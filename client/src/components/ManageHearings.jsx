import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCookies } from 'react-cookie';

const ManageHearings = () => {
  const [cookies] = useCookies(['courtEmail']);
  const navigate = useNavigate();
  const [cases, setCases] = useState([]);
  const [hearings, setHearings] = useState([]);
  
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  
  const [scheduleForm, setScheduleForm] = useState({ caseId: '', hearingDate: '', courtName: '', status: 'Scheduled', notes: '' });
  const [updateForm, setUpdateForm] = useState({ id: '', status: 'Scheduled', notes: '' });
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!cookies.courtEmail) navigate('/court_auth');
    else { fetchCases(); fetchHearings(); }
  }, [cookies, navigate]);

  const fetchCases = async () => {
    try {
      const res = await axios.get('http://localhost:4000/api/v1/court/cases');
      if(res.data.success) {
         setCases(res.data.cases.filter(c => c.status !== 'Closed'));
      }
    } catch(e) { console.error(e); }
  };

  const fetchHearings = async () => {
    try {
      const res = await axios.get('http://localhost:4000/api/v1/court/hearings');
      if(res.data.success) setHearings(res.data.hearings);
    } catch(e) { console.error(e); }
  };

  const handleScheduleHearing = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...scheduleForm, userId: 'CourtStaff', userName: cookies.courtEmail };
      const res = await axios.post('http://localhost:4000/api/v1/court/hearing', payload);
      if(res.data.success) {
        alert("Hearing Scheduled Successfully");
        setShowScheduleModal(false);
        setScheduleForm({ caseId: '', hearingDate: '', courtName: '', status: 'Scheduled', notes: '' });
        fetchHearings();
      }
    } catch (e) { alert("Error scheduling hearing"); }
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    try {
      const payload = { status: updateForm.status, notes: updateForm.notes, userId: 'CourtStaff', userName: cookies.courtEmail };
      const res = await axios.put(`http://localhost:4000/api/v1/court/hearing/${updateForm.id}/status`, payload);
      if(res.data.success) {
        alert("Hearing Status Updated Successfully");
        setShowUpdateModal(false);
        fetchHearings();
      }
    } catch (e) { alert("Error updating hearing"); }
  };

  const handleDeleteHearing = async (id) => {
    if(!window.confirm("Are you sure you want to delete this scheduled hearing?")) return;
    try {
      const res = await axios.delete(`http://localhost:4000/api/v1/court/hearing/${id}`);
      if(res.data.success) {
         alert("Hearing Deleted Successfully");
         fetchHearings();
      }
    } catch(e) { alert("Error deleting hearing"); }
  };

  const openUpdateModal = (hearing) => {
      setUpdateForm({ id: hearing._id, status: hearing.status, notes: hearing.notes || '' });
      setShowUpdateModal(true);
  };

  // Extract upcoming hearings (scheduled and date >= today)
  const today = new Date();
  today.setHours(0,0,0,0);
  const upcomingHearings = hearings.filter(h => h.status === 'Scheduled' && new Date(h.hearingDate) >= today).slice(0, 3);

  const filteredHearings = hearings.filter(h => {
     let cNum = h.caseId?.caseNumber || '';
     let cCourt = h.courtName || '';
     return cNum.toLowerCase().includes(search.toLowerCase()) || cCourt.toLowerCase().includes(search.toLowerCase());
  });

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
          <h3 className="fw-bold mb-0">Manage Hearings</h3>
          <button className="btn btn-primary rounded-pill px-4 shadow-sm" onClick={() => setShowScheduleModal(true)}>
            <i className="fa fa-calendar-plus-o me-2"></i> Schedule Hearing
          </button>
        </div>

        {upcomingHearings.length > 0 && (
           <div className="mb-5">
              <h5 className="fw-bold mb-3 text-dark"><i className="fa fa-clock-o text-primary me-2"></i> Upcoming Hearings</h5>
              <div className="row g-3">
                 {upcomingHearings.map(h => (
                    <div className="col-12 col-md-4" key={"upc-"+h._id}>
                       <div className="card shadow-sm border-0 h-100" style={{ borderRadius: '15px', borderLeft: '4px solid #3b82f6' }}>
                          <div className="card-body">
                             <div className="d-flex justify-content-between">
                                <span className="badge bg-primary mb-2">Upcoming</span>
                                <span className="small text-muted fw-bold">{new Date(h.hearingDate).toLocaleDateString()}</span>
                             </div>
                             <h6 className="fw-bold text-dark">{h.caseId?.caseNumber}</h6>
                             <p className="small text-secondary mb-0"><i className="fa fa-map-marker me-1"></i> {h.courtName}</p>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        )}

        <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '15px' }}>
           <div className="card-body p-3">
              <div className="input-group">
                 <span className="input-group-text bg-light border-0"><i className="fa fa-search text-muted"></i></span>
                 <input type="text" className="form-control bg-light border-0" placeholder="Search by Case No, Court..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
           </div>
        </div>

        <div className="card border-0 shadow-sm" style={{ borderRadius: '15px' }}>
           <div className="table-responsive p-3">
              <table className="table table-hover align-middle mb-0">
                 <thead className="table-light">
                    <tr>
                       <th>Case ID</th>
                       <th>Court Name</th>
                       <th>Hearing Date</th>
                       <th>Status</th>
                       <th>Action</th>
                    </tr>
                 </thead>
                 <tbody>
                    {filteredHearings.map(h => (
                       <tr key={h._id}>
                          <td className="fw-bold text-dark">{h.caseId?.caseNumber || 'N/A'}</td>
                          <td>{h.courtName}</td>
                          <td>{new Date(h.hearingDate).toLocaleDateString()}</td>
                          <td>
                             <span className={`badge ${h.status === 'Completed' ? 'bg-success' : h.status === 'Scheduled' ? 'bg-primary' : h.status === 'Postponed' ? 'bg-warning text-dark' : 'bg-secondary'}`}>
                               {h.status}
                             </span>
                          </td>
                          <td>
                             <button className="btn btn-sm btn-outline-dark rounded-pill px-3 me-2" onClick={() => openUpdateModal(h)}>Update Status</button>
                             <button className="btn btn-sm btn-outline-danger rounded-pill px-2" onClick={() => handleDeleteHearing(h._id)}><i className="fa fa-trash"></i></button>
                          </td>
                       </tr>
                    ))}
                    {filteredHearings.length === 0 && <tr><td colSpan="5" className="text-center py-4 text-muted">No hearings found.</td></tr>}
                 </tbody>
              </table>
           </div>
        </div>
      </div>

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
           <div className="card shadow border-0" style={{ width: '500px', borderRadius: '15px' }}>
              <div className="card-body p-4">
                 <h5 className="fw-bold text-dark mb-3"><i className="fa fa-calendar-plus-o me-2"></i>Schedule Hearing</h5>
                 <form onSubmit={handleScheduleHearing}>
                    <div className="mb-3">
                       <label className="form-label small fw-bold text-secondary">Select Active Court Case</label>
                       <select className="form-select bg-light border-0 py-2" value={scheduleForm.caseId} onChange={e => {
                          const caseObj = cases.find(c => c._id === e.target.value);
                          setScheduleForm({...scheduleForm, caseId: e.target.value, courtName: caseObj ? caseObj.courtName : ''});
                       }} required>
                          <option value="">Choose Case...</option>
                          {cases.map(c => <option key={c._id} value={c._id}>{c.caseNumber} ({c.courtName})</option>)}
                       </select>
                    </div>
                    <div className="mb-3">
                       <label className="form-label small fw-bold text-secondary">Hearing Date</label>
                       <input type="date" className="form-control bg-light border-0 py-2" value={scheduleForm.hearingDate} onChange={e => setScheduleForm({...scheduleForm, hearingDate: e.target.value})} required />
                    </div>
                    <div className="mb-3">
                       <label className="form-label small fw-bold text-secondary">Court Name</label>
                       <input type="text" className="form-control bg-light py-2 border-0" value={scheduleForm.courtName} onChange={e => setScheduleForm({...scheduleForm, courtName: e.target.value})} required />
                    </div>
                    <div className="mb-3">
                       <label className="form-label small fw-bold text-secondary">Status</label>
                       <select className="form-select bg-light border-0 py-2" value={scheduleForm.status} onChange={e => setScheduleForm({...scheduleForm, status: e.target.value})} required>
                           <option value="Scheduled">Scheduled</option>
                           <option value="Completed">Completed</option>
                           <option value="Postponed">Postponed</option>
                       </select>
                    </div>
                    <div className="mb-3">
                       <label className="form-label small fw-bold text-secondary">Notes (Optional)</label>
                       <textarea className="form-control bg-light py-2 border-0" rows="2" value={scheduleForm.notes} onChange={e => setScheduleForm({...scheduleForm, notes: e.target.value})} placeholder="e.g. Subpoenas issued"></textarea>
                    </div>
                    <div className="d-flex justify-content-end mt-4">
                       <button type="button" className="btn btn-light rounded-pill px-3 me-2" onClick={() => setShowScheduleModal(false)}>Cancel</button>
                       <button type="submit" className="btn btn-primary rounded-pill px-4 fw-bold shadow-sm">Schedule</button>
                    </div>
                 </form>
              </div>
           </div>
        </div>
      )}

      {/* Update Modal */}
      {showUpdateModal && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
           <div className="card shadow border-0" style={{ width: '400px', borderRadius: '15px' }}>
              <div className="card-body p-4">
                 <h5 className="fw-bold text-dark mb-3"><i className="fa fa-pencil text-secondary me-2"></i>Update Hearing</h5>
                 <form onSubmit={handleUpdateStatus}>
                    <div className="mb-3">
                       <label className="form-label small fw-bold text-secondary">Status</label>
                       <select className="form-select bg-light border-0 py-2" value={updateForm.status} onChange={e => setUpdateForm({...updateForm, status: e.target.value})} required>
                           <option value="Scheduled">Scheduled</option>
                           <option value="Completed">Completed</option>
                           <option value="Postponed">Postponed</option>
                           <option value="Rescheduled">Rescheduled</option>
                       </select>
                    </div>
                    <div className="mb-3">
                       <label className="form-label small fw-bold text-secondary">Notes Update</label>
                       <textarea className="form-control bg-light py-2 border-0" rows="3" value={updateForm.notes} onChange={e => setUpdateForm({...updateForm, notes: e.target.value})} placeholder="Add hearing notes..."></textarea>
                    </div>
                    <div className="d-flex justify-content-end mt-4">
                       <button type="button" className="btn btn-light rounded-pill px-3 me-2" onClick={() => setShowUpdateModal(false)}>Cancel</button>
                       <button type="submit" className="btn btn-dark rounded-pill px-4 fw-bold shadow-sm">Save Update</button>
                    </div>
                 </form>
              </div>
           </div>
        </div>
      )}

    </div>
  );
};

export default ManageHearings;
