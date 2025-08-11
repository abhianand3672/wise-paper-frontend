import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { getAuthHeaders } from '../utils/auth';
import { useState } from 'react';
import { Star, Trash2 } from 'lucide-react';

const PaperCard = ({ paper, inProfile, onUnbookmark }) => {
  const { user } = useAuth();
  const [bookmarked, setBookmarked] = useState(!!paper._id);
  const [loading, setLoading] = useState(false);

  const handleBookmark = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/user/bookmarks', {         
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({ paper: { ...paper, paperId: paper.link || paper.paperId } })
      });
      if (res.ok) setBookmarked(true);
    } finally {
      setLoading(false);
    }
  };

  const handleUnbookmark = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/user/bookmarks/${encodeURIComponent(paper.link || paper.paperId)}`, {
        method: 'DELETE',
        headers: { ...getAuthHeaders() }
      });
      if (res.ok) {
        setBookmarked(false);
        if (onUnbookmark) onUnbookmark();
      }
    } finally {
      setLoading(false);
    }
  };

  const truncateText = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden transition-transform duration-200 hover:scale-105 hover:shadow-xl group flex flex-col h-full">
      <div className="px-6 py-4 flex flex-col h-full">
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-800 mb-3 line-clamp-2">
          {paper.title}
        </h3>
        {/* Authors */}
        {paper.authors && paper.authors.length > 0 && (
          <p className="text-sm text-gray-600 mb-3">
            By {paper.authors.slice(0, 3).join(', ')}
            {paper.authors.length > 3 && ` +${paper.authors.length - 3} more`}
          </p>
        )}
        {/* Summary */}
        <p className="text-gray-700 text-sm mb-4 line-clamp-3">
          {truncateText(paper.summary)}
        </p>
        {/* Actions */}
        <div className="flex items-center justify-between mt-auto pt-2">
          <Link
            to={paper.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            Read 
          </Link>
          <Link
            to={`/paper/${btoa(paper.title).replace(/[+/=]/g, '')}`}
            state={{ paper: paper }}
            className="text-gray-600 hover:text-gray-700 text-sm"
          >
            Explain AI
          </Link>
          {user && (
            inProfile ? (
              <button
                onClick={handleUnbookmark}
                disabled={loading}
                className="ml-2 px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-700 hover:bg-red-200 flex items-center gap-1"
                title="Remove Bookmark"
              >
                <Trash2 className="h-4 w-4" />
                Remove
              </button>
            ) : (
              <button
                onClick={bookmarked ? handleUnbookmark : handleBookmark}
                disabled={loading}
                className={`ml-2 px-2 py-1 rounded text-xs font-medium flex items-center gap-1 ${bookmarked ? 'bg-yellow-200 text-yellow-800' : 'bg-gray-100 text-gray-700 hover:bg-yellow-100'}`}
                title={bookmarked ? 'Remove Bookmark' : 'Bookmark'}
              >
                <Star className={`h-4 w-4 ${bookmarked ? 'fill-current' : ''}`} />
                {bookmarked ? 'Bookmarked' : 'Bookmark'}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default PaperCard; 