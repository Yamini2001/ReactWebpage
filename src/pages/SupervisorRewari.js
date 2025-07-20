import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaTrash, FaUpload } from 'react-icons/fa';
import './SupervisorRewari.css';

export default function SupervisorNarnaul() {
  const navigate = useNavigate();
  const [uploadSection, setUploadSection] = useState('Equipment');
  const [files, setFiles] = useState([]);

  // Fetch Narnaul files from server
  const fetchFiles = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/documents');
      const data = await res.json();
      const filtered = data.filter((file) => file.district === 'rewari');
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
        if (contentType.includes('application/json')) {
          const data = await res.json();
          alert('File uploaded!');
          fetchFiles();
        } else {
          const text = await res.text();
          console.error('Upload error:', text);
          alert('Upload failed: Unexpected response');
        }
      } catch (err) {
        console.error('Upload error:', err);
        alert('Upload failed');
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

      {/* Maintenance Section */}
      <div className="section-box">
        <h2>Equipment Check</h2>
        <p>All machinery running smoothly</p>
        <p className="documents-label">📄 Documents</p>
        {files
          .filter((file) => file.section === 'Equipment')
          .map((file, i) => (
            <div key={i} className="file-item">
              <span>{file.name}</span>
              <div className="icon-group">
                <FaEye className="view" onClick={() => viewFile(file)} />
                <FaTrash className="delete" onClick={() => deleteFile(file.id)} />
              </div>
            </div>
          ))}
      </div>

      {/* Updates Section */}
      <div className="section-box">
        <h2>New Installation</h2>
        <p>CNC machine installed successfully</p>
        <p className="documents-label">📄 Documents</p>
        {files
          .filter((file) => file.section === 'Installation')
          .map((file, i) => (
            <div key={i} className="file-item">
              <span>{file.name}</span>
              <div className="icon-group">
                <FaEye className="view" onClick={() => viewFile(file)} />
                <FaTrash className="delete" onClick={() => deleteFile(file.id)} />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
