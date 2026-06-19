import { useState, useEffect, useRef } from 'react'
import FileGrid from './FileGrid';
import UploadProgress from './UploadProgress';
import AdminDashboard from './AdminDashboard';
import PublicShare from './PublicShare';
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
  const [inputModal, setInputModal] = useState(null); // { title, label, onConfirm }
  const [shareModal, setShareModal] = useState(null); // { file }
  const [moveModal, setMoveModal] = useState(null); // { file }
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
    // Handle Public Share Route
    if (window.location.pathname.startsWith('/s/')) {
      return; // Do nothing, let the render handle it
    }

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
      if (res.status === 401) {
        setToken(null);
        localStorage.removeItem('token');
        setView('files');
        return;
      }
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
      if (res.status === 401) {
        setToken(null);
        localStorage.removeItem('token');
        setView('files');
        return;
      }
      if (!res.ok) throw new Error(`Failed to fetch files: ${res.status}`);
      const data = await res.json();
      setFiles(data.files || []);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFolder = searchQuery ? true : (currentFolder ? file.parentId === currentFolder : !file.parentId);
    return matchesSearch && matchesFolder;
  });

  const filteredFolders = folders.filter(folder => {
    const matchesSearch = folder.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFolder = searchQuery ? true : (currentFolder ? folder.parentId === currentFolder : !folder.parentId);
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
          setTimeout(() => {
            setUploads(prev => prev.filter(u => u.id !== uploadId));
          }, 6000);
        }
      };

      xhr.onerror = () => {
        setUploads(prev => prev.map(u => u.id === uploadId ? { ...u, status: 'error' } : u));
        setTimeout(() => {
          setUploads(prev => prev.filter(u => u.id !== uploadId));
        }, 6000);
      };

      xhr.open('POST', '/api/upload');
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      xhr.send(formData);
    });
  };

  const handleDragOver = (e) => {
    if (view === 'admin') return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    if (view === 'admin') return;
    e.preventDefault();
    if (e.relatedTarget && e.currentTarget.contains(e.relatedTarget)) return;
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    if (view === 'admin') return;
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      uploadFiles(e.dataTransfer.files);
    }
  };

  const handleDownload = () => {
    if (!selectedFile) return;
    const url = `/api/files/${selectedFile.id}/content?token=${token}&download=true`;
    const a = document.createElement('a');
    a.href = url;
    a.download = selectedFile.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleShare = async () => {
    if (!selectedFile) return;
    setShareModal({ file: selectedFile });
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

  const handleRename = () => {
    if (!selectedFile) return;
    setInputModal({
      title: 'Rename File',
      label: 'New Name',
      defaultValue: selectedFile.name,
      onConfirm: async (newName) => {
        try {
          const res = await fetch(`/api/files/${selectedFile.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ name: newName })
          });
          if (res.ok) {
            const data = await res.json();
            setSelectedFile(data.file);
            fetchFiles();
            showToast('File renamed', 'success');
          } else {
            showToast('Rename failed', 'error');
          }
        } catch (e) {
          console.error(e);
          showToast('Rename error', 'error');
        }
      }
    });
  };

  const handleMove = () => {
    if (!selectedFile) return;
    setMoveModal({ file: selectedFile });
  };

  const executeMove = async (targetFolderId) => {
    if (!moveModal?.file) return;
    const parentId = targetFolderId === 'root' ? null : targetFolderId;
    try {
      const res = await fetch(`/api/files/${moveModal.file.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ parentId })
      });
      if (res.ok) {
        const data = await res.json();
        if (selectedFile?.id === moveModal.file.id) {
          setSelectedFile(data.file);
        }
        fetchFiles();
        showToast('File moved', 'success');
        setMoveModal(null);
      } else {
        showToast('Move failed', 'error');
      }
    } catch (e) {
      console.error(e);
      showToast('Move error', 'error');
    }
  };

  const getFolderPath = (folderId) => {
    let curr = folderId;
    const path = [];
    while (curr) {
      const folder = folders.find(f => f.id === curr);
      if (!folder) break;
      path.unshift(folder.name);
      curr = folder.parentId;
    }
    return '/' + path.join('/');
  };

  const handleDeleteFolder = async () => {
    if (!currentFolder) return;
    const folder = folders.find(f => f.id === currentFolder);
    if (!folder) return;
    
    const hasFiles = files.some(f => f.parentId === currentFolder);
    const hasFolders = folders.some(f => f.parentId === currentFolder);
    if (hasFiles || hasFolders) {
      showToast('Cannot delete a non-empty folder. Please empty it first.', 'error');
      return;
    }

    openConfirmModal(`Are you sure you want to delete the folder "${folder.name}"?`, async () => {
      try {
        const res = await fetch(`/api/folders/${currentFolder}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const parent = folder.parentId;
          setCurrentFolder(parent);
          fetchFolders();
          showToast('Folder deleted', 'success');
        } else {
          const data = await res.json();
          showToast(data.error || 'Failed to delete folder', 'error');
        }
      } catch (err) {
        console.error(err);
        showToast('Error deleting folder', 'error');
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

  const openConfirmModal = (message, onConfirm) => {
    setConfirmModal({
      message,
      onConfirm
    });
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
    setInputModal({
      title: 'New Folder',
      label: 'Folder Name',
      onConfirm: async (name) => {
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
        } catch (e) { console.error(e); }
      }
    });
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

  // Render Public Share View
  if (window.location.pathname.startsWith('/s/')) {
    const shareId = window.location.pathname.split('/')[2];
    return <PublicShare shareId={shareId} />;
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-900 flex items-center justify-center p-4 relative overflow-hidden animate-fade-in">
        {/* Decorative Background Glows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <form 
          onSubmit={handleAuth} 
          className="bg-slate-900/60 backdrop-blur-xl p-8 rounded-2xl border border-slate-800 shadow-2xl max-w-md w-full relative z-10 transition-all duration-300 hover:border-slate-700/80"
        >
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 bg-blue-600/10 rounded-2xl flex items-center justify-center mb-3 border border-blue-500/20">
              <img src={cabinetIcon} alt="Cabinet Logo" className="w-8 h-8 animate-pulse" />
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Cabinet</h1>
            <p className="text-slate-400 text-sm mt-1.5 text-center">
              {isSignUp ? 'Register a standard 50GB file locker' : 'Sign in to access your secure files'}
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5 ml-1">Username</label>
              <input
                type="text"
                placeholder="Username"
                className="w-full p-3 bg-slate-950/80 border border-slate-800 text-white rounded-xl placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5 ml-1">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full p-3 bg-slate-950/80 border border-slate-800 text-white rounded-xl placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full mt-8 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white p-3.5 rounded-xl font-bold transition-colors duration-200 shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
          >
            {isSignUp ? 'Create Account' : 'Sign In'}
          </button>
          
          <button 
            type="button" 
            onClick={() => setIsSignUp(!isSignUp)}
            className="w-full mt-5 text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors hover:underline"
          >
            {isSignUp ? 'Already have an account? Sign in' : 'Need an account? Register now'}
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
            {view !== 'admin' && (
              <input
                type="text"
                placeholder="Search files..."
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            )}
          </div>
          <div className="flex items-center gap-4">
            {view !== 'admin' && (
              <>
                <button onClick={handleCreateFolder} className="text-gray-500 hover:text-blue-600" title="New Folder">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5v6m3-3H9m4.06-7.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
                  </svg>
                </button>
                {currentFolder && (
                  <button onClick={handleDeleteFolder} className="text-gray-500 hover:text-red-600" title="Delete Current Folder">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                  </button>
                )}
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
              </>
            )}
            {isAdmin() && (
              <button 
                onClick={() => setView(view === 'admin' ? 'files' : 'admin')}
                className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors px-3 py-1 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-100"
              >
                {view === 'admin' ? 'Back to Files' : 'Admin'}
              </button>
            )}
            <button 
              onClick={() => { localStorage.removeItem('token'); setToken(null); setView('files'); }}
              className="text-sm text-gray-500 hover:text-red-500"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      {view === 'admin' && isAdmin() ? (
        <AdminDashboard token={token} showToast={showToast} openConfirmModal={openConfirmModal} />
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
                <source src={`/api/files/${selectedFile.id}/content?token=${token}`} type={selectedFile.mimeType} />
                Your browser does not support the video tag.
              </video>
            )}

            {/* Audio Player */}
            {selectedFile.mimeType.startsWith('audio/') && (
              <div className="w-full rounded-lg mb-4 bg-gray-100 p-4 flex items-center justify-center">
                <audio 
                  controls 
                  className="w-full"
                  src={`/api/files/${selectedFile.id}/content?token=${token}`}
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
              <h2 className="text-lg font-bold text-gray-900 mb-1 truncate">{selectedFile.name}</h2>
            </a>
            <p className="text-xs text-gray-400 mb-2 truncate">Location: {selectedFile.parentId ? getFolderPath(selectedFile.parentId) : 'Home'}</p>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <button onClick={handleDownload} className="bg-blue-600 text-white py-3 rounded-xl font-medium">Download</button>
              <button onClick={handleShare} className="bg-gray-100 text-gray-700 py-3 rounded-xl font-medium">Share</button>
              <button onClick={handleQRCode} className="bg-gray-100 text-gray-700 py-3 rounded-xl font-medium">QR Code</button>
              <button onClick={handleRename} className="bg-gray-100 text-gray-700 py-3 rounded-xl font-medium">Rename</button>
              <button onClick={handleMove} className="bg-gray-100 text-gray-700 py-3 rounded-xl font-medium">Move</button>
              {selectedFile.parentId !== currentFolder && (
                <button onClick={() => { setCurrentFolder(selectedFile.parentId); setSelectedFile(null); setSearchQuery(''); }} className="bg-gray-100 text-gray-700 py-3 rounded-xl font-medium">Go to Folder</button>
              )}
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

      {/* Input Modal */}
      {inputModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-6 shadow-2xl max-w-sm w-full mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">{inputModal.title}</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              inputModal.onConfirm(e.target.input.value);
              setInputModal(null);
            }}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{inputModal.label}</label>
              <input name="input" defaultValue={inputModal.defaultValue || ''} className="w-full p-2 border rounded-lg mb-6" autoFocus required />
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setInputModal(null)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">Confirm</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {shareModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-6 shadow-2xl max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Share File</h3>
            
            <div className="mb-6">
              <h4 className="text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Public Link</h4>
              <form onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const data = Object.fromEntries(formData.entries());
                try {
                  const res = await fetch('/api/shares', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({ fileId: shareModal.file.id, ...data })
                  });
                  const json = await res.json();
                  if (json.link) {
                    const fullLink = `${window.location.origin}${json.link}`;
                    await navigator.clipboard.writeText(fullLink);
                    showToast('Link copied to clipboard!', 'success');
                    setShareModal(null);
                  }
                } catch (err) { showToast('Share failed', 'error'); }
              }}>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Password (Optional)</label>
                    <input name="password" type="password" className="w-full p-2 border rounded text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Max Downloads</label>
                    <input name="maxDownloads" type="number" className="w-full p-2 border rounded text-sm" />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="block text-xs text-gray-500 mb-1">Expiration</label>
                  <input name="expiresAt" type="datetime-local" className="w-full p-2 border rounded text-sm" />
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 text-sm">Generate Link</button>
              </form>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <h4 className="text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Internal Share</h4>
              <form onSubmit={async (e) => {
                e.preventDefault();
                const username = e.target.username.value;
                try {
                  const res = await fetch(`/api/files/${shareModal.file.id}/share`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({ username })
                  });
                  if (res.ok) {
                    showToast(`Shared with ${username}`, 'success');
                    setShareModal(null);
                  } else {
                    const err = await res.json();
                    showToast(err.error || 'Share failed', 'error');
                  }
                } catch (err) { showToast('Share failed', 'error'); }
              }} className="flex gap-2">
                <input name="username" placeholder="Username" className="flex-1 p-2 border rounded text-sm" required />
                <button type="submit" className="bg-gray-800 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-900 text-sm">Share</button>
              </form>
            </div>
            <button onClick={() => setShareModal(null)} className="mt-4 w-full text-gray-500 text-sm hover:text-gray-700">Close</button>
          </div>
        </div>
      )}

      {/* Move Modal */}
      {moveModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-6 shadow-2xl max-w-sm w-full mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Move File</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              executeMove(e.target.folder.value);
            }}>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Folder</label>
              <select name="folder" className="w-full p-2 border rounded-lg mb-6 text-sm bg-white" required>
                <option value="root">Home (Root)</option>
                {folders.map(f => (
                  <option key={f.id} value={f.id}>
                    {getFolderPath(f.id)}
                  </option>
                ))}
              </select>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setMoveModal(null)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">Move</button>
              </div>
            </form>
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
