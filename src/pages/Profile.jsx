import { useEffect, useState } from 'react';
import { useAuth } from '../components/AuthContext';
import { getAuthHeaders } from '../utils/auth';
import PaperCard from '../components/PaperCard';
import { XCircle } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('http://localhost:5000/api/user/profile', {
          headers: { ...getAuthHeaders() }
        });
        const data = await res.json();
        if (res.ok) {
          setProfile(data.user);
        } else {
          setError(data.error || 'Failed to load profile');
        }
      } catch (err) {
        setError('Failed to load profile');
      }
      setLoading(false);
    };
    const fetchBookmarks = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/user/bookmarks', {
          headers: { ...getAuthHeaders() }
        });
        const data = await res.json();
        if (res.ok) {
          setBookmarks(data.bookmarks || []);
        }
      } catch {}
    };
    fetchProfile();
    fetchBookmarks();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4 flex justify-center">
          <XCircle className="w-16 h-16 text-red-500" />
        </div>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 p-4">
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h2 className="text-xl font-semibold">Profile</h2>
        </div>
        <div className="px-6 py-4">
          <div className="flex flex-col gap-2">
            <div><span className="font-medium">Name:</span> {profile?.name}</div>
            <div><span className="font-medium">Email:</span> {profile?.email}</div>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h2 className="text-xl font-semibold">Bookmarked Papers</h2>
        </div>
        <div className="px-6 py-4">
          {bookmarks.length === 0 ? (
            <div className="text-gray-500">No bookmarks yet.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
              {bookmarks.map((paper, idx) => (
                <PaperCard
                  key={idx}
                  paper={paper}
                  inProfile={true}
                  onUnbookmark={() => setBookmarks(bookmarks => bookmarks.filter((b, i) => i !== idx))}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;