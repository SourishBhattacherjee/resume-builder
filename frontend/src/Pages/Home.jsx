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
    <div className="min-h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Abstract Background Shapes */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/20 blur-[100px] animate-float" style={{animationDuration: '15s'}}></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-400/20 blur-[120px] animate-float" style={{animationDuration: '20s', animationDelay: '5s'}}></div>
      </div>
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 sm:pt-40 sm:pb-32 z-10 w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-blue-800 to-purple-900 clip-path-hero transform -skew-y-3 origin-top-left scale-110 z-0"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 z-0 mix-blend-overlay"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold mb-8 tracking-tight text-white leading-tight drop-shadow-lg">
              Build Your Professional <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-purple-300 to-indigo-300 animate-pulse">Resume in Minutes</span>
            </h1>
            <p className="text-xl sm:text-2xl text-blue-100 mb-12 font-medium max-w-3xl mx-auto leading-relaxed shadow-sm">Create stunning, ATS-friendly resumes with our powerful LaTeX-based builder and land your dream job.</p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <button 
                onClick={() => navigate('/login')}
                className="w-full sm:w-auto bg-white/95 backdrop-blur-sm text-indigo-700 px-10 py-4 rounded-full text-lg font-bold shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] hover:bg-white transform hover:-translate-y-1 transition-all duration-300"
              >
                Get Started for Free
              </button>
              <button 
                onClick={() => document.getElementById('templates').scrollIntoView({ behavior: 'smooth' })}
                className="w-full sm:w-auto bg-indigo-800/40 backdrop-blur-md border border-indigo-300/30 text-white px-10 py-4 rounded-full text-lg font-bold hover:bg-indigo-700/50 transform hover:-translate-y-1 transition-all duration-300"
              >
                View Templates
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Template Showcase */}
      <section id="templates" className="py-24 relative z-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">Choose Your <span className="text-gradient">Professional Look</span></h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium">Select from a variety of professionally designed LaTeX templates, all optimized for Applicant Tracking Systems.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((template) => (
              <div key={template} className="glass-card overflow-hidden group hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-500 ease-out border border-slate-200/50 bg-white/60">
                <div className="relative overflow-hidden aspect-[8.5/11] bg-slate-100 p-4">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                  <img 
                    src={new URL(`../assets/template${template}.png`, import.meta.url).href} 
                    alt={`Template ${template}`}
                    className="w-full h-full object-cover object-top rounded shadow-sm group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20 flex justify-center">
                    <button className="bg-white/90 backdrop-blur text-indigo-700 font-bold py-2 px-6 rounded-full shadow-lg text-sm hover:bg-white hover:scale-105 transition-all">Use Template</button>
                  </div>
                </div>
                <div className="p-6 bg-white/60 backdrop-blur-md relative z-20 border-t border-slate-100">
                  <h3 className="font-bold text-xl mb-1 text-slate-800">Template {template}</h3>
                  <p className="text-sm text-slate-500 font-medium">Clean & Modern Design</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative z-10 bg-slate-100/50 border-y border-slate-200/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
           <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">Everything You Need for a <span className="text-gradient">Perfect Resume</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "ATS-Friendly",
                desc: "Our LaTeX templates are designed to be easily parsed by applicant tracking systems.",
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2l9 4-9 16-9-16 9-4z" />,
                color: "from-blue-400 to-indigo-500"
              },
              {
                title: "Professional Templates",
                desc: "Choose from a selection of beautiful templates crafted by design experts.",
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 6h13M8 12h13m-7 6h7" />,
                color: "from-purple-400 to-indigo-500"
              },
              {
                title: "Instant Verification",
                desc: "Generate and download your resume as a high-quality PDF in seconds.",
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />,
                color: "from-amber-400 to-orange-500"
              },
              {
                title: "Secure Cloud Storage",
                desc: "Your resumes are safely stored in the cloud, accessible anytime, anywhere.",
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h14a4 4 0 004-4v-1a4 4 0 00-4-4H7a4 4 0 00-4 4v1z" />,
                color: "from-emerald-400 to-teal-500"
              }
            ].map((feature, idx) => (
              <div key={idx} className="glass-card p-8 group hover:-translate-y-2 transition-all duration-300 relative overflow-hidden bg-white">
                <div className={`absolute -right-10 -top-10 w-32 h-32 bg-gradient-to-br ${feature.color} opacity-10 rounded-full blur-2xl group-hover:opacity-30 transition-opacity duration-500`}></div>
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} p-0.5 mb-6 shadow-lg shadow-${feature.color.split('-')[1]}/30 transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                  <div className="w-full h-full bg-white rounded-xl flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-slate-800" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      {feature.icon}
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-800 tracking-tight">{feature.title}</h3>
                <p className="text-slate-600 font-medium leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 relative z-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">Loved by <span className="text-gradient">Professionals</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="glass-card p-8 flex flex-col items-center text-center relative mt-10 hover:-translate-y-2 transition-all duration-300">
                <div className="absolute -top-12">
                  <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-indigo-500 to-purple-500 shadow-xl">
                    <img src={testimonial.avatar} alt={testimonial.name} className="w-full h-full rounded-full object-cover border-4 border-white"/>
                  </div>
                </div>
                <div className="pt-12 flex-grow flex flex-col justify-between">
                  <p className="text-slate-600 mb-8 italic font-medium text-lg leading-relaxed relative">
                    <span className="text-4xl text-indigo-400 absolute -top-4 -left-4 opacity-50">"</span>
                    {testimonial.text}
                    <span className="text-4xl text-indigo-400 absolute -bottom-6 -right-2 opacity-50">"</span>
                  </p>
                  <div>
                    <p className="font-bold text-xl text-slate-800 tracking-tight">{testimonial.name}</p>
                    <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wider mt-1">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modern Footer */}
      <footer className="relative bg-slate-900 text-slate-300 py-16 overflow-hidden z-10">
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mx-auto mb-8 flex items-center justify-center shadow-2xl shadow-indigo-500/20 transform rotate-3 hover:rotate-6 transition-transform">
             <span className="text-white font-black text-3xl">RB</span>
          </div>
          <h2 className="text-3xl font-bold mb-8 text-white">Ready to boost your career?</h2>
          <button 
             onClick={() => navigate('/register')}
             className="bg-indigo-600 text-white hover:bg-indigo-500 px-8 py-3 rounded-full font-bold shadow-lg shadow-indigo-600/30 transform hover:-translate-y-1 transition-all duration-300 mb-12"
          >
            Create Your Account
          </button>
          
          <div className="border-t border-slate-700/50 pt-8 flex flex-col md:flex-row justify-between items-center text-sm font-medium gap-4">
            <p className="text-slate-400">© {new Date().getFullYear()} Resume Builder. All rights reserved.</p>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-white hover:underline transition-colors">Privacy</a>
              <a href="#" className="hover:text-white hover:underline transition-colors">Terms</a>
              <a href="#" className="hover:text-white hover:underline transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;