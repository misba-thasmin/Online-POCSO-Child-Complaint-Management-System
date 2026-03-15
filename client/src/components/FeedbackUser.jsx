import React, { useState ,useEffect } from 'react';
import { Link } from 'react-router-dom';
import "./css/bootstrap.min.css";
import "./css/owl.carousel.min.css";
import "./css/font-awesome.min.css";
import "./css/animate.css";
import "./css/font-awesome.min.css";
import "./css/lineicons.min.css";
import "./css/magnific-popup.css";
import "./css/style.css";
import "./js/jquery.min.js";  
import "./js/bootstrap.bundle.min.js";
import Cookies from 'js-cookie';
import axios from 'axios';
{/*
import "./js/waypoints.min.js";
import "./js/jquery.easing.min.js";
import "./js/owl.carousel.min.js";
import "./js/jquery.magnific-popup.min.js";
*/}
import imgSmall from "./img/core-img/logo-small.png";
import imgBg from "./img/bg-img/9.png";
import Logout from './Logout.jsx';
import Title from './Title.jsx';

// vendoremail  useremail  complaint mobile lat long status

const FeedbackUser = () => {

 const userEmail = decodeURIComponent(document.cookie.replace(/(?:(?:^|.*;\s*)email\s*=\s*([^;]*).*$)|^.*$/, '$1'));
 const location = decodeURIComponent(document.cookie.replace(/(?:(?:^|.*;\s*)cook_location\s*=\s*([^;]*).*$)|^.*$/, '$1'));
 const department = decodeURIComponent(document.cookie.replace(/(?:(?:^|.*;\s*)cook_department\s*=\s*([^;]*).*$)|^.*$/, '$1'));
 
 
 const [formData, setFormData] = useState({
    
    useremail: '',
    name: '',
    feedback: '',
    location: '',
    department: ''
  });

  const postFeedback = async () => {
    const token = localStorage.getItem('token');
    //console.log(userEmail);  // Output: donar@gmail.com
    
    try {
      const response = await fetch('http://localhost:4000/api/v1/feedback/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify({
          ...formData,
          useremail: userEmail,
          location: location,
          department: department,
         
        }),
      });

      if (response.ok) {
        console.log('Feedback data posted successfully!');
        // Handle success, e.g., redirect to another page
        alert('Feedback Submitted Successful');
        window.location.href = "/user_home";

      } else {
        console.error('Error posting Feedback data:', response.statusText);
        alert('Feedback Submitted Successful');
      }
    } catch (error) {
      console.error('Error posting Feedback data:', error.message);
    }
  }



  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  
  };



  // OnForm Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    
    postFeedback();
  };

 
    


  return (
    <div>
        <div>
      
        <div className="header-area glass-nav" id="headerArea" style={{ position: 'sticky', top: 0, zIndex: 1000, padding: '1rem' }}>
        <div className="container h-100 d-flex align-items-center justify-content-between">
    
        <div className="header-area glass-nav" id="headerArea" style={{ position: 'sticky', top: 0, zIndex: 1000, padding: '1rem' }}>
        <div className="container h-100 d-flex align-items-center justify-content-between">
            <div className="logo-wrapper" style={{color:'#020310'}}><img src={imgSmall} alt=""/> <Title /> </div>
        
            <div className="suha-navbar-toggler" data-bs-toggle="offcanvas" data-bs-target="#suhaOffcanvas" aria-controls="suhaOffcanvas"><span></span><span></span><span></span></div>
        </div>
        </div>  

{/* tabindex="-1" */}
        <div className="offcanvas offcanvas-start suha-offcanvas-wrap"  id="suhaOffcanvas" aria-labelledby="suhaOffcanvasLabel">
      <button className="btn-close btn-close-white text-reset" type="button" data-bs-dismiss="offcanvas" aria-label="Close"></button>

      <div className="offcanvas-body">
        <div className="sidenav-profile">
          <div className="user-profile"><img src={imgBg} alt=""/></div>
          <div className="user-info">
            <h6 className="user-name mb-1">Complaint Management app</h6>
         
          </div>
        </div>
    
        <ul className="sidenav-nav ps-0">
          <li><Link to="/user_home"><i className="lni lni-home"></i>Home</Link></li>
          <li><Logout /></li>  
          </ul>
      </div>
    </div>
      </div>
    </div>
    <div className="page-content-wrapper">
      <div className="top-products-area py-3">
        <div className="container">
          <div className="section-heading d-flex align-items-center justify-content-between">
            <h6>Post Feedback</h6>
          </div>
        {/* Form Scrip Start*/}
        <div className="profile-wrapper-area py-3">
          <div className="card user-data-card">
            <div className="card-body">
              <form  onSubmit={handleSubmit}>

              
              <div className="mb-3">
                  <div className="title mb-2"><span>Name</span></div>
                  <input className="form-control"
                    name="name" id="name"
                    value={formData.name}
                    onChange={handleInputChange}    type="text"  />
                </div>
  				
                <div className="mb-3">
                  <div className="title mb-2"><span>Feedback</span></div>
                  <input className="form-control" name="feedback" id="feedback"
                    value={formData.feedback}
                    onChange={handleInputChange}   type="text"/>
                </div>   
                <button className="btn btn-success w-100"  type="submit">Submit Feedback</button>
              </form>
            </div>
          </div>
        </div>
        {/* Form Scrip End*/}
        
    


        </div>
        
      </div>
    </div>
            
            <div className="footer-nav-area" id="footerNav">
              <div className="container h-100 px-0">
                <div className="suha-footer-nav h-100">
                  <ul className="h-100 d-flex align-items-center justify-content-between ps-0">
                    <li className="active"> <Link to="/user_home" ><i className="lni lni-home"></i>Home </Link> </li>
                    <li><Logout /></li> 
                    
                
                  </ul>
                </div>
              </div>
            </div>


</div>
</div>
  )
}

export default FeedbackUser