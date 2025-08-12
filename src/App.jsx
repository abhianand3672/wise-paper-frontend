import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Search from './pages/Search';
import FieldPapers from './pages/FieldPapers';
import AIAssistant from './pages/AIAssistant';
import PaperDetail from './pages/PaperDetail';
import Profile from './pages/Profile';
import Footer from './components/Footer';
import { useAuth } from './components/AuthContext';
import './App.css';
import { ToastContainer } from 'react-toastify';

function PrivateRoute({ children }) {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) {
    // Optionally, trigger Signin modal here or redirect to home
    return <Navigate to="/" state={{ from: location }} />;
  }
  return children;
}

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  return (
    <Router>
      <ToastContainer />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Navbar />
        <main className="container ">
          <Routes>
            <Route
              path="/"
              element={<Home />}
            />
            <Route
              path="/search"
              element={<Search />}
            />
            <Route
              path="/field/:fieldId"
              element={
                <PrivateRoute>
                  <FieldPapers />
                </PrivateRoute>
              }
            />
            <Route
              path="/ai-assistant"
              element={<AIAssistant />}
            />
            <Route
              path="/paper/:paperId"
              element={
                <PrivateRoute>
                  <PaperDetail />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        {/* Loading Overlay */}
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading...</p>
            </div>
          </div>
        )}
        {/* Error Toast */}
        {error && (
          <div className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg z-50">
            <p>{error}</p>
            <button 
              onClick={() => setError(null)}
              className="ml-2 text-sm underline"
            >
              Dismiss
            </button>
          </div>
        )}
        <Footer />
      </div>
    </Router>
  );
}

export default App;