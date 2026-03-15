import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import "./css/bootstrap.min.css";
import "./css/font-awesome.min.css";
import "./css/lineicons.min.css";
import "./css/style.css";
// We don't need the logo-white.png anymore as we are on a light theme
import imgfolder from "./img/core-img/logo-small.png";

const UserLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cookies, setCookie] = useCookies(['email']);
  const [error, setError] = useState('');

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // User login route should match the schema and backend router in user.js
      const response = await axios.post('http://localhost:4000/api/v1/user/login', {
        email: email,
        password: password,
      });

      if (response.status === 200) {
          localStorage.setItem('token', response.data.token);
          axios.defaults.headers.common['x-auth-token'] = response.data.token;
          
          alert('Login Successful!');
          window.location.href = "user_home";
          setCookie('email', email, { path: '/' , sameSite: 'strict' });
          setError('');
      } else {
        setError('Login failed. Please check your credentials.');
        alert('Login Unsuccessful!');
      }
    } catch (error) {
      console.error('Error during login:', error.message);
      setError('Internal Server Error. Please try again later.');
      alert('Login Unsuccessful!');
    }
  };

  // Set body background for light theme
  React.useEffect(() => {
    document.body.style.backgroundColor = '#f8fafc';
    return () => { document.body.style.backgroundColor = ''; }
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
      <title>Citizen Login - Child Safety Portal</title>
      
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6 col-xl-5">
            {/* Login Card */}
            <div className="card border-0 shadow-lg rounded-4 overflow-hidden" style={{ backgroundColor: '#ffffff' }}>
              
              <div className="card-body p-5">
                {/* Logo & Header */}
                <div className="text-center mb-4">
                  <img src={imgfolder} alt="Logo" style={{ height: '50px', marginBottom: '1rem' }} />
                  <h3 className="fw-bold text-dark" style={{ letterSpacing: '-0.5px' }}>Citizen Portal</h3>
                  <p className="text-muted small">Please sign in to access your dashboard.</p>
                </div>

                {error && <div className="alert alert-danger py-2 small">{error}</div>}

                {/* Form */}
                <form onSubmit={handleLogin}>
                  {/* Email Field */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold text-secondary small mb-1">Email Address</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0 text-muted" style={{ borderRadius: '12px 0 0 12px' }}>
                        <i className="fa fa-envelope"></i>
                      </span>
                      <input 
                        type="email" 
                        name="email" 
                        id="email" 
                        className="form-control bg-light border-start-0 ps-0 form-control-lg" 
                        style={{ borderRadius: '0 12px 12px 0', fontSize: '15px' }}
                        value={email}    
                        onChange={handleEmailChange}  
                        placeholder="citizen@example.com"
                        required
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold text-secondary small mb-1">Password</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0 text-muted" style={{ borderRadius: '12px 0 0 12px' }}>
                        <i className="fa fa-lock"></i>
                      </span>
                      <input 
                        type="password" 
                        name="password" 
                        id="password" 
                        className="form-control bg-light border-start-0 ps-0 form-control-lg" 
                        style={{ borderRadius: '0 12px 12px 0', fontSize: '15px' }}
                        value={password} 
                        onChange={handlePasswordChange} 
                        placeholder="••••••••"
                        required
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button type="submit" className="btn btn-primary btn-lg w-100 mb-4 hover-lift" style={{ borderRadius: '12px', fontWeight: '600', padding: '12px' }}>
                    Sign In to Portal
                  </button>
                </form>

                {/* Footer Links */}
                <div className="text-center mt-3 border-top pt-4">
                  <a className="text-primary text-decoration-none small fw-semibold d-block mb-2" href="reset_password">
                    Forgot your password?
                  </a>
                  <span className="text-muted small">
                    Don't have an account? <Link to="/user_register" className="text-primary fw-bold text-decoration-none ms-1">Register Now</Link>
                  </span>
                </div>

              </div>
            </div>
            
            {/* Return Hub Link */}
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

export default UserLogin;