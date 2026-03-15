import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import "./css/bootstrap.min.css";
import "./css/font-awesome.min.css";
import "./css/lineicons.min.css";
import "./css/style.css";
import imgfolder from "./img/core-img/logo-small.png";

const UserRegister = () => {
    const [userData, setUserData] = useState({
        name: '', email: '', passwordHash: '', phone: '', city: '', question1: '', question2: '',
    });
    const [validationErrors, setValidationErrors] = useState({});
    const [existingEmails, setExistingEmails] = useState([]);

    useEffect(() => {
        document.body.style.backgroundColor = '#f8fafc';
        return () => { document.body.style.backgroundColor = ''; }
    }, []);

    useEffect(() => {
        const fetchExistingEmails = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/v1/user/');
                setExistingEmails(response.data.map(user => user.email));
            } catch (error) {
                console.error('Error fetching existing emails:', error);
            }
        };
        fetchExistingEmails();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
        setValidationErrors({ ...validationErrors, [name]: '' });
    };

    const validateForm = () => {
        let isValid = true;
        const errors = {};
        if (!/^\d{10}$/.test(userData.phone)) {
            errors.phone = 'Phone must be a valid 10-digit number.';
            isValid = false;
        }
        if (!/(?=.*\d)(?=.*[A-Z])(?=.*[!@#$%^&*()_+])(?=.{8,})/.test(userData.passwordHash)) {
            errors.passwordHash = 'Password needs 1 upper, 1 digit, 1 special char, 8+ length.';
            isValid = false;
        }
        if (existingEmails.includes(userData.email.toLowerCase())) {
            errors.email = 'Email already exists. Try logging in.';
            isValid = false;
        }
        setValidationErrors(errors);
        return isValid;
    };

    const handleActualSubmit = async () => {
        try {
            // Send to /api/v1/user/ where the auth logic expects it, just like the Advocate
            const payload = { ...userData };
            const response = await fetch('http://localhost:4000/api/v1/user/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (response.ok) {
                alert('Account Created Successfully! You can now log in.');
                window.location.href = "/user_auth";
            } else {
                alert('Registration Failed. Please check the fields and try again.');
            }
        } catch (error) {
            console.error('Error submitting form data:', error.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) { handleActualSubmit(); }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1rem' }}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-10 col-lg-8 col-xl-7">
                        {/* Registration Card */}
                        <div className="card border-0 shadow-lg rounded-4 overflow-hidden" style={{ backgroundColor: '#ffffff' }}>
                            <div className="card-body p-sm-5 p-4">
                                
                                <div className="text-center mb-5 border-bottom pb-4">
                                    <img src={imgfolder} alt="Logo" style={{ height: '40px', marginBottom: '1rem' }} />
                                    <h3 className="fw-bold text-dark mb-1">Join the Citizen Portal</h3>
                                    <p className="text-muted small mb-0">Securely report incidents and receive updates.</p>
                                </div>

                                <form onSubmit={handleSubmit}>
                                    <div className="row g-4">
                                        <div className="col-md-6">
                                            <label className="form-label fw-semibold text-secondary small mb-1">Full Name</label>
                                            <div className="input-group">
                                                <span className="input-group-text bg-light border-end-0 text-muted"><i className="fa fa-user"></i></span>
                                                <input type="text" name="name" className="form-control bg-light border-start-0 ps-0 form-control-lg" style={{ fontSize: '15px' }} value={userData.name} onChange={handleChange} placeholder="John Doe" required />
                                            </div>
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label fw-semibold text-secondary small mb-1">Email Address</label>
                                            <div className="input-group">
                                                <span className="input-group-text bg-light border-end-0 text-muted"><i className="fa fa-envelope"></i></span>
                                                <input type="email" name="email" className={`form-control bg-light border-start-0 ps-0 form-control-lg ${validationErrors.email ? 'is-invalid' : ''}`} style={{ fontSize: '15px' }} value={userData.email} onChange={handleChange} placeholder="citizen@example.com" required />
                                            </div>
                                            {validationErrors.email && <div className="text-danger small mt-1"><i className="fa fa-exclamation-circle"></i> {validationErrors.email}</div>}
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label fw-semibold text-secondary small mb-1">Secure Password</label>
                                            <div className="input-group">
                                                <span className="input-group-text bg-light border-end-0 text-muted"><i className="fa fa-lock"></i></span>
                                                <input type="password" name="passwordHash" className={`form-control bg-light border-start-0 ps-0 form-control-lg ${validationErrors.passwordHash ? 'is-invalid' : ''}`} style={{ fontSize: '15px' }} value={userData.passwordHash} onChange={handleChange} placeholder="Required Strong Password" required />
                                            </div>
                                            {validationErrors.passwordHash ? (
                                                <div className="text-danger small mt-1"><i className="fa fa-exclamation-circle"></i> {validationErrors.passwordHash}</div>
                                            ) : (
                                                <div className="form-text small text-muted"><i className="fa fa-info-circle"></i> Minimum 8 chars, 1 uppercase, 1 symbol, 1 digit.</div>
                                            )}
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label fw-semibold text-secondary small mb-1">Mobile Number</label>
                                            <div className="input-group">
                                                <span className="input-group-text bg-light border-end-0 text-muted"><i className="fa fa-phone"></i></span>
                                                <input type="number" name="phone" className={`form-control bg-light border-start-0 ps-0 form-control-lg ${validationErrors.phone ? 'is-invalid' : ''}`} style={{ fontSize: '15px' }} value={userData.phone} onChange={handleChange} placeholder="10-digit number" required />
                                            </div>
                                            {validationErrors.phone && <div className="text-danger small mt-1"><i className="fa fa-exclamation-circle"></i> {validationErrors.phone}</div>}
                                        </div>

                                        <div className="col-12">
                                            <label className="form-label fw-semibold text-secondary small mb-1">Residential City/Locality</label>
                                            <div className="input-group">
                                                <span className="input-group-text bg-light border-end-0 text-muted"><i className="fa fa-map-marker"></i></span>
                                                <input type="text" name="city" className="form-control bg-light border-start-0 ps-0 form-control-lg" style={{ fontSize: '15px' }} value={userData.city} onChange={handleChange} placeholder="Enter your current city" required />
                                            </div>
                                        </div>

                                        <div className="col-12 mt-4 border-top pt-4">
                                            <h6 className="fw-bold mb-3 text-dark"><i className="fa fa-shield text-success me-2"></i> Security Recovery Questions</h6>
                                        </div>

                                        <div className="col-md-6 border-end-md">
                                            <label className="form-label fw-semibold text-secondary small mb-1">What is your pet animal name?</label>
                                            <input type="text" name="question1" className="form-control bg-light form-control-lg" style={{ fontSize: '15px', borderRadius: '10px' }} value={userData.question1} onChange={handleChange} placeholder="Secret answer 1" required />
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label fw-semibold text-secondary small mb-1">What is your school best friend name?</label>
                                            <input type="text" name="question2" className="form-control bg-light form-control-lg" style={{ fontSize: '15px', borderRadius: '10px' }} value={userData.question2} onChange={handleChange} placeholder="Secret answer 2" required />
                                        </div>
                                    </div>

                                    <div className="mt-5">
                                        <button type="submit" className="btn btn-primary btn-lg w-100 hover-lift shadow-sm" style={{ borderRadius: '12px', fontWeight: 'bold', padding: '14px' }}>
                                            <i className="fa fa-user-plus me-2"></i> Create Citizen Account
                                        </button>
                                    </div>
                                </form>

                                <div className="text-center mt-4">
                                    <span className="text-muted small">
                                        Already have an account? <Link to="/user_auth" className="text-primary fw-bold text-decoration-none ms-1">Sign In</Link>
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Return Hub Link */}
                        <div className="text-center mt-4 pb-4">
                            <Link to="/" className="text-muted text-decoration-none small hover-lift d-inline-block">
                                <i className="fa fa-arrow-left me-1"></i> Back to Main Selection
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserRegister;