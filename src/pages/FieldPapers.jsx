import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PaperCard from '../components/PaperCard';
import {
  Monitor,
  Stethoscope,
  Settings,
  Atom,
  Dna,
  BookOpen,
  Search,
  Brain,
  User,
  GraduationCap
} from 'lucide-react';

const FieldPapers = () => {
  const { fieldId } = useParams();
  const [papers, setPapers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fieldInfo, setFieldInfo] = useState(null);
  const [error, setError] = useState(null);

  const fieldIcons = {
    'computer-science': Monitor,
    'medicine': Stethoscope,
    'engineering': Settings,
    'physics': Atom,
    'biology': Dna,
    'computer-science': BookOpen,
    'physics': Search,
    'mathematics': Brain,
    'biology': User,
    'chemistry': GraduationCap
  };

  useEffect(() => {
    const fetchPapers = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/api/papers/field/${fieldId}?limit=20`);
        const data = await response.json();
        if (data.success) {
          setPapers(data.papers || []);
        } else {
          setError(data.error || 'Failed to fetch papers');
        }
      } catch (err) {
        setError('Failed to fetch papers');
      } finally {
        setIsLoading(false);
      }
    };
    const fetchFieldInfo = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/papers/fields');
        const data = await response.json();
        const field = data.fields.find(f => f.id === fieldId);
        setFieldInfo(field);
      } catch (error) {
        // handle error
      }
    };
    fetchFieldInfo();
    fetchPapers();
  }, [fieldId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4">
      {/* Header */}
      <div className="text-center">
        <div className="text-6xl mb-4 flex justify-center">
          {fieldIcons[fieldId] ? (
            React.createElement(fieldIcons[fieldId], { className: "w-16 h-16 text-purple-600" })
          ) : (
            <BookOpen className="w-16 h-16 text-purple-600" />
          )}
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
          {fieldInfo?.name || fieldId}
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {fieldInfo?.description || 'Latest research papers in this field'}
        </p>
      </div>

      {/* Papers Grid */}
      {papers.length > 0 ? (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Latest Papers ({papers.length})
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {papers.map((paper, index) => (
              <PaperCard key={index} paper={paper} />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4 flex justify-center">
            <BookOpen className="w-16 h-16 text-purple-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No papers found</h3>
          <p className="text-gray-600">No papers available for this field at the moment.</p>
        </div>
      )}
    </div>
  );
};

export default FieldPapers; 