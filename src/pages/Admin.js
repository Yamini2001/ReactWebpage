// src/pages/Admin.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Supervisor.css'; // Or Admin.css

const Admin = () => {
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/employees');
        const data = await res.json();
        setEmployees(data);
      } catch (err) {
        console.error('Failed to fetch employee data:', err);
      }
    };

    fetchData();
  }, []);

  // Group employees by district
  const grouped = employees.reduce((acc, emp) => {
    const key = emp.district.toLowerCase();
    if (!acc[key]) acc[key] = [];
    acc[key].push(emp);
    return acc;
  }, {});

  return (
    <div className="container">
      <h2 className="header-title">Admin Panel – Supervisor Documents</h2>

      {['mahendergarh', 'narnaul', 'rewari'].map((district) => (
        <div key={district} className="district-section">
          <h3>{district.charAt(0).toUpperCase() + district.slice(1)}</h3>
          <ul className="employee-list">
            {(grouped[district] || []).map((emp) => (
              <li
                key={emp.id}
                onClick={() => navigate(`/supervisor/${emp.id}`)}
                className="employee-item"
              >
                {emp.name}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Admin;
