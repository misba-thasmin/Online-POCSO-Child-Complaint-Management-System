import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./css/bootstrap.min.css";
import "./css/font-awesome.min.css";
import "./css/lineicons.min.css";
import "./css/style.css";

const CourtRegister = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', courtName: '', district: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
     setFormData({ ...formData, [e.target.name]: e.target.value });
     setError('');
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/api/v1/court_auth/register', formData);
      if (response.status === 201) {
          setSuccessMsg('Registration successful! Redirecting to login...');
          setTimeout(() => navigate('/court_auth'), 2000);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed.');
    }
  };

  React.useEffect(() => {
    document.body.style.backgroundColor = '#f8fafc';
    return () => { document.body.style.backgroundColor = ''; }
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
      <title>Court Staff Registration - Child Safety Portal</title>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-8 col-xl-7">
            <div className="card border-0 shadow-lg rounded-4 overflow-hidden" style={{ backgroundColor: '#ffffff' }}>
              <div className="card-body p-5">
                
                {/* Logo & Header */}
                <div className="text-center mb-4">
                  <div className="d-inline-flex justify-content-center align-items-center bg-info bg-opacity-10 text-info rounded-circle mb-3" style={{ width: '60px', height: '60px' }}>
                    <i className="fa fa-user-plus fa-2x"></i>
                  </div>
                  <h3 className="fw-bold text-dark" style={{ letterSpacing: '-0.5px' }}>Staff Registration</h3>
                  <p className="text-muted small">Create a court staff account to access the legal dashboard.</p>
                </div>
                
                {error && <div className="alert alert-danger py-2 small"><i className="fa fa-exclamation-circle me-1"></i>{error}</div>}
                {successMsg && <div className="alert alert-success py-2 small"><i className="fa fa-check-circle me-1"></i>{successMsg}</div>}
                
                <form onSubmit={handleRegister}>
                  <div className="row g-3 mb-4">
                     {/* Full Name */}
                     <div className="col-md-6">
                        <label className="form-label fw-semibold text-secondary small mb-1">Full Name</label>
                        <div className="input-group">
                           <span className="input-group-text bg-light border-end-0 text-info" style={{ borderRadius: '12px 0 0 12px' }}><i className="fa fa-user-o"></i></span>
                           <input type="text" name="name" className="form-control bg-light border-start-0 ps-0 form-control-lg" style={{ borderRadius: '0 12px 12px 0', fontSize: '15px' }} value={formData.name} onChange={handleChange} placeholder="John Doe" required />
                        </div>
                     </div>

                     {/* Court Name */}
                     <div className="col-md-6">
                        <label className="form-label fw-semibold text-secondary small mb-1">Court Name</label>
                        <div className="input-group">
                           <span className="input-group-text bg-light border-end-0 text-info" style={{ borderRadius: '12px 0 0 12px' }}><i className="fa fa-university"></i></span>
                           <input type="text" name="courtName" className="form-control bg-light border-start-0 ps-0 form-control-lg" style={{ borderRadius: '0 12px 12px 0', fontSize: '15px' }} value={formData.courtName} onChange={handleChange} placeholder="District Court, Division" required />
                        </div>
                     </div>

                     {/* District */}
                     <div className="col-md-6">
                        <label className="form-label fw-semibold text-secondary small mb-1">District</label>
                        <div className="input-group">
                           <span className="input-group-text bg-light border-end-0 text-info" style={{ borderRadius: '12px 0 0 12px' }}><i className="fa fa-map-marker"></i></span>
                           <input type="text" name="district" className="form-control bg-light border-start-0 ps-0 form-control-lg" style={{ borderRadius: '0 12px 12px 0', fontSize: '15px' }} value={formData.district} onChange={handleChange} placeholder="Jurisdiction District" required />
                        </div>
                     </div>

                     {/* Email */}
                     <div className="col-md-6">
                        <label className="form-label fw-semibold text-secondary small mb-1">Official Email Address</label>
                        <div className="input-group">
                           <span className="input-group-text bg-light border-end-0 text-info" style={{ borderRadius: '12px 0 0 12px' }}><i className="fa fa-envelope-o"></i></span>
                           <input type="email" name="email" className="form-control bg-light border-start-0 ps-0 form-control-lg" style={{ borderRadius: '0 12px 12px 0', fontSize: '15px' }} value={formData.email} onChange={handleChange} placeholder="officer@court.gov" required />
                        </div>
                     </div>

                     {/* Password */}
                     <div className="col-md-12">
                        <label className="form-label fw-semibold text-secondary small mb-1">Secure Password</label>
                        <div className="input-group">
                           <span className="input-group-text bg-light border-end-0 text-info" style={{ borderRadius: '12px 0 0 12px' }}><i className="fa fa-lock"></i></span>
                           <input type={showPassword ? "text" : "password"} name="password" className="form-control bg-light border-start-0 border-end-0 ps-0 form-control-lg" style={{ fontSize: '15px' }} value={formData.password} onChange={handleChange} placeholder="••••••••" required />
                           <button type="button" className="input-group-text bg-light border-start-0 text-muted" onClick={togglePasswordVisibility} style={{ borderRadius: '0 12px 12px 0', cursor: 'pointer' }}>
                              <i className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                           </button>
                        </div>
                     </div>
                  </div>

                  <button type="submit" className="btn btn-info btn-lg w-100 mb-4 hover-lift shadow-sm text-white" style={{ borderRadius: '12px', fontWeight: 'bold', padding: '12px' }}>
                    Register Account
                  </button>
                </form>

                <div className="text-center mt-3 border-top pt-4">
                  <span className="text-muted small">
                    Already registered? <Link to="/court_auth" className="text-info fw-bold text-decoration-none ms-1">Sign In</Link>
                  </span>
                </div>
              </div>
            </div>
            
            <div className="text-center mt-4">
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
export default CourtRegister;
