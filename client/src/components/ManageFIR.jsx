import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCookies } from 'react-cookie';

const ManageFIR = () => {
  const [cookies] = useCookies(['courtEmail']);
  const navigate = useNavigate();
  const [firs, setFirs] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [formData, setFormData] = useState({ firNumber: '', complaintId: '', policeStation: '', investigatorName: '' });
  const [documentFile, setDocumentFile] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!cookies.courtEmail) navigate('/court_auth');
    else {
      fetchFIRs();
      fetchComplaints();
    }
  }, [cookies, navigate]);

  const fetchFIRs = async () => {
    try {
      const res = await axios.get('http://localhost:4000/api/v1/court/firs');
      if(res.data.success) setFirs(res.data.firs);
    } catch(e) { console.error(e); }
  };

  const fetchComplaints = async () => {
    try {
      // Fetch only complaints that don't already have an FIR (optional filtering can be done here or map)
      const res = await axios.get('http://localhost:4000/api/v1/complaint/');
      if (res.data && res.data.length) setComplaints(res.data);
    } catch(e) { console.error(e); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('firNumber', formData.firNumber);
      data.append('complaintId', formData.complaintId);
      data.append('policeStation', formData.policeStation);
      data.append('investigatorName', formData.investigatorName);
      data.append('userId', 'CourtStaff');
      data.append('userName', cookies.courtEmail);
      if (documentFile) {
          data.append('document', documentFile);
      }

      const res = await axios.post('http://localhost:4000/api/v1/court/fir', data);

      if(res.data.success) {
        alert("FIR Registered Successfully");
        setShowModal(false);
        setFormData({ firNumber: '', complaintId: '', policeStation: '', investigatorName: '' });
        setDocumentFile(null);
        fetchFIRs();
      }
    } catch (e) {
      console.error(e);
      alert("Error registering FIR");
    }
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      <div className="header-area glass-nav" style={{ position: 'sticky', top: 0, zIndex: 1000, padding: '1rem' }}>
        <div className="container h-100 d-flex align-items-center justify-content-start">
          <Link to="/court_home" className="logo-wrapper text-decoration-none" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <i className="fa fa-arrow-left fs-4" style={{ color: '#3b82f6' }}></i>
            <span className="brand-text" style={{ fontSize: '1.1rem', fontWeight: 700 }}>Back to Dashboard</span>
          </Link>
        </div>
      </div>

      <div className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="fw-bold mb-0">Registered FIR Records</h3>
          <div className="badge bg-info bg-opacity-10 text-info px-3 py-2 border border-info rounded-pill">
              <i className="fa fa-info-circle me-1"></i> Read-Only Mode (Officer Action Required for Registry)
          </div>
        </div>



        <div className="card border-0 shadow-sm" style={{ borderRadius: '15px' }}>
           <div className="table-responsive p-3">
              <table className="table table-hover align-middle mb-0">
                 <thead className="table-light">
                    <tr>
                       <th>FIR No.</th>
                       <th>Complaint ID</th>
                       <th>Police Station</th>
                       <th>Investigator</th>
                       <th>Date Registered</th>
                       <th>Action</th>
                    </tr>
                 </thead>
                 <tbody>
                    {firs.map(fir => (
                       <tr key={fir._id}>
                          <td className="fw-bold text-primary">{fir.firNumber}</td>
                          <td><span className="badge bg-secondary">{fir.complaintId?._id || fir.complaintId}</span></td>
                          <td>{fir.policeStation}</td>
                          <td>{fir.investigatorName}</td>
                          <td>{new Date(fir.dateCreated).toLocaleDateString()}</td>
                          <td>
                              {fir.documentPath ? (
                                  <a href={`http://localhost:4000/${fir.documentPath}`} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-info rounded-pill">
                                      <i className="fa fa-eye me-1"></i> View Doc
                                  </a>
                              ) : (
                                  <span className="text-muted small">No Doc</span>
                              )}
                          </td>
                       </tr>
                    ))}
                    {firs.length === 0 && <tr><td colSpan="6" className="text-center py-4 text-muted">No FIRs registered yet.</td></tr>}
                 </tbody>
              </table>
           </div>
        </div>
      </div>
    </div>
  );
};
export default ManageFIR;
