import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="w-full bg-gradient-to-r from-purple-200 via-blue-100 to-purple-100 py-8 mt-12 border-t border-purple-200">
    <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
      {/* Logo and tagline */}
      <div className="flex flex-col items-center md:items-start">
        <div className="flex items-center mb-2">
          <div className="w-8 h-8 bg-purple-700 rounded-lg flex items-center justify-center mr-2">
            <span className="text-white text-lg font-bold">W</span>
          </div>
          <span className="text-xl font-bold text-purple-700">Wise <span className="text-purple-500">Paper</span></span>
        </div>
        <span className="text-sm text-gray-500">Empowering students & researchers with free, AI-powered research access.</span>
      </div>
      
      {/* Copyright */}
      <div className="text-xs text-gray-500 text-center md:text-right">
        &copy; {new Date().getFullYear()} Wise Paper. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
