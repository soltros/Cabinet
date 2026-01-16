import React, { useState, useEffect } from 'react';
import cabinetIcon from './cabinet-icon.svg';

const PublicShare = ({ shareId }) => {
  const [metadata, setMetadata] = useState(null);
  const [error, setError] = useState(null);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    fetchMetadata();
  }, [shareId]);

  const fetchMetadata = async () => {
    try {
      const res = await fetch(`/api/public/shares/${shareId}`);
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to load share');
      }
      const data = await res.json();
      setMetadata(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/public/shares/${shareId}/download`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Download failed');
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = metadata.name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
        <div className="flex flex-col items-center mb-6">
          <img src={cabinetIcon} alt="Logo" className="w-12 h-12 mb-2" />
          <h1 className="text-2xl font-bold text-blue-600">Cabinet</h1>
        </div>

        <div className="mb-8">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-blue-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 break-all">{metadata.name}</h2>
          <p className="text-gray-500 mt-1">{(metadata.size / 1024 / 1024).toFixed(2)} MB</p>
        </div>

        <form onSubmit={handleDownload}>
          {metadata.isPasswordProtected && (
            <div className="mb-4 text-left">
              <label className="block text-sm font-medium text-gray-700 mb-1">Password Required</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Enter password..."
                required
              />
            </div>
          )}

          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            Download File
          </button>
        </form>
      </div>

      {/* Custom Toast */}
      {toast && (
        <div className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-full shadow-lg z-[60] text-white font-medium transition-all ${
          toast.type === 'error' ? 'bg-red-500' : 'bg-blue-600'
        }`}>
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default PublicShare;