import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Lightbulb } from 'lucide-react';

const PaperDetail = () => {
  const { paperId } = useParams();
  const location = useLocation();
  const paper = location.state?.paper;
  const [explanation, setExplanation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);

  const getExplanation = async () => {
    setIsLoading(true);
    try {
      let paperContent = null;
      if (paper?.summary) {
        paperContent = {
          title: paper.title,
          summary: paper.summary,
          authors: paper.authors
        };
      }

      const response = await fetch('https://wise-paper-backend.onrender.com/api/ai/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: paperContent ? JSON.stringify(paperContent) : (paper?.title || decodeURIComponent(paperId)),
          type: paperContent ? 'paper' : 'query'
        })
      });
      const data = await response.json();
      if (data.success) {
        setExplanation(data.explanation);
      }
    } catch (error) {
      console.error('Error getting explanation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAskQuestion = async () => {
    if (!question.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch('https://wise-paper-backend.onrender.com/api/ai/explain', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Removed getAuthHeaders() as it's no longer imported
        },
        body: JSON.stringify({
          question,
          paper: paper
        })
      });
      const data = await response.json();
      if (data.success) {
        setExplanation(data.explanation);
      }
    } catch (error) {
      console.error('Error asking question:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getExplanation();
    // eslint-disable-next-line
  }, [paperId]);

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
          AI Research Explanation
        </h1>
        <p className="text-gray-600">Understanding complex research made simple</p>
      </div>

      {/* Paper Title */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h2 className="text-xl font-semibold">Research Paper</h2>
        </div>
        <div className="px-6 py-4">
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            {paper?.title || decodeURIComponent(paperId)}
          </h3>
          {paper?.authors && paper.authors.length > 0 && (
            <p className="text-sm text-gray-600 mb-3">
              By {paper.authors.join(', ')}
            </p>
          )}
          {paper?.summary && (
            <div className="mt-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Abstract:</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                {paper.summary}
              </p>
            </div>
          )}
          {paper?.source && (
            <div className="mt-3">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {paper.source}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* AI Explanation */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h2 className="text-xl font-semibold">AI Summary</h2>
        </div>
        <div className="px-6 py-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
              <span>Generating explanation...</span>
            </div>
          ) : explanation ? (
            <div className="space-y-6">
              {/* Simple Explanation */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Simple Explanation</h3>
                <p className="text-gray-700 leading-relaxed">{explanation.explanation}</p>
              </div>
              {/* Key Points */}
              {explanation.keyPoints && explanation.keyPoints.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Key Points</h3>
                  <ul className="space-y-2">
                    {explanation.keyPoints.slice(0, 6).map((point, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-blue-500 mr-3 mt-1">•</span>
                        <span className="text-gray-700">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">No explanation available. Please try again.</p>
            </div>
          )}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            Tips for Understanding Research
          </h3>
        </div>
        <div className="px-6 py-4">
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Read the abstract first to get an overview</li>
            <li>• Look for the main findings and conclusions</li>
            <li>• Pay attention to the methodology used</li>
            <li>• Consider the implications and applications</li>
            <li>• Ask questions about concepts you don't understand</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PaperDetail; 