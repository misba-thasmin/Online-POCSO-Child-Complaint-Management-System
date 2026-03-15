import React, { useState, useEffect, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCookies } from 'react-cookie';

const CourtCaseDetails = () => {
  const { id } = useParams();
  const [cookies] = useCookies(['courtEmail']);
  const navigate = useNavigate();
  const [courtCase, setCourtCase] = useState(null);
  const [hearings, setHearings] = useState([]);
  
  const [showHearingModal, setShowHearingModal] = useState(false);
  const [showJudgmentModal, setShowJudgmentModal] = useState(false);
  const [showEditDetailsModal, setShowEditDetailsModal] = useState(false);
  
  const [hearingForm, setHearingForm] = useState({ hearingDate: '', notes: '' });
  const [judgmentForm, setJudgmentForm] = useState({ verdict: '', punishment: '', date: '', documentFile: null });
  const [editDetailsForm, setEditDetailsForm] = useState({ judgeName: '', status: '' });

  const fetchCaseDetails = useCallback(async () => {
    try {
      const res = await axios.get(`http://localhost:4000/api/v1/court/case/${id}`);
      if(res.data.success) {
         setCourtCase(res.data.courtCase);
         setEditDetailsForm({
            judgeName: res.data.courtCase.judgeName || '',
            status: res.data.courtCase.status || 'Active'
         });
      }
    } catch(e) { console.error(e); }
  }, [id]);

  const fetchHearings = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:4000/api/v1/court/hearings');
      if(res.data.success) {
         setHearings(res.data.hearings.filter(h => h.caseId._id === id || h.caseId === id));
      }
    } catch(e) { console.error(e); }
  }, [id]);

  useEffect(() => {
    if (!cookies.courtEmail) navigate('/court_auth');
    else { fetchCaseDetails(); fetchHearings(); }
  }, [cookies, navigate, fetchCaseDetails, fetchHearings]);

  const handleScheduleHearing = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:4000/api/v1/court/hearing', {
        ...hearingForm, caseId: id, courtName: courtCase.courtName, userId: 'CourtStaff', userName: cookies.courtEmail
      });
      alert('Hearing Scheduled!');
      setShowHearingModal(false);
      setHearingForm({ hearingDate: '', notes: '' });
      fetchHearings();
    } catch(e) { alert("Failed to schedule hearing"); }
  };

  const handleEditDetails = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:4000/api/v1/court/case/${id}/details`, {
        ...editDetailsForm, userId: 'CourtStaff', userName: cookies.courtEmail
      });
      alert('Case Details Updated Successfully!');
      setShowEditDetailsModal(false);
      fetchCaseDetails();
    } catch(e) { alert("Failed to update case details"); }
  };

  const handleUploadJudgment = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('verdict', judgmentForm.verdict);
      formData.append('punishment', judgmentForm.punishment);
      formData.append('date', judgmentForm.date);
      formData.append('userId', 'CourtStaff');
      formData.append('userName', cookies.courtEmail);
      if(judgmentForm.documentFile) {
          formData.append('document', judgmentForm.documentFile);
      }

      await axios.put(`http://localhost:4000/api/v1/court/case/${id}/judgment`, formData);
      alert('Judgment Uploaded & Case Closed!');
      setShowJudgmentModal(false);
      fetchCaseDetails();
    } catch(e) { alert("Failed to upload judgment"); }
  };

  if(!courtCase) return <div className="text-center py-5">Loading Details...</div>;

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      <div className="header-area glass-nav" style={{ position: 'sticky', top: 0, zIndex: 1000, padding: '1rem' }}>
        <div className="container h-100 d-flex align-items-center justify-content-start">
          <Link to="/manage_court_cases" className="logo-wrapper text-decoration-none" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <i className="fa fa-arrow-left fs-4" style={{ color: '#3b82f6' }}></i>
            <span className="brand-text" style={{ fontSize: '1.1rem', fontWeight: 700 }}>Back to Cases</span>
          </Link>
        </div>
      </div>

      <div className="container py-5">
        <div className="row g-4">
           {/* Left Column: Details & Timeline */}
           <div className="col-12 col-lg-8">
              <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '15px' }}>
                 <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-start mb-4">
                       <div>
                          <h4 className="fw-bold mb-1">Case: {courtCase.caseNumber}</h4>
                          <span className="text-muted"><i className="fa fa-university me-1"></i> {courtCase.courtName}</span>
                       </div>
                       <span className={`badge px-3 py-2 ${courtCase.status === 'Closed' ? 'bg-success' : courtCase.status === 'Active' ? 'bg-warning text-dark' : 'bg-secondary'}`}>
                           {courtCase.status}
                       </span>
                    </div>
                    
                    <div className="row mb-4">
                       <div className="col-md-6 mb-3">
                          <label className="text-muted small fw-bold">FIR Number</label>
                          <p className="mb-0 text-dark fw-medium">{courtCase.firId ? courtCase.firId.firNumber : 'N/A'}</p>
                       </div>
                       <div className="col-md-6 mb-3">
                          <label className="text-muted small fw-bold">Date Filed</label>
                          <p className="mb-0 text-dark fw-medium">{new Date(courtCase.dateCreated).toLocaleDateString()}</p>
                       </div>
                       <div className="col-md-6 mb-3">
                          <label className="text-muted small fw-bold">Complaint Department</label>
                          <p className="mb-0 text-dark fw-medium">{courtCase.complaintId?.department || 'N/A'}</p>
                       </div>
                       <div className="col-md-6 mb-3">
                          <label className="text-muted small fw-bold">Judge Name</label>
                          <p className="mb-0 text-dark fw-medium">{courtCase.judgeName || 'Not Assigned'}</p>
                       </div>
                    </div>

                    <h5 className="fw-bold border-bottom pb-2 mb-3"><i className="fa fa-road text-primary me-2"></i> Case Timeline</h5>
                    <div className="timeline px-2">
                       <div className="d-flex mb-3">
                          <div className="text-success me-3"><i className="fa fa-check-circle fs-5"></i></div>
                          <div>
                             <h6 className="mb-0 fw-bold">Complaint Registered</h6>
                             <small className="text-muted">ID: {courtCase.complaintId?._id}</small>
                          </div>
                       </div>
                       <div className="d-flex mb-3">
                          <div className={courtCase.firId ? "text-success me-3" : "text-muted me-3"}><i className={courtCase.firId ? "fa fa-check-circle fs-5" : "fa fa-circle-o fs-5"}></i></div>
                          <div>
                             <h6 className="mb-0 fw-bold">FIR Registered</h6>
                             {courtCase.firId && <small className="text-muted">{courtCase.firId.firNumber} by {courtCase.firId.investigatorName}</small>}
                          </div>
                       </div>
                       <div className="d-flex mb-3">
                          <div className="text-success me-3"><i className="fa fa-check-circle fs-5"></i></div>
                          <div>
                             <h6 className="mb-0 fw-bold">Case Filed in Court</h6>
                             <small className="text-muted">{courtCase.caseNumber} at {courtCase.courtName}</small>
                          </div>
                       </div>
                       <div className="d-flex mb-3">
                          <div className={hearings.length > 0 ? "text-success me-3" : "text-muted me-3"}><i className={hearings.length > 0 ? "fa fa-check-circle fs-5" : "fa fa-circle-o fs-5"}></i></div>
                          <div>
                             <h6 className="mb-0 fw-bold">Court Hearings ({hearings.length})</h6>
                             {hearings.length > 0 && <small className="text-muted">Last hearing scheduled on {new Date(hearings[hearings.length-1].hearingDate).toLocaleDateString()}</small>}
                          </div>
                       </div>
                       <div className="d-flex">
                          <div className={courtCase.status === 'Closed' ? "text-success me-3" : "text-muted me-3"}><i className={courtCase.status === 'Closed' ? "fa fa-check-circle fs-5" : "fa fa-circle-o fs-5"}></i></div>
                          <div>
                             <h6 className="mb-0 fw-bold">Judgment & Case Closed</h6>
                             {courtCase.status === 'Closed' && courtCase.judgment && <small className="text-muted">Verdict: {courtCase.judgment.verdict}</small>}
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           {/* Right Column: Actions & Details */}
           <div className="col-12 col-lg-4">
              
              {/* Actions Card */}
              <div className="card border-0 shadow-sm mb-4 bg-white" style={{ borderRadius: '15px' }}>
                 <div className="card-body p-4">
                    <h5 className="fw-bold mb-3"><i className="fa fa-cogs text-secondary me-2"></i> Actions</h5>
                    <button 
                       className="btn btn-outline-dark w-100 rounded-pill mb-2 fw-bold shadow-sm" 
                       onClick={() => setShowEditDetailsModal(true)}
                       disabled={courtCase.status === 'Closed'}
                    >
                       <i className="fa fa-pencil me-2"></i> Edit Case Details
                    </button>
                    <button 
                       className="btn btn-primary w-100 rounded-pill mb-2 fw-bold shadow-sm" 
                       onClick={() => setShowHearingModal(true)}
                       disabled={courtCase.status === 'Closed'}
                    >
                       <i className="fa fa-calendar-plus-o me-2"></i> Schedule Hearing
                    </button>
                    <button 
                       className="btn btn-success w-100 rounded-pill fw-bold shadow-sm" 
                       onClick={() => setShowJudgmentModal(true)}
                       disabled={courtCase.status === 'Closed'}
                    >
                       <i className="fa fa-legal me-2"></i> Upload Judgment
                    </button>
                 </div>
              </div>

              {/* Hearings List */}
              <div className="card border-0 shadow-sm mb-4 bg-white" style={{ borderRadius: '15px' }}>
                 <div className="card-header bg-white border-bottom pt-3 pb-2 px-4">
                    <h6 className="fw-bold mb-0">Scheduled Hearings</h6>
                 </div>
                 <div className="card-body p-0">
                    <ul className="list-group list-group-flush">
                       {hearings.length === 0 ? (
                          <li className="list-group-item text-center py-4 text-muted small border-0">No hearings scheduled.</li>
                       ) : (
                          hearings.map(h => (
                             <li key={h._id} className="list-group-item p-3 border-0 border-bottom">
                                <div className="d-flex justify-content-between align-items-center mb-1">
                                   <span className="fw-bold text-primary"><i className="fa fa-calendar me-2"></i>{new Date(h.hearingDate).toLocaleDateString()}</span>
                                </div>
                                <p className="mb-0 small text-secondary">{h.notes}</p>
                             </li>
                          ))
                       )}
                    </ul>
                 </div>
              </div>

              {/* Judgment Details if Closed */}
              {courtCase.status === 'Closed' && courtCase.judgment && (
                  <div className="card border-0 shadow-sm bg-success bg-opacity-10" style={{ borderRadius: '15px' }}>
                     <div className="card-body p-4">
                        <h5 className="fw-bold text-success mb-3"><i className="fa fa-gavel me-2"></i> Final Judgment</h5>
                        <p className="mb-1"><span className="fw-bold text-dark">Verdict:</span> <span className="text-secondary">{courtCase.judgment.verdict}</span></p>
                        <p className="mb-1"><span className="fw-bold text-dark">Punishment:</span> <span className="text-secondary">{courtCase.judgment.punishment}</span></p>
                        <p className="mb-1"><span className="fw-bold text-dark">Date:</span> <span className="text-secondary">{new Date(courtCase.judgment.date).toLocaleDateString()}</span></p>
                        {courtCase.judgment.documentPath && (
                           <a href={`http://localhost:4000/${courtCase.judgment.documentPath.replace(/\\/g, '/')}`} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-success mt-3 rounded-pill">
                              <i className="fa fa-download me-1"></i> Download Judgment File
                           </a>
                        )}
                     </div>
                  </div>
              )}
           </div>
        </div>

        {/* Schedule Hearing Modal */}
        {showHearingModal && (
           <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
              <div className="card shadow border-0" style={{ width: '400px', borderRadius: '15px' }}>
                 <div className="card-body p-4">
                    <h5 className="fw-bold text-primary mb-3"><i className="fa fa-calendar-plus-o me-2"></i>Schedule Hearing</h5>
                    <form onSubmit={handleScheduleHearing}>
                       <div className="mb-3">
                          <label className="form-label small fw-bold text-secondary">Hearing Date</label>
                          <input type="date" className="form-control bg-light py-2 border-0" value={hearingForm.hearingDate} onChange={e => setHearingForm({...hearingForm, hearingDate: e.target.value})} required />
                       </div>
                       <div className="mb-3">
                          <label className="form-label small fw-bold text-secondary">Notes / Agenda</label>
                          <textarea className="form-control bg-light border-0" rows="3" value={hearingForm.notes} onChange={e => setHearingForm({...hearingForm, notes: e.target.value})} placeholder="Purpose of hearing..."></textarea>
                       </div>
                       <div className="d-flex justify-content-end mt-4">
                          <button type="button" className="btn btn-light rounded-pill px-3 me-2" onClick={() => setShowHearingModal(false)}>Cancel</button>
                          <button type="submit" className="btn btn-primary rounded-pill px-4 fw-bold shadow-sm">Schedule</button>
                       </div>
                    </form>
                 </div>
              </div>
           </div>
        )}

        {/* Edit Case Details Modal */}
        {showEditDetailsModal && (
           <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
              <div className="card shadow border-0" style={{ width: '400px', borderRadius: '15px' }}>
                 <div className="card-body p-4">
                    <h5 className="fw-bold text-dark mb-3"><i className="fa fa-pencil me-2"></i>Edit Case Details</h5>
                    <form onSubmit={handleEditDetails}>
                       <div className="mb-3">
                          <label className="form-label small fw-bold text-secondary">Judge Name</label>
                          <input type="text" className="form-control bg-light py-2 border-0" value={editDetailsForm.judgeName} onChange={e => setEditDetailsForm({...editDetailsForm, judgeName: e.target.value})} required />
                       </div>
                       <div className="mb-3">
                          <label className="form-label small fw-bold text-secondary">Case Status</label>
                          <select className="form-select bg-light border-0 py-2" value={editDetailsForm.status} onChange={e => setEditDetailsForm({...editDetailsForm, status: e.target.value})} required>
                              <option value="Active">Active / Fast Track</option>
                              <option value="Pending">Pending / Under Trial</option>
                              <option value="Closed">Closed</option>
                          </select>
                       </div>
                       <div className="d-flex justify-content-end mt-4">
                          <button type="button" className="btn btn-light rounded-pill px-3 me-2" onClick={() => setShowEditDetailsModal(false)}>Cancel</button>
                          <button type="submit" className="btn btn-dark rounded-pill px-4 fw-bold shadow-sm">Update Details</button>
                       </div>
                    </form>
                 </div>
              </div>
           </div>
        )}

        {/* Upload Judgment Modal */}
        {showJudgmentModal && (
           <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
              <div className="card shadow border-0" style={{ width: '500px', borderRadius: '15px' }}>
                 <div className="card-body p-4">
                    <h5 className="fw-bold text-success mb-3"><i className="fa fa-legal me-2"></i>Upload Judgment</h5>
                    <form onSubmit={handleUploadJudgment}>
                       <div className="row g-3">
                          <div className="col-12">
                             <label className="form-label small fw-bold text-secondary">Verdict</label>
                             <input type="text" className="form-control bg-light border-0 py-2" value={judgmentForm.verdict} onChange={e => setJudgmentForm({...judgmentForm, verdict: e.target.value})} placeholder="e.g. Guilty / Acquitted" required />
                          </div>
                          <div className="col-12">
                             <label className="form-label small fw-bold text-secondary">Punishment details</label>
                             <textarea className="form-control bg-light border-0" rows="2" value={judgmentForm.punishment} onChange={e => setJudgmentForm({...judgmentForm, punishment: e.target.value})} placeholder="e.g. 5 Years Imprisonment"></textarea>
                          </div>
                          <div className="col-md-6">
                             <label className="form-label small fw-bold text-secondary">Judgment Date</label>
                             <input type="date" className="form-control bg-light border-0 py-2" value={judgmentForm.date} onChange={e => setJudgmentForm({...judgmentForm, date: e.target.value})} required />
                          </div>
                          <div className="col-md-6">
                             <label className="form-label small fw-bold text-secondary">Upload Document (PDF/IMG)</label>
                             <input type="file" className="form-control bg-light border-0 py-2" onChange={e => setJudgmentForm({...judgmentForm, documentFile: e.target.files[0]})} accept="image/*,.pdf" required />
                          </div>
                       </div>
                       <div className="d-flex justify-content-end mt-4">
                          <button type="button" className="btn btn-light rounded-pill px-3 me-2" onClick={() => setShowJudgmentModal(false)}>Cancel</button>
                          <button type="submit" className="btn btn-success rounded-pill px-4 fw-bold shadow-sm">Save Judgment</button>
                       </div>
                    </form>
                 </div>
              </div>
           </div>
        )}

      </div>
    </div>
  );
};
export default CourtCaseDetails;
