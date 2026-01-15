import React from 'react';

const FileCard = ({ file, onClick, token }) => {
  return (
    <div 
      onClick={() => onClick(file)}
      className="group relative bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer aspect-[3/4] flex flex-col"
    >
      {/* Thumbnail / Icon Area */}
      <div className="flex-1 bg-gray-50 flex items-center justify-center p-4">
        {file.thumbnail ? (
          <img src={`${file.thumbnail}?token=${token}`} alt={file.name} className="w-full h-full object-cover" />
        ) : (
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )}
      </div>

      {/* Metadata Footer */}
      <div className="p-3 bg-white border-t border-gray-100">
        <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
        <p className="text-xs text-gray-500 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
      </div>
    </div>
  );
};

export default FileCard;