import React from 'react';
import FileCard from './FileCard';

const FileGrid = ({ files, folders, onFileClick, onFolderClick, token, viewMode }) => {
  const isEmpty = (!files || files.length === 0) && (!folders || folders.length === 0);

  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400">
        <p>This folder is empty.</p>
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mx-4 mb-32">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 font-medium text-gray-500">Name</th>
              <th className="px-4 py-3 font-medium text-gray-500 w-24">Size</th>
              <th className="px-4 py-3 font-medium text-gray-500 w-32">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {folders.map(folder => (
              <tr key={folder.id} onClick={() => onFolderClick(folder.id)} className="hover:bg-gray-50 cursor-pointer">
                <td className="px-4 py-3 flex items-center gap-3 font-medium text-gray-900">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-blue-500">
                    <path d="M19.5 21a3 3 0 0 0 3-3v-4.5a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3V18a3 3 0 0 0 3 3h15ZM1.5 10.146V6a3 3 0 0 1 3-3h5.379a2.25 2.25 0 0 1 1.59.659l2.122 2.121c.14.141.331.22.53.22H19.5a3 3 0 0 1 3 3v1.146A4.483 4.483 0 0 0 19.5 9h-15a4.483 4.483 0 0 0-3 1.146Z" />
                  </svg>
                  {folder.name}
                </td>
                <td className="px-4 py-3 text-gray-500">-</td>
                <td className="px-4 py-3 text-gray-500">{new Date(folder.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
            {files.map(file => (
              <tr key={file.id} onClick={() => onFileClick(file)} className="hover:bg-gray-50 cursor-pointer">
                <td className="px-4 py-3 flex items-center gap-3 text-gray-700">
                  {file.thumbnail ? (
                    <img src={`${file.thumbnail}?token=${token}`} className="w-6 h-6 rounded object-cover" />
                  ) : (
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  )}
                  {file.name}
                </td>
                <td className="px-4 py-3 text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</td>
                <td className="px-4 py-3 text-gray-500">{new Date(file.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 p-4 pb-32">
      {folders.map((folder) => (
        <div 
          key={folder.id} 
          onClick={() => onFolderClick(folder.id)}
          className="group bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col items-center justify-center aspect-[3/4]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16 text-blue-200 group-hover:text-blue-300 transition-colors mb-3">
            <path d="M19.5 21a3 3 0 0 0 3-3v-4.5a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3V18a3 3 0 0 0 3 3h15ZM1.5 10.146V6a3 3 0 0 1 3-3h5.379a2.25 2.25 0 0 1 1.59.659l2.122 2.121c.14.141.331.22.53.22H19.5a3 3 0 0 1 3 3v1.146A4.483 4.483 0 0 0 19.5 9h-15a4.483 4.483 0 0 0-3 1.146Z" />
          </svg>
          <p className="text-sm font-medium text-gray-900 text-center truncate w-full px-2">{folder.name}</p>
          <p className="text-xs text-gray-500 mt-1">Folder</p>
        </div>
      ))}
      {files.map((file) => (
        <FileCard key={file.id} file={file} onClick={onFileClick} token={token} />
      ))}
    </div>
  );
};

export default FileGrid;