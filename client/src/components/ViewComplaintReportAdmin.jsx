import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title as ChartTitle, Tooltip as ChartTooltip, Legend } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import "./css/bootstrap.min.css";
import "./css/font-awesome.min.css";
import "./css/lineicons.min.css";
import "./css/style.css";
import "./css/Landing.css";

import imgSmall from "./img/core-img/logo-small.png";
import imgBg from "./img/bg-img/9.png";
import Logout from './Logout.jsx';
import Title from './Title.jsx';

// Register Chart.js components
ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, ChartTitle, ChartTooltip, Legend);

const ViewComplaintReportAdmin = () => {

  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCity, setFilterCity] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  // Unique values for dropdowns
  const [cities, setCities] = useState([]);
  const [types, setTypes] = useState([]);

  useEffect(() => {
    document.body.style.backgroundColor = '#f8fafc';
    return () => { document.body.style.backgroundColor = ''; }
  }, []);

  useEffect(() => {
    const fetchComplaintsData = async () => {
      try {
          // Fetch complaints
          const response = await axios.get(`http://localhost:4000/api/v1/complaint/`);
          if (response.status === 200) {
            const data = response.data;
            setComplaints(data);
            
            // Identify unique filter options
            const unqCities = [...new Set(data.map(item => item.location).filter(Boolean))];
            const unqTypes = [...new Set(data.map(item => item.department).filter(Boolean))];
            setCities(unqCities);
            setTypes(unqTypes);
          }

          // Fetch statistics
          try {
            const statsRes = await axios.get(`http://localhost:4000/api/v1/admin/reports/statistics`);
            if (statsRes.data && statsRes.data.success) {
                setStats(statsRes.data);
            }
          } catch(err) {
            console.error('Stats endpoint error', err);
          }

      } catch (error) {
        console.error('Error fetching complaints:', error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaintsData();
  }, []);

  // Filter and Sort Processing
  let filteredData = complaints.filter((comp) => {
    // 1. Text Search matching
    const matchSearch = Object.values(comp).some((val) => 
        val && val.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
    // 2. Specific Dropdowns
    const matchCity = filterCity === '' || comp.location === filterCity;
    const matchType = filterType === '' || comp.department === filterType;
    const matchStatus = filterStatus === '' || (comp.status && comp.status.toLowerCase() === filterStatus.toLowerCase());

    return matchSearch && matchCity && matchType && matchStatus;
  });

  // Sort
  filteredData = filteredData.sort((a, b) => {
      const dateA = new Date(a.dateCreated).getTime();
      const dateB = new Date(b.dateCreated).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const getStatusBadge = (status) => {
      if (!status) return <span className="badge bg-secondary rounded-pill px-3 py-2 shadow-sm text-capitalize">Unknown</span>;
      const lowered = status.toLowerCase();
      if (lowered === 'pending') return <span className="badge bg-warning text-dark rounded-pill px-3 py-2 shadow-sm text-capitalize border border-warning"><i className="fa fa-clock-o me-1"></i> Pending</span>;
      if (lowered === 'on-progress' || lowered === 'in-progress' || lowered === 'progress') return <span className="badge bg-info text-dark rounded-pill px-3 py-2 shadow-sm text-capitalize border border-info"><i className="fa fa-spinner fa-spin me-1"></i> In Progress</span>;
      if (lowered === 'resolved' || lowered === 'closed') return <span className="badge bg-success rounded-pill px-3 py-2 shadow-sm text-capitalize border border-success"><i className="fa fa-check-circle me-1"></i> Resolved</span>;
      return <span className="badge bg-primary rounded-pill px-3 py-2 shadow-sm text-capitalize">{status}</span>;
  };

  const handlePageChange = (pageNum) => {
    setCurrentPage(pageNum);
  };

  const handleOpenModal = (complaint) => {
    setSelectedComplaint(complaint);
    setShowModal(true);
  };
  
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedComplaint(null);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Master Complaint Ledger Report", 14, 15);
    autoTable(doc, {
        head: [['ID', 'Applicant', 'Department', 'Location', 'Status', 'Date']],
        body: filteredData.map((c, i) => [
            i + 1,
            c.name || 'Anonymous',
            c.department || 'General',
            c.location || 'Unknown',
            c.status || 'Unknown',
            c.dateCreated ? new Date(c.dateCreated).toLocaleDateString() : ''
        ]),
        startY: 20
    });
    doc.save('complaints_report.pdf');
  };

  const exportExcel = () => {
    const wsData = filteredData.map((c, i) => ({
        "ID": i + 1,
        "Applicant": c.name || 'Anonymous',
        "Department": c.department || 'General',
        "Location": c.location || 'Unknown',
        "Status": c.status || 'Unknown',
        "Date": c.dateCreated ? new Date(c.dateCreated).toLocaleDateString() : ''
    }));
    const worksheet = XLSX.utils.json_to_sheet(wsData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Complaints");
    XLSX.writeFile(workbook, "complaints_report.xlsx");
  };

  // Chart Data Configurations
  const defaultColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
  
  const statusChartData = {
      labels: ['Pending', 'In-Progress', 'Resolved/Closed'],
      datasets: [{
          data: stats ? [stats.statusCounts.pending, stats.statusCounts.inProgress, stats.statusCounts.resolved] : [0,0,0],
          backgroundColor: ['#f59e0b', '#3b82f6', '#10b981'],
          borderWidth: 1
      }]
  };

  const catLabels = stats?.categories?.map(c => c._id || 'General') || [];
  const catData = stats?.categories?.map(c => c.count) || [];
  const categoryChartData = {
      labels: catLabels,
      datasets: [{
          label: 'Complaints',
          data: catData,
          backgroundColor: '#8b5cf6'
      }]
  };

  return (
    <div className="landing-container">
      {/* Universal Header Area */}
      <div className="header-area glass-nav" id="headerArea" style={{ position: 'sticky', top: 0, zIndex: 1000, padding: '1rem' }}>
        <div className="container h-100 d-flex align-items-center justify-content-between">
          <div className="logo-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src={imgSmall} alt="" style={{ height: '30px' }} />
            <span className="brand-text" style={{ fontSize: '1.25rem', fontWeight: 700 }}><Title /></span>
          </div>
          <div className="suha-navbar-toggler" data-bs-toggle="offcanvas" data-bs-target="#suhaOffcanvas" aria-controls="suhaOffcanvas" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ backgroundColor: '#2b304d', height: '2px', width: '25px', display: 'block' }}></span>
            <span style={{ backgroundColor: '#2b304d', height: '2px', width: '25px', display: 'block' }}></span>
            <span style={{ backgroundColor: '#2b304d', height: '2px', width: '25px', display: 'block' }}></span>
          </div>
        </div>
      </div>

      {/* Offcanvas Sidebar */}
      <div className="offcanvas offcanvas-start suha-offcanvas-wrap" id="suhaOffcanvas" aria-labelledby="suhaOffcanvasLabel" style={{ backgroundColor: '#ffffff', width: '280px', borderRight: '1px solid #e2e8f0', boxShadow: '4px 0 15px rgba(0,0,0,0.05)' }}>
        <button className="btn-close btn-close-dark text-reset" type="button" data-bs-dismiss="offcanvas" aria-label="Close" style={{ margin: '1.5rem 1rem 0 auto', display: 'block' }}></button>
        <div className="offcanvas-body" style={{ padding: '0 1.5rem 1.5rem 1.5rem' }}>
          <div className="sidenav-profile" style={{ paddingBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', textAlign: 'center', marginBottom: '1rem' }}>
            <div className="user-profile mb-3"><img src={imgBg} alt="Admin Profile" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #eff6ff', padding: '3px' }} /></div>
            <div className="user-info">
              <h6 className="user-name mb-1" style={{ color: '#0f172a', fontWeight: '700' }}>Admin Control Panel</h6>
              <p className="text-muted small mb-0">Complaint Management</p>
            </div>
          </div>
          
          <ul className="sidenav-nav ps-0" style={{ listStyle: 'none' }}>
            <li style={{ marginBottom: '0.25rem' }}>
              <Link to="/admin_home" className="d-flex align-items-center text-secondary nav-item-hover" style={{ textDecoration: 'none', padding: '0.75rem 1rem', borderRadius: '10px', fontWeight: '500', transition: 'all 0.2s ease' }}>
                <i className="fa fa-tachometer me-3" style={{ fontSize: '18px', width: '20px', textAlign: 'center' }}></i> Dashboard
              </Link>
            </li>
            <li style={{ marginBottom: '0.25rem' }}>
               <span className="d-flex align-items-center" style={{ color: '#3b82f6', textDecoration: 'none', padding: '0.75rem 1rem', borderRadius: '10px', backgroundColor: '#eff6ff', fontWeight: '600' }}>
                 <i className="fa fa-file-text-o me-3" style={{ fontSize: '18px', width: '20px', textAlign: 'center' }}></i> All Reports
               </span>
            </li>
            <li style={{ marginTop: 'auto', paddingTop: '100px' }}>
              <div className="d-flex align-items-center text-danger nav-item-hover" style={{ padding: '0.75rem 1rem', borderRadius: '10px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s ease' }}>
                <Logout className="w-100" />
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* Main Page Content */}
      <div className="page-content-wrapper" style={{ minHeight: 'calc(100vh - 140px)', padding: '2.5rem 0 6rem 0' }}>
        <div className="container" style={{ maxWidth: '1400px' }}>
          
          <div className="d-flex flex-wrap align-items-center justify-content-between mb-4 gap-3">
             <div className="d-flex align-items-center">
                 <div className="icon-circle bg-primary text-white d-flex align-items-center justify-content-center me-3 shadow-sm" style={{ width: '50px', height: '50px', borderRadius: '12px' }}>
                    <i className="fa fa-list-alt fs-4"></i>
                 </div>
                 <div>
                    <h3 className="mb-0 fw-bold text-dark" style={{ letterSpacing: '-0.5px' }}>Master Complaint Ledger</h3>
                     <p className="text-muted small mb-0">Total <strong className="text-primary">{filteredData.length}</strong> complaints matched</p>
                 </div>
             </div>
             
             <div className="d-flex gap-2">
                 <button onClick={exportPDF} className="btn btn-outline-danger btn-sm rounded-pill fw-bold shadow-sm" style={{ padding: '0.4rem 1.2rem' }}>
                    <i className="fa fa-file-pdf-o me-2"></i> Export PDF
                 </button>
                 <button onClick={exportExcel} className="btn btn-outline-success btn-sm rounded-pill fw-bold shadow-sm" style={{ padding: '0.4rem 1.2rem' }}>
                    <i className="fa fa-file-excel-o me-2"></i> Export Excel
                 </button>
             </div>
          </div>

          {/* Analytics Dashboard Strip */}
          {stats && (
              <div className="row g-4 mb-4">
                  {/* KPI Cards */}
                  <div className="col-12 col-xl-4 d-flex flex-column gap-3">
                      <div className="card shadow-sm border-0 bg-white" style={{ borderRadius: '16px' }}>
                          <div className="card-body p-4 d-flex align-items-center">
                              <div className="icon-wrapper bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '50px', height: '50px' }}>
                                  <i className="fa fa-folder-open fs-4"></i>
                              </div>
                              <div><h6 className="text-muted small fw-bold mb-1">Total System Complaints</h6><h3 className="mb-0 fw-bold">{stats.totalComplaints}</h3></div>
                          </div>
                      </div>
                      <div className="card shadow-sm border-0 bg-white" style={{ borderRadius: '16px' }}>
                          <div className="card-body p-4 d-flex align-items-center">
                              <div className="icon-wrapper bg-success bg-opacity-10 text-success rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '50px', height: '50px' }}>
                                  <i className="fa fa-check-circle fs-4"></i>
                              </div>
                              <div><h6 className="text-muted small fw-bold mb-1">Total Resolved Cases</h6><h3 className="mb-0 fw-bold">{stats.statusCounts.resolved}</h3></div>
                          </div>
                      </div>
                      <div className="card shadow-sm border-0 bg-white" style={{ borderRadius: '16px' }}>
                          <div className="card-body p-4 d-flex align-items-center">
                              <div className="icon-wrapper bg-warning bg-opacity-10 text-warning rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '50px', height: '50px' }}>
                                  <i className="fa fa-users fs-4"></i>
                              </div>
                              <div><h6 className="text-muted small fw-bold mb-1">Active Advocates</h6><h3 className="mb-0 fw-bold">{stats.totalAdvocates || 0}</h3></div>
                          </div>
                      </div>
                  </div>

                  {/* Charts */}
                  <div className="col-12 col-md-6 col-xl-4">
                      <div className="card shadow-sm border-0 h-100 bg-white" style={{ borderRadius: '16px' }}>
                          <div className="card-body p-4 d-flex flex-column align-items-center justify-content-center">
                              <h6 className="fw-bold text-dark w-100 text-start mb-3">Status Breakdown</h6>
                              <div style={{ height: '220px', width: '100%' }} className="d-flex justify-content-center">
                                  <Doughnut data={statusChartData} options={{ maintainAspectRatio: false }} />
                              </div>
                          </div>
                      </div>
                  </div>
                  <div className="col-12 col-md-6 col-xl-4">
                      <div className="card shadow-sm border-0 h-100 bg-white" style={{ borderRadius: '16px' }}>
                          <div className="card-body p-4 d-flex flex-column align-items-center justify-content-center">
                              <h6 className="fw-bold text-dark w-100 text-start mb-3">Complaints by Department</h6>
                              <div style={{ height: '220px', width: '100%' }}>
                                  <Bar data={categoryChartData} options={{ maintainAspectRatio: false, scales: { y: { beginAtZero: true } }, plugins: { legend: { display: false } } }} />
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          )}

          {/* Superior Filtration Box */}
          <div className="card shadow-sm border-0 mb-4" style={{ borderRadius: '16px', backgroundColor: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(10px)' }}>
            <div className="card-body p-4">
               <div className="row g-3">
                 {/* Search */}
                 <div className="col-12 col-md-4 col-xl-3">
                    <label className="form-label small fw-bold text-muted mb-1">Global Search</label>
                    <div className="input-group drop-shadow-sm">
                       <span className="input-group-text bg-white border-end-0 text-muted"><i className="fa fa-search"></i></span>
                       <input type="text" className="form-control border-start-0 ps-0" placeholder="Search reference, names..." value={searchTerm} onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}} />
                    </div>
                 </div>
                 
                 {/* Filters */}
                 <div className="col-6 col-md-4 col-xl-2">
                    <label className="form-label small fw-bold text-muted mb-1">Status</label>
                    <select className="form-select text-secondary fw-semibold drop-shadow-sm" value={filterStatus} onChange={(e) => {setFilterStatus(e.target.value); setCurrentPage(1);}}>
                      <option value="">All Statuses</option>
                      <option value="pending">Pending</option>
                      <option value="on-progress">In-Progress</option>
                      <option value="resolved">Resolved</option>
                    </select>
                 </div>
                 
                 <div className="col-6 col-md-4 col-xl-2">
                    <label className="form-label small fw-bold text-muted mb-1">City / Region</label>
                    <select className="form-select text-secondary drop-shadow-sm" value={filterCity} onChange={(e) => {setFilterCity(e.target.value); setCurrentPage(1);}}>
                      <option value="">All Regions</option>
                      {cities.map((city, idx) => (
                        <option key={idx} value={city}>{city}</option>
                      ))}
                    </select>
                 </div>

                 <div className="col-6 col-md-4 col-xl-3">
                    <label className="form-label small fw-bold text-muted mb-1">Complaint Type</label>
                    <select className="form-select text-secondary drop-shadow-sm" value={filterType} onChange={(e) => {setFilterType(e.target.value); setCurrentPage(1);}}>
                      <option value="">All Departments</option>
                      {types.map((type, idx) => (
                        <option key={idx} value={type}>{type}</option>
                      ))}
                    </select>
                 </div>

                 {/* Sort */}
                 <div className="col-6 col-md-4 col-xl-2">
                    <label className="form-label small fw-bold text-muted mb-1">Sort By Date</label>
                    <select className="form-select text-secondary drop-shadow-sm" value={sortOrder} onChange={(e) => {setSortOrder(e.target.value); setCurrentPage(1);}}>
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                    </select>
                 </div>

               </div>
            </div>
          </div>

          {/* Unified Data Grid */}
          <div className="card shadow-sm border-0" style={{ borderRadius: '16px', overflow: 'hidden' }}>
             {loading ? (
                <div className="p-5 text-center">
                   <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}></div>
                   <h5 className="text-muted">Loading Complaint Archive...</h5>
                </div>
             ) : currentItems.length === 0 ? (
                <div className="p-5 text-center bg-white">
                   <div className="icon-circle bg-light text-muted mx-auto mb-3" style={{ width: '80px', height: '80px', borderRadius: '50%', fontSize: '2rem' }}><i className="fa fa-inbox"></i></div>
                   <h5 className="text-secondary fw-bold">No Records Found</h5>
                   <p className="text-muted">Try adjusting your search criteria or resetting filters.</p>
                   <button onClick={() => {setSearchTerm(''); setFilterCity(''); setFilterStatus(''); setFilterType('');}} className="btn btn-primary rounded-pill mt-2 px-4 shadow-sm hover-lift">Clear All Filters</button>
                </div>
             ) : (
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0" style={{ backgroundColor: '#fff' }}>
                       <thead className="bg-light" style={{ borderBottom: '2px solid #e2e8f0' }}>
                          <tr>
                             <th className="py-3 px-4 text-uppercase text-secondary small fw-bold" style={{ width: '80px' }}>ID</th>
                             <th className="py-3 text-uppercase text-secondary small fw-bold">Applicant Details</th>
                             <th className="py-3 text-uppercase text-secondary small fw-bold">Department / Type</th>
                             <th className="py-3 text-uppercase text-secondary small fw-bold">Registered On</th>
                             <th className="py-3 text-uppercase text-secondary small fw-bold">Assigned To</th>
                             <th className="py-3 text-uppercase text-secondary small fw-bold text-center">Status</th>
                             <th className="py-3 px-4 text-uppercase text-secondary small fw-bold text-end">Action</th>
                          </tr>
                       </thead>
                       <tbody>
                          {currentItems.map((comp, index) => (
                             <tr key={comp._id} style={{ transition: 'all 0.2s ease', cursor: 'default' }}>
                                <td className="px-4 text-secondary fw-semibold">
                                    #{((currentPage - 1) * itemsPerPage) + index + 1}
                                </td>
                                <td>
                                    <div className="d-flex flex-column">
                                        <span className="fw-bold text-dark">{comp.name || 'Anonymous'}</span>
                                        <span className="text-muted small"><i className="fa fa-map-marker me-1"></i> {comp.location || 'Unknown Origin'}</span>
                                    </div>
                                </td>
                                <td>
                                    <span className="badge bg-light text-dark shadow-sm border px-2 py-1"><i className="fa fa-folder-open-o text-primary me-1"></i> {comp.department || 'General'}</span>
                                </td>
                                <td>
                                    <div className="d-flex flex-column">
                                        <span className="text-dark fw-semibold">{comp.dateCreated ? new Date(comp.dateCreated).toLocaleDateString('en-GB') : 'Unknown'}</span>
                                        <span className="text-muted small"><i className="fa fa-clock-o me-1"></i> {comp.dateCreated ? new Date(comp.dateCreated).toLocaleTimeString('en-GB', { hour: '2-digit', minute:'2-digit' }) : ''}</span>
                                    </div>
                                </td>
                                <td>
                                    {comp.assignedOfficerName ? (
                                        <span className="badge bg-primary bg-opacity-10 text-primary border border-primary px-3 py-2 rounded-pill shadow-sm" style={{ fontSize: '0.8rem' }}><i className="fa fa-user-circle me-1"></i> {comp.assignedOfficerName}</span>
                                    ) : (
                                        <span className="badge bg-light text-secondary border px-3 py-2 rounded-pill shadow-sm" style={{ fontSize: '0.8rem' }}><i className="fa fa-minus-circle me-1"></i> Unassigned</span>
                                    )}
                                </td>
                                <td className="text-center">
                                    {getStatusBadge(comp.status)}
                                </td>
                                <td className="text-end px-4">
                                    <button 
                                      onClick={() => handleOpenModal(comp)}
                                      className="btn btn-outline-primary btn-sm rounded-pill fw-bold hover-lift"
                                      style={{ padding: '0.4rem 1rem' }}
                                    >
                                       <i className="fa fa-eye me-1"></i> View Detail
                                    </button>
                                </td>
                             </tr>
                          ))}
                       </tbody>
                    </table>
                </div>
             )}
              
             {/* Pagination Footer */}
             {totalPages > 1 && (
                <div className="card-footer bg-white p-4 border-top d-flex justify-content-between align-items-center">
                   <div className="text-muted small fw-semibold">
                      Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredData.length)} of {filteredData.length} entries
                   </div>
                   <ul className="pagination pagination-sm rounded mb-0 drop-shadow-sm">
                      <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                         <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}><i className="fa fa-chevron-left"></i></button>
                      </li>
                      {[...Array(totalPages)].map((_, i) => (
                         <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                            <button className="page-link" onClick={() => handlePageChange(i + 1)}>{i + 1}</button>
                         </li>
                      ))}
                      <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                         <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}><i className="fa fa-chevron-right"></i></button>
                      </li>
                   </ul>
                </div>
             )}
          </div>
          
        </div>
      </div>

       {/* Floating Modal For Complaint Full Narrative */}
       <Modal show={showModal} onHide={handleCloseModal} size="lg" centered dialogClassName="custom-modal-fade">
          {selectedComplaint && (
            <div style={{ borderRadius: '20px', overflow: 'hidden' }}>
              <Modal.Header className="bg-primary text-white border-0" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, #2563eb, #3b82f6)' }}>
                  <Modal.Title className="fw-bold">
                     <i className="fa fa-file-text-o me-2"></i> Case Narrative Review
                  </Modal.Title>
                  <button type="button" className="btn-close btn-close-white" aria-label="Close" onClick={handleCloseModal}></button>
              </Modal.Header>
              <Modal.Body className="p-4 bg-light">
                 {/* Metadata Strip */}
                 <div className="d-flex justify-content-between align-items-center bg-white p-3 rounded-3 shadow-sm mb-4 border-start border-4 border-primary">
                    <div>
                       <h6 className="text-muted small text-uppercase mb-1">Applicant Reference</h6>
                       <span className="fs-5 fw-bold text-dark">{selectedComplaint.name || 'Anonymous User'}</span>
                    </div>
                    <div className="text-end">
                       <h6 className="text-muted small text-uppercase mb-1">Declared Status</h6>
                       {getStatusBadge(selectedComplaint.status)}
                    </div>
                 </div>

                 {/* Narrative Text */}
                 <div className="bg-white p-4 pe-5 rounded-3 shadow-sm mb-4 position-relative">
                    <i className="fa fa-quote-left fs-1 text-light position-absolute" style={{ top: '15px', right: '20px', opacity: '0.4' }}></i>
                    <h6 className="fw-bold text-dark border-bottom pb-2 mb-3"><i className="fa fa-bullhorn text-warning me-2"></i>Primary Complaint Discourse</h6>
                    <p className="text-secondary" style={{ lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>
                       {selectedComplaint.writecomplaint || <span className="text-muted fst-italic">No narrative captured.</span>}
                    </p>
                 </div>

                 {/* Administrative Feedbacks */}
                 <div className="row g-3 mb-4">
                    <div className="col-md-4">
                       <div className="bg-white p-3 rounded-3 shadow-sm h-100 border-top border-3 border-danger">
                          <h6 className="small fw-bold text-dark mb-2"><i className="fa fa-question-circle text-danger me-1"></i> Root Reason</h6>
                          <p className="small text-muted mb-0">{selectedComplaint.reason && selectedComplaint.reason !== 'Nil' ? selectedComplaint.reason : 'Pending assessment...'}</p>
                       </div>
                    </div>
                    <div className="col-md-4">
                       <div className="bg-white p-3 rounded-3 shadow-sm h-100 border-top border-3 border-success">
                          <h6 className="small fw-bold text-dark mb-2"><i className="fa fa-medkit text-success me-1"></i> Remedies Applied</h6>
                          <p className="small text-muted mb-0">{selectedComplaint.remedies && selectedComplaint.remedies !== 'Nil' ? selectedComplaint.remedies : 'No remedies documented.'}</p>
                       </div>
                    </div>
                    <div className="col-md-4">
                       <div className="bg-white p-3 rounded-3 shadow-sm h-100 border-top border-3 border-info">
                          <h6 className="small fw-bold text-dark mb-2"><i className="fa fa-sticky-note-o text-info me-1"></i> Additional Notes</h6>
                          <p className="small text-muted mb-0">{selectedComplaint.notes && selectedComplaint.notes !== 'Nil' ? selectedComplaint.notes : 'No extra notes recorded.'}</p>
                       </div>
                    </div>
                 </div>

                 {/* Evidence Proofs Wrapper */}
                 <h6 className="fw-bold text-dark mb-3 ps-1"><i className="fa fa-camera-retro text-secondary me-2"></i> Visual Evidence & Documentation</h6>
                 <div className="d-flex flex-wrap gap-3">
                    {/* User Proof */}
                    {selectedComplaint.image1 ? (
                       <a href={`http://localhost:4000/${selectedComplaint.image1}`} target="_blank" rel="noopener noreferrer" className="d-block shadow-sm rounded-3 overflow-hidden position-relative hover-lift border border-2 border-white" style={{ width: '180px', height: '140px', backgroundColor: '#e2e8f0' }}>
                          <img src={`http://localhost:4000/${selectedComplaint.image1}`} alt="Citizen Proof" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <div className="position-absolute bottom-0 w-100 bg-dark bg-opacity-75 text-white small p-1 text-center" style={{ backdropFilter: 'blur(2px)' }}>User Submission</div>
                       </a>
                    ) : (
                       <div className="d-flex flex-column align-items-center justify-content-center shadow-sm rounded-3 bg-white border border-dashed" style={{ width: '180px', height: '140px' }}>
                          <i className="fa fa-image text-black-50 fs-3 mb-2"></i>
                          <span className="small text-muted">No User Proof</span>
                       </div>
                    )}
                    
                    {/* Resolution Proof */}
                    {selectedComplaint.imagePath ? (
                       <a href={`http://localhost:4000/${selectedComplaint.imagePath}`} target="_blank" rel="noopener noreferrer" className="d-block shadow-sm rounded-3 overflow-hidden position-relative hover-lift border border-2 border-white border-success" style={{ width: '180px', height: '140px', backgroundColor: '#e2e8f0' }}>
                          <img src={`http://localhost:4000/${selectedComplaint.imagePath}`} alt="Resolution Proof" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <div className="position-absolute bottom-0 w-100 bg-success bg-opacity-75 text-white small p-1 text-center" style={{ backdropFilter: 'blur(2px)' }}><i className="fa fa-check-circle me-1"></i> Resolution Proof</div>
                       </a>
                    ) : (
                       <div className="d-flex flex-column align-items-center justify-content-center shadow-sm rounded-3 bg-white border border-dashed" style={{ width: '180px', height: '140px' }}>
                          <i className="fa fa-file-image-o text-black-50 fs-3 mb-2"></i>
                          <span className="small text-muted">No Resolution Proof</span>
                       </div>
                    )}
                 </div>

              </Modal.Body>
              <Modal.Footer className="bg-white border-0 py-3">
                  <Button variant="light" className="px-4 rounded-pill border fw-bold" onClick={handleCloseModal}>Close Record</Button>
              </Modal.Footer>
            </div>
          )}
       </Modal>

      {/* Persistent Footer */}
      <div className="footer-nav-area glass-nav" id="footerNav" style={{ position: 'fixed', bottom: 0, width: '100%', padding: '0 1rem', borderTop: '1px solid rgba(0,0,0,0.05)', height: '60px', zIndex: 900, background: 'rgba(255,255,255,0.95)' }}>
        <div className="container h-100 px-0">
          <ul className="h-100 d-flex align-items-center justify-content-between ps-0 mb-0" style={{ listStyle: 'none' }}>
            <li className="active">
              <Link to="/admin_home" style={{ color: '#3b82f6', textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '12px' }}>
                <i className="lni lni-home" style={{ fontSize: '20px', marginBottom: '2px' }}></i>Home
              </Link>
            </li>
            <li>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#64748b' }}>
                <Logout />
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default ViewComplaintReportAdmin;
