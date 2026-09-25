import React from 'react';

const UploadProgress = ({ uploads }) => {
  if (uploads.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50">
      <div className="bg-gray-50 px-4 py-2 border-b border-gray-100 flex justify-between items-center">
        <h3 className="text-sm font-semibold text-gray-700">Uploads</h3>
        <span className="text-xs text-gray-500">{uploads.length} active</span>
      </div>
      <div className="max-h-64 overflow-y-auto p-2 space-y-2">
        {uploads.map((upload) => (
          <div key={upload.id} className="text-sm">
            <div className="flex justify-between mb-1">
              <span className="truncate w-48 text-gray-700">{upload.name}</span>
              <span className={`text-xs ${
                upload.status === 'error'
                  ? 'text-red-500'
                  : upload.status === 'completed'
                    ? 'text-green-600'
                    : 'text-blue-600'
              }`}>
                {upload.status === 'error'
                  ? 'Failed'
                  : upload.status === 'finalizing'
                    ? 'Finalizing…'
                    : upload.status === 'completed'
                      ? 'Complete'
                      : `${upload.progress}%`}
              </span>
            </div>
            {upload.error && (
              <div className="text-xs text-red-500 mb-1 break-words">{upload.error}</div>
            )}
            <div className="w-full bg-gray-100 rounded-full h-1.5">
              <div 
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  upload.status === 'error' ? 'bg-red-500' : 
                  upload.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'
                }`}
                style={{ width: `${upload.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UploadProgress;