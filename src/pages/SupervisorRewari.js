import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaTrash, FaUpload } from 'react-icons/fa';
import './SupervisorRewari.css';

export default function SupervisorNarnaul() {
  const navigate = useNavigate();

  const [files, setFiles] = useState({
    Equipment: [],
    Installation: [],
  });

  const [uploadSection, setUploadSection] = useState('Equipment');

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
        <h1 className='head'>Rewari Supervisor Dashboard</h1>
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
          <option value="Equipment">Equipment</option>
          <option value="Installation">Installation</option>
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
        <h2>Equipment Check</h2>
        <p>All machinery running smoothly</p>
        <p className="documents-label">📄 Documents</p>
        {files.Equipment.map((file, i) => (
          <div key={i} className="file-item">
            <span>{file.name}</span>
            <div className="icon-group">
              <FaEye className="view" title="View" onClick={() => viewFile(file)} />
              <FaTrash className="delete" title="Delete" onClick={() => deleteFile('Equipment', file)} />
            </div>
          </div>
        ))}
      </div>

      {/* Installation Section */}
      <div className="section-box">
        <h2>New Installation</h2>
        <p>CNC machine installed successfully</p>
        <p className="documents-label">📄 Documents</p>
        {files.Installation.map((file, i) => (
          <div key={i} className="file-item">
            <span>{file.name}</span>
            <div className="icon-group">
              <FaEye className="view" title="View" onClick={() => viewFile(file)} />
              <FaTrash className="delete" title="Delete" onClick={() => deleteFile('Installation', file)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
