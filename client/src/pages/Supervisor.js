import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Supervisor.css'; // Make sure to create this file
import { FiLogOut } from 'react-icons/fi';

const Supervisor = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/employees');
        setEmployees(response.data);
      } catch (error) {
        console.error('Error fetching employee data:', error);
        setError('Failed to fetch employee data.');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  return (
    <div className="supervisor-container">
      <div className="supervisor-header">
        <button onClick={() => navigate('/')} className="back-btn">← Back</button>
        <h1 className="header-title">Mahendragarh Supervisor</h1>
        <button onClick={() => navigate('/login')} className="logout-btn">
                      <FiLogOut className="logout-icon" />
          Logout
          </button>
      </div>

      <div className="employee-list">
        {loading ? (
          <p className="loading-text">Loading employee data...</p>
        ) : error ? (
          <p className="error-text">{error}</p>
        ) : employees.length === 0 ? (
          <p className="no-employees">No employees found.</p>
        ) : (
          employees.map((emp) => (
            <div
              key={emp.id}
              className="employee-card"
              onClick={() => navigate(`/supervisor/${emp.name.toLowerCase()}`)}
            >
              <div>
                <h2 className="employee-name">{emp.name}</h2>
                <p className="employee-status">{emp.status}</p>
              </div>
              <span className="arrow">›</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Supervisor;
