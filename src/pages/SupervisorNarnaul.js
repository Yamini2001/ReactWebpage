import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaTrash, FaUpload } from 'react-icons/fa';
import './SupervisorNarnaul.css';

export default function SupervisorNarnaul() {
  const navigate = useNavigate();
  const [uploadSection, setUploadSection] = useState('Maintenance');
  const [files, setFiles] = useState([]);

  // Fetch Narnaul files from server
  const fetchFiles = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/documents');
      const data = await res.json();
      const filtered = data.filter((file) => file.district === 'narnaul');
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
      formData.append('district', 'narnaul');

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
        <h1 className="head">Narnaul Supervisor Dashboard</h1>
        <button onClick={handleLogout} className="logout-btn">
          ↩ Logout
        </button>
      </div>

      {/* Upload Section */}
      <div className="upload-section">
        <select
          value={uploadSection}
          onChange={(e) => setUploadSection(e.target.value)}
          className="select-section"
        >
          <option value="Maintenance">Maintenance</option>
          <option value="Updates">Updates</option>
        </select>

        <div style={{ marginTop: '16px' }}>
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
            <FaUpload />
            Upload New Data
          </button>
        </div>
      </div>

      {/* Maintenance Section */}
      <div className="section-box">
        <h2>Server Maintenance</h2>
        <p>Monthly server backup completed</p>
        <p className="documents-label">📄 Documents</p>
        {files
          .filter((file) => file.section === 'Maintenance')
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
        <h2>Software Updates</h2>
        <p>All systems updated to latest version</p>
        <p className="documents-label">📄 Documents</p>
        {files
          .filter((file) => file.section === 'Updates')
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
