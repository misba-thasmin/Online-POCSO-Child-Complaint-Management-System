import React from 'react';
import './ComplaintTimeline.css';

const stages = [
  'Pending Investigation',
  'Under Investigation',
  'FIR Registered',
  'Court Hearing Scheduled',
  'Resolved / Closed'
];

// Map actual complaint status to an index 0-4
const getStageIndex = (status) => {
    if (!status) return 0; // Default Pending Investigation
    const s = status.toLowerCase();
    if (s.includes('pending')) return 0;
    if (s.includes('under')) return 1;
    if (s.includes('fir')) return 2;
    if (s.includes('court') || s.includes('hearing')) return 3;
    if (s.includes('resolved') || s.includes('closed') || s.includes('rejected')) return 4;
    return 0;
};

const ComplaintTimeline = ({ status }) => {
  const currentIndex = getStageIndex(status);

  return (
    <div className="timeline-container mt-4 mb-4 p-4 bg-white rounded-3 shadow-sm border">
      <h6 className="mb-4" style={{ color: '#3b82f6', fontWeight: '600', fontSize: '1rem' }}>
        <i className="fa fa-tasks me-2"></i>Case Timeline
      </h6>
      <div className="position-relative">
        <div className="progress" style={{ height: '4px', backgroundColor: '#e2e8f0', position: 'absolute', top: '24px', left: '10%', right: '10%', zIndex: 0 }}>
          <div
            className="progress-bar"
            role="progressbar"
            style={{ width: `${(currentIndex / (stages.length - 1)) * 100}%`, backgroundColor: '#3b82f6' }}
            aria-valuenow={(currentIndex / (stages.length - 1)) * 100}
            aria-valuemin="0"
            aria-valuemax="100"
          ></div>
        </div>
        <div className="d-flex justify-content-between position-relative z-index-1">
          {stages.map((stage, index) => {
            const isCompleted = index <= currentIndex;
            const isCurrent = index === currentIndex;
            
            return (
              <div key={index} className="text-center" style={{ width: '20%', position: 'relative', zIndex: 1 }}>
                <div 
                  className={`rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2 ${isCompleted ? 'bg-primary text-white' : 'bg-light text-muted border'}`}
                  style={{ width: '52px', height: '52px', border: isCompleted ? 'none' : '2px solid #e2e8f0', transition: 'all 0.3s ease', boxShadow: isCurrent ? '0 0 0 4px rgba(59, 130, 246, 0.2)' : 'none' }}
                >
                  {isCompleted ? <i className="fa fa-check"></i> : <span style={{fontSize: '0.8rem'}}>{index + 1}</span>}
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: isCurrent ? '600' : '400', color: isCompleted ? '#1e293b' : '#94a3b8', lineHeight: '1.2' }}>
                  {stage}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ComplaintTimeline;
