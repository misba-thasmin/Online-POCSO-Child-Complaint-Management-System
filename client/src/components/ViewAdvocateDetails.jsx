import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./css/bootstrap.min.css";
import "./css/font-awesome.min.css";
import "./css/lineicons.min.css";
import "./css/style.css";
import "./css/Landing.css";
import imgSmall from "./img/core-img/logo-small.png";
import imgBg from "./img/bg-img/9.png";
import Logout from './Logout.jsx';
import Title from './Title.jsx';

const ViewAdvocateDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [advocate, setAdvocate] = useState(null);
    const [ratings, setRatings] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [totalReviews, setTotalReviews] = useState(0);
    const [loading, setLoading] = useState(true);

    const [showRequestModal, setShowRequestModal] = useState(false);
    const [requestDesc, setRequestDesc] = useState('');
    
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [ratingVal, setRatingVal] = useState(5);
    const [feedbackTxt, setFeedbackTxt] = useState('');

    useEffect(() => {
        document.body.style.backgroundColor = '#f8fafc';
        fetchAdvocateDetails();
        fetchRatings();
        return () => {
            document.body.style.backgroundColor = '';
        }
    }, [id]);

    const fetchAdvocateDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:4000/api/v1/business/${id}`);
            if (response.status === 200) {
                setAdvocate(response.data);
            }
        } catch (error) {
            console.error('Error fetching details:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRatings = async () => {
        try {
            const response = await axios.get(`http://localhost:4000/api/v1/advocateRating/advocate/${id}`);
            if (response.status === 200) {
                setRatings(response.data.ratings);
                setAverageRating(response.data.averageRating);
                setTotalReviews(response.data.totalReviews);
            }
        } catch (error) {
            console.error('Error fetching ratings:', error);
        }
    };

    const handleRequestSubmit = async (e) => {
        e.preventDefault();
        
        let userEmail = null;
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.startsWith('email=')) {
                userEmail = decodeURIComponent(cookie.substring(6));
                break;
            }
        }

        if (!userEmail) {
            alert('Please log in as a citizen to send a request');
            return;
        }

        let userId = null;
        try {
            // We need the user's ID, but we only have their email in the cookie.
            // Let's fetch the user list and find the matching user to get their ID.
            const userRes = await axios.get('http://localhost:4000/api/v1/user');
            const foundUser = userRes.data.find(u => u.email === userEmail);
            if(foundUser) {
                userId = foundUser._id || foundUser.id;
            }
        } catch(err) {
            console.error("Error fetching user id:", err);
        }

        if(!userId) {
            alert("Could not identify user. Please try logging in again.");
            return;
        }

        try {
            const body = {
                userId: userId,
                advocateId: id,
                caseDescription: requestDesc
            };
            const res = await axios.post(`http://localhost:4000/api/v1/advocateRequest/`, body);
            if (res.status === 200 || res.status === 201) {
                alert('Request sent successfully!');
                setShowRequestModal(false);
                setRequestDesc('');
            }
        } catch (err) {
            console.error(err);
            alert('Error sending request. Please try again.');
        }
    };

    const handleRatingSubmit = async (e) => {
        e.preventDefault();

        let userEmail = null;
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.startsWith('email=')) {
                userEmail = decodeURIComponent(cookie.substring(6));
                break;
            }
        }

        if (!userEmail) {
            alert('Please log in as a citizen to submit a rating');
            return;
        }

        let userId = null;
        try {
            const userRes = await axios.get('http://localhost:4000/api/v1/user');
            const foundUser = userRes.data.find(u => u.email === userEmail);
            if(foundUser) {
                userId = foundUser._id || foundUser.id;
            }
        } catch(err) {
            console.error("Error fetching user id:", err);
        }

        if(!userId) {
            alert("Could not identify user. Please try logging in again.");
            return;
        }

        try {
            const body = {
                userId: userId,
                advocateId: id,
                rating: ratingVal,
                feedback: feedbackTxt
            };
            const res = await axios.post(`http://localhost:4000/api/v1/advocateRating/`, body);
            if (res.status === 200 || res.status === 201) {
                alert('Rating submitted successfully!');
                setShowRatingModal(false);
                fetchRatings();
            }
        } catch (err) {
            if (err.response && err.response.status === 400) {
                alert(err.response.data);
            } else {
                console.error(err);
                alert('Error submitting rating. Please try again.');
            }
        }
    };

    if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary" role="status"></div></div>;
    if (!advocate) return <div className="container mt-5 text-center"><h5>Advocate not found</h5></div>;

    const renderStars = (rating) => {
        return [...Array(5)].map((_, index) => (
            <i key={index} className={`fa fa-star ${index < rating ? 'text-warning' : 'text-secondary'}`} style={{ marginRight: '2px' }}></i>
        ));
    };

    return (
        <div className="landing-container pb-5">
            {/* Header */}
            <div className="header-area glass-nav" id="headerArea" style={{ position: 'sticky', top: 0, zIndex: 1000, padding: '1rem' }}>
                <div className="container h-100 d-flex align-items-center justify-content-between">
                    <div className="logo-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <button onClick={() => navigate(-1)} className="btn btn-sm text-dark me-2 d-flex align-items-center justify-content-center shadow-sm" style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.7)', border: '1px solid rgba(0,0,0,0.1)' }}>
                            <i className="fa fa-arrow-left"></i>
                        </button>
                        <span className="brand-text fw-bold">Advocate Profile</span>
                    </div>
                </div>
            </div>

            <div className="container mt-4" style={{ maxWidth: '800px' }}>
                {/* Main Profile Card */}
                <div className="card shadow-sm border-0 mb-4" style={{ borderRadius: '16px', overflow: 'hidden' }}>
                    {/* Cover Photo Area */}
                    <div style={{ height: '150px', background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)', position: 'relative' }}>
                        {/* Decorative elements in the cover */}
                        <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '150px', height: '150px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', zIndex: 1 }}></div>
                        <div style={{ position: 'absolute', bottom: '-40px', left: '20%', width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', zIndex: 1 }}></div>
                    </div>
                    
                    <div className="card-body p-4 p-md-5 pt-0 position-relative" style={{ zIndex: 2 }}>
                        <div className="row">
                            <div className="col-12 col-md-4 text-center mb-4 mb-md-0" style={{ marginTop: '-60px' }}>
                                {/* Avatar overlapping the cover */}
                                <div className="mx-auto shadow bg-white" style={{ width: '140px', height: '140px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '5px solid #ffffff' }}>
                                    <div style={{ width: '100%', height: '100%', borderRadius: '50%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <i className="fa fa-user-circle" style={{ fontSize: '70px', color: '#94a3b8' }}></i>
                                    </div>
                                </div>
                                <h3 className="mt-3 fw-bold text-dark">{advocate.name}</h3>
                                <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 rounded-pill px-3 py-2 fw-semibold mb-3">
                                    <i className="fa fa-briefcase me-2"></i>{advocate.service}
                                </span>
                                
                                <div className="mt-2 p-3 bg-light rounded-3" style={{ border: '1px solid rgba(0,0,0,0.05)' }}>
                                    <div className="d-flex justify-content-center align-items-center mb-1">
                                        <h2 className="mb-0 me-2 text-warning fw-bold">{averageRating || "0.0"}</h2>
                                        <div style={{ fontSize: '1.2rem' }}>{renderStars(Math.round(averageRating || 0))}</div>
                                    </div>
                                    <small className="text-secondary fw-medium">Based on {totalReviews} Reviews</small>
                                </div>
                            </div>

                            <div className="col-12 col-md-8 pt-md-4">
                                <h5 className="text-secondary fw-bold mb-3 pb-2" style={{ borderBottom: '2px solid #f1f5f9' }}>
                                    <i className="fa fa-info-circle me-2 text-primary"></i>Profile Details
                                </h5>
                                <div className="row g-3">
                                    <div className="col-12 col-sm-6">
                                        <div className="d-flex align-items-center">
                                            <div className="me-3 text-center" style={{width: '25px'}}><i className="fa fa-phone text-success"></i></div>
                                            <div>
                                                <small className="text-muted d-block" style={{fontSize: '0.75rem'}}>Phone</small>
                                                <strong>{advocate.mobile}</strong>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 col-sm-6">
                                        <div className="d-flex align-items-center">
                                            <div className="me-3 text-center" style={{width: '25px'}}><i className="fa fa-envelope text-primary"></i></div>
                                            <div>
                                                <small className="text-muted d-block" style={{fontSize: '0.75rem'}}>Email</small>
                                                <strong>{advocate.advocateemail}</strong>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="d-flex align-items-start">
                                            <div className="me-3 text-center" style={{width: '25px'}}><i className="fa fa-map-marker text-danger"></i></div>
                                            <div>
                                                <small className="text-muted d-block" style={{fontSize: '0.75rem'}}>Address</small>
                                                <strong>{advocate.address}, {advocate.locality}, {advocate.city}</strong>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 col-sm-6">
                                        <div className="d-flex align-items-center">
                                            <div className="me-3 text-center" style={{width: '25px'}}><i className="fa fa-clock-o text-warning"></i></div>
                                            <div>
                                                <small className="text-muted d-block" style={{fontSize: '0.75rem'}}>Availability</small>
                                                <strong>{advocate.available}</strong>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 col-sm-6">
                                        <div className="d-flex align-items-center">
                                            <div className="me-3 text-center" style={{width: '25px'}}><i className="fa fa-certificate text-info"></i></div>
                                            <div>
                                                <small className="text-muted d-block" style={{fontSize: '0.75rem'}}>Bar Council Number</small>
                                                <strong>{advocate.barCouncilNumber || 'Not specified'}</strong>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 d-flex gap-2 flex-wrap" style={{ borderTop: '2px solid #f1f5f9' }}>
                                    <button className="btn btn-primary px-4 py-2 fw-bold shadow-sm d-flex align-items-center" style={{ borderRadius: '10px' }} onClick={() => setShowRequestModal(true)}>
                                        <i className="fa fa-paper-plane me-2"></i>Request Help
                                    </button>
                                    <a href={`tel:${advocate.mobile}`} className="btn btn-outline-success px-4 py-2 fw-bold d-flex align-items-center" style={{ borderRadius: '10px' }}>
                                        <i className="fa fa-phone me-2"></i>Call
                                    </a>
                                    <a target="_blank" rel="noopener noreferrer" href={`https://maps.google.com/?q=${advocate.lat},${advocate.long}`} className="btn btn-outline-danger px-4 py-2 fw-bold d-flex align-items-center" style={{ borderRadius: '10px' }}>
                                        <i className="fa fa-map-o me-2"></i>Map
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Statistics Card */}
                <div className="row g-3 mb-4">
                    <div className="col-md-3 col-6">
                        <div className="card shadow-sm border-0 h-100 text-center py-4 px-2" style={{ borderRadius: '16px', background: 'linear-gradient(145deg, #ffffff, #f8fafc)' }}>
                            <div className="d-inline-flex align-items-center justify-content-center mb-3 text-primary bg-primary bg-opacity-10" style={{ width: '50px', height: '50px', borderRadius: '50%' }}>
                                <i className="fa fa-star fa-lg"></i>
                            </div>
                            <h2 className="fw-bolder mb-1 text-dark" style={{ letterSpacing: '-0.5px' }}>{advocate.experience || 0}</h2>
                            <small className="text-secondary fw-semibold text-uppercase" style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}>Years Exp.</small>
                        </div>
                    </div>
                    <div className="col-md-3 col-6">
                        <div className="card shadow-sm border-0 h-100 text-center py-4 px-2" style={{ borderRadius: '16px', background: 'linear-gradient(145deg, #ffffff, #f8fafc)' }}>
                            <div className="d-inline-flex align-items-center justify-content-center mb-3 text-success bg-success bg-opacity-10" style={{ width: '50px', height: '50px', borderRadius: '50%' }}>
                                <i className="fa fa-folder fa-lg"></i>
                            </div>
                            <h2 className="fw-bolder mb-1 text-dark" style={{ letterSpacing: '-0.5px' }}>{advocate.totalCasesHandled || 0}</h2>
                            <small className="text-secondary fw-semibold text-uppercase" style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}>Total Cases</small>
                        </div>
                    </div>
                    <div className="col-md-3 col-6">
                        <div className="card shadow-sm border-0 h-100 text-center py-4 px-2" style={{ borderRadius: '16px', background: 'linear-gradient(145deg, #ffffff, #f8fafc)' }}>
                            <div className="d-inline-flex align-items-center justify-content-center mb-3 text-info bg-info bg-opacity-10" style={{ width: '50px', height: '50px', borderRadius: '50%' }}>
                                <i className="fa fa-check-square-o fa-lg"></i>
                            </div>
                            <h2 className="fw-bolder mb-1 text-dark" style={{ letterSpacing: '-0.5px' }}>{advocate.completedCases || 0}</h2>
                            <small className="text-secondary fw-semibold text-uppercase" style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}>Completed</small>
                        </div>
                    </div>
                    <div className="col-md-3 col-6">
                        <div className="card shadow-sm border-0 h-100 text-center py-4 px-2" style={{ borderRadius: '16px', background: 'linear-gradient(145deg, #ffffff, #f8fafc)' }}>
                            <div className="d-inline-flex align-items-center justify-content-center mb-3 text-warning bg-warning bg-opacity-10" style={{ width: '50px', height: '50px', borderRadius: '50%' }}>
                                <i className="fa fa-trophy fa-lg"></i>
                            </div>
                            <h2 className="fw-bolder mb-1 text-dark" style={{ letterSpacing: '-0.5px' }}>{advocate.successRate || '0%'}</h2>
                            <small className="text-secondary fw-semibold text-uppercase" style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}>Success Rate</small>
                        </div>
                    </div>
                </div>

                {/* Rating & Reviews Section */}
                <div className="card shadow-sm border-0 mb-4" style={{ borderRadius: '16px' }}>
                    <div className="card-body p-4">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h5 className="fw-bold mb-0"><i className="fa fa-comments-o me-2"></i>Client Reviews</h5>
                            <button className="btn btn-sm btn-outline-primary shadow-sm" onClick={() => setShowRatingModal(true)}>
                                <i className="fa fa-star me-1"></i> Write a Review
                            </button>
                        </div>
                        
                        {ratings.length > 0 ? (
                            <div className="list-group list-group-flush">
                                {ratings.map((rev) => (
                                    <div key={rev._id} className="list-group-item px-0 py-3 border-bottom">
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                            <strong>{rev.userId?.name || 'User'}</strong>
                                            <span className="text-muted small">{new Date(rev.dateSubmitted).toLocaleDateString()}</span>
                                        </div>
                                        <div className="mb-2">{renderStars(rev.rating)}</div>
                                        <p className="mb-0 text-secondary">{rev.feedback}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-4 bg-light rounded">
                                <i className="fa fa-commenting-o fa-2x text-muted mb-2"></i>
                                <p className="mb-0 text-muted">No reviews yet. Be the first to share your experience!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Request Modal */}
            {showRequestModal && (
                <>
                    <div className="modal-backdrop fade show"></div>
                    <div className="modal fade show d-block" tabIndex="-1">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content border-0 shadow-lg" style={{borderRadius: '16px'}}>
                                <div className="modal-header border-0 pb-0">
                                    <h5 className="modal-title fw-bold">Request Legal Help</h5>
                                    <button type="button" className="btn-close" onClick={() => setShowRequestModal(false)}></button>
                                </div>
                                <div className="modal-body">
                                    <p className="text-muted small">Please describe your issue briefly. The advocate will contact you for further details.</p>
                                    <form onSubmit={handleRequestSubmit}>
                                        <div className="mb-3">
                                            <label className="form-label fw-bold">Case Details / Request</label>
                                            <textarea className="form-control bg-light border-0" rows="4" style={{borderRadius: '10px'}} value={requestDesc} onChange={(e) => setRequestDesc(e.target.value)} placeholder="E.g., I need assistance with a child protection case..." required></textarea>
                                        </div>
                                        <button type="submit" className="btn btn-primary w-100 py-2 fw-bold" style={{borderRadius: '10px'}}>Send Request</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Rating Modal */}
            {showRatingModal && (
                <>
                    <div className="modal-backdrop fade show"></div>
                    <div className="modal fade show d-block" tabIndex="-1">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content border-0 shadow-lg" style={{borderRadius: '16px'}}>
                                <div className="modal-header border-0 pb-0">
                                    <h5 className="modal-title fw-bold">Rate this Advocate</h5>
                                    <button type="button" className="btn-close" onClick={() => setShowRatingModal(false)}></button>
                                </div>
                                <div className="modal-body">
                                    <form onSubmit={handleRatingSubmit}>
                                        <div className="mb-3 text-center">
                                            <label className="form-label fw-bold d-block mb-3">Your Rating ({ratingVal}/5)</label>
                                            <div className="d-flex justify-content-center gap-2">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <i key={star} className={`fa fa-star fa-2x cursor-pointer ${star <= ratingVal ? 'text-warning' : 'text-secondary'}`} style={{cursor: 'pointer', transition: 'all 0.2s'}} onMouseEnter={() => setRatingVal(star)} onClick={() => setRatingVal(star)}></i>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="mb-4">
                                            <label className="form-label fw-bold">Feedback</label>
                                            <textarea className="form-control bg-light border-0" rows="3" style={{borderRadius: '10px'}} value={feedbackTxt} onChange={(e) => setFeedbackTxt(e.target.value)} placeholder="Share details of your experience..." required></textarea>
                                        </div>
                                        <button type="submit" className="btn btn-success w-100 py-2 fw-bold" style={{borderRadius: '10px'}}>Submit Review</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
            
            {/* Footer Navigation Area - Optional here but good for consistency */}
        </div>
    );
};

export default ViewAdvocateDetails;
