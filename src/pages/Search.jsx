import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import PaperCard from '../components/PaperCard';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('query') || '');
  const [selectedSource, setSelectedSource] = useState(searchParams.get('source') || 'all');

  const sources = [
    { value: 'all', label: 'All Sources' },
    { value: 'arxiv', label: 'arXiv' },
    { value: 'pubmed', label: 'PubMed' }
  ];
  const limits = [10, 20, 50, 100];
  const popularQueries = [
    'machine learning',
    'artificial intelligence',
    'cancer research',
    'quantum computing',
    'climate change',
    'renewable energy',
    'covid-19',
    'blockchain',
    'robotics',
    'genetics'
  ];

  const searchPapers = async (searchQuery = searchParams.get('query') || '') => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({
        query: searchQuery,
        source: selectedSource,
        limit: '20'
      });
      const response = await fetch(`http://localhost:5000/api/papers/search?${params}`);
      const data = await response.json();
      if (data.success) {
        setPapers(data.papers);
        // Add to search history
        // This part of the logic needs to be adapted to handle search history
        // For now, we'll just update the searchParams to reflect the current search
        setSearchParams(prev => {
          const newParams = new URLSearchParams(prev);
          newParams.set('query', searchQuery);
          newParams.set('source', selectedSource);
          return newParams;
        });
      } else {
        setPapers([]);
        setError('Failed to fetch papers.');
      }
    } catch (error) {
      setPapers([]);
      setError('Network error or server issue.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    searchPapers();
  };

  const handleQueryClick = (clickedQuery) => {
    setSearchQuery(clickedQuery);
    searchPapers(clickedQuery);
  };

  useEffect(() => {
    // Load search history from localStorage
    const saved = localStorage.getItem('searchHistory');
    if (saved) {
      // This part of the logic needs to be adapted to handle search history
      // For now, we'll just update the searchParams to reflect the current search
      setSearchParams(prev => {
        const newParams = new URLSearchParams(prev);
        newParams.set('query', clickedQuery);
        newParams.set('source', selectedSource);
        return newParams;
      });
    }
  }, []);

  useEffect(() => {
    // Save search history to localStorage
    // This part of the logic needs to be adapted to handle search history
    // For now, we'll just update the searchParams to reflect the current search
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
  }, [searchHistory]);

  return (
    <div className="space-y-8 p-4">
      {/* Search Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
          Search Research Papers
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover the latest research from arXiv, PubMed, and other repositories. 
          Use AI to understand complex papers in simple terms.
        </p>
      </div>
      {/* Search Form */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden max-w-4xl mx-auto">
        <div className="px-6 py-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Search Input */}
            <div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for research papers (e.g., machine learning, cancer treatment, quantum physics)..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors duration-200 text-lg"
                required
              />
            </div>
            {/* Filters */}
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-48">
                <label className="block text-sm font-medium text-gray-700 mb-2">Source</label>
                <select
                  value={selectedSource}
                  onChange={(e) => setSelectedSource(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                >
                  {sources.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
              <div className="min-w-32">
                <label className="block text-sm font-medium text-gray-700 mb-2">Results</label>
                <select
                  value={limits[1]} // Default to 20
                  onChange={(e) => setSelectedSource(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                >
                  {limits.map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-purple-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Searching...
                    </span>
                  ) : (
                    '🔍 Search'
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      {/* Popular Searches */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden max-w-4xl mx-auto">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h3 className="text-lg font-semibold">Popular Searches</h3>
        </div>
        <div className="px-6 py-4">
          <div className="flex flex-wrap gap-2">
            {popularQueries.map((popularQuery) => (
              <button
                key={popularQuery}
                onClick={() => handleQueryClick(popularQuery)}
                className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer"
              >
                {popularQuery}
              </button>
            ))}
          </div>
        </div>
      </div>
      {/* Search History */}
      {/* This section needs to be adapted to handle search history */}
      {/* For now, it will show the current search query */}
      {searchQuery && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden max-w-4xl mx-auto">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
            <h3 className="text-lg font-semibold">Recent Searches</h3>
          </div>
          <div className="px-6 py-4">
            <div className="flex flex-wrap gap-2">
              <button
                key={searchQuery}
                onClick={() => handleQueryClick(searchQuery)}
                className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer"
              >
                {searchQuery}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Search Results */}
      {papers.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Search Results ({papers.length})</h2>
            <p className="text-gray-600">Showing results for "{searchQuery}"</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {papers.map((paper, index) => (
              <PaperCard key={index} paper={paper} />
            ))}
          </div>
        </div>
      )}
      {/* No Results */}
      {!loading && papers.length === 0 && searchQuery && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No papers found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your search terms or filters</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {popularQueries.slice(0, 5).map((popularQuery) => (
              <button
                key={popularQuery}
                onClick={() => handleQueryClick(popularQuery)}
                className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer"
              >
                {popularQuery}
              </button>
            ))}
          </div>
        </div>
      )}
      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Searching for papers...</p>
        </div>
      )}
    </div>
  );
};

export default Search; 