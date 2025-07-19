// src/components/Admin.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Admin.css';

const Admin = () => {
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/documents');

        if (!res.ok) {
          const errorHtml = await res.text();
          console.error('Server error:', res.status, errorHtml);
          return;
        }

        const data = await res.json();
        setFiles(data);
      } catch (error) {
        console.error('Failed to fetch files:', error);
      }
    };
    fetchFiles();
  }, []);

  const handleLogout = () => {
    navigate('/login');
  };

  const grouped = files.reduce((acc, file) => {
    const key = file.district?.toLowerCase();
    if (!key) return acc;
    if (!acc[key]) acc[key] = [];
    acc[key].push(file);
    return acc;
  }, {});

  const districts = ['mahendergarh', 'narnaul', 'rewari'];

  return (
    <div className="container">
      <div className="header">
        <h2 className="head">Admin Panel – Supervisor Documents</h2>
        <button onClick={handleLogout} className="logout-btn">↩ Logout</button>
      </div>

      {districts.map((district) => (
        <div key={district} className="district-section">
          <h3>{district.charAt(0).toUpperCase() + district.slice(1)}</h3>
          <ul className="employee-list">
            {(grouped[district] || []).map((file) => (
              <li key={file.id} className="employee-item">
                {file.name} – {file.section} –{' '}
                <a href={file.url} target="_blank" rel="noreferrer">View</a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Admin;
