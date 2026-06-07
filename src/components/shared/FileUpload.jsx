import { useState, useRef } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase';
import { formatFileSize, getFileIcon } from '../../utils/helpers';
import toast from 'react-hot-toast';

export default function FileUpload({
  storagePath,
  onUploadComplete,
  accept = '*/*',
  multiple = false,
  label = 'Drop files here or click to browse',
  sublabel = '',
  disabled = false,
}) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState({});
  const inputRef = useRef(null);

  const handleSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setSelectedFiles(prev => multiple ? [...prev, ...files] : files);
    e.target.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files || []);
    setSelectedFiles(prev => multiple ? [...prev, ...files] : files);
  };

  const removeFile = (idx) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== idx));
  };

  const uploadAll = async () => {
    if (!selectedFiles.length || !storagePath) return [];
    setUploading(true);
    const results = [];

    for (const file of selectedFiles) {
      try {
        const ts = Date.now();
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
        const storageRef = ref(storage, `${storagePath}/${ts}_${safeName}`);

        await new Promise((resolve, reject) => {
          const task = uploadBytesResumable(storageRef, file);
          task.on(
            'state_changed',
            (snap) => {
              const pct = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
              setProgress(prev => ({ ...prev, [file.name]: pct }));
            },
            (err) => {
              toast.error(`Failed: ${file.name}`);
              reject(err);
            },
            async () => {
              const url = await getDownloadURL(task.snapshot.ref);
              results.push({ fileName: file.name, fileURL: url, fileSize: file.size, uploadedAt: new Date() });
              resolve();
            }
          );
        });
      } catch {
        // individual file error already toasted
      }
    }

    setUploading(false);
    setSelectedFiles([]);
    setProgress({});
    if (onUploadComplete) onUploadComplete(results);
    return results;
  };

  return (
    <div className="space-y-3">
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => !disabled && inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
          disabled
            ? 'border-gray-700 cursor-not-allowed opacity-50'
            : 'border-gray-600 hover:border-blue-500 cursor-pointer group'
        }`}
      >
        <div className="text-3xl mb-2">📁</div>
        <p className="text-gray-400 text-sm group-hover:text-blue-400 transition-colors">{label}</p>
        {sublabel && <p className="text-gray-600 text-xs mt-1">{sublabel}</p>}
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept={accept}
          multiple={multiple}
          onChange={handleSelect}
          disabled={disabled}
        />
      </div>

      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          {selectedFiles.map((file, idx) => (
            <div key={idx} className="flex items-center gap-3 bg-[#1f2937] rounded-lg p-3 border border-gray-700">
              <span className="text-xl flex-shrink-0">{getFileIcon(file.name)}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-200 truncate">{file.name}</p>
                <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                {progress[file.name] !== undefined && (
                  <div className="mt-1.5 h-1 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 transition-all duration-200"
                      style={{ width: `${progress[file.name]}%` }}
                    />
                  </div>
                )}
              </div>
              {!uploading && (
                <button onClick={() => removeFile(idx)} className="text-gray-600 hover:text-red-400 transition-colors flex-shrink-0 text-lg leading-none">
                  ×
                </button>
              )}
            </div>
          ))}

          <button
            onClick={uploadAll}
            disabled={uploading}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-lg text-sm font-medium transition-colors"
          >
            {uploading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Uploading...
              </span>
            ) : (
              `Upload ${selectedFiles.length} file${selectedFiles.length > 1 ? 's' : ''}`
            )}
          </button>
        </div>
      )}
    </div>
  );
}

export function FileChip({ file, onRemove }) {
  return (
    <div className="inline-flex items-center gap-2 bg-[#1f2937] border border-gray-700 rounded-lg px-3 py-1.5">
      <span className="text-sm">{getFileIcon(file.fileName)}</span>
      <a
        href={file.fileURL}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-blue-400 hover:text-blue-300 truncate max-w-[140px]"
        title={file.fileName}
      >
        {file.fileName}
      </a>
      <span className="text-xs text-gray-500">{formatFileSize(file.fileSize)}</span>
      {onRemove && (
        <button onClick={onRemove} className="text-gray-600 hover:text-red-400 transition-colors text-base leading-none">×</button>
      )}
    </div>
  );
}
