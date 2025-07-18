import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaTrash, FaUpload } from 'react-icons/fa';
import './SupervisorNarnaul.css';

export default function SupervisorNarnaul() {
  const navigate = useNavigate();

  const [files, setFiles] = useState({
    Maintenance: [],
    Updates: [],
  });

  const [uploadSection, setUploadSection] = useState('Maintenance');

  const viewFile = (file) => {
    const fileURL = URL.createObjectURL(file);
    window.open(fileURL, '_blank');
  };

  const deleteFile = (section, fileToDelete) => {
    if (window.confirm(`Delete "${fileToDelete.name}"?`)) {
      setFiles((prev) => ({
        ...prev,
        [section]: prev[section].filter((file) => file.name !== fileToDelete.name),
      }));
    }
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFiles((prev) => ({
        ...prev,
        [uploadSection]: [...prev[uploadSection], file],
      }));
      alert(`${file.name} uploaded to ${uploadSection}.`);
    }
  };

  const handleLogout = () => navigate('/login');

  return (
    <div className="container">
      {/* Header */}
      <div className="header">
        <h1 className='head'>Narnaul Supervisor Dashboard</h1>
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
          <input type="file" id="fileUpload" onChange={handleUpload} style={{ display: 'none' }} />
          <button
            onClick={() => document.getElementById('fileUpload').click()}
            className="upload-btn"
          >
            <FaUpload />
            Upload New Data
          </button>
        </div>
      </div>

      {/* Equipment Section */}
      <div className="section-box">
        <h2>Server Maintenance</h2>
        <p>Monthly server backup completed</p>
        <p className="documents-label">📄 Documents</p>
        {files.Maintenance.map((file, i) => (
          <div key={i} className="file-item">
            <span>{file.name}</span>
            <div className="icon-group">
              <FaEye className="view" title="View" onClick={() => viewFile(file)} />
              <FaTrash className="delete" title="Delete" onClick={() => deleteFile('Maintenance', file)} />
            </div>
          </div>
        ))}
      </div>

      {/* Installation Section */}
      <div className="section-box">
        <h2>Software Updates</h2>
        <p>All systems updated to latest version</p>
        <p className="documents-label">📄 Documents</p>
        {files.Updates.map((file, i) => (
          <div key={i} className="file-item">
            <span>{file.name}</span>
            <div className="icon-group">
              <FaEye className="view" title="View" onClick={() => viewFile(file)} />
              <FaTrash className="delete" title="Delete" onClick={() => deleteFile('Updates', file)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
