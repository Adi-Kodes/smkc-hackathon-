import React, { useState, useRef } from 'react';
import { 
  Menu, Camera, CheckCircle2, ChevronRight, Home, CheckSquare, 
  FileText, User, ArrowLeft, MapPin, Clock, Upload, Check, RefreshCw
} from 'lucide-react';
import { Link } from 'react-router-dom';

const MobileApp = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [attendanceMarked, setAttendanceMarked] = useState(true);
  const [uploadedPhotos, setUploadedPhotos] = useState([
    'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=60'
  ]);
  const [toastMessage, setToastMessage] = useState('');
  const fileInputRef = useRef(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handlePhotoUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setUploadedPhotos(prev => [imageUrl, ...prev]);
      showToast('📸 फोटो यशस्वीरित्या जिओ-टॅग करून अपलोड केला!');
    }
  };

  const handleSimulateCamera = () => {
    // Add realistic construction sample photo
    const samplePhotos = [
      'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1590496793929-36417d3117de?w=600&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1541888946425-d0fbb180c5f5?w=600&auto=format&fit=crop&q=60'
    ];
    const randomPhoto = samplePhotos[Math.floor(Math.random() * samplePhotos.length)];
    setUploadedPhotos(prev => [randomPhoto, ...prev]);
    showToast('📸 जिओ-टॅग व वेळेच्या ठशासह नवीन पुरावा जोडला!');
  };

  return (
    <div className="mobile-view-container">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-notification">
          <CheckCircle2 size={18} color="#4ade80" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Mobile Device Frame */}
      <div className="mobile-phone-frame">
        
        {/* Header */}
        <header className="mobile-header">
          <div className="mobile-header-top">
            <Link to="/dashboard" title="डॅशबोर्डवर परत जा" style={{ color: '#ffffff', display: 'flex', alignItems: 'center' }}>
              <ArrowLeft size={22} />
            </Link>
            <div className="mobile-corp-name">सांगली मिरज कुपवाड महानगरपालिका</div>
            <Menu size={22} style={{ cursor: 'pointer' }} />
          </div>
          <h1 className="mobile-logo-title">फिल्ड सेतू</h1>
        </header>

        {/* Scrollable Content */}
        <main className="mobile-body-content">
          
          {/* Card 1: Upload Photo Evidence */}
          <div className="mobile-card">
            <h2 className="mobile-card-title">कामाला पुरावा अपलोड करा (फोटो)</h2>
            
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handlePhotoUpload} 
              accept="image/*" 
              capture="environment" 
              style={{ display: 'none' }} 
            />

            <div 
              onClick={() => {
                if (fileInputRef.current) {
                  fileInputRef.current.click();
                } else {
                  handleSimulateCamera();
                }
              }}
              className="mobile-camera-btn-area"
            >
              <Camera className="mobile-camera-icon" />
              <div className="mobile-camera-text">फोटो घ्या / अपलोड करा</div>
              <span style={{ fontSize: '11px', color: '#2e6b36', marginTop: '4px' }}>
                📍 GPS & Timestamp आपोआप जोडले जाईल
              </span>
            </div>

            {/* Uploaded Photos Preview List */}
            {uploadedPhotos.length > 0 && (
              <div style={{ marginTop: '14px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '8px' }}>
                  अलिकडे अपलोड केलेले पुरावे ({uploadedPhotos.length})
                </span>
                <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                  {uploadedPhotos.map((url, index) => (
                    <div key={index} style={{ position: 'relative', flexShrink: 0 }}>
                      <img 
                        src={url} 
                        alt="Evidence" 
                        style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #d2e7d4' }} 
                      />
                      <span style={{ position: 'absolute', bottom: '2px', right: '2px', backgroundColor: '#2e6b36', color: '#fff', fontSize: '9px', padding: '1px 4px', borderRadius: '4px' }}>
                        ✓ GPS
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Card 2: Today's Attendance Check-in */}
          <div 
            onClick={() => {
              setAttendanceMarked(!attendanceMarked);
              showToast(attendanceMarked ? 'हजेरी रद्द केली' : '✓ जिओ-फेन्स पडताळणीसह हजेरी नोंदवली!');
            }}
            className="mobile-card mobile-attendance-card"
          >
            <div>
              <h2 className="mobile-card-title" style={{ marginBottom: '4px' }}>आजची उपस्थिती</h2>
              {attendanceMarked ? (
                <div className="attendance-status-badge">
                  <CheckCircle2 size={18} fill="#2e6b36" color="#ffffff" />
                  <span>नोंदवली आहे (Geo-Verified)</span>
                </div>
              ) : (
                <div style={{ color: '#e11d48', fontSize: '13px', fontWeight: 700 }}>
                  ○ हजेरी नोंदवा (Click to Geo Check-in)
                </div>
              )}
            </div>
            <ChevronRight size={22} color="#94a3b8" />
          </div>

          {/* Card 3: Ongoing Tasks */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#1e293b' }}>सुरू असलेली कामे</h2>
              <span style={{ fontSize: '11px', color: '#2e6b36', fontWeight: 700 }}>१ नियुक्त काम</span>
            </div>
            
            <div className="mobile-card mobile-task-item">
              <div>
                <h3 className="mobile-task-name">रस्ते दुरुस्ती - गणपती मंदिर जवळ</h3>
                <div className="mobile-task-meta" style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
                  <MapPin size={13} color="#2e6b36" />
                  <span>स्थान: शिवाजी नगर</span>
                </div>
                <div className="mobile-task-meta" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={13} color="#94a3b8" />
                  <span>दिनांक: 15.09.22 10:09 AM</span>
                </div>
              </div>
              <ChevronRight size={22} color="#94a3b8" />
            </div>

            {/* Quick Extension / Delay Request Option */}
            <div style={{ marginTop: '12px', padding: '12px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2ede3', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b' }}>अतिरिक्त वेळ किंवा कामगार हवे आहेत?</div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>विलंब विनंती पाठवा (Delay Request)</div>
              </div>
              <button 
                onClick={() => showToast('विनंती पर्यवेक्षकांकडे पाठवली आहे')}
                style={{ backgroundColor: '#f0fdf4', color: '#2e6b36', border: '1px solid #bbf7d0', padding: '6px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
              >
                विनंती करा
              </button>
            </div>
          </div>
          
        </main>

        {/* Bottom Navigation */}
        <nav className="mobile-bottom-bar">
          <button 
            onClick={() => setActiveTab('home')}
            className={`mobile-nav-item ${activeTab === 'home' ? 'active' : ''}`}
            style={{ background: 'none', border: 'none' }}
          >
            <Home size={22} />
            <span>मुख्यपृष्ठ</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('tasks')}
            className={`mobile-nav-item ${activeTab === 'tasks' ? 'active' : ''}`}
            style={{ background: 'none', border: 'none' }}
          >
            <CheckSquare size={22} />
            <span>माझी कामे</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('reports')}
            className={`mobile-nav-item ${activeTab === 'reports' ? 'active' : ''}`}
            style={{ background: 'none', border: 'none' }}
          >
            <FileText size={22} />
            <span>अहवाल</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('profile')}
            className={`mobile-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
            style={{ background: 'none', border: 'none' }}
          >
            <User size={22} />
            <span>प्रोफाइल</span>
          </button>
        </nav>
        
      </div>
    </div>
  );
};

export default MobileApp;
