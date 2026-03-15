import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCookies } from 'react-cookie';

const ManageCourtCases = () => {
  const [cookies] = useCookies(['courtEmail']);
  const navigate = useNavigate();
  const [cases, setCases] = useState([]);
  const [firs, setFirs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ caseNumber: '', complaintId: '', courtName: '', judgeName: '', status: 'Active' });
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!cookies.courtEmail) navigate('/court_auth');
    else { fetchCases(); fetchFIRs(); }
  }, [cookies, navigate]);

  const fetchCases = async () => {
    try {
      const res = await axios.get('http://localhost:4000/api/v1/court/cases');
      if(res.data.success) setCases(res.data.cases);
    } catch(e) { console.error(e); }
  };

  const fetchFIRs = async () => {
    try {
      const res = await axios.get('http://localhost:4000/api/v1/court/firs');
      if(res.data.success) setFirs(res.data.firs);
    } catch(e) { console.error(e); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData, userId: 'CourtStaff', userName: cookies.courtEmail };
      const res = await axios.post('http://localhost:4000/api/v1/court/case', payload);
      if(res.data.success) {
        alert("Case Filed Successfully");
        setShowModal(false);
        fetchCases();
      }
    } catch (e) { alert("Error filing case"); }
  };

  const filteredCases = cases.filter(c => 
     c.caseNumber.toLowerCase().includes(search.toLowerCase()) || 
     c.courtName.toLowerCase().includes(search.toLowerCase()) ||
     c.status.toLowerCase().includes(search.toLowerCase())
  );

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
          <h3 className="fw-bold mb-0">Manage Court Cases</h3>
          <button className="btn btn-warning rounded-pill px-4 shadow-sm" onClick={() => setShowModal(!showModal)}>
            <i className="fa fa-briefcase me-2"></i> File New Case
          </button>
        </div>

        {showModal && (
          <div className="card shadow-sm border-0 mb-4 p-4" style={{ borderRadius: '15px' }}>
            <h5 className="mb-3 text-warning"><i className="fa fa-plus-circle me-2"></i>File Case in Court</h5>
            <form onSubmit={handleSubmit}>
               <div className="row g-3">
                  <div className="col-md-6">
                     <label className="form-label fw-bold text-secondary small mb-1">Select Registered FIR</label>
                     <select className="form-select bg-light border-0 py-2" value={formData.complaintId} onChange={e => setFormData({...formData, complaintId: e.target.value})} required>
                        <option value="">Choose FIR...</option>
                        {firs.map(f => {
                           const cId = (f.complaintId && f.complaintId._id) ? f.complaintId._id : f.complaintId;
                           if(!cId) return null;
                           return <option key={f._id} value={cId}>FIR: {f.firNumber}</option>;
                        })}
                     </select>
                  </div>
                  <div className="col-md-6">
                     <label className="form-label fw-bold text-secondary small mb-1">Court Case Number</label>
                     <input type="text" className="form-control bg-light border-0 py-2" value={formData.caseNumber} onChange={e => setFormData({...formData, caseNumber: e.target.value})} placeholder="e.g. CC-2026-105" required />
                  </div>
                  <div className="col-md-6">
                     <label className="form-label fw-bold text-secondary small mb-1">Court Name</label>
                     <input type="text" className="form-control bg-light border-0 py-2" value={formData.courtName} onChange={e => setFormData({...formData, courtName: e.target.value})} placeholder="Court Division" required />
                  </div>
                  <div className="col-md-6">
                     <label className="form-label fw-bold text-secondary small mb-1">Judge Name</label>
                     <input type="text" className="form-control bg-light border-0 py-2" value={formData.judgeName} onChange={e => setFormData({...formData, judgeName: e.target.value})} placeholder="Presiding Judge" required />
                  </div>
                  <div className="col-md-6">
                     <label className="form-label fw-bold text-secondary small mb-1">Initial Case Status</label>
                     <select className="form-select bg-light border-0 py-2" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} required>
                        <option value="Active">Active / Fast Track</option>
                        <option value="Pending">Pending / Under Trial</option>
                        <option value="Closed">Closed</option>
                     </select>
                  </div>
               </div>
               <div className="mt-4 text-end">
                  <button type="button" className="btn btn-light rounded-pill px-4 me-2" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-warning text-white rounded-pill px-4 fw-bold">File Case</button>
               </div>
            </form>
          </div>
        )}

        <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '15px' }}>
           <div className="card-body p-3">
              <div className="input-group">
                 <span className="input-group-text bg-light border-0"><i className="fa fa-search text-muted"></i></span>
                 <input type="text" className="form-control bg-light border-0" placeholder="Search by Case No, Court, Status..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
           </div>
        </div>

        <div className="card border-0 shadow-sm" style={{ borderRadius: '15px' }}>
           <div className="table-responsive p-3">
              <table className="table table-hover align-middle mb-0">
                 <thead className="table-light">
                    <tr>
                       <th>Case Number</th>
                       <th>FIR Number</th>
                       <th>Court Name</th>
                       <th>Status</th>
                       <th>Date Filed</th>
                       <th>Action</th>
                    </tr>
                 </thead>
                 <tbody>
                    {filteredCases.map(c => (
                       <tr key={c._id}>
                          <td className="fw-bold text-dark">{c.caseNumber}</td>
                          <td>{c.firId ? c.firId.firNumber : 'N/A'}</td>
                          <td>{c.courtName}</td>
                          <td>
                             <span className={`badge ${c.status === 'Closed' ? 'bg-success' : c.status === 'Active' ? 'bg-warning' : 'bg-secondary'}`}>
                               {c.status}
                             </span>
                          </td>
                          <td>{new Date(c.dateCreated).toLocaleDateString()}</td>
                          <td>
                             <Link to={`/court_case/${c._id}`} className="btn btn-sm btn-outline-primary rounded-pill px-3">View Details</Link>
                          </td>
                       </tr>
                    ))}
                    {filteredCases.length === 0 && <tr><td colSpan="6" className="text-center py-4 text-muted">No cases found.</td></tr>}
                 </tbody>
              </table>
           </div>
        </div>
      </div>
    </div>
  );
};
export default ManageCourtCases;
