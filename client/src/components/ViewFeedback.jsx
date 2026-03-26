import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
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

const ViewFeedback = () => {
  const [complaintData, setComplaintData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchComplaintData = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/v1/feedback/`);
        if (response.status === 200) {
          setComplaintData(response.data);
        } else {
          console.error('Error fetching Complaint data:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching Complaint data:', error.message);
      }
    };

    fetchComplaintData();
  }, []);

  // Filter data based on the search term
  const filteredData = complaintData.filter((complaint) => { 
    return Object.values(complaint).some((field) =>
      field && field.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  });  

  const timeOptions = { hour: '2-digit', minute: '2-digit' };

  return (
    <div>
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

        <div className="offcanvas offcanvas-start suha-offcanvas-wrap" id="suhaOffcanvas" aria-labelledby="suhaOffcanvasLabel">
            <button className="btn-close btn-close-white text-reset" type="button" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            <div className="offcanvas-body">
                <div className="sidenav-profile">
                    <div className="user-profile"><img src={imgBg} alt=""/></div>
                    <div className="user-info">
                        <h6 className="user-name mb-1">Online POCSO Child Safety Complaint Management System Management System</h6>
                    </div>
                </div>
                <ul className="sidenav-nav ps-0">
                    <li><Link to="/admin_home"><i className="lni lni-home"></i>Home</Link></li>
                    <li><Logout /></li>  
                </ul>
            </div>
        </div>

        <div className="page-content-wrapper" style={{ backgroundColor: '#f4f7f6', minHeight: '100vh', paddingBottom: '80px' }}>
            <div className="container pt-4">
                
                <div className="d-flex align-items-center justify-content-between mb-4">
                    <h4 className="mb-0 text-dark fw-bold" style={{ borderLeft: '4px solid #00c6eb', paddingLeft: '10px' }}>User Feedbacks</h4>
                </div>
                
                {/* Search Bar */}
                <div className="card shadow-sm border-0 mb-4 rounded" style={{ backgroundColor: '#ffffff' }}>
                    <div className="card-body">
                        <div className="input-group">
                            <span className="input-group-text bg-light border-end-0"><i className="fa fa-search text-muted"></i></span>
                            <input 
                                className="form-control border-start-0 ps-0 text-dark" 
                                type="text" 
                                placeholder="Search feedbacks..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)} 
                            />
                        </div>
                    </div>
                </div>

                {/* Feedback Grid */}
                <div className="row g-4" style={{marginTop: 5}}>
                    {filteredData.length > 0 ? filteredData.map((feedback) => (
                        <div key={feedback._id} className="col-12 col-md-6 col-lg-4">                                        
                            <div className="card border-0 shadow-sm rounded-4 h-100" style={{ transition: 'transform 0.2s', cursor: 'default' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                                <div className="card-body p-4">
                                    {/* Header: Avatar, Name, Email */}
                                    <div className="d-flex align-items-center mb-3">
                                        <div className="flex-shrink-0">
                                            <i className="fa fa-user-circle fa-3x text-primary shadow-sm rounded-circle bg-white"></i>
                                        </div>
                                        <div className="flex-grow-1 ms-3">
                                            <h6 className="mb-0 fw-bold text-dark">{feedback.name}</h6>
                                            <small className="text-muted"><i className="fa fa-envelope-o me-1"></i>{feedback.useremail}</small>
                                        </div>
                                    </div>

                                    {/* Feedback Message Block */}
                                    <div className="bg-light p-3 rounded-3 mb-3 border position-relative">
                                        <i className="fa fa-quote-left text-primary opacity-25 position-absolute top-0 start-0 mt-2 ms-2 fs-5"></i>
                                        <p className="mb-0 text-dark small fst-italic ps-3 pe-2 pt-2 lh-base">
                                            "{feedback.feedback}"
                                        </p>
                                    </div>

                                    {/* Details List */}
                                    <ul className="list-unstyled mb-0 small text-muted">
                                        <li className="mb-2 d-flex align-items-center">
                                            <i className="fa fa-map-marker text-danger me-2" style={{width: '16px', textAlign: 'center'}}></i> 
                                            <span className="text-dark">{feedback.location}</span>
                                        </li>
                                        <li className="mb-2 d-flex align-items-center">
                                            <i className="fa fa-building-o text-success me-2" style={{width: '16px', textAlign: 'center'}}></i> 
                                            <strong className="text-dark me-1">Department:</strong> {feedback.department}
                                        </li>
                                        <li className="d-flex align-items-center">
                                            <i className="fa fa-calendar text-info me-2" style={{width: '16px', textAlign: 'center'}}></i> 
                                            <span>{new Date(feedback.dateCreated).toLocaleDateString('en-GB', timeOptions)}</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>                        
                        </div>
                    )) : (
                        <div className="col-12 text-center py-5 text-muted">
                            <i className="fa fa-comments-o fs-1 mb-3 d-block"></i>
                            <p>No feedbacks found matching your search.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
            
        <div className="footer-nav-area" id="footerNav" style={{ zIndex: 900 }}>
            <div className="container h-100 px-0">
                <div className="suha-footer-nav h-100">
                    <ul className="h-100 d-flex align-items-center justify-content-between ps-0">
                        <li className="active"> <Link to="/admin_home"><i className="lni lni-home"></i>Home </Link> </li>
                        <li><Logout /></li> 
                    </ul>
                </div>
            </div>
        </div>

    </div>
  )
}

export default ViewFeedback
