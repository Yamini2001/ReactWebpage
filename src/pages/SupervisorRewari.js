import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaTrash, FaUpload } from 'react-icons/fa';
import './SupervisorRewari.css';

export default function SupervisorRewari() {
  const navigate = useNavigate();
  const [uploadSection, setUploadSection] = useState('Equipment');
  const [files, setFiles] = useState([]);

  // ✅ Fetch only Rewari files from server
  const fetchFiles = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/documents');
      const data = await res.json();
      const filtered = data.filter(file => file.district?.toLowerCase() === "rewari");
      setFiles(filtered);
    } catch (error) {
      console.error('Failed to fetch files:', error);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('section', uploadSection);
      formData.append('district', 'rewari');

      try {
        const res = await fetch('http://localhost:4000/api/documents/upload', {
          method: 'POST',
          body: formData,
        });

        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await res.json();
          console.log('Uploaded file:', data); // For debug
          alert('File uploaded!');
          fetchFiles(); // Refresh list
        } else {
          const text = await res.text();
          console.error('Unexpected response:', text);
          alert('Upload failed: Server returned non-JSON response.');
        }
      } catch (err) {
        console.error('Upload failed:', err);
      }
    }
  };

  const viewFile = (file) => {
    window.open(file.url, '_blank');
  };

  const deleteFile = async (id) => {
    if (window.confirm('Are you sure to delete this file?')) {
      try {
        await fetch(`http://localhost:4000/api/documents/${id}`, {
          method: 'DELETE',
        });
        fetchFiles();
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  const handleLogout = () => navigate('/login');

  return (
    <div className="container">
      {/* Header */}
      <div className="header">
        <h1 className="head">Rewari Supervisor Dashboard</h1>
        <button onClick={handleLogout} className="logout-btn">
          ↩ Logout
        </button>
      </div>

      {/* Upload Section */}
      <div className="upload-section">
        <div className="upload-controls">
          <select
            value={uploadSection}
            onChange={(e) => setUploadSection(e.target.value)}
            className="select-section"
          >
            <option value="Equipment">Equipment</option>
            <option value="Installation">Installation</option>
          </select>

          <input
            type="file"
            id="fileUpload"
            onChange={handleUpload}
            style={{ display: 'none' }}
          />
          <button
            onClick={() => document.getElementById('fileUpload').click()}
            className="upload-btn"
          >
            <FaUpload style={{ marginRight: '6px' }} />
            Upload New Data
          </button>
        </div>
      </div>

      {/* Display Uploaded Files */}
      {['Equipment', 'Installation'].map((section) => (
        <div className="section-box" key={section}>
          <h2>{section}</h2>
          {files
            .filter((f) => f.section === section)
            .map((file) => (
              <div key={file.id} className="file-item">
                <span>{file.name}</span>
                <div className="icon-group">
                  <FaEye className="view" title="View" onClick={() => viewFile(file)} />
                  <FaTrash className="delete" title="Delete" onClick={() => deleteFile(file.id)} />
                </div>
              </div>
            ))}
        </div>
      ))}
    </div>
  );
}
