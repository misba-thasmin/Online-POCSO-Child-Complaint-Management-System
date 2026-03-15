import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import "./css/Landing.css";
import imgSmall from "./img/core-img/logo-small.png";

const Index = () => {
  // Add background color for light mode directly to body
  useEffect(() => {
    document.body.style.backgroundColor = '#f8fafc';
    return () => {
      document.body.style.backgroundColor = ''; // Reset on unmount
    }
  }, []);

  return (
    <div className="landing-container">
      {/* Navigation Bar */}
      <nav className="glass-nav">
        <div className="brand-section">
          <img src={imgSmall} alt="Logo" className="brand-logo" />
          <h1 className="brand-text">Child Safety Portal</h1>
        </div>
        <div className="nav-links">
          {/* Add secondary links here if needed */}
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero-wrapper">
        <h1 className="hero-title">
          Online POCSO Child <br /><span>Complaint Management</span> System
        </h1>
        <p className="hero-subtitle">
          A secure, anonymous, and fast platform dedicated to protecting children. Report incidents securely and track them with the help of designated officers, advocates, and administrators.
        </p>
      </header>

      {/* Main Portals Grid */}
      <main className="portals-grid">
        {/* User Portal */}
        <Link to="/user_auth" className="portal-card">
          <div className="portal-icon user-icon">
            <i className="fa fa-user"></i>
          </div>
          <h2 className="portal-title">Citizen Portal</h2>
          <p className="portal-desc">Report incidents anonymously, track your complaints, and communicate securely.</p>
          <div className="portal-btn btn-primary-glass">Access Portal</div>
        </Link>

        {/* Officer Portal */}
        <Link to="/officer_login" className="portal-card">
          <div className="portal-icon officer-icon">
            <i className="fa fa-shield"></i>
          </div>
          <h2 className="portal-title">Officer Portal</h2>
          <p className="portal-desc">Investigate reports, update statuses, and manage critical information.</p>
          <div className="portal-btn btn-warning-glass">Access Portal</div>
        </Link>

        {/* Advocate Portal */}
        <Link to="/advocate_auth" className="portal-card">
          <div className="portal-icon advocate-icon">
            <i className="fa fa-balance-scale"></i>
          </div>
          <h2 className="portal-title">Advocate Portal</h2>
          <p className="portal-desc">Provide legal assistance and follow up on cases for justice.</p>
          <div className="portal-btn btn-success-glass">Access Portal</div>
        </Link>

        {/* Admin Portal */}
        <Link to="/admin_login" className="portal-card">
          <div className="portal-icon admin-icon">
            <i className="fa fa-cog"></i>
          </div>
          <h2 className="portal-title">Admin Portal</h2>
          <p className="portal-desc">Oversee system operations, manage users, and review analytics.</p>
          <div className="portal-btn btn-danger-glass">Access Portal</div>
        </Link>

        {/* Court Portal */}
        <Link to="/court_auth" className="portal-card">
          <div className="portal-icon" style={{ color: '#0ea5e9' }}>
            <i className="fa fa-university"></i>
          </div>
          <h2 className="portal-title">Court Staff Portal</h2>
          <p className="portal-desc">Manage post-investigation cases, hearings, and judgments.</p>
          <div className="portal-btn" style={{ background: 'rgba(14, 165, 233, 0.1)', color: '#38bdf8', border: '1px solid rgba(14, 165, 233, 0.3)' }}>Access Portal</div>
        </Link>

        {/* AI Assistant Portal */}
        <Link to="/ai_assistant" className="portal-card">
          <div className="portal-icon" style={{ color: '#a855f7' }}>
            <i className="fa fa-robot"></i>
          </div>
          <h2 className="portal-title">AI Legal Assistant</h2>
          <p className="portal-desc">Ask questions instantly and get structured advice on crimes and legal sections.</p>
          <div className="portal-btn" style={{ background: 'rgba(168, 85, 247, 0.1)', color: '#c084fc', border: '1px solid rgba(168, 85, 247, 0.3)' }}>Ask AI</div>
        </Link>
      </main>

      {/* Features Overview */}
      <section className="features-container">
        <div className="feature-item">
          <i className="fa fa-lock"></i>
          <span>Secure & Confidential</span>
        </div>
        <div className="feature-item">
          <i className="fa fa-bolt"></i>
          <span>Rapid Response</span>
        </div>
        <div className="feature-item">
          <i className="fa fa-gavel"></i>
          <span>Legal Support</span>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p>&copy; {new Date().getFullYear()} Online Complaint Registration Management System. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default Index;
