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

const ViewBusinessAdmin = () => {
  const navigate = useNavigate();

  const UpdateStatusAdmin = (id) => {
    navigate("/update_advocate_admin/" + id);
  }

  const [businessData, setBusinessData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchBusinessData = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/v1/business/`);
        if (response.status === 200) {
          setBusinessData(response.data);
        } else {
          console.error('Error fetching business data:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching business data:', error.message);
      }
    };

    fetchBusinessData();
  }, []);

  // Filter data based on the search term
  const filteredData = businessData.filter((business) => { 
    return Object.values(business).some((field) =>
      field && field.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  });  

  const getBadgeClass = (status) => {
      const s = status ? status.toLowerCase() : '';
      if (s === 'approved') return 'bg-success';
      if (s === 'pending') return 'bg-warning text-dark';
      if (s === 'rejected' || s === 'cancelled') return 'bg-danger';
      return 'bg-secondary';
  }

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
                        <h6 className="user-name mb-1">On Road Help</h6>
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
                    <h4 className="mb-0 text-dark fw-bold" style={{ borderLeft: '4px solid #00c6eb', paddingLeft: '10px' }}>Approve Advocate</h4>
                </div>
                
                {/* Search Bar */}
                <div className="card shadow-sm border-0 mb-4 rounded" style={{ backgroundColor: '#ffffff' }}>
                    <div className="card-body">
                        <div className="input-group">
                            <span className="input-group-text bg-light border-end-0"><i className="fa fa-search text-muted"></i></span>
                            <input 
                                className="form-control border-start-0 ps-0 text-dark" 
                                type="text" 
                                placeholder="Search advocates..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)} 
                            />
                        </div>
                    </div>
                </div>

                {/* Advocate Cards Grid */}
                <div className="row g-4" style={{marginTop: 5}}>
                    {filteredData.length > 0 ? filteredData.map((business) => (
                        <div key={business._id} className="col-12 col-md-6 col-xl-4">                                        
                            <div className="card border-0 shadow-sm rounded-4 h-100" style={{ transition: 'transform 0.2s', cursor: 'default' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                                
                                <div className="card-body p-4 position-relative">
                                    {/* Status Badge */}
                                    <div className="position-absolute top-0 end-0 mt-3 me-3">
                                        <span className={`badge rounded-pill ${getBadgeClass(business.status)} px-3 py-2 shadow-sm`}>
                                            {business.status || 'Pending'}
                                        </span>
                                    </div>
                                    
                                    {/* Header: Avatar, Name, Service */}
                                    <div className="d-flex align-items-center mb-4 pe-5">
                                        <div className="flex-shrink-0">
                                            <div className="d-inline-flex justify-content-center align-items-center bg-light text-primary rounded-circle shadow-sm" style={{ width: '60px', height: '60px' }}>
                                                <i className="fa fa-gavel fa-2x"></i>
                                            </div>
                                        </div>
                                        <div className="flex-grow-1 ms-3">
                                            <h5 className="mb-0 fw-bold text-dark">{business.name}</h5>
                                            <small className="text-muted fw-semibold text-uppercase">{business.service}</small>
                                        </div>
                                    </div>

                                    <hr className="text-muted opacity-25 mb-4" />

                                    {/* Details List */}
                                    <div className="row g-3 small text-muted mb-4">
                                        <div className="col-12 d-flex align-items-center">
                                            <i className="fa fa-clock-o text-primary me-3 flex-shrink-0" style={{ width: '16px', textAlign: 'center' }}></i>
                                            <span className="text-dark"><strong>Available:</strong> {business.available}</span>
                                        </div>
                                        <div className="col-12 d-flex align-items-center">
                                            <i className="fa fa-phone text-success me-3 flex-shrink-0" style={{ width: '16px', textAlign: 'center' }}></i>
                                            <span className="text-dark"><strong>Mobile:</strong> {business.mobile}</span>
                                        </div>
                                        <div className="col-12 d-flex align-items-start">
                                            <i className="fa fa-map-marker text-danger me-3 mt-1 flex-shrink-0" style={{ width: '16px', textAlign: 'center' }}></i>
                                            <span className="text-dark"><strong>Address:</strong> {business.address}, {business.locality}, {business.city}</span>
                                        </div>
                                    </div>

                                </div>
                                <div className="card-footer bg-white border-top-0 p-4 pt-0 d-flex gap-2">
                                    <button className="btn btn-outline-primary rounded-pill flex-grow-1 fw-semibold shadow-sm" onClick={() => UpdateStatusAdmin(business.id)}>
                                        <i className="fa fa-pencil-square-o me-1"></i> Update Status
                                    </button>
                                    <a 
                                        className="btn btn-outline-danger rounded-circle shadow-sm d-flex align-items-center justify-content-center" 
                                        style={{ width: '40px', height: '40px' }}
                                        target="_blank" rel="noopener noreferrer"
                                        title="Show on map"
                                        href={`https://maps.google.com/?q=${business.lat},${business.long}`}
                                    >
                                        <i className="fa fa-map-o"></i>
                                    </a> 
                                </div>
                            </div>                        
                        </div>
                    )) : (
                        <div className="col-12 text-center py-5 text-muted">
                            <i className="fa fa-gavel fs-1 mb-3 d-block"></i>
                            <p>No advocates found matching your search.</p>
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

export default ViewBusinessAdmin
