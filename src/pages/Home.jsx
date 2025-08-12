import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import PaperCard from "../components/PaperCard";
import { useAuth } from "../components/AuthContext";
import Signin from "./Signin";
import { 
  Monitor, 
  Stethoscope, 
  Settings, 
  Atom, 
  Dna, 
  BookOpen, 
  Search, 
  Bot, 
  Smartphone,
  GraduationCap
} from "lucide-react";

const Home = () => {
  const [featuredPapers, setFeaturedPapers] = useState([]);
  const [fields, setFields] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showSignin, setShowSignin] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const checkHealth = async () => {
      try {
        // Test backend connectivity
        console.log("Testing backend connectivity...");
        const healthResponse = await fetch("https://wise-paper-backend.onrender.com/api/health");
        const healthData = await healthResponse.json();
        console.log("Backend health:", healthData);

        // Fetch available fields
        const fieldsResponse = await fetch(
          "https://wise-paper-backend.onrender.com/api/papers/fields"
        );
        const fieldsData = await fieldsResponse.json();
        setFields(fieldsData.fields);

        // Fetch some featured papers (only arXiv)
        console.log("Fetching featured papers...");
        const papersResponse = await fetch(
          "https://wise-paper-backend.onrender.com/api/papers/search?query=AI&source=arxiv&limit=12"
        );
        const papersData = await papersResponse.json();
        console.log("Featured papers API response:", papersData);
        console.log("Papers array:", papersData.papers);
        console.log("Papers length:", papersData.papers?.length);
        setFeaturedPapers(papersData.papers || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        console.error("Error details:", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    checkHealth();
  }, []);

  const fieldIcons = {
    "computer-science": Monitor,
    "medicine": Stethoscope,
    "engineering": Settings,
    "physics": Atom,
    "biology": Dna,
  };

  const handleProtectedNav = (path) => {
    if (path === "/search") {
      // Allow direct access to search page
      navigate(path);
    } else if (user) {
      navigate(path);
    } else {
      setShowSignin(true);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-[100%] pt-8 px-4 bg-gradient-to-r from-blue-50 via-purple-100 to-purple-200 ">
      {/* Hero Section - Split Left/Right */}
      <section className="flex flex-col md:flex-row items-stretch min-h-[70vh] w-full max-w-7xl mx-auto">
        {/* Left Side */}
        <div className="w-full md:w-1/2 flex flex-col justify-center pt-0 pb-8 space-y-8">
          <div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent text-left">
              <span className="block text-purple-700">Unlock the world of</span>
              <span className="block text-purple-500">Research Papers</span>
            </h1>
            <h2 className="text-2xl text-purple-600 mb-3 max-w-xl font-medium text-left">
              Access free research papers from top repositories
            </h2>
            <p className="text-lg text-gray-700 mb-8 max-w-xl text-left">
              Access free research papers from arXiv, PubMed, and more. 
              Let AI help you simplify and understand complex research with ease.
            </p>
          </div>
          <div className="flex gap-4">
            <button
              className="bg-purple-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              onClick={() => handleProtectedNav("/search")}
            >
              Search Papers
            </button>
            <button
              className="bg-white text-purple-600 px-6 py-3 rounded-lg font-medium border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transform hover:scale-105 transition-all duration-200"
              onClick={() => handleProtectedNav("/ai-assistant")}
            >
              AI Assistant
            </button>
          </div>
        </div>
        {/* Right Side - Card Carousel or Illustration (Desktop only) */}
        <div className="hidden md:flex w-1/2 items-center justify-center relative">
          {/* Carousel of featured papers */}
          <div className="w-full space-y-6">
            <h3 className="text-xl font-semibold text-purple-700 mb-4 text-left">Featured Papers</h3>
            <div className="overflow-x-auto flex gap-4 pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {console.log("Featured papers state:", featuredPapers)}
              {console.log("Featured papers length:", featuredPapers.length)}
              {console.log("Papers with abstracts:", featuredPapers.filter(paper => paper.summary && paper.summary !== 'No abstract available').length)}
              {isLoading ? (
                <div className="text-gray-500">Loading featured papers...</div>
              ) : featuredPapers.length > 0 ? (
                featuredPapers
                  .slice(0, 6) // Show first 6 papers regardless of abstract
                  .map((paper, idx) => (
                    <div key={idx} className="min-w-[260px] max-w-[260px] flex-shrink-0">
                      <PaperCard paper={paper} />
                    </div>
                  ))
              ) : (
                <div className="text-gray-500">No featured papers available</div>
              )}
              {featuredPapers.length > 0 && featuredPapers.length < 3 && (
                <div className="text-sm text-gray-500 mt-2">
                  Showing {featuredPapers.length} papers (fetched {featuredPapers.length} total)
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Papers (Mobile only) */}
      <section className="md:hidden w-full max-w-7xl mx-auto">
        <h3 className="text-xl font-semibold text-purple-700 mb-4">Featured Papers</h3>
        <div className="overflow-x-auto flex gap-4 pb-2">
          {isLoading ? (
            <div className="text-gray-500">Loading featured papers...</div>
          ) : featuredPapers.length > 0 ? (
            featuredPapers
              .filter(paper => paper.summary && paper.summary !== 'No abstract available')
              .map((paper, idx) => (
                <div key={idx} className="min-w-[260px] max-w-[260px]">
                  <PaperCard paper={paper} />
                </div>
              ))
          ) : (
            <div className="text-gray-500">No featured papers available</div>
          )}
        </div>
      </section>

      {/* Research Fields */}
      <section className="mt-2 w-full max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-8 text-left">Explore Research Fields</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {fields && fields.length > 0 ? (
            fields.map((field) => (
              <Link
                key={field.id}
                to={`/field/${field.id}`}
                className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden transition-transform duration-200 hover:scale-105 hover:shadow-xl group"
              >
                <div className="px-6 py-4 text-center">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-200">
                    {fieldIcons[field.id] ? (
                      React.createElement(fieldIcons[field.id], { className: "w-12 h-12 text-purple-600" })
                    ) : (
                      <BookOpen className="w-12 h-12 text-purple-600" />
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {field.name}
                  </h3>
                  <p className="text-gray-600 text-sm">{field.description}</p>
                  <div className="mt-4 text-blue-600 font-medium group-hover:text-blue-700">
                    Explore Papers →
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center py-12 col-span-full">
              <div className="text-6xl mb-4 flex justify-center">
                <BookOpen className="w-16 h-16 text-purple-600" />
              </div>
              <p className="text-gray-600">Loading research fields...</p>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white rounded-2xl shadow-lg p-8 mt-12 w-full max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-8 text-center">
          Why Choose Wise Paper?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl mb-4 flex justify-center">
              <Search className="w-12 h-12 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Free Access</h3>
            <p className="text-gray-600">
              Access thousands of research papers from arXiv, PubMed, and other
              open repositories.
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4 flex justify-center">
              <Bot className="w-12 h-12 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">AI Assistant</h3>
            <p className="text-gray-600">
              Get AI-powered explanations of complex research papers in simple
              terms.
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4 flex justify-center">
              <Smartphone className="w-12 h-12 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Easy to Use</h3>
            <p className="text-gray-600">
              Modern, responsive interface designed for students and
              researchers.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center py-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-white mt-12 w-full max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-4">Ready to Explore Research?</h2>
        <p className="text-xl mb-8 opacity-90">
          Start discovering the latest research in your field today.
        </p>
        <button
          onClick={() => handleProtectedNav("/search")}
          className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
        >
          Get Started
        </button>
      </section>
      {/* Signin Modal */}
      {showSignin && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl"
              onClick={() => setShowSignin(false)}
              aria-label="Close"
            >
              ×
            </button>
            <Signin onClose={() => setShowSignin(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
