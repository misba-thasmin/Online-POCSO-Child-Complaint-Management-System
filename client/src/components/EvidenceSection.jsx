import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EvidenceSection = ({ complaintId, currentUserRole, currentUserId }) => {
  const [evidenceList, setEvidenceList] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (complaintId) {
      fetchEvidence();
    }
  }, [complaintId]);

  const fetchEvidence = async () => {
    try {
      const res = await axios.get(`http://localhost:4000/api/v1/evidence/${complaintId}`);
      if (res.status === 200) {
        setEvidenceList(res.data);
      }
    } catch (error) {
      console.error("Error fetching evidence", error);
    }
  };

  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
    setErrorMsg('');
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (selectedFiles.length === 0) {
      setErrorMsg('Please select files to upload');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('complaintId', complaintId);
    formData.append('uploadedBy', currentUserRole);
    formData.append('uploaderId', currentUserId);
    
    selectedFiles.forEach(file => {
      formData.append('files', file);
    });

    try {
      const res = await axios.post('http://localhost:4000/api/v1/evidence/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (res.status === 201) {
        setSelectedFiles([]);
        document.getElementById('evidenceFileInput').value = '';
        fetchEvidence();
      }
    } catch (error) {
      console.error("Upload error", error);
      setErrorMsg('Error uploading files. Unsupported format or file too large.');
    } finally {
      setIsUploading(false);
    }
  };

  const renderEvidenceIcon = (type) => {
    switch(type) {
      case 'image': return <i className="fa fa-file-image-o text-primary" style={{fontSize: '2rem'}}></i>;
      case 'video': return <i className="fa fa-file-video-o text-danger" style={{fontSize: '2rem'}}></i>;
      case 'document': return <i className="fa fa-file-pdf-o text-success" style={{fontSize: '2rem'}}></i>;
      default: return <i className="fa fa-file-o text-secondary" style={{fontSize: '2rem'}}></i>;
    }
  };

  return (
    <div className="evidence-section mt-4 border rounded-3 p-4 bg-white shadow-sm">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h6 style={{ color: '#8b5cf6', fontWeight: '600', fontSize: '1rem', margin: 0 }}>
          <i className="fa fa-folder-open me-2"></i>Evidence & Documents
        </h6>
        <span className="badge bg-light text-dark border">{evidenceList.length} Files</span>
      </div>

      {/* Upload Form - hide for Court, show for User/Officer/Advocate */}
      {currentUserRole !== 'Court' && currentUserRole !== 'Admin' && (
        <form onSubmit={handleUpload} className="mb-4 p-3 bg-light rounded border border-dashed">
          <label className="form-label fw-bold text-secondary small">Upload New Evidence (Images, Videos, PDFs)</label>
          <div className="d-flex gap-2">
            <input 
              id="evidenceFileInput"
              type="file" 
              className="form-control form-control-sm" 
              multiple 
              accept="image/*,video/*,.pdf" 
              onChange={handleFileChange} 
            />
            <button 
              type="submit" 
              className="btn btn-sm btn-primary px-3" 
              disabled={isUploading}
            >
              {isUploading ? <i className="fa fa-spinner fa-spin"></i> : <i className="fa fa-upload me-1"></i>} Upload
            </button>
          </div>
          {errorMsg && <div className="text-danger small mt-2">{errorMsg}</div>}
          <div className="text-muted small mt-1">Files supported: JPG, PNG, MP4, PDF</div>
        </form>
      )}

      {/* Evidence Grid */}
      <div className="row g-3">
        {evidenceList.length > 0 ? (
          evidenceList.map(ev => (
            <div key={ev._id} className="col-12 col-md-6 col-lg-4">
              <div className="border rounded p-3 d-flex align-items-center h-100 transition-hover" style={{ backgroundColor: '#f8fafc' }}>
                <div className="me-3">
                  {renderEvidenceIcon(ev.fileType)}
                </div>
                <div className="flex-grow-1 overflow-hidden">
                  <div className="text-truncate fw-bold mb-1" style={{ fontSize: '0.85rem' }}>
                    {ev.fileUrl.split('/').pop().split('-').slice(1).join('-') || 'Document'}
                  </div>
                  <div className="d-flex justify-content-between text-muted" style={{ fontSize: '0.7rem' }}>
                    <span>By: {ev.uploadedBy}</span>
                    <span>{new Date(ev.uploadDate).toLocaleDateString()}</span>
                  </div>
                </div>
                <a 
                  href={`http://localhost:4000/${ev.fileUrl.replace(/\\/g, '/')}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn btn-sm btn-outline-secondary ms-2 rounded-circle"
                  style={{ width: '32px', height: '32px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <i className="fa fa-eye"></i>
                </a>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center py-4 text-muted">
            <i className="fa fa-folder-o mb-2" style={{ fontSize: '2rem', opacity: 0.5 }}></i>
            <p className="mb-0 small">No evidence uploaded yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EvidenceSection;
