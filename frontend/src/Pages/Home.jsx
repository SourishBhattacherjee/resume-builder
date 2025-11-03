import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const Home = () => {
  const navigate = useNavigate();

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Software Engineer",
      text: "This resume builder helped me land my dream job! The LaTeX templates are truly ATS-friendly and look incredibly professional.",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      name: "Michael Chen",
      role: "Product Manager",
      text: "The best resume builder I've ever used. Clean, professional templates and excellent ATS optimization.",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      name: "Emily Rodriguez",
      role: "Data Scientist",
      text: "Finally, a resume builder that understands the importance of LaTeX! Got multiple callbacks after switching to these templates.",
      avatar: "https://randomuser.me/api/portraits/women/65.jpg"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-indigo-800 text-white py-24 sm:py-32">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 tracking-tight">Build Your Professional Resume in Minutes</h1>
            <p className="text-lg sm:text-xl text-indigo-100 mb-10">Create stunning, ATS-friendly resumes with our powerful LaTeX-based builder and land your dream job.</p>
            <button 
              onClick={() => navigate('/login')}
              className="bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-bold shadow-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300"
            >
              Get Started for Free
            </button>
          </div>
        </div>
      </section>

      {/* Template Showcase */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">Choose Your Professional Look</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">Select from a variety of professionally designed LaTeX templates, all optimized for Applicant Tracking Systems.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((template) => (
              <div key={template} className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 group">
                <img 
                  src={'/src/assets/template' + template + '.png'} 
                  alt={`Template ${template}`}
                  className="w-full h-80 object-cover object-top group-hover:opacity-90 transition-opacity"
                />
                <div className="p-6">
                  <h3 className="font-bold text-xl mb-2">Template {template}</h3>
                  <p className="text-gray-600">A clean and modern design to make your profile shine.</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">Everything You Need for a Perfect Resume</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              {/* Inline SVG for ShieldCheckIcon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-blue-600 mx-auto mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2l9 4-9 16-9-16 9-4z" />
              </svg>
              <h3 className="text-xl font-semibold mb-2">ATS-Friendly</h3>
              <p className="text-gray-600">Our LaTeX templates are designed to be easily parsed by applicant tracking systems.</p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              {/* Inline SVG for DocumentTextIcon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-blue-600 mx-auto mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 6h13M8 12h13m-7 6h7" />
              </svg>
              <h3 className="text-xl font-semibold mb-2">Professional Templates</h3>
              <p className="text-gray-600">Choose from a selection of beautiful templates crafted by design experts.</p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              {/* Inline SVG for LightningBoltIcon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-blue-600 mx-auto mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 2L4 14h9l-2 8 9-12h-9l2-8z" />
              </svg>
              <h3 className="text-xl font-semibold mb-2">Instant PDF Generation</h3>
              <p className="text-gray-600">Generate and download your resume as a high-quality PDF in seconds.</p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              {/* Inline SVG for CloudIcon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-blue-600 mx-auto mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h14a4 4 0 004-4v-1a4 4 0 00-4-4H7a4 4 0 00-4 4v1z" />
              </svg>
              <h3 className="text-xl font-semibold mb-2">Secure Cloud Storage</h3>
              <p className="text-gray-600">Your resumes are safely stored in the cloud with Supabase, accessible anytime.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">Loved by Professionals Worldwide</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center text-center">
                <img src={testimonial.avatar} alt={testimonial.name} className="w-20 h-20 rounded-full mb-4 border-4 border-blue-200"/>
                <p className="text-gray-600 mb-6 italic">"{testimonial.text}"</p>
                <div>
                  <p className="font-bold text-lg">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-10">
        <div className="container mx-auto px-4 text-center">
          <p className="text-lg font-semibold mb-2">Resume Builder</p>
          <p className="mb-4">© {new Date().getFullYear()} All rights reserved.</p>
          <div className="flex justify-center space-x-6">
            <a href="#" className="text-gray-400 hover:text-white transition">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-white transition">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-white transition">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;