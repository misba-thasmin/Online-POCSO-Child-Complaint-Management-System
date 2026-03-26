import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

const ViewComplaintUser = () => {
  const [complaintId, setComplaintId] = useState('');
  const [cook_location, setCookLocation] = useState('');
  const [cook_department, setCookDepartment] = useState('');
  const [complaintData, setComplaintData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserData, setCurrentUserData] = useState(null);

  const navigate = useNavigate();

  // Apply Light Theme Background
  useEffect(() => {
    document.body.style.backgroundColor = '#f8fafc';
    return () => {
      document.body.style.backgroundColor = '';
    }
  }, []);

  const getUserLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          updateLocationOnServer(latitude, longitude);
        },
        (error) => {
          console.error(`Error getting user location: ${error.message}`);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  async function updateLocationOnServer(latitude, longitude) {
    const url = `http://localhost:4000/api/v1/complaint/map/` + complaintId;
    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lat: latitude,
          long: longitude,
        }),
      });
      if (response.ok) {
        alert("Location updated successfully!");
        window.location.reload();
      } else {
        console.error(`Error updating location: ${response.statusText}`);
      }
    } catch (error) {
      console.error(`Error updating location: ${error.message}`);
    }
  }

  useEffect(() => {
    if (complaintId) {
      getUserLocation();
    }
  }, [complaintId]);

  const Feedbackfunction = (location, department) => {
    setCookLocation(location);
    setCookDepartment(department);
  };

  useEffect(() => {
    if (cook_location && cook_department) {
      updateFeedback();
    }
  }, [cook_location, cook_department]);

  const updateFeedback = () => {
    document.cookie = `cook_location=${cook_location}`;
    document.cookie = `cook_department=${cook_department}`;
    window.location.href = '/feedback_user';
  };

  const LoadPhoto = (id) => {
    navigate("/photo_user/" + id);
  }

  useEffect(() => {
    const fetchComplaintData = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/v1/complaint/');
        const data = await response.json();
        const useremail = decodeURIComponent(document.cookie.replace(/(?:(?:^|.*;\s*)email\s*=\s*([^;]*).*$)|^.*$/, '$1'));
        const filteredComplaint = data.filter((complaint) => complaint.useremail === useremail);
        setComplaintData(filteredComplaint);
        setFilteredData(filteredComplaint);
        
        // Fetch current user id
        try {
           const userRes = await fetch('http://localhost:4000/api/v1/user/');
           const users = await userRes.json();
           const currUser = users.find(u => u.email === useremail);
           if (currUser) {
               setCurrentUserData(currUser);
           }
        } catch(e) { console.error(e); }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching Complaint data:', error.message);
        setLoading(false);
      }
    };
    fetchComplaintData();
  }, []);

  const handleSearch = (term) => {
    setSearchTerm(term);
    const filtered = complaintData.filter((complaint) =>
      Object.values(complaint).some((field) =>
        field && field.toString().toLowerCase().includes(term.toLowerCase())
      )
    );
    setFilteredData(filtered);
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
              <h6 className="user-name mb-1" style={{ color: '#1e293b' }}>Online POCSO Child Safety Complaint Management System</h6>
            </div>
          </div>
          <ul className="sidenav-nav ps-0" style={{ listStyle: 'none', padding: '1rem' }}>
            <li style={{ padding: '10px 0', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
              <Link to="/user_home" style={{ color: '#475569', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
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
        <div className="container">

          <div className="section-heading d-flex align-items-center justify-content-center mb-4">
            <h2 className="hero-title" style={{ fontSize: '2.5rem', marginBottom: 0, textAlign: 'center' }}>
              My <span>Complaints</span>
            </h2>
          </div>

          {/* Improved Search Bar */}
          <div className="row justify-content-center mb-5">
            <div className="col-12 col-md-8 col-lg-6">
              <div className="position-relative">
                <input
                  className="form-control form-control-lg"
                  type="text"
                  placeholder="Search by ID, status, or details..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  style={{ borderRadius: '30px', paddingLeft: '20px', paddingRight: '50px', border: '1px solid #cbd5e1', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}
                />
                <i className="fa fa-search position-absolute" style={{ right: '20px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}></i>
              </div>
            </div>
          </div>

          {/* complaints grid */}
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
                        {/* Personal & Basic Info */}
                        <div className="col-12 col-md-6">
                          <h6 className="mb-3" style={{ color: '#3b82f6', fontWeight: '600', fontSize: '0.95rem' }}><i className="fa fa-user me-2"></i>Personal Info</h6>
                          <div className="mb-2">
                            <small className="text-muted d-block" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Name</small>
                            <p className="mb-0 fw-bold" style={{ color: '#1e293b' }}>{complaint.name}</p>
                          </div>
                          <div className="mb-2">
                            <small className="text-muted d-block" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Contact</small>
                            <p className="mb-0" style={{ color: '#475569' }}>{complaint.mobile}</p>
                          </div>
                          <div className="mb-2">
                            <small className="text-muted d-block" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email</small>
                            <p className="mb-0 text-truncate" style={{ color: '#475569' }}>{complaint.useremail}</p>
                          </div>
                        </div>

                        {/* Location Details */}
                        <div className="col-12 col-md-6">
                          <h6 className="mb-3" style={{ color: '#8b5cf6', fontWeight: '600', fontSize: '0.95rem' }}><i className="fa fa-map-marker me-2"></i>Location</h6>
                          <div className="mb-2">
                            <small className="text-muted d-block" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Address</small>
                            <p className="mb-0" style={{ color: '#475569' }}>{complaint.address}</p>
                          </div>
                          <div className="mb-2">
                            <small className="text-muted d-block" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>District</small>
                            <p className="mb-0" style={{ color: '#475569' }}>{complaint.district}</p>
                          </div>
                          <div className="mb-2">
                            <small className="text-muted d-block" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Area</small>
                            <p className="mb-0 fw-bold" style={{ color: '#1e293b' }}>{complaint.location}</p>
                          </div>
                        </div>

                        {/* Full Width Complaint Info */}
                        <div className="col-12">
                          <h6 className="mb-3 mt-2" style={{ color: '#f59e0b', fontWeight: '600', fontSize: '0.95rem' }}><i className="fa fa-file-text me-2"></i>Complaint Details</h6>
                          <div className="p-3" style={{ backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                            <div className="mb-3">
                              <span className="badge bg-light text-dark border me-2">{complaint.department}</span>
                            </div>
                            <p className="mb-0" style={{ color: '#334155', lineHeight: '1.6' }}>"{complaint.writecomplaint}"</p>
                          </div>
                        </div>

                        {/* Admin/Officer Response Section (Only show if there are notes/remedies) */}
                        {(complaint.reason || complaint.remedies || complaint.notes) && (
                          <div className="col-12">
                            <h6 className="mb-3 mt-2" style={{ color: '#10b981', fontWeight: '600', fontSize: '0.95rem' }}><i className="fa fa-shield me-2"></i>Official Response</h6>
                            <div className="p-3" style={{ borderLeft: '3px solid #10b981', backgroundColor: '#f0fdf4', borderRadius: '0 12px 12px 0' }}>
                              {complaint.reason && <div className="mb-2"><strong style={{ color: '#065f46' }}>Reason:</strong> <span style={{ color: '#064e3b' }}>{complaint.reason}</span></div>}
                              {complaint.remedies && <div className="mb-2"><strong style={{ color: '#065f46' }}>Remedy:</strong> <span style={{ color: '#064e3b' }}>{complaint.remedies}</span></div>}
                              {complaint.notes && <div className="mb-0"><strong style={{ color: '#065f46' }}>Notes:</strong> <span style={{ color: '#064e3b' }}>{complaint.notes}</span></div>}
                            </div>
                          </div>
                        )}

                        {/* Case Timeline */}
                        <div className="col-12 mt-4">
                           <ComplaintTimeline status={complaint.status} />
                        </div>

                        {/* Evidence Section */}
                        <div className="col-12 mt-2">
                           <EvidenceSection 
                               complaintId={complaint._id || complaint.id} 
                               currentUserRole="User"
                               currentUserId={currentUserData ? (currentUserData._id || currentUserData.id) : null}
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

                    {/* Card Footer Actions */}
                    <div className="card-footer bg-transparent border-0 px-4 pb-4 pt-0">
                      <div className="d-flex flex-wrap gap-2 pt-3" style={{ borderTop: '1px solid #f1f5f9' }}>
                        <button className="btn btn-sm btn-outline-primary" onClick={() => setComplaintId(complaint.id)} style={{ borderRadius: '8px' }}><i className="fa fa-crosshairs me-1"></i> Update Geo Map</button>
                        <a className="btn btn-sm btn-outline-info" target="_blank" rel="noopener noreferrer" href={`https://maps.google.com/?q=${complaint.lat},${complaint.long}`} style={{ borderRadius: '8px' }}><i className="fa fa-map me-1"></i> Show Map</a>
                        <button className="btn btn-sm btn-outline-warning" onClick={() => Feedbackfunction(complaint.location, complaint.department)} style={{ borderRadius: '8px' }}><i className="fa fa-star me-1"></i> Feedback</button>
                        <button className="btn btn-sm btn-outline-secondary" onClick={() => LoadPhoto(complaint.id)} style={{ borderRadius: '8px' }}><i className="fa fa-camera me-1"></i> Add Photo</button>
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-5">
              <div className="mb-3 text-muted" style={{ fontSize: '3rem' }}><i className="fa fa-inbox"></i></div>
              <h5 className="text-secondary">No complaints found.</h5>
              <p className="text-muted">You haven't posted any complaints yet, or none match your search criteria.</p>
              <Link to="/post_complaint" className="btn btn-primary mt-3 px-4 rounded-pill">Post a Complaint</Link>
            </div>
          )}

        </div>
      </div>

      {/* Footer Navigation */}
      <div className="footer-nav-area glass-nav" id="footerNav" style={{ position: 'fixed', bottom: 0, width: '100%', padding: '0 1rem', borderTop: '1px solid rgba(0,0,0,0.05)', borderBottom: 'none', height: '60px', borderRadius: '0', display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.9)' }}>
        <div className="container h-100 px-0">
          <div className="suha-footer-nav h-100">
            <ul className="h-100 d-flex align-items-center justify-content-between ps-0 mb-0" style={{ listStyle: 'none', width: '100%' }}>
              <li className="active">
                <Link to="/user_home" style={{ color: '#3b82f6', textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '12px' }}>
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

export default ViewComplaintUser;