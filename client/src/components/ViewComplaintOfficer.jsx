import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';

import "./css/bootstrap.min.css";
import "./css/font-awesome.min.css";
import "./css/lineicons.min.css";
import "./css/style.css";
import "./css/Landing.css"; // Import the light theme styles

import imgSmall from "./img/core-img/logo-small.png";
import imgBg from "./img/bg-img/9.png";
import Logout from './Logout.jsx';
import Title from './Title.jsx';
import ComplaintTimeline from './ComplaintTimeline.jsx';
import EvidenceSection from './EvidenceSection.jsx';

const ViewComplaintOfficer = () => {
  const navigate = useNavigate();
  const [complaintData, setComplaintData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentOfficer, setCurrentOfficer] = useState(null);

  // FIR Modal State
  const [showFIRModal, setShowFIRModal] = useState(false);
  const [selectedComplaintId, setSelectedComplaintId] = useState(null);
  const [firFormData, setFIRFormData] = useState({
      firNumber: '',
      policeStation: '',
      investigatorName: '',
      firDate: new Date().toISOString().split('T')[0]
  });
  const [firFile, setFIRFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Read officer details
  const officeremail = document.cookie.replace(/(?:(?:^|.*;\s*)officeremail\s*\=\s*([^;]*).*$)|^.*$/, '$1');

  useEffect(() => {
    const fetchOfficerData = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/v1/officer/`);
        if (response.status === 200 && officeremail) {
          const matchedOfficer = response.data.find(o => o.email === decodeURIComponent(officeremail));
          if (matchedOfficer) {
            setCurrentOfficer(matchedOfficer);
          }
        }
      } catch (error) {
        console.error('Error fetching officer data:', error);
      }
    };
    fetchOfficerData();
  }, [officeremail]);

  const assignComplaint = async (complaintId) => {
    if (!currentOfficer) {
      alert("Officer details not loaded. Please wait a moment and try again.");
      return;
    }
    
    try {
      const response = await axios.put(`http://localhost:4000/api/v1/complaint/assign/${complaintId}`, {
        officerId: currentOfficer._id || currentOfficer.id,
        officerName: currentOfficer.name
      }, {
        headers: {
          'x-auth-token': localStorage.getItem('token')
        }
      });
      
      if (response.data.success) {
        alert("Case assigned successfully!");
        setComplaintData(prevData => prevData.map(c => 
          c._id === complaintId ? response.data.complaint : c
        ));
      }
    } catch (error) {
       console.error("Assignment error:", error);
       alert(error.response?.data?.message || "Error assigning case");
    }
  };

  // Apply Light Theme Background
  useEffect(() => {
    document.body.style.backgroundColor = '#f8fafc';
    return () => {
      document.body.style.backgroundColor = '';
    }
  }, []);

  const UpdateStatusAdmin = (id) => {
    navigate("/update_status_officer/" + id);
  }

  useEffect(() => {
    const fetchComplaintData = async () => {
      if (!currentOfficer) return;
      try {
        const officerId = currentOfficer._id || currentOfficer.id;
        const response = await axios.get(`http://localhost:4000/api/v1/officer/complaints/${officerId}`);
        if (response.status === 200 && response.data.success) {
          console.log("Complaints fetched length: ", response.data.complaints.length);
          setComplaintData(response.data.complaints);
          setLoading(false);
        } else {
          console.error('Error fetching Complaint data from API');
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching Complaint data:', error.message);
        setLoading(false);
      }
    };

    if (currentOfficer) {
        fetchComplaintData();
    }
  }, [currentOfficer]);

  // Filter data to only apply search term (since location filter is already handled by API)
  const filteredData = complaintData.filter((complaint) => {
    const isSearchTermMatch = Object.values(complaint).some((field) =>
      field && field.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );

    return isSearchTermMatch;
  });

  const handleOpenFIRModal = (complaint) => {
      setSelectedComplaintId(complaint._id || complaint.id);
      setFIRFormData({
          firNumber: `FIR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
          policeStation: currentOfficer?.policeStation || '',
          investigatorName: currentOfficer?.name || '',
          firDate: new Date().toISOString().split('T')[0]
      });
      setShowFIRModal(true);
  };

  const handleFIRSubmit = async (e) => {
      e.preventDefault();
      setIsSubmitting(true);
      
      const formData = new FormData();
      formData.append('firNumber', firFormData.firNumber);
      formData.append('complaintId', selectedComplaintId);
      formData.append('policeStation', firFormData.policeStation);
      formData.append('investigatorName', firFormData.investigatorName);
      formData.append('officerId', currentOfficer._id || currentOfficer.id);
      if (firFile) formData.append('document', firFile);

      try {
          const res = await axios.post('http://localhost:4000/api/v1/officer/register-fir', formData, {
              headers: { 'Content-Type': 'multipart/form-data' }
          });
          if (res.data.success) {
              alert("FIR Registered Successfully!");
              setShowFIRModal(false);
              // Refresh complaint data to show updated status
              const response = await axios.get(`http://localhost:4000/api/v1/complaint/`);
              setComplaintData(response.data);
          }
      } catch (err) {
          console.error("FIR Error:", err);
          alert("Failed to register FIR: " + (err.response?.data?.error || err.message));
      } finally {
          setIsSubmitting(false);
      }
  };

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  const timeOptions = { hour: '2-digit', minute: '2-digit' };

  // Helper function to return proper badge colors based on status
  const getStatusBadgeClass = (status) => {
    if (!status) return 'bg-secondary';
    const s = status.toLowerCase();
    if (s.includes('pending')) return 'bg-warning text-dark';
    if (s.includes('resolved') || s.includes('completed')) return 'bg-success';
    if (s.includes('progress')) return 'bg-info text-dark';
    if (s.includes('rejected')) return 'bg-danger';
    return 'bg-primary';
  };

  return (
    <div className="landing-container">

      {/* Header Area styled with Glassmorphism */}
      <div className="header-area glass-nav" id="headerArea" style={{ position: 'sticky', top: 0, zIndex: 1000, padding: '1rem' }}>
        <div className="container h-100 d-flex align-items-center justify-content-between">
          <div className="logo-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src={imgSmall} alt="" style={{ height: '30px' }} />
            <span className="brand-text" style={{ fontSize: '1.25rem', fontWeight: 700 }}><Title /></span>
          </div>
          <div className="suha-navbar-toggler" data-bs-toggle="offcanvas" data-bs-target="#suhaOffcanvas" aria-controls="suhaOffcanvas" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ backgroundColor: 'white', height: '2px', width: '25px', display: 'block' }}></span>
            <span style={{ backgroundColor: 'white', height: '2px', width: '25px', display: 'block' }}></span>
            <span style={{ backgroundColor: 'white', height: '2px', width: '25px', display: 'block' }}></span>
          </div>
        </div>
      </div>

      {/* Offcanvas Sidebar with light styling */}
      <div className="offcanvas offcanvas-start suha-offcanvas-wrap" id="suhaOffcanvas" aria-labelledby="suhaOffcanvasLabel" style={{ backgroundColor: '#ffffff' }}>
        <button className="btn-close btn-close-dark text-reset" type="button" data-bs-dismiss="offcanvas" aria-label="Close" style={{ margin: '1rem' }}></button>
        <div className="offcanvas-body">
          <div className="sidenav-profile" style={{ padding: '1rem', textAlign: 'center' }}>
            <div className="user-profile mb-3"><img src={imgBg} alt="" style={{ width: '80px', borderRadius: '50%' }} /></div>
            <div className="user-info">
              <h6 className="user-name mb-1" style={{ color: '#1e293b' }}>Complaint Management System</h6>
            </div>
          </div>
          <ul className="sidenav-nav ps-0" style={{ listStyle: 'none', padding: '1rem' }}>
            <li style={{ padding: '10px 0', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
              <Link to="/officer_home" style={{ color: '#475569', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <i className="lni lni-home"></i>Home
              </Link>
            </li>
            <li style={{ padding: '10px 0' }}>
              <div style={{ color: '#475569', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Logout />
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div className="page-content-wrapper" style={{ minHeight: 'calc(100vh - 140px)', padding: '2rem 0 6rem 0' }}>
        <div className="container" style={{ maxWidth: '1200px' }}>

          <div className="section-heading d-flex align-items-center justify-content-center mb-4">
            <h2 className="hero-title" style={{ fontSize: '2.5rem', marginBottom: 0, textAlign: 'center' }}>
              Assigned <span>Complaints</span>
            </h2>
          </div>

          {/* Improved Search Bar */}
          <div className="row justify-content-center mb-5">
            <div className="col-12 col-md-8 col-lg-6">
              <div className="position-relative">
                <input
                  className="form-control form-control-lg"
                  type="text"
                  placeholder="Search by User, Location, or details..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ borderRadius: '30px', paddingLeft: '20px', paddingRight: '50px', border: '1px solid #cbd5e1', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}
                />
                <i className="fa fa-search position-absolute" style={{ right: '20px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}></i>
              </div>
            </div>
          </div>

          {/* Complaints Grid */}
          {filteredData.length > 0 ? (
            <div className="row g-4">
              {filteredData.map((complaint) => (
                <div key={complaint._id} className="col-12 col-xl-6">
                  <div className="card h-100" style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>

                    {/* Card Header */}
                    <div className="card-header bg-transparent d-flex justify-content-between align-items-center" style={{ borderBottom: '1px solid #f1f5f9', padding: '1.25rem 1.5rem' }}>
                      <span className="text-muted" style={{ fontSize: '0.85rem' }}>
                        <i className="fa fa-calendar me-2"></i>
                        {new Date(complaint.dateCreated).toLocaleDateString('en-GB') + ' ' + new Date(complaint.dateCreated).toLocaleTimeString('en-GB', timeOptions)}
                      </span>
                      <span className={`badge ${getStatusBadgeClass(complaint.status)} px-3 py-2 rounded-pill`} style={{ fontSize: '0.85rem', fontWeight: '500' }}>
                        {complaint.status || 'Pending'}
                      </span>
                    </div>

                    <div className="card-body p-4">

                      <div className="row g-4">
                        {/* User Details */}
                        <div className="col-12 col-md-6">
                          <h6 className="mb-3" style={{ color: '#3b82f6', fontWeight: '600', fontSize: '0.95rem' }}><i className="fa fa-user me-2"></i>User Details</h6>
                          <div className="mb-2">
                            <small className="text-muted d-block" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Name</small>
                            <p className="mb-0 fw-bold" style={{ color: '#1e293b' }}>{complaint.name}</p>
                          </div>
                          <div className="mb-2">
                            <small className="text-muted d-block" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Contact Number</small>
                            <p className="mb-0" style={{ color: '#475569' }}>{complaint.mobile}</p>
                          </div>
                          <div className="mb-2">
                            <small className="text-muted d-block" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email</small>
                            <p className="mb-0 text-truncate" style={{ color: '#475569' }}>{complaint.useremail}</p>
                          </div>
                        </div>

                        {/* Location Details */}
                        <div className="col-12 col-md-6">
                          <h6 className="mb-3" style={{ color: '#8b5cf6', fontWeight: '600', fontSize: '0.95rem' }}><i className="fa fa-map-marker me-2"></i>Location Details</h6>
                          <div className="mb-2">
                            <small className="text-muted d-block" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Address</small>
                            <p className="mb-0" style={{ color: '#475569' }}>{complaint.address}</p>
                          </div>
                          <div className="mb-2">
                            <small className="text-muted d-block" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>District</small>
                            <p className="mb-0" style={{ color: '#475569' }}>{complaint.district}</p>
                          </div>
                          <div className="mb-2">
                            <small className="text-muted d-block" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Area / Location</small>
                            <p className="mb-0 fw-bold" style={{ color: '#1e293b' }}>{complaint.location}</p>
                          </div>
                        </div>

                        {/* Complaint Information */}
                        <div className="col-12">
                          <h6 className="mb-3 mt-2" style={{ color: '#f59e0b', fontWeight: '600', fontSize: '0.95rem' }}><i className="fa fa-file-text me-2"></i>Complaint Information</h6>
                          <div className="p-3" style={{ backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                            <div className="mb-3">
                              <span className="badge bg-light text-dark border me-2">{complaint.department}</span>
                            </div>
                            <p className="mb-0" style={{ color: '#334155', lineHeight: '1.6' }}>"{complaint.writecomplaint}"</p>
                          </div>
                        </div>

                        {/* Case Timeline */}
                        <div className="col-12 mt-4">
                           <ComplaintTimeline status={complaint.status} />
                        </div>

                        {/* Evidence Section */}
                        <div className="col-12 mt-2">
                           <EvidenceSection 
                               complaintId={complaint._id || complaint.id} 
                               currentUserRole="Officer"
                               currentUserId={currentOfficer ? (currentOfficer._id || currentOfficer.id) : null}
                           />
                        </div>

                        {/* Image Proofs */}
                        {(complaint.image1 || complaint.imagePath) && (
                          <div className="col-12 d-flex gap-3 flex-wrap mt-2">
                            {complaint.image1 && (
                              <a href={`http://localhost:4000/${complaint.image1}`} target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                                <div className="d-flex flex-column align-items-center p-2 border rounded" style={{ backgroundColor: '#fcfcfc' }}>
                                  <small className="text-muted mb-2">Complaint Proof</small>
                                  <img src={`http://localhost:4000/${complaint.image1}`} alt="Proof" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }} />
                                </div>
                              </a>
                            )}
                            {complaint.imagePath && (
                              <a href={`http://localhost:4000/${complaint.imagePath}`} target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                                <div className="d-flex flex-column align-items-center p-2 border rounded" style={{ backgroundColor: '#fcfcfc' }}>
                                  <small className="text-success mb-2">Resolution Proof</small>
                                  <img src={`http://localhost:4000/${complaint.imagePath}`} alt="Resolved" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '2px solid #10b981' }} />
                                </div>
                              </a>
                            )}
                          </div>
                        )}

                      </div>
                    </div>

                    {/* Officer Actions Footer */}
                    <div className="card-footer bg-transparent border-0 px-4 pb-4 pt-0">
                      <div className="d-flex flex-wrap gap-2 align-items-center pt-3" style={{ borderTop: '1px solid #f1f5f9' }}>
                        
                        {!complaint.assignedOfficer ? (
                            <button className="btn btn-sm btn-primary py-2 px-3 fw-bold" onClick={() => assignComplaint(complaint._id)} style={{ borderRadius: '8px' }}>
                                <i className="fa fa-briefcase me-1"></i> Work on Case
                            </button>
                        ) : complaint.assignedOfficer === (currentOfficer?._id || currentOfficer?.id) ? (
                            <>
                                <span className="badge bg-success px-3 py-2" style={{ borderRadius: '8px', fontSize: '13px' }}><i className="fa fa-check-circle me-1"></i> Assigned to You</span>
                                <button className="btn btn-sm btn-outline-primary" onClick={() => UpdateStatusAdmin(complaint._id)} style={{ borderRadius: '8px' }}><i className="fa fa-pencil-square-o me-1"></i> Update Status</button>
                                
                                {/* Only show Register FIR if status is not already FIR Registered or beyond */}
                                {(!complaint.status || (complaint.status.toLowerCase() !== 'fir registered' && !complaint.status.toLowerCase().includes('case') && !complaint.status.toLowerCase().includes('hearing') && !complaint.status.toLowerCase().includes('closed'))) && (
                                    <button className="btn btn-sm btn-danger px-4 py-2 fw-bold shadow-sm" onClick={() => handleOpenFIRModal(complaint)} style={{ borderRadius: '8px' }}>
                                        <i className="fa fa-file-text me-1"></i> Register FIR
                                    </button>
                                )}
                            </>
                        ) : (
                            <span className="badge bg-secondary px-3 py-2 text-white" style={{ borderRadius: '8px', fontSize: '13px' }}><i className="fa fa-lock me-1"></i> Assigned to: {complaint.assignedOfficerName}</span>
                        )}

                        <a className="btn btn-sm btn-outline-info ms-auto" target="_blank" rel="noopener noreferrer" href={`https://maps.google.com/?q=${complaint.lat},${complaint.long}`} style={{ borderRadius: '8px' }}><i className="fa fa-map me-1"></i> Show Map</a>
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-5">
              <div className="mb-3 text-muted" style={{ fontSize: '3rem' }}><i className="fa fa-inbox"></i></div>
              <h5 className="text-secondary">No complaints assigned.</h5>
              <p className="text-muted">There are no complaints matching your specific location or search queries.</p>
            </div>
          )}

        </div>
      </div>

      {/* FIR Registration Modal */}
      <Modal show={showFIRModal} onHide={() => setShowFIRModal(false)} centered size="lg">
          <Modal.Header closeButton style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)', color: 'white' }}>
              <Modal.Title className="fw-bold"><i className="fa fa-shield me-2"></i>Official FIR Registration</Modal.Title>
          </Modal.Header>
          <form onSubmit={handleFIRSubmit}>
              <Modal.Body className="p-4" style={{ backgroundColor: '#fdfdfd' }}>
                  <div className="alert alert-info py-2 small mb-4">
                      <i className="fa fa-info-circle me-2"></i> This will formally register an FIR for <strong>Complaint ID: {selectedComplaintId?.substring(selectedComplaintId.length - 8)}</strong>.
                  </div>
                  <div className="row g-3">
                      <div className="col-md-6">
                          <label className="form-label small fw-bold text-muted">FIR Number</label>
                          <input type="text" className="form-control" value={firFormData.firNumber} onChange={e => setFIRFormData({...firFormData, firNumber: e.target.value})} required />
                      </div>
                      <div className="col-md-6">
                          <label className="form-label small fw-bold text-muted">FIR Date</label>
                          <input type="date" className="form-control" value={firFormData.firDate} onChange={e => setFIRFormData({...firFormData, firDate: e.target.value})} required />
                      </div>
                      <div className="col-md-6">
                          <label className="form-label small fw-bold text-muted">Police Station</label>
                          <input type="text" className="form-control" value={firFormData.policeStation} onChange={e => setFIRFormData({...firFormData, policeStation: e.target.value})} required />
                      </div>
                      <div className="col-md-6">
                          <label className="form-label small fw-bold text-muted">Investigating Officer</label>
                          <input type="text" className="form-control" value={firFormData.investigatorName} disabled />
                      </div>
                      <div className="col-12 mt-4">
                          <div className="p-3 border rounded-3 bg-white shadow-sm">
                              <label className="form-label small fw-bold text-dark d-block mb-3">Upload Formal FIR Document (PDF/Image)</label>
                              <input type="file" className="form-control" onChange={e => setFIRFile(e.target.files[0])} accept="image/*,.pdf" />
                              <div className="mt-2 text-muted" style={{ fontSize: '0.75rem' }}>
                                  <i className="fa fa-exclamation-triangle me-1"></i> Document must be clearly readable for legal verification.
                              </div>
                          </div>
                      </div>
                  </div>
              </Modal.Body>
              <Modal.Footer className="bg-light border-0">
                  <Button variant="outline-secondary" className="rounded-pill px-4" onClick={() => setShowFIRModal(false)}>Cancel</Button>
                  <Button variant="danger" type="submit" className="rounded-pill px-4 fw-bold" disabled={isSubmitting}>
                      {isSubmitting ? <><i className="fa fa-spinner fa-spin me-2"></i>Processing...</> : <><i className="fa fa-check-circle me-2"></i>Confirm & Register FIR</>}
                  </Button>
              </Modal.Footer>
          </form>
      </Modal>

      {/* Footer Navigation */}
      <div className="footer-nav-area glass-nav" id="footerNav" style={{ position: 'fixed', bottom: 0, width: '100%', padding: '0 1rem', borderTop: '1px solid rgba(0,0,0,0.05)', borderBottom: 'none', height: '60px', borderRadius: '0', display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.9)' }}>
        <div className="container h-100 px-0">
          <div className="suha-footer-nav h-100">
            <ul className="h-100 d-flex align-items-center justify-content-between ps-0 mb-0" style={{ listStyle: 'none', width: '100%' }}>
              <li className="active">
                <Link to="/officer_home" style={{ color: '#3b82f6', textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '12px' }}>
                  <i className="lni lni-home" style={{ fontSize: '20px', marginBottom: '2px' }}></i>Home
                </Link>
              </li>
              <li>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#64748b' }}>
                  <Logout />
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

    </div>
  )
}

export default ViewComplaintOfficer;