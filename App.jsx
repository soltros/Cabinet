import { useState, useEffect, useRef } from 'react'
import FileGrid from './FileGrid';
import UploadProgress from './UploadProgress';
import AdminDashboard from './AdminDashboard';
import cabinetIcon from './cabinet-icon.svg';
import { QRCodeSVG } from 'qrcode.react';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploads, setUploads] = useState([]);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [view, setView] = useState('files'); // 'files' | 'admin'
  const [toast, setToast] = useState(null); // { message, type }
  const [confirmModal, setConfirmModal] = useState(null); // { message, onConfirm }
  const [editQuotaModal, setEditQuotaModal] = useState(null); // { userId, currentQuota }
  const [qrCodeLink, setQrCodeLink] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [drawerDragY, setDrawerDragY] = useState(0);
  const [drawerStartY, setDrawerStartY] = useState(0);
  const [isDrawerDragging, setIsDrawerDragging] = useState(false);
  const [currentFolder, setCurrentFolder] = useState(null); // ID or null for root
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const fileInputRef = useRef(null);
  
  // Login State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (token) fetchFiles();
    if (token) fetchFolders();
  }, [token]);

  useEffect(() => {
    let objectUrl;

    const loadPdf = async () => {
      if (selectedFile && selectedFile.mimeType === 'application/pdf') {
        try {
          const res = await fetch(`/api/files/${selectedFile.id}/content`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!res.ok) throw new Error('PDF fetch failed');
          const blob = await res.blob();
          objectUrl = URL.createObjectURL(blob);
          setPdfUrl(objectUrl);
        } catch (error) {
          console.error('Failed to load PDF preview:', error);
          setPdfUrl(null);
        }
      } else {
        setPdfUrl(null);
      }
    };

    loadPdf();

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [selectedFile, token]);

  // Helper: Format Bytes
  const formatBytes = (bytes, decimals = 2) => {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  };

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    const endpoint = isSignUp ? '/api/auth/register' : '/api/auth/login';
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const data = await res.json();
        
        if (isSignUp && data.status === 'success') {
          showToast('Registration successful! Please login.', 'success');
          setIsSignUp(false);
          return;
        }

        if (data.token) {
          localStorage.setItem('token', data.token);
          setToken(data.token);
        } else {
          showToast(data.error || 'Authentication failed', 'error');
        }
      } else {
        const text = await res.text();
        throw new Error(`Server returned non-JSON response: ${text.slice(0, 100)}`);
      }
    } catch (err) {
      console.error(err);
      showToast(`Error: ${err.message}`, 'error');
    }
  };

  const fetchFolders = async () => {
    try {
      const res = await fetch('/api/folders', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error(`Failed to fetch folders: ${res.status}`);
      const data = await res.json();
      setFolders(data.folders || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchFiles = async () => {
    try {
      const res = await fetch('/api/files', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error(`Failed to fetch files: ${res.status}`);
      const data = await res.json();
      setFiles(data.files || []);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFolder = currentFolder ? file.parentId === currentFolder : !file.parentId;
    return matchesSearch && matchesFolder;
  });

  const filteredFolders = folders.filter(folder => {
    const matchesSearch = folder.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFolder = currentFolder ? folder.parentId === currentFolder : !folder.parentId;
    return matchesSearch && matchesFolder;
  });

  // Upload Logic
  const uploadFiles = (filesToUpload) => {
    Array.from(filesToUpload).forEach(file => {
      const uploadId = Math.random().toString(36).substr(2, 9);
      setUploads(prev => [...prev, { id: uploadId, name: file.name, progress: 0, status: 'uploading' }]);

      const xhr = new XMLHttpRequest();
      const formData = new FormData();
      formData.append('file', file);
      if (currentFolder) formData.append('parentId', currentFolder);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          setUploads(prev => prev.map(u => u.id === uploadId ? { ...u, progress: percent } : u));
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          setUploads(prev => prev.map(u => u.id === uploadId ? { ...u, status: 'completed', progress: 100 } : u));
          fetchFiles();
          setTimeout(() => {
            setUploads(prev => prev.filter(u => u.id !== uploadId));
          }, 3000); 
        } else {
          setUploads(prev => prev.map(u => u.id === uploadId ? { ...u, status: 'error' } : u));
        }
      };

      xhr.onerror = () => {
        setUploads(prev => prev.map(u => u.id === uploadId ? { ...u, status: 'error' } : u));
      };

      xhr.open('POST', '/api/upload');
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      xhr.send(formData);
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    if (e.relatedTarget && e.currentTarget.contains(e.relatedTarget)) return;
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      uploadFiles(e.dataTransfer.files);
    }
  };

  const handleDownload = async () => {
    if (!selectedFile) return;
    try {
      const res = await fetch(`/api/files/${selectedFile.id}/content`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Download failed');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = selectedFile.name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error(err);
      showToast('Download failed', 'error');
    }
  };

  const handleShare = async () => {
    if (!selectedFile) return;
    try {
      const res = await fetch('/api/shares', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ fileId: selectedFile.id })
      });
      const data = await res.json();
      if (data.link) {
        const fullLink = `${window.location.origin}${data.link}`;
        await navigator.clipboard.writeText(fullLink);
        showToast('Link copied to clipboard!', 'success');
      }
    } catch (err) {
      console.error(err);
      showToast('Share failed', 'error');
    }
  };

  const handleQRCode = async () => {
    if (!selectedFile) return;
    try {
      const res = await fetch('/api/shares', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ fileId: selectedFile.id })
      });
      const data = await res.json();
      if (data.link) {
        const fullLink = `${window.location.origin}${data.link}`;
        setQrCodeLink(fullLink);
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to generate QR Code', 'error');
    }
  };

  const handleDelete = async () => {
    if (!selectedFile) return;
    setConfirmModal({
      message: 'Are you sure you want to delete this file?',
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/files/${selectedFile.id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            setSelectedFile(null);
            fetchFiles();
            showToast('File deleted', 'success');
          } else {
            showToast('Delete failed', 'error');
          }
        } catch (err) {
          console.error(err);
        }
      }
    });
  };

  const handleDrawerTouchStart = (e) => {
    setDrawerStartY(e.touches[0].clientY);
    setIsDrawerDragging(true);
  };

  const handleDrawerTouchMove = (e) => {
    if (!isDrawerDragging) return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - drawerStartY;
    if (diff > 0) setDrawerDragY(diff); // Only allow dragging down
  };

  const handleDrawerTouchEnd = () => {
    setIsDrawerDragging(false);
    if (drawerDragY > 100) {
      setSelectedFile(null);
    }
    setDrawerDragY(0);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      uploadFiles(e.target.files);
    }
    e.target.value = '';
  };

  const isAdmin = () => {
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.username === 'admin';
    } catch (e) {
      return false;
    }
  };

  const handleCreateFolder = async () => {
    const name = prompt('Folder name:');
    if (!name) return;
    try {
      const res = await fetch('/api/folders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ name, parentId: currentFolder })
      });
      if (res.ok) {
        fetchFolders();
        showToast('Folder created', 'success');
      } else {
        showToast('Failed to create folder', 'error');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const getBreadcrumbs = () => {
    const crumbs = [{ id: null, name: 'Home' }];
    let curr = currentFolder;
    const path = [];
    while (curr) {
      const folder = folders.find(f => f.id === curr);
      if (!folder) break;
      path.unshift(folder);
      curr = folder.parentId;
    }
    return [...crumbs, ...path];
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <form onSubmit={handleAuth} className="bg-white p-8 rounded-xl shadow-lg max-w-sm w-full">
          <div className="flex flex-col items-center mb-6">
            <img src={cabinetIcon} alt="Logo" className="w-12 h-12 mb-2" />
            <h1 className="text-2xl font-bold text-blue-600">Cabinet</h1>
          </div>
          <input
            type="text"
            placeholder="Username"
            className="w-full mb-4 p-3 border rounded-lg"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full mb-6 p-3 border rounded-lg"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700">
            {isSignUp ? 'Sign Up' : 'Login'}
          </button>
          <button 
            type="button" 
            onClick={() => setIsSignUp(!isSignUp)}
            className="w-full mt-4 text-sm text-blue-600 hover:underline">
            {isSignUp ? 'Already have an account? Login' : 'Need an account? Sign Up'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-gray-50 relative"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Drag Overlay */}
      {isDragging && (
        <div className="absolute inset-0 bg-blue-500/10 z-50 border-4 border-blue-500 border-dashed m-4 rounded-2xl flex items-center justify-center pointer-events-none">
          <div className="bg-white p-4 rounded-xl shadow-lg">
            <p className="text-blue-600 font-bold text-lg">Drop files to upload</p>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('files')}>
            <img src={cabinetIcon} alt="Logo" className="w-8 h-8" />
            <h1 className="text-xl font-bold text-blue-600 hover:underline">Cabinet</h1>
          </div>
          <div className="flex-1 max-w-md mx-4 hidden md:block">
            <input
              type="text"
              placeholder="Search files..."
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-4">
            <button onClick={handleCreateFolder} className="text-gray-500 hover:text-blue-600" title="New Folder">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5v6m3-3H9m4.06-7.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
              </svg>
            </button>
            <button onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')} className="text-gray-500 hover:text-blue-600" title="Toggle View">
              {viewMode === 'grid' ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 17.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
                </svg>
              )}
            </button>
            <button 
              onClick={handleUploadClick}
              className="text-gray-500 hover:text-blue-600"
              title="Upload Files"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
              </svg>
            </button>
            {isAdmin() && (
              <button 
                onClick={() => setView('admin')}
                className="text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                Admin
              </button>
            )}
            <button 
              onClick={() => { localStorage.removeItem('token'); setToken(null); }}
              className="text-sm text-gray-500 hover:text-red-500"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      {view === 'admin' ? (
        <AdminDashboard token={token} showToast={showToast} />
      ) : (
        <main className="max-w-7xl mx-auto mt-4">
          <div className="md:hidden px-4 mb-4">
            <input
              type="text"
              placeholder="Search files..."
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Breadcrumbs */}
          <div className="px-4 mb-4 flex items-center gap-2 text-sm text-gray-600 overflow-x-auto whitespace-nowrap">
            {getBreadcrumbs().map((crumb, i) => (
              <div key={crumb.id || 'root'} className="flex items-center">
                {i > 0 && <span className="mx-2 text-gray-400">/</span>}
                <button 
                  onClick={() => setCurrentFolder(crumb.id)}
                  className={`hover:text-blue-600 ${i === getBreadcrumbs().length - 1 ? 'font-bold text-gray-900' : ''}`}
                >
                  {crumb.name}
                </button>
              </div>
            ))}
          </div>

          <FileGrid files={filteredFiles} folders={filteredFolders} onFileClick={setSelectedFile} onFolderClick={setCurrentFolder} token={token} viewMode={viewMode} />
        </main>
      )}

      {/* Bottom Sheet / Drawer */}
      {selectedFile && (
        <div className="fixed inset-0 z-50 flex items-end justify-center pointer-events-none">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/20 pointer-events-auto" onClick={() => setSelectedFile(null)} />
          
          {/* Drawer */}
          <div 
            className="bg-white w-full max-w-lg rounded-t-2xl p-6 shadow-2xl transform transition-transform pointer-events-auto touch-none"
            style={{ transform: `translateY(${drawerDragY}px)`, transition: isDrawerDragging ? 'none' : 'transform 0.2s ease-out' }}
            onTouchStart={handleDrawerTouchStart}
            onTouchMove={handleDrawerTouchMove}
            onTouchEnd={handleDrawerTouchEnd}
          >
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6" />
            
            {/* Image Viewer */}
            {selectedFile.mimeType.startsWith('image/') && (
              <div className="w-full rounded-lg mb-4 bg-gray-100 overflow-hidden">
                <a href={`/api/files/${selectedFile.id}/content?token=${token}`} target="_blank" rel="noopener noreferrer">
                  <img 
                    src={`/api/files/${selectedFile.id}/content?token=${token}`} 
                    alt={selectedFile.name}
                    className="w-full h-auto max-h-[60vh] object-contain mx-auto" 
                  />
                </a>
              </div>
            )}

            {/* Task 5.1: Video Player */}
            {selectedFile.mimeType.startsWith('video/') && (
              <video 
                controls 
                className="w-full rounded-lg mb-4 bg-black aspect-video"
                poster={`${selectedFile.thumbnail}?token=${token}`}
              >
                <source src={`/api/files/${selectedFile.id}/content`} type={selectedFile.mimeType} />
                Your browser does not support the video tag.
              </video>
            )}

            {/* Audio Player */}
            {selectedFile.mimeType.startsWith('audio/') && (
              <div className="w-full rounded-lg mb-4 bg-gray-100 p-4 flex items-center justify-center">
                <audio 
                  controls 
                  className="w-full"
                  src={`/api/files/${selectedFile.id}/content`}
                >
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}

            {/* Task 5.2: PDF Previewer */}
            {selectedFile.mimeType === 'application/pdf' && (
              <div className="w-full rounded-lg mb-4 bg-gray-200 aspect-[4/5] overflow-hidden relative">
                {pdfUrl ? (
                  <iframe
                    src={pdfUrl}
                    title={selectedFile.name}
                    className="w-full h-full border-0"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    {selectedFile.thumbnail ? (
                      <img src={`${selectedFile.thumbnail}?token=${token}`} className="w-full h-full object-cover opacity-50 blur-sm" />
                    ) : (
                      <span className="text-gray-500 font-medium animate-pulse">Loading PDF...</span>
                    )}
                  </div>
                )}
              </div>
            )}

            <a href={`/api/files/${selectedFile.id}/content?token=${token}`} target="_blank" rel="noopener noreferrer" className="hover:underline block">
              <h2 className="text-lg font-bold text-gray-900 mb-2 truncate">{selectedFile.name}</h2>
            </a>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <button onClick={handleDownload} className="bg-blue-600 text-white py-3 rounded-xl font-medium">Download</button>
              <button onClick={handleShare} className="bg-gray-100 text-gray-700 py-3 rounded-xl font-medium">Share</button>
              <button onClick={handleQRCode} className="bg-gray-100 text-gray-700 py-3 rounded-xl font-medium">QR Code</button>
              <button onClick={handleDelete} className="bg-red-100 text-red-600 py-3 rounded-xl font-medium">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Toast */}
      {toast && (
        <div className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-full shadow-lg z-[60] text-white font-medium transition-all ${
          toast.type === 'error' ? 'bg-red-500' : 'bg-blue-600'
        }`}>
          {toast.message}
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-6 shadow-2xl max-w-sm w-full mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Confirm Action</h3>
            <p className="text-gray-600 mb-6">{confirmModal.message}</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setConfirmModal(null)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium">Cancel</button>
              <button onClick={() => { confirmModal.onConfirm(); setConfirmModal(null); }} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">Confirm</button>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {qrCodeLink && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50" onClick={() => setQrCodeLink(null)}>
          <div className="bg-white p-6 rounded-xl shadow-2xl flex flex-col items-center max-w-sm w-full mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Scan to Download</h3>
            <div className="p-4 bg-white rounded-lg border border-gray-200 mb-4">
              <QRCodeSVG value={qrCodeLink} size={200} />
            </div>
            <p className="text-sm text-gray-500 mb-6 break-all text-center">{qrCodeLink}</p>
            <button onClick={() => setQrCodeLink(null)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 w-full">Close</button>
          </div>
        </div>
      )}

      <UploadProgress uploads={uploads} />
      <input
        type="file"
        multiple
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  )
}

export default App
