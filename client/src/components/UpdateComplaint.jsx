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



const UpdateComplaint = () => {
  const { id } = useParams(); // Use useParams to get route parameters

  //const id = match.params.id;
  //const [complaintData, setComplaintData] = useState({});
  
  const [editedComplaint, setEditedComplaint] = useState({
    useremail:'',
    name:'',
    landmark:'',
    doorno:'',
    place:'',
    location:'',
    complainttype:'',
    complaintlevel:''   
  });
  
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchComplaintDetails = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/v1/complaint/${id}`);
        if (response.ok) {
          const data = await response.json();
          setEditedComplaint({
            useremail: data.useremail  ,
            name: data.name  ,        
            landmark: data.landmark ,
            doorno: data.doorno ,
            place: data.place ,
            location: data.location ,
            complainttype: data.complainttype ,
            complaintlevel: data.complaintlevel
            
          });
        }else {
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

  const handleUpdateComplaint  = async (e) =>  {
    e.preventDefault();
    try {

      // Mobile number validation
      {/*if (!/^\d{10}$/.test(editedComplaint.mobile)) {
        console.error('Mobile number must be a 10-digit number');
        //errors.mobile = 'Phone must be a 10-digit number';
        alert('Mobile number must be a 10-digit number');
        return;
      }*/}

      const response = await fetch(`http://localhost:4000/api/v1/complaint/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
         'x-auth-token': token,
        },
        body: JSON.stringify(editedComplaint),
      });

      if (response.ok) {
        console.log('Complaint details updated successfully!');
        alert("Updated successfully")
        // Add any additional logic you need after a successful update
        window.location.href = "/status_user";

      } else {
        console.error('Not updating complaint details:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating complaint details:', error.message);
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
            <h6 className="user-name mb-1">Complaint Management System</h6>
         
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
            <h6>Edit Complaint details</h6>
          </div>
        {/* Form Scrip Start*/}
        <div className="profile-wrapper-area py-3">
          <div className="card user-data-card">
            <div className="card-body">
              <form onSubmit={handleUpdateComplaint} >
              
              <div className="mb-3">
                  <div className="title mb-2"><span>User Email</span></div>
                  <input className="form-control"
                    name="useremail" id="useremail"
                    value={editedComplaint.useremail}
                    onChange={handleInputChange}    type="text" disabled  />
                </div>
              <div className="mb-3">
                  <div className="title mb-2"><span>Name</span></div>
                  <input className="form-control"
                    name="name" id="name"
                    value={editedComplaint.name}
                    onChange={handleInputChange}    type="text"  />
                </div>

                <div className="mb-3">
                  <div className="title mb-2"><span>Landmark</span></div>
                  <input className="form-control" name="landmark" id="landmark"
                    value={editedComplaint.landmark}
                    onChange={handleInputChange}   type="text"/>
                </div>


            
	  			 <div className="mb-3">
                    <div className="title mb-2"><span>Door no</span></div>
                  <input className="form-control" name="doorno" id="doorno"
                    value={editedComplaint.doorno}
                    onChange={handleInputChange}   type="text"/>
                </div>

	    			
			  	 <div className="mb-3">
                  <div className="title mb-2"><span>Place</span></div>
                  <input className="form-control" name="place" id="place"
                    value={editedComplaint.place}
                    onChange={handleInputChange}  type="text" />
                </div>

                <div className="mb-3">
                  <div className="title mb-2"><span>Choose Location</span></div>
                    <select name="location" id="location"
                    value={editedComplaint.location}
                    onChange={handleInputChange}>
                          <option value="">Location</option>
                          <option value="Kumbakonam">Kumbakonam</option>
                          <option value="Karaikal">Karaikal</option>
                          <option value="Palakkad">Palakkad</option>
                          <option value="Andhra">Andhra</option>
                          <option value="Delhi">Delhi</option>
                          <option value="WeeThanjavurkly">Thanjavur</option>
                          <option value="Banglore">Banglore</option>
							        </select>
                </div><br></br>
            
                <div className="mb-3">
                  <div className="title mb-2"><span>Select Complaint type</span></div>
                    <select name="complainttype" id="complainttype"
                    value={editedComplaint.complainttype}
                    onChange={handleInputChange}>
                          <option value="">Complaint type</option>
                          <option value="StreetLight">Street Light</option>
                          <option value="Pipeleakage">Pipe Leakage</option>
                          <option value="Rainwater">Rain Water</option>
                          <option value="Roadreconstruction">Road Re-construction</option>
                          <option value="Garbage">Garbage</option>
							        </select>
                </div><br></br>        
                
                <div className="mb-3">
                  <div className="title mb-2"><span>Choose Complaint level</span></div>
                    <select name="complaintlevel" id="complaintlevel"
                    value={editedComplaint.complaintlevel}
                    onChange={handleInputChange}>
                          <option value="">Complaint level</option>
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                          
							        </select>
                </div>
                <button  className="btn btn-success w-100"  type="submit">Update</button>
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

export default UpdateComplaint