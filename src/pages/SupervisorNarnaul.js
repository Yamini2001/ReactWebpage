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
      const filtered = data.filter(
        (f) => f.district?.toLowerCase() === 'narnaul'
      );
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
       if (contentType && contentType.includes('application/json')) {
          const data = await res.json();
          console.log('Uploaded file:', data); // For debug
          alert('File uploaded!');
          fetchFiles(); // Refresh list
        } else {
          const text = await res.text();
          console.error('Unexpected response:', text);
          alert('Upload failed: Server returned non-JSON response.');
        }
      } catch (err) {
        console.error('Upload failed:', err);
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
  <div className="upload-controls">
    <select
      value={uploadSection}
      onChange={(e) => setUploadSection(e.target.value)}
      className="select-section"
    >
      <option value="Maintenance">Maintenance</option>
      <option value="Updates">Updates</option>
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
      <FaUpload style={{ marginRight: '5px' }} />
      Upload New Data
    </button>
  </div>
</div>

     {['Maintenance', 'Updates'].map((section) => (
             <div className="section-box" key={section}>
               <h2>{section}</h2>
               {files
                 .filter((f) => f.section === section)
                 .map((file) => (
                   <div key={file.id} className="file-item">
                     <span>{file.name}</span>
                     <div className="icon-group">
                       <FaEye className="view" title="View" onClick={() => viewFile(file)} />
                       <FaTrash className="delete" title="Delete" onClick={() => deleteFile(file.id)} />
                     </div>
                   </div>
                 ))}
             </div>
           ))}
         </div>
       );
     }