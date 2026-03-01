import { useEffect, useState } from "react";
import axios from "axios";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", email: "" });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (storedUser) {
      setUser(storedUser);
      setEditForm({ name: storedUser.fullName || storedUser.name || "", email: storedUser.email || "" });
    }
    
    // Always fetch latest to ensure picture and details are up to date!
    if (token) {
      axios.get("/profile", { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => {
          if (res.data.user) {
            setUser(res.data.user);
            setEditForm({ name: res.data.user.fullName || res.data.user.name || "", email: res.data.user.email || "" });
            localStorage.setItem("user", JSON.stringify(res.data.user));
          }
        })
        .catch(() => {
           if (!storedUser) setUser(null); 
        });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const getInitials = (name) => {
    if (!name) return "U";
    const words = name.split(" ");
    return words.map((w) => w[0]).join("").toUpperCase();
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("fullName", editForm.name);
      formData.append("email", editForm.email);
      if (file) {
        formData.append("picture", file);
      }

      const token = localStorage.getItem("token");
      
      const response = await axios.put("/update-profile", formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data && response.data.user) {
        const updatedUser = { 
            ...user, 
            name: response.data.user.fullName, 
            fullName: response.data.user.fullName,
            email: response.data.user.email, 
            picture: response.data.user.picture 
        };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setIsEditing(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditForm({ name: user?.fullName || user?.name || "", email: user?.email || "" });
    setFile(null);
    setPreview(null);
    setError("");
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-[60vh] p-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        {isEditing ? (
          <form onSubmit={handleUpdate} className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Edit Profile</h2>
            
            {error && (
              <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm text-center">
                {error}
              </div>
            )}

            {/* Profile Image Upload */}
            <div className="flex flex-col items-center mb-6">
              {preview || user.picture ? (
                <img
                  src={preview || user.picture}
                  alt="profile"
                  className="w-28 h-28 rounded-full mb-3 border-4 border-indigo-500 object-cover"
                />
              ) : (
                <div className="w-28 h-28 rounded-full mb-3 border-4 border-gray-200 flex items-center justify-center bg-gray-100 text-3xl font-bold text-gray-500">
                  {getInitials(editForm.name || "U")}
                </div>
              )}
              <label className="cursor-pointer text-sm font-medium text-indigo-600 hover:text-indigo-800 transition">
                Change Picture
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Name Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition duration-200"
                required
              />
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition duration-200"
                required
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4 mt-6">
              <button
                type="button"
                onClick={cancelEdit}
                className="flex-1 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition duration-200 disabled:opacity-70 flex justify-center items-center"
              >
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : "Save Changes"}
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center">
            {/* Display Mode */}
            {user.picture ? (
              <img
                src={user.picture}
                alt="profile"
                className="w-32 h-32 rounded-full mx-auto mb-5 border-4 border-indigo-500 object-cover shadow-md"
              />
            ) : (
              <div className="w-32 h-32 rounded-full mx-auto mb-5 border-4 border-indigo-100 flex items-center justify-center bg-indigo-50 text-4xl font-bold text-indigo-500 shadow-md">
                {getInitials(user.name || user.fullName)}
              </div>
            )}

            <h2 className="text-3xl font-bold text-gray-800 mb-1">
              {user.name || user.fullName || "No Name"}
            </h2>

            <p className="text-gray-500 mb-8 font-medium">
              {user.email || "No Email"}
            </p>

            <div className="flex flex-col space-y-3">
              <button
                onClick={() => setIsEditing(true)}
                className="w-full bg-indigo-50 text-indigo-700 hover:bg-indigo-100 hover:text-indigo-800 font-semibold py-3 px-4 rounded-lg transition duration-200"
              >
                Edit Profile
              </button>
              <button
                onClick={handleLogout}
                className="w-full bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 font-semibold py-3 px-4 rounded-lg transition duration-200"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}