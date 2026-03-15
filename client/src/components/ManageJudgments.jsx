import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCookies } from 'react-cookie';

const ManageJudgments = () => {
  const [cookies] = useCookies(['courtEmail']);
  const navigate = useNavigate();
  const [cases, setCases] = useState([]);
  
  const [showJudgmentModal, setShowJudgmentModal] = useState(false);
  const [judgmentForm, setJudgmentForm] = useState({ 
      caseId: '', verdict: 'Guilty', punishment: '', date: '', document: null 
  });
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!cookies.courtEmail) navigate('/court_auth');
    else fetchCases();
  }, [cookies, navigate]);

  const fetchCases = async () => {
    try {
      const res = await axios.get('http://localhost:4000/api/v1/court/cases');
      if(res.data.success) {
         setCases(res.data.cases);
      }
    } catch(e) { console.error(e); }
  };

  const activeCasesList = cases.filter(c => c.status && c.status.toLowerCase() !== 'closed');
  
  const handleRecordJudgment = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('verdict', judgmentForm.verdict);
      formData.append('punishment', judgmentForm.punishment);
      formData.append('date', judgmentForm.date);
      formData.append('userId', 'CourtStaff');
      formData.append('userName', cookies.courtEmail);
      if (judgmentForm.document) formData.append('document', judgmentForm.document);

      const res = await axios.put(`http://localhost:4000/api/v1/court/case/${judgmentForm.caseId}/judgment`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if(res.data.success) {
        alert("Judgment Recorded and Case Closed Successfully!");
        setShowJudgmentModal(false);
        setJudgmentForm({ caseId: '', verdict: 'Guilty', punishment: '', date: '', document: null });
        fetchCases();
      }
    } catch (e) { alert("Error recording judgment"); }
  };

  const closedCases = cases.filter(c => c.status === 'Closed').filter(c => {
     let cNum = c.caseNumber || '';
     let v = c.judgment?.verdict || '';
     return cNum.toLowerCase().includes(search.toLowerCase()) || v.toLowerCase().includes(search.toLowerCase());
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
          <div>
            <h3 className="fw-bold mb-0">Record Final Judgments</h3>
            <p className="text-muted small mb-0">Record verdicts and conclude active court cases.</p>
          </div>
          <button className="btn rounded-pill px-4 shadow-sm text-white" style={{ backgroundColor: '#9333ea' }} onClick={() => setShowJudgmentModal(true)}>
            <i className="fa fa-gavel me-2"></i> Issue Judgment
          </button>
        </div>

        <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '15px' }}>
           <div className="card-body p-3">
              <div className="input-group">
                 <span className="input-group-text bg-light border-0"><i className="fa fa-search text-muted"></i></span>
                 <input type="text" className="form-control bg-light border-0" placeholder="Search closed cases by Case No or Verdict..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
           </div>
        </div>

        <div className="card border-0 shadow-sm" style={{ borderRadius: '15px' }}>
           <div className="card-header bg-white border-bottom pt-4 pb-3 px-4">
              <h5 className="fw-bold mb-0 text-dark"><i className="fa fa-check-circle text-success me-2"></i> Concluded Cases Archive</h5>
           </div>
           <div className="table-responsive p-3">
              <table className="table table-hover align-middle mb-0">
                 <thead className="table-light">
                    <tr>
                       <th>Case ID</th>
                       <th>Court Name</th>
                       <th>Judgment Date</th>
                       <th>Verdict</th>
                       <th>Punishment</th>
                       <th>Action</th>
                    </tr>
                 </thead>
                 <tbody>
                    {closedCases.map(c => (
                       <tr key={c._id}>
                          <td className="fw-bold text-dark">{c.caseNumber}</td>
                          <td>{c.courtName}</td>
                          <td>{c.judgment?.date ? new Date(c.judgment.date).toLocaleDateString() : 'N/A'}</td>
                          <td>
                             <span className={`badge ${c.judgment?.verdict === 'Guilty' ? 'bg-danger' : c.judgment?.verdict === 'Not Guilty' ? 'bg-success' : 'bg-secondary'}`}>
                               {c.judgment?.verdict || 'Unknown'}
                             </span>
                          </td>
                          <td><small className="text-secondary">{c.judgment?.punishment || 'None'}</small></td>
                          <td>
                             <Link to={`/court_case/${c._id}`} className="btn btn-sm btn-outline-primary rounded-pill px-3">View Details</Link>
                          </td>
                       </tr>
                    ))}
                    {closedCases.length === 0 && <tr><td colSpan="6" className="text-center py-4 text-muted">No closed cases found.</td></tr>}
                 </tbody>
              </table>
           </div>
        </div>
      </div>

      {/* Record Judgment Modal */}
      {showJudgmentModal && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
           <div className="card shadow border-0" style={{ width: '550px', borderRadius: '15px' }}>
              <div className="card-header text-white px-4 py-3" style={{ background: 'linear-gradient(135deg, #7e22ce 0%, #a855f7 100%)', borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}>
                 <h5 className="fw-bold mb-0"><i className="fa fa-balance-scale me-2"></i>Record Final Judgment</h5>
                 <small className="text-white-50">This action permanently closes the case.</small>
              </div>
              <div className="card-body p-4">
                 <form onSubmit={handleRecordJudgment}>
                    <div className="mb-3">
                       <label className="form-label small fw-bold text-secondary">Target Court Case</label>
                       <select className="form-select bg-light border-0 py-2" value={judgmentForm.caseId} onChange={e => setJudgmentForm({...judgmentForm, caseId: e.target.value})} required>
                          <option value="">Select an active case...</option>
                          {activeCasesList.map(c => <option key={c._id} value={c._id}>{c.caseNumber} - {c.courtName}</option>)}
                       </select>
                    </div>
                    
                    <div className="row g-3 mb-3">
                        <div className="col-md-6">
                           <label className="form-label small fw-bold text-secondary">Verdict</label>
                           <select className="form-select bg-light border-0 py-2 fw-bold text-dark" value={judgmentForm.verdict} onChange={e => setJudgmentForm({...judgmentForm, verdict: e.target.value})} required>
                               <option value="Guilty" className="text-danger">Guilty</option>
                               <option value="Not Guilty" className="text-success">Not Guilty</option>
                               <option value="Case Dismissed">Case Dismissed</option>
                           </select>
                        </div>
                        <div className="col-md-6">
                           <label className="form-label small fw-bold text-secondary">Official Date</label>
                           <input type="date" className="form-control bg-light border-0 py-2" value={judgmentForm.date} onChange={e => setJudgmentForm({...judgmentForm, date: e.target.value})} required />
                        </div>
                    </div>

                    <div className="mb-3">
                       <label className="form-label small fw-bold text-secondary">Punishment / Penalty Ordered</label>
                       <textarea className="form-control bg-light py-2 border-0" rows="2" value={judgmentForm.punishment} onChange={e => setJudgmentForm({...judgmentForm, punishment: e.target.value})} placeholder="e.g. 10 years imprisonment, $5000 fine..."></textarea>
                    </div>

                    <div className="mb-4">
                        <label className="form-label small fw-bold text-secondary">Upload Official Judgment Document (PDF/Img)</label>
                        <input type="file" className="form-control bg-light py-2 border-0" accept=".pdf,image/*" onChange={e => setJudgmentForm({...judgmentForm, document: e.target.files[0]})} />
                        <small className="text-muted d-block mt-1">This will be attached to the sealed timeline.</small>
                    </div>

                    <div className="d-flex justify-content-end mt-4 pt-2 border-top">
                       <button type="button" className="btn btn-light rounded-pill px-4 me-2" onClick={() => setShowJudgmentModal(false)}>Cancel</button>
                       <button type="submit" className="btn text-white rounded-pill px-4 fw-bold shadow-sm" style={{ backgroundColor: '#9333ea' }}>Close Case & Record</button>
                    </div>
                 </form>
              </div>
           </div>
        </div>
      )}

    </div>
  );
};

export default ManageJudgments;
