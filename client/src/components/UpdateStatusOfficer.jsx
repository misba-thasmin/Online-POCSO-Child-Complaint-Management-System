import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

import "./css/bootstrap.min.css";
import "./css/owl.carousel.min.css";
import "./css/font-awesome.min.css";
import "./css/animate.css";
import "./css/lineicons.min.css";
import "./css/magnific-popup.css";
import "./css/style.css";
import "./js/jquery.min.js";  
import "./js/bootstrap.bundle.min.js";

import imgSmall from "./img/core-img/logo-small.png";
import imgBg from "./img/bg-img/9.png";
import Logout from './Logout.jsx';
import Title from './Title.jsx';

const UpdateStatusOfficer = () => {
  const { id } = useParams();
  
  const [editedComplaint, setEditedComplaint] = useState({
    status: '',
    reason: '',
    remedies: '',
    notes: '',
    image: null
  });
  
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchComplaintDetails = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/v1/complaint/${id}`);
        if (response.ok) {
          const data = await response.json();
          setEditedComplaint({
            status: data.status || '',
            reason: data.reason || '',
            remedies: data.remedies || '',
            notes: data.notes || ''
          });
        } else {
          console.error('Error fetching complaint data:', response.statusText);
        } 
      } catch (error) {
        console.error('Error fetching complaint data:', error.message);
      }
    };

    fetchComplaintDetails();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedComplaint({
      ...editedComplaint,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    setEditedComplaint({
      ...editedComplaint,
      image: e.target.files[0]
    });
  };

  const handleUpdateComplaint = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      if (editedComplaint.image) {
        formData.append('image', editedComplaint.image);
      }
      formData.append('status', editedComplaint.status);
      formData.append('reason', editedComplaint.reason);
      formData.append('remedies', editedComplaint.remedies);
      formData.append('notes', editedComplaint.notes);

      const response = await fetch(`http://localhost:4000/api/v1/complaint/status/${id}`, {
        method: 'PUT',
        headers: {
          'x-auth-token': token,
        },
        body: formData,
      });

      if (response.ok) {
        console.log('Status updated successfully!');
        alert('Status updated successfully!');
        window.location.href = "/view_complaint_officer";
      } else {
        console.error('Failed to update status:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating status:', error.message);
    }
  };

  // Status Badge color mapping
  const getBadgeColor = (status) => {
    if (!status) return 'bg-secondary';
    const s = status.toLowerCase();
    if (s.includes('resolved') || s.includes('completed')) return 'bg-success';
    if (s.includes('progress') || s.includes('pending')) return 'bg-warning text-dark';
    if (s.includes('closed') || s.includes('rejected')) return 'bg-danger';
    return 'bg-secondary';
  };

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', paddingBottom: '80px' }}>
      
      {/* Header Area */}
      <div className="header-area glass-nav" id="headerArea" style={{ position: 'sticky', top: 0, zIndex: 1000, padding: '1rem' }}>
        <div className="container h-100 d-flex align-items-center justify-content-between">
          <div className="logo-wrapper" style={{color:'#020310'}}>
            <img src={imgSmall} alt=""/> <Title />
          </div>
          <div className="suha-navbar-toggler" data-bs-toggle="offcanvas" data-bs-target="#suhaOffcanvas" aria-controls="suhaOffcanvas">
            <span></span><span></span><span></span>
          </div>
        </div>
      </div>  

      {/* Offcanvas Menu */}
      <div className="offcanvas offcanvas-start suha-offcanvas-wrap" id="suhaOffcanvas" aria-labelledby="suhaOffcanvasLabel">
        <button className="btn-close btn-close-white text-reset" type="button" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        <div className="offcanvas-body">
          <div className="sidenav-profile">
            <div className="user-profile"><img src={imgBg} alt=""/></div>
            <div className="user-info">
              <h6 className="user-name mb-1">Complaint - Update status</h6>
            </div>
          </div>
          <ul className="sidenav-nav ps-0">
            <li><Link to="/officer_home"><i className="lni lni-home"></i>Home</Link></li>
            <li><Logout /></li>  
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="page-content-wrapper mt-5 pt-4">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 col-md-10 col-12">
              
              <div className="card shadow-sm border-0" style={{ borderRadius: '15px' }}>
                <div className="card-header bg-white border-0 text-center pt-4 pb-2" style={{ borderRadius: '15px 15px 0 0' }}>
                  <h4 className="fw-bold mb-1" style={{ color: '#2c3e50' }}>
                    <i className="fa fa-edit me-2" style={{ color: '#198754' }}></i>
                    Update Complaint Status
                  </h4>
                  <span className={`badge rounded-pill mt-2 px-3 py-2 ${getBadgeColor(editedComplaint.status)}`}>
                    Status: {editedComplaint.status || 'Pending'}
                  </span>
                </div>
                
                <div className="card-body p-4 p-md-5 pt-3">
                  <form onSubmit={handleUpdateComplaint}>
                    
                    {/* Status Dropdown */}
                    <div className="mb-4">
                      <label htmlFor="status" className="form-label fw-bold" style={{ color: '#495057' }}>
                        <i className="fa fa-info-circle me-1 text-primary" style={{ color: '#0d6efd' }}></i> Status
                      </label>
                      <select 
                        className="form-select form-select-lg" 
                        name="status" 
                        id="status"
                        value={editedComplaint.status}
                        onChange={handleInputChange}  
                        style={{ borderRadius: '8px', fontSize: '1rem', border: '1px solid #ced4da', backgroundColor: '#fdfdfd' }}
                      >
                        <option value="On Progress">On Progress</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </div>

                    {/* Reason Textarea */}
                    <div className="mb-4">
                      <label htmlFor="reason" className="form-label fw-bold" style={{ color: '#495057' }}>
                        <i className="fa fa-question-circle me-1" style={{ color: '#dc3545' }}></i> Reason
                      </label>
                      <textarea 
                        className="form-control" 
                        name="reason" 
                        id="reason"
                        rows="3"
                        value={editedComplaint.reason}
                        onChange={handleInputChange}
                        placeholder="Explain the reason for the update..."
                        style={{ borderRadius: '8px', resize: 'none' }}
                      ></textarea>
                    </div>     
                    
                    {/* Remedies Textarea */}
                    <div className="mb-4">
                      <label htmlFor="remedies" className="form-label fw-bold" style={{ color: '#495057' }}>
                        <i className="fa fa-medkit me-1" style={{ color: '#198754' }}></i> Remedies / Solution
                      </label>
                      <textarea 
                        className="form-control" 
                        name="remedies" 
                        id="remedies"
                        rows="3"
                        value={editedComplaint.remedies}
                        onChange={handleInputChange}
                        placeholder="Detail the remedies or solutions provided..."
                        style={{ borderRadius: '8px', resize: 'none' }}
                      ></textarea>
                    </div>    

                    {/* Complaint Notes Textarea */}
                    <div className="mb-4">
                      <label htmlFor="notes" className="form-label fw-bold" style={{ color: '#495057' }}>
                        <i className="fa fa-sticky-note me-1" style={{ color: '#ffc107' }}></i> Complaint Notes
                      </label>
                      <textarea 
                        className="form-control" 
                        name="notes" 
                        id="notes"
                        rows="3"
                        value={editedComplaint.notes}
                        onChange={handleInputChange}
                        placeholder="Additional notes or remarks..."
                        style={{ borderRadius: '8px', resize: 'none' }}
                      ></textarea>
                    </div>    
                    
                    {/* Upload Image */}
                    <div className="mb-5">
                      <label htmlFor="image" className="form-label fw-bold" style={{ color: '#495057' }}>
                        <i className="fa fa-image me-1" style={{ color: '#6f42c1' }}></i> Upload Image Evidence
                      </label>
                      <input
                        className="form-control form-control-lg"
                        name="image"
                        id="image"
                        type="file"
                        onChange={handleImageChange}
                        style={{ borderRadius: '8px', fontSize: '1rem' }}
                      />
                    </div>
                
                    {/* Action Buttons */}
                    <div className="d-flex flex-column flex-sm-row justify-content-between gap-3 mt-4">
                      <Link to="/view_complaint_officer" className="btn btn-outline-secondary w-100" style={{ borderRadius: '8px', padding: '12px 20px', fontWeight: '500' }}>
                        <i className="fa fa-arrow-left me-2"></i> Cancel / Back
                      </Link>
                      <button className="btn btn-success w-100 shadow-sm" type="submit" style={{ borderRadius: '8px', padding: '12px 20px', fontWeight: '500', transition: 'all 0.3s ease' }}>
                        <i className="fa fa-save me-2"></i> Save Update
                      </button>
                    </div>
                    
                  </form>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
      
      {/* Footer Nav */}
      <div className="footer-nav-area" id="footerNav" style={{ zIndex: 1000 }}>
        <div className="container h-100 px-0">
          <div className="suha-footer-nav h-100">
            <ul className="h-100 d-flex align-items-center justify-content-between ps-0">
              <li className="active"> 
                <Link to="/officer_home"><i className="lni lni-home"></i>Home</Link> 
              </li>
              <li><Logout /></li> 
            </ul>
          </div>
        </div>
      </div>

    </div>
  )
}

export default UpdateStatusOfficer;