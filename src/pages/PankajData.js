import React, { useEffect, useState } from 'react';
import { FaEye, FaTrash, FaUpload } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import './PankajData.css';

const EmployeeData = () => {
  const navigate = useNavigate();
  const { name: employeeId } = useParams();
  const [documents, setDocuments] = useState([]);
  const [employeeName, setEmployeeName] = useState('');

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/documents/employees/${employeeId}`);
        const data = await res.json();
        setDocuments(data.documents);
        setEmployeeName(data.employeeName || 'Employee');
      } catch (err) {
        console.error(err);
      }
    };

    fetchDocs();
  }, [employeeId]);

  const handleView = (doc) => {
    if (doc.fileUrl) {
      window.open(doc.fileUrl, '_blank');
    } else {
      alert('No file uploaded yet.');
    }
  };

  const handleDelete = async (docId) => {
    if (window.confirm('Delete this document?')) {
      await fetch(`http://localhost:4000/api/documents/${docId}`, { method: 'DELETE' });
      setDocuments((prev) => prev.filter((d) => d.id !== docId));
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('employeeId', employeeId);

    const res = await fetch('http://localhost:4000/api/documents/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    setDocuments((prev) => [...prev, data]);
    alert('File uploaded.');
  };

  return (
    <div className="container">
      <div className="header">
        <div className="header-left">
          <span className="back-btn" onClick={() => navigate(-1)}>&larr; Back</span>
          <h2 className="header-title">{employeeName}'s Documents</h2>
        </div>
        <button className="logout-btn" onClick={() => navigate('/login')}>↩ Logout</button>
      </div>

      <div className="section-box">
        <h2>Employee Documents</h2>

        {documents.map((doc) => (
          <div className="file-item" key={doc.id}>
            <span>{doc.name}</span>
            <div className="icon-group">
              <FaEye className="view" title="View" onClick={() => handleView(doc)} />
              <FaTrash className="delete" title="Delete" onClick={() => handleDelete(doc.id)} />
            </div>
          </div>
        ))}

        <div className="upload-section">
          <label className="upload-btn">
            <FaUpload />
            Upload New Files
            <input type="file" style={{ display: 'none' }} onChange={handleUpload} accept=".pdf" />
          </label>
        </div>
      </div>
    </div>
  );
};

export default EmployeeData;
