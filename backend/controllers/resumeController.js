const generateResumeLatex = require('../helper/latexGenerators');
const { createClient } = require('@supabase/supabase-js');
const saveLatexToFile = require('../helper/saveLatexToFile');
const Resume = require('../models/Resume');
const fs = require('fs');
const path = require('path');
const { execSync, exec } = require('child_process');
const connectDB = require('../utils/db');

const TEMP_DIR = path.join(__dirname, '..', 'temp_files');

const { redisClient } = require('../utils/redis');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const createResume = async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, template } = req.body;

    if (!name || !template) {
      return res.status(400).json({
        success: false,
        message: "Resume name and template is required",
      });
    }

    const newResume = new Resume({
      user: userId,
      name,
      template,
      personalDetails: [{}], // safe default
      education: [],
      skills: [],
      experience: [],
      projects: [],
    });

    const savedResume = await newResume.save();

    res.status(201).json({
      success: true,
      _id: savedResume._id,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating resume",
      error: error.message,
    });
  }
};
const updateResume = async (req, res) => {
  let texPath, pdfPath, baseName;

  try {
    connectDB();
    const { id } = req.params;

    // 1️⃣ Update DB
    const updatedResume = await Resume.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    if (!updatedResume) {
      return res.status(404).json({ error: "Resume not found" });
    }

    const latex = generateResumeLatex(updatedResume);

    // 2️⃣ Ensure temp dir exists
    if (!fs.existsSync(TEMP_DIR)) {
      fs.mkdirSync(TEMP_DIR, { recursive: true });
    }

    baseName = `resume_${id}`;
    texPath = path.join(TEMP_DIR, `${baseName}.tex`);
    pdfPath = path.join(TEMP_DIR, `${baseName}.pdf`);

    // 3️⃣ Write TEX
    fs.writeFileSync(texPath, latex);

    // 4️⃣ Compile
    execSync(
      `pdflatex -interaction=nonstopmode -output-directory="${TEMP_DIR}" "${texPath}"`,
      { stdio: "ignore" }
    );

    if (!fs.existsSync(pdfPath)) {
      return res.status(500).json({ error: "PDF not generated" });
    }

    const bucket = process.env.SUPABASE_BUCKET;
    const pdfKey = `resumes/${id}/${baseName}.pdf`;
    const texKey = `resumes/${id}/${baseName}.tex`;

    // 5️⃣ Upload PDF
    const pdfBuffer = fs.readFileSync(pdfPath);
    const { error: pdfUploadError } = await supabase.storage
      .from(bucket)
      .upload(pdfKey, pdfBuffer, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (pdfUploadError) throw pdfUploadError;

    // 6️⃣ Upload TEX (optional)
    const texBuffer = fs.readFileSync(texPath);
    const { error: texUploadError } = await supabase.storage
      .from(bucket)
      .upload(texKey, texBuffer, {
        contentType: "text/x-tex",
        upsert: true,
      });

    if (texUploadError) throw texUploadError;

    // 7️⃣ Create Signed URL
    const { data: signedData, error: signError } =
      await supabase.storage
        .from(bucket)
        .createSignedUrl(pdfKey, 3600);

    if (signError) throw signError;

    // 8️⃣ Store storage path in DB
    await Resume.findByIdAndUpdate(id, {
      pdfPath: pdfKey,
      latexPath: texKey,
    });

    // 9️⃣ Return URL
    res.json({
      success: true,
      pdfUrl: signedData.signedUrl,
    });

  } catch (err) {
    console.error("Update resume failed:", err);
    res.status(500).json({ error: err.message });

  } finally {
    // 🔥 Guaranteed cleanup
    if (baseName) {
      const extensions = [
        "tex",
        "pdf",
        "aux",
        "log",
        "out",
        "synctex.gz",
      ];

      extensions.forEach(ext => {
        const filePath = path.join(TEMP_DIR, `${baseName}.${ext}`);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }
  }
};
const deleteResume = async (req, res) => {
  try {
    connectDB();
    const { id } = req.params;

    // Find resume to get file paths
    const resume = await Resume.findById(id);
    if (!resume) return res.status(404).json({ error: 'Resume not found' });

    // Delete from database
    await Resume.findByIdAndDelete(id);

    // Delete files from Supabase
    const extensions = ['.tex', '.pdf', '.png'];
    const fileKeys = extensions.map(ext => `resumes/${id}/resume_${id}${ext}`);

    const { error } = await supabase.storage
      .from(process.env.SUPABASE_BUCKET)
      .remove(fileKeys);

    if (error) {
      console.error('Error deleting files from Supabase:', error);
      throw error;
    }

    res.json({
      success: true,
      message: 'Resume and all associated files deleted successfully',
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
const getResume = async (req, res) => {
  try {
    connectDB();

    const userId = req.params.id;

    // 🔥 Get page from query (default = 1)
    const page = parseInt(req.query.page) || 1;
    const limit = 6;
    const skip = (page - 1) * limit;

    // 🔥 Get total count first
    const totalResumes = await Resume.countDocuments({ user: userId });

    if (totalResumes === 0) {
      return res.status(404).json({
        success: false,
        message: 'No resumes found for this user'
      });
    }

    // 🔥 Fetch paginated resumes
    const resumes = await Resume.find({ user: userId })
      .select('-__v')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      currentPage: page,
      totalPages: Math.ceil(totalResumes / limit),
      totalResumes,
      count: resumes.length,
      data: resumes
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching resumes',
      error: err.message
    });
  }
};
const downloadResume = async (req, res) => {
  const { id } = req.params;

  try {
    connectDB();

    // Find the resume to verify it exists
    const resume = await Resume.findById(id);
    if (!resume) return res.status(404).json({ error: 'Resume not found' });

    // Download PDF from Supabase
    const pdfKey = `resumes/${id}/resume_${id}.pdf`;
    const { data, error } = await supabase.storage
      .from(process.env.SUPABASE_BUCKET)
      .download(pdfKey);

    if (error) {
      console.error('Error downloading PDF:', error);
      return res.status(404).json({ error: 'Resume PDF not found' });
    }

    // Convert to buffer
    const buffer = Buffer.from(await data.arrayBuffer());

    // Set headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="resume_${id}.pdf"`);

    // Send the file
    res.send(buffer);

  } catch (error) {
    console.error('Error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: error.message });
    }
  }
};
const getResumeById = async (req, res) => {
  try {
    connectDB();
    const resumeId = req.params.id;
    const resume = await Resume.findById(resumeId).lean();

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    if (resume.pdfPath) {
      const bucket = process.env.SUPABASE_BUCKET;
      const { data: signedData, error: signError } = await supabase.storage
        .from(bucket)
        .createSignedUrl(resume.pdfPath, 3600);

      if (!signError && signedData) {
        resume.pdfUrl = signedData.signedUrl;
      }
    }

    res.status(200).json(resume);
  } catch (error) {
    console.error('Error fetching resume:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const previewResume = async (req, res) => {
  let texPath, pdfPath, baseName;

  try {
    const { id } = req.params;
    const formData = req.body;

    // 1️⃣ Store in Redis
    await redisClient.setEx(`resume:preview:${id}`, 3600, JSON.stringify(formData));

    const latex = generateResumeLatex(formData);

    // 2️⃣ Ensure temp dir exists
    if (!fs.existsSync(TEMP_DIR)) {
      fs.mkdirSync(TEMP_DIR, { recursive: true });
    }

    baseName = `preview_${id}`;
    texPath = path.join(TEMP_DIR, `${baseName}.tex`);
    pdfPath = path.join(TEMP_DIR, `${baseName}.pdf`);

    // 3️⃣ Write TEX
    fs.writeFileSync(texPath, latex);

    // 4️⃣ Compile
    execSync(
      `pdflatex -interaction=nonstopmode -output-directory="${TEMP_DIR}" "${texPath}"`,
      { stdio: "ignore" }
    );

    if (!fs.existsSync(pdfPath)) {
      return res.status(500).json({ error: "PDF not generated" });
    }

    const bucket = process.env.SUPABASE_BUCKET;
    const pdfKey = `previews/${id}/${baseName}.pdf`;

    // 5️⃣ Upload PDF
    const pdfBuffer = fs.readFileSync(pdfPath);
    const { error: pdfUploadError } = await supabase.storage
      .from(bucket)
      .upload(pdfKey, pdfBuffer, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (pdfUploadError) throw pdfUploadError;

    // 6️⃣ Create Signed URL
    const { data: signedData, error: signError } =
      await supabase.storage
        .from(bucket)
        .createSignedUrl(pdfKey, 3600);

    if (signError) throw signError;

    // 7️⃣ Return URL
    res.json({
      success: true,
      pdfUrl: signedData.signedUrl,
    });

  } catch (err) {
    console.error("Preview resume failed:", err);
    res.status(500).json({ error: err.message });

  } finally {
    if (baseName) {
      const extensions = ["tex", "pdf", "aux", "log", "out", "synctex.gz"];
      extensions.forEach(ext => {
        const filePath = path.join(TEMP_DIR, `${baseName}.${ext}`);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }
  }
};

module.exports = {
  createResume, getResume, updateResume, deleteResume, downloadResume, getResumeById, previewResume
}