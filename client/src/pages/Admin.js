import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLogOut, FiChevronRight } from 'react-icons/fi';
import './Admin.css';

export default function Admin() {
  const navigate = useNavigate();
  const [supervisors, setSupervisors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSupervisors = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        console.error('⛔ No token found in localStorage');
        setError('You are not logged in.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:4000/api/supervisors', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const rawText = await response.text(); // For debugging
        console.log('🧾 Raw response:', rawText);

        if (!response.ok) {
          throw new Error(`Failed to fetch supervisors: ${rawText}`);
        }

        const data = JSON.parse(rawText);
        if (Array.isArray(data)) {
          setSupervisors(data);
        } else {
          setError('Unexpected response format');
        }
      } catch (err) {
        console.error('❌ Error fetching supervisors:', err);
        setError(err.message || 'Error fetching supervisors');
      } finally {
        setLoading(false);
      }
    };

    fetchSupervisors();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="admin-container">
      <div className="admin-wrapper">
        <div className="admin-header">
          <h1 className="admin-title">Admin Dashboard</h1>
          <button onClick={handleLogout} className="logout-button">
            <FiLogOut className="logout-icon" />
            <span>Logout</span>
          </button>
        </div>

        <div className="card-list">
          {loading ? (
            <p>Loading supervisors...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : supervisors.length === 0 ? (
            <p className="no-supervisors">No supervisors found.</p>
          ) : (
            supervisors.map((supervisor) => (
              <div
                key={supervisor.id}
                className="card"
                onClick={() => navigate(`/supervisor?id=${supervisor.id}`)}
 // ✅ FIXED: was `employee_count`
              >
                <div>
                  <h2 className="card-title">{supervisor.name}</h2>
                  <p className="card-subtitle">
                    {supervisor.employee_count} {supervisor.employee_count === 1 ? 'employee' : 'employees'}
                  </p>
                </div>
                <FiChevronRight className="card-icon" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
