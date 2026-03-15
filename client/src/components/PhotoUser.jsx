import React, { useState,useEffect } from 'react';
import { Link ,useParams} from 'react-router-dom';

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

import imgSmall from "./img/core-img/logo-small.png";
import imgBg from "./img/bg-img/9.png";
import Logout from './Logout.jsx';
import Title from './Title.jsx';

// name  donarname city password phone  locality address city phone 

const PhotoUser = () => {
  const { id } = useParams(); // Use useParams to get route parameters

  //const id = match.params.id;
  //const [complaintData, setComplaintData] = useState({});
  
  const [editedComplaint,  setEditedComplaint] = useState({
    
    
    image: null // New state to hold the selected image file
  });
  
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchComplaintDetails = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/v1/complaint/${id}`);
        if (response.ok) {
          const data = await response.json();
          setEditedComplaint({
            status: data.status  ,
            reason: data.reason,
            remedies: data.remedies,
            notes: data.notes
          });
        }else {
          console.error('Error fetching User data:', response.statusText);
        } 
      } catch (error) {
        console.error('Error fetching User data:', error.message);
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
      formData.append('image', editedComplaint.image);
      formData.append('status', editedComplaint.status);
      formData.append('reason', editedComplaint.reason);
      formData.append('remedies', editedComplaint.remedies);
      formData.append('notes', editedComplaint.notes);

      const response = await fetch(`http://localhost:4000/api/v1/complaint/upload_image/${id}`, {
        method: 'PUT',
        headers: {
          'x-auth-token': token,
        },
        body: formData,
      });

      if (response.ok) {
        console.log('Image updated successfully!');
        alert('Image updated successfully!')
        window.location.href = "/view_complaint_user";
      } else {
        console.error('Failed to update image:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating image:', error.message);
    }
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
            <h6 className="user-name mb-1">Complaint - Update status</h6>
         
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
            <h6>Update Status</h6>
          </div>
        {/* Form Scrip Start*/}
        <div className="profile-wrapper-area py-3">
          <div className="card user-data-card">
            <div className="card-body">
              <form onSubmit={handleUpdateComplaint} >
              <div className="mb-3">
                  
<div className="mb-3">
          <div className="title mb-2"><span>Upload Image</span></div>
          <input
            className="form-control"
            name="image"
            id="image"
            type="file"
            onChange={handleImageChange}
          />
        </div>
                </div>
            
  
                <button  className="btn btn-success w-100"  type="submit">Save</button>
              </form>
            </div>
          </div>
        </div>
        {/* Form Scrip End
        */}



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

export default PhotoUser