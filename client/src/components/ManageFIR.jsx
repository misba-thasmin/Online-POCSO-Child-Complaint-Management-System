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
          <h3 className="fw-bold mb-0">Manage FIRs</h3>
          <button className="btn btn-primary rounded-pill px-4 shadow-sm" onClick={() => setShowModal(!showModal)}>
            <i className="fa fa-plus me-2"></i> Register New FIR
          </button>
        </div>

        {showModal && (
          <div className="card shadow-sm border-0 mb-4 p-4" style={{ borderRadius: '15px' }}>
            <h5 className="mb-3 text-primary"><i className="fa fa-file-text me-2"></i>Register FIR Details</h5>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
               <div className="row g-3">
                  <div className="col-md-6">
                     <label className="form-label fw-bold text-secondary small mb-1">Select Complaint</label>
                     <select className="form-select bg-light border-0 py-2" value={formData.complaintId} onChange={e => setFormData({...formData, complaintId: e.target.value})} required>
                        <option value="">Choose Complaint...</option>
                        {complaints.map(c => <option key={c.id || c._id} value={c.id || c._id}>ID: ({(c.id || c._id).substring((c.id || c._id).length-6)}) - District: {c.district}</option>)}
                     </select>
                  </div>
                  <div className="col-md-6">
                     <label className="form-label fw-bold text-secondary small mb-1">FIR Number</label>
                     <input type="text" className="form-control bg-light border-0 py-2" value={formData.firNumber} onChange={e => setFormData({...formData, firNumber: e.target.value})} placeholder="e.g. FIR-2026-0012" required />
                  </div>
                  <div className="col-md-6">
                     <label className="form-label fw-bold text-secondary small mb-1">Police Station</label>
                     <input type="text" className="form-control bg-light border-0 py-2" value={formData.policeStation} onChange={e => setFormData({...formData, policeStation: e.target.value})} placeholder="Station Name / Area" required />
                  </div>
                  <div className="col-md-6">
                     <label className="form-label fw-bold text-secondary small mb-1">Investigating Officer Name</label>
                     <input type="text" className="form-control bg-light border-0 py-2" value={formData.investigatorName} onChange={e => setFormData({...formData, investigatorName: e.target.value})} placeholder="Name of IO" required />
                  </div>
                  <div className="col-md-12">
                     <label className="form-label fw-bold text-secondary small mb-1">Upload FIR Document (PDF/Image)</label>
                     <input type="file" className="form-control bg-light border-0 py-2" onChange={e => setDocumentFile(e.target.files[0])} accept="image/*,.pdf" />
                     <small className="text-muted">Optional. Highly recommended for accurate court records.</small>
                  </div>
               </div>
               <div className="mt-4 text-end">
                  <button type="button" className="btn btn-light rounded-pill px-4 me-2" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary rounded-pill px-4">Save FIR</button>
               </div>
            </form>
          </div>
        )}

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
