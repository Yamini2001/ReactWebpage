import React, { useState } from 'react';
import { FaEye, FaTrash, FaUpload } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './PankajData.css';

const EmployeeData = () => {
  const navigate = useNavigate();

  const [documents, setDocuments] = useState([
    { name: '10th.pdf', file: null },
    { name: '12th.pdf', file: null },
    { name: 'Aadhar.pdf', file: null },
    { name: 'Pan.pdf', file: null },
  ]);

  const handleView = (doc) => {
    if (doc.file) {
      const fileURL = URL.createObjectURL(doc.file);
      window.open(fileURL, '_blank');
    } else {
      alert(`Viewing ${doc.name} (Demo placeholder – no file attached)`);
    }
  };

  const handleDelete = (docToDelete) => {
    if (window.confirm(`Delete "${docToDelete.name}"?`)) {
      setDocuments((prev) => prev.filter((doc) => doc.name !== docToDelete.name));
    }
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const newDoc = { name: file.name, file };
      setDocuments((prev) => [...prev, newDoc]);
      alert(`${file.name} uploaded.`);
    }
  };

  const handleLogout = () => navigate('/login');

  return (
    <div className="container">
      <div className="header">
        <div className="header-left">
          <span className="back-btn" onClick={() => navigate(-1)}>&larr; Back</span>
          <h2 className="header-title">Pankaj's Data</h2>
        </div>
        <button className="logout-btn" onClick={handleLogout}>↩ Logout</button>
      </div>

      <div className="section-box">
        <h2>Employee Information</h2>
        <p>Document verification completed</p>
        <p className="documents-label">📄 Documents</p>

        {documents.map((doc, index) => (
          <div className="file-item" key={index}>
            <span>{doc.name}</span>
            <div className="icon-group">
              <FaEye className="view" title="View" onClick={() => handleView(doc)} />
              <FaTrash className="delete" title="Delete" onClick={() => handleDelete(doc)} />
            </div>
          </div>
        ))}

        <div className="upload-section">
          <label className="upload-btn">
            <FaUpload />
            Upload New Files
            <input
              type="file"
              style={{ display: 'none' }}
              onChange={handleUpload}
              accept=".pdf"
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default EmployeeData;
