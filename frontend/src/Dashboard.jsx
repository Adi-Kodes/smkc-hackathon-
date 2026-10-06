import React, { useState, useEffect } from 'react';
import { 
  Menu, Search, Bell, Home, CheckCircle, Users, AlertTriangle, 
  FileText, Settings, Camera, MapPin, Clock, Check, X, Smartphone, 
  ChevronRight, ShieldAlert, CheckCircle2, LogOut
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { API_BASE_URL, SOCKET_BASE_URL } from './config';

const initialTasks = [
  {
    id: '104',
    type: 'रस्ते दुरुस्ती - गणपती मंदिर जवळ',
    location: 'शिवाजी नगर',
    workers: '5 कर्मचारी',
    updatedTime: '15.09.22 10:09 AM',
    status: '75% प्रगती',
    gpsVerified: true,
    coordinates: '16.8524° N, 74.5815° E',
    beforePhoto: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=60',
    duringPhoto: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&auto=format&fit=crop&q=60',
    afterPhoto: 'https://images.unsplash.com/photo-1590496793929-36417d3117de?w=600&auto=format&fit=crop&q=60',
    hasEvidence: true,
    supervisorStatus: 'pending'
  },
  {
    id: '106',
    type: 'रस्ते दुरुस्ती - स्वच्छता',
    location: 'शिवाजी नगर',
    workers: '3 कर्मचारी',
    updatedTime: '15.09.22 10:09 AM',
    status: '75% प्रगती',
    gpsVerified: true,
    coordinates: '16.8540° N, 74.5822° E',
    beforePhoto: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&auto=format&fit=crop&q=60',
    duringPhoto: 'https://images.unsplash.com/photo-1584467735815-f778f274e296?w=600&auto=format&fit=crop&q=60',
    afterPhoto: null,
    hasEvidence: true,
    supervisorStatus: 'approved'
  },
  {
    id: '108',
    type: 'रस्ते दुरुस्ती, विश्रामबाग',
    location: 'विश्रामबाग',
    workers: '3 कर्मचारी',
    updatedTime: '15.09.22 10:09 AM',
    status: '75% प्रगती',
    gpsVerified: false,
    coordinates: '16.8450° N, 74.6010° E',
    beforePhoto: null,
    duringPhoto: null,
    afterPhoto: null,
    hasEvidence: false,
    supervisorStatus: 'exception',
    exceptionReason: 'फोटो पुरावा गहाळ आणि जिओ-फेन्स उल्लंघन संशयित'
  },
  {
    id: '111',
    type: 'रस्ते दुरुस्ती, विश्रामबाग',
    location: 'विश्रामबाग',
    workers: '2 कर्मचारी',
    updatedTime: '15.09.22 10:09 AM',
    status: '75% प्रगती',
    gpsVerified: true,
    coordinates: '16.8432° N, 74.6025° E',
    beforePhoto: 'https://images.unsplash.com/photo-1541888946425-d0fbb180c5f5?w=600&auto=format&fit=crop&q=60',
    duringPhoto: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=60',
    afterPhoto: null,
    hasEvidence: true,
    supervisorStatus: 'pending'
  },
  {
    id: '112',
    type: 'रस्ते दुरुस्ती - गणपती मंदिर जवळ',
    location: 'शिवाजी नगर',
    workers: '5 कर्मचारी',
    updatedTime: '15.09.22 10:09 AM',
    status: '75% प्रगती',
    gpsVerified: false,
    coordinates: '16.8510° N, 74.5800° E',
    beforePhoto: null,
    duringPhoto: null,
    afterPhoto: null,
    hasEvidence: false,
    supervisorStatus: 'pending'
  }
];

const Dashboard = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const [selectedTask, setSelectedTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('home');
  const [toastMessage, setToastMessage] = useState('');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Auth Check
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Socket.io Real-time connection
    const socket = io(SOCKET_BASE_URL);
    
    socket.on('connect', () => {
      console.log('Real-time connected');
    });

    socket.on('taskUpdated', (updatedTask) => {
      // Example of handling real-time update
      showToast(`नवीन अपडेट: काम #${updatedTask.id} मध्ये बदल झाला आहे!`);
    });

    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      setUser(userData);
      
      // Fetch Real Tasks from API
      fetch(`${API_BASE_URL}/api/tasks`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        // If DB has tasks, we would map them here. 
        // For now, if empty, we keep initialTasks so the UI doesn't look blank.
        if (data.tasks && data.tasks.length > 0) {
          // setTasks(data.tasks); 
        }
      })
      .catch(err => console.error("Error fetching tasks:", err));
    } catch (e) {
      navigate('/login');
    }

    // Cleanup socket on unmount
    return () => {
      socket.disconnect();
    };
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleApprove = (taskId) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, supervisorStatus: 'approved' } : t));
    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask({ ...selectedTask, supervisorStatus: 'approved' });
    }
    showToast(`काम ID #${taskId} मंजूर करण्यात आले (Task Approved)`);
  };

  const handleRaiseException = (taskId) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, supervisorStatus: 'exception' } : t));
    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask({ ...selectedTask, supervisorStatus: 'exception' });
    }
    showToast(`काम ID #${taskId} वर आक्षेप नोंदवला (Exception Raised)`);
  };

  const filteredTasks = tasks.filter(t => 
    t.id.includes(searchTerm) || 
    t.type.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-layout">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-notification">
          <CheckCircle2 size={18} color="#4ade80" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Left Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-nav-list">
          <button 
            onClick={() => setActiveTab('home')}
            className={`sidebar-nav-btn ${activeTab === 'home' ? 'active' : ''}`}
          >
            <Home size={22} className="sidebar-btn-icon" />
            <span className="sidebar-btn-label">मुख्यपृष्ठ</span>
          </button>

          <button 
            onClick={() => setActiveTab('progress')}
            className={`sidebar-nav-btn ${activeTab === 'progress' ? 'active' : ''}`}
          >
            <CheckCircle size={22} className="sidebar-btn-icon" />
            <span className="sidebar-btn-label">कार्य प्रगती</span>
          </button>

          <button 
            onClick={() => setActiveTab('attendance')}
            className={`sidebar-nav-btn ${activeTab === 'attendance' ? 'active' : ''}`}
          >
            <Users size={22} className="sidebar-btn-icon" />
            <span className="sidebar-btn-label">कर्मचारी हजेरी</span>
          </button>

          <button 
            onClick={() => setActiveTab('alerts')}
            className={`sidebar-nav-btn ${activeTab === 'alerts' ? 'active' : ''}`}
          >
            <AlertTriangle size={22} className="sidebar-btn-icon" />
            <span className="sidebar-btn-label">इशारे आणि<br/>चेतावण्या</span>
          </button>

          <button 
            onClick={() => setActiveTab('reports')}
            className={`sidebar-nav-btn ${activeTab === 'reports' ? 'active' : ''}`}
          >
            <FileText size={22} className="sidebar-btn-icon" />
            <span className="sidebar-btn-label">अहवाल</span>
          </button>

          <button 
            onClick={() => setActiveTab('settings')}
            className={`sidebar-nav-btn ${activeTab === 'settings' ? 'active' : ''}`}
          >
            <Settings size={22} className="sidebar-btn-icon" />
            <span className="sidebar-btn-label">सेटिंग्ज</span>
          </button>
        </div>

        {/* Switch to Worker Mobile View Shortcut */}
        <Link 
          to="/mobile" 
          title="कामगार ॲप पहा (Worker App)" 
          className="sidebar-mobile-shortcut"
        >
          <Smartphone size={18} />
          <span>कामगार ॲप</span>
        </Link>
      </aside>

      {/* Main View Area */}
      <div className="dashboard-main-wrapper">
        
        {/* Top Header */}
        <header className="dashboard-header">
          <div className="header-brand">
            <Menu size={24} style={{ cursor: 'pointer' }} />
            <div>
              <div className="header-corporation-title">सांगली मिरज कुपवाड महानगरपालिका</div>
              <div className="header-app-name">फिल्ड सेतू</div>
            </div>
          </div>
          
          <div className="header-actions">
            {/* Search Input */}
            <div className="header-search-wrapper">
              <Search size={16} className="header-search-icon" />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="शोधा..." 
                className="header-search-input"
              />
            </div>

            {/* View Switcher Pill */}
            <Link to="/mobile" className="header-view-pill">
              <Smartphone size={14} />
              <span>कामगार ॲप दृश्य</span>
            </Link>

            {/* Notification Bell */}
            <div className="header-bell-btn">
              <Bell size={20} />
              <span className="header-bell-badge"></span>
            </div>

            {/* User Profile */}
            <div className="header-profile-box">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" 
                alt={user?.name || "User"} 
                className="header-avatar"
              />
              <div>
                <div className="header-profile-name">{user?.name || "लोड होत आहे..."}</div>
                <div className="header-profile-role">{user?.role === 'supervisor' ? 'पर्यवेक्षक' : 'कामगार'}</div>
              </div>
              <button 
                onClick={handleLogout} 
                className="ml-4 flex items-center justify-center p-2 rounded-full hover:bg-[rgba(255,255,255,0.2)] transition-colors text-white" 
                title="Logout"
                style={{ marginLeft: '12px', border: 'none', background: 'transparent', cursor: 'pointer', color: 'white' }}
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="dashboard-content">
          
          {/* Top 4 Stats Cards */}
          <div className="stats-cards-grid">
            
            {/* Progress Card */}
            <div className="stat-card">
              <div className="stat-circle-wrapper">
                <svg className="stat-circle-svg" viewBox="0 0 36 36">
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e2e8f0" strokeWidth="3.5" />
                  <path strokeDasharray="88, 100" strokeLinecap="round" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#2e6b36" strokeWidth="3.5" />
                </svg>
                <div className="stat-circle-center-text">88%</div>
              </div>
              <div className="stat-label-title">कामाची प्रगती</div>
            </div>
            
            {/* Completed Tasks */}
            <div className="stat-card">
              <div className="stat-number-large stat-number-green">45</div>
              <div className="stat-label-title">पूर्ण कामे</div>
            </div>
            
            {/* Ongoing Tasks */}
            <div className="stat-card">
              <div className="stat-number-large stat-number-dark">15</div>
              <div className="stat-label-title">सुरू असलेली कामे</div>
            </div>
            
            {/* Workers Present */}
            <div className="stat-card">
              <div className="stat-number-large stat-number-green" style={{ display: 'flex', alignItems: 'baseline' }}>
                120<span style={{ fontSize: '18px', color: '#94a3b8', marginLeft: '4px' }}>/130</span>
              </div>
              <div className="stat-progress-bar-container">
                <div className="stat-progress-bar-fill" style={{ width: '92.3%' }}></div>
              </div>
              <div className="stat-label-title">कर्मचारी हजर</div>
            </div>
          </div>

          {/* 2-Column Main Section */}
          <div className="dashboard-main-grid">
            
            {/* Left Column: Tasks Table & Evidence Inspector */}
            <div>
              <div className="table-card-container">
                <div className="table-card-header">
                  <div>
                    <h2 className="table-title">सुरू असलेल्या कामांचा तपशील</h2>
                    <p className="table-subtitle">प्रत्येक कामाची थेट व पडताळणीकृत नोंद (Click to review)</p>
                  </div>
                  <span className="table-count-badge">{filteredTasks.length} कामे</span>
                </div>

                <div className="table-responsive-wrapper">
                  <table className="tasks-table">
                    <thead>
                      <tr>
                        <th>काम ID</th>
                        <th>कामाचा प्रकार</th>
                        <th>स्थान</th>
                        <th>कर्मचारी</th>
                        <th>अद्ययावत वेळ</th>
                        <th>स्थिती</th>
                        <th>फोटो पुरावा</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTasks.map((task) => (
                        <tr 
                          key={task.id} 
                          onClick={() => setSelectedTask(task)}
                          className={selectedTask?.id === task.id ? 'selected-row' : ''}
                        >
                          <td className="task-id-cell">
                            काम ID: {task.id}
                            {task.supervisorStatus === 'approved' && (
                              <span className="task-id-badge-approved">✓ मंजूर</span>
                            )}
                            {task.supervisorStatus === 'exception' && (
                              <span className="task-id-badge-exception">⚠ आक्षेप</span>
                            )}
                          </td>
                          <td style={{ fontWeight: 600 }}>{task.type}</td>
                          <td>
                            <div className="task-location-cell">
                              <MapPin size={14} color="#2e6b36" />
                              <span>{task.location}</span>
                            </div>
                          </td>
                          <td>{task.workers}</td>
                          <td>
                            <div className="task-location-cell">
                              <Clock size={14} color="#94a3b8" />
                              <span>{task.updatedTime}</span>
                            </div>
                          </td>
                          <td>
                            <span className="task-status-pill">{task.status}</span>
                          </td>
                          <td>
                            {task.hasEvidence ? (
                              <div className="photo-evidence-cell">
                                <span className="photo-evidence-text">फोटो पुरावा<br/>अपलोड केला</span>
                                <button className="camera-action-btn" title="पुरावा पहा">
                                  <Camera size={15} />
                                </button>
                              </div>
                            ) : (
                              <span className="no-evidence-badge">पुरावा नाही</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Evidence Inspector / One Task One Record Modal */}
              {selectedTask && (
                <div className="evidence-inspector-card">
                  <div className="inspector-header">
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span className="inspector-task-badge">काम #{selectedTask.id}</span>
                        <h3 className="inspector-title">{selectedTask.type}</h3>
                      </div>
                      <p className="inspector-subtitle">
                        One Task → One Record: डिजिटल पुरावा पडताळणी प्रणाली
                      </p>
                    </div>
                    <button 
                      onClick={() => setSelectedTask(null)}
                      className="inspector-close-btn"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  {/* 4 Pillars Summary */}
                  <div className="pillars-summary-grid">
                    <div>
                      <span className="pillar-item-label">WHO (कर्मचारी)</span>
                      <span className="pillar-item-value">{selectedTask.workers}</span>
                    </div>
                    <div>
                      <span className="pillar-item-label">WHERE (स्थान & GPS)</span>
                      <span className="pillar-item-value">{selectedTask.location}</span>
                    </div>
                    <div>
                      <span className="pillar-item-label">WHEN (वेळ)</span>
                      <span className="pillar-item-value">{selectedTask.updatedTime}</span>
                    </div>
                    <div>
                      <span className="pillar-item-label">GPS पडताळणी</span>
                      <span className="pillar-item-value" style={{ color: selectedTask.gpsVerified ? '#2e6b36' : '#e11d48' }}>
                        {selectedTask.gpsVerified ? '✓ Verified (Geo-fence OK)' : '⚠ Geo-fence Breach'}
                      </span>
                    </div>
                  </div>

                  {/* Before -> During -> After Evidence */}
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 800, marginBottom: '10px' }}>
                      कामाचे पुरावे (Before → During → After Photo Evidence)
                    </div>
                    <div className="photos-evidence-grid">
                      {/* Before Photo */}
                      <div className="photo-step-card">
                        <span className="photo-step-title">१. काम सुरू करण्यापूर्वी (Before)</span>
                        {selectedTask.beforePhoto ? (
                          <img src={selectedTask.beforePhoto} alt="Before" className="photo-step-img" />
                        ) : (
                          <div className="photo-step-placeholder">फोटो उपलब्ध नाही</div>
                        )}
                        <span className="photo-step-meta">📍 Geo-tag: 16.8524° N, 74.5815° E</span>
                      </div>

                      {/* During Photo */}
                      <div className="photo-step-card">
                        <span className="photo-step-title">२. काम सुरू असताना (During)</span>
                        {selectedTask.duringPhoto ? (
                          <img src={selectedTask.duringPhoto} alt="During" className="photo-step-img" />
                        ) : (
                          <div className="photo-step-placeholder">फोटो उपलब्ध नाही</div>
                        )}
                        <span className="photo-step-meta">🕒 Timestamp: 10:15 AM</span>
                      </div>

                      {/* After Photo */}
                      <div className="photo-step-card">
                        <span className="photo-step-title">३. काम पूर्ण झाल्यावर (After)</span>
                        {selectedTask.afterPhoto ? (
                          <img src={selectedTask.afterPhoto} alt="After" className="photo-step-img" />
                        ) : (
                          <div className="photo-step-placeholder">अद्याप प्रगतीपथावर</div>
                        )}
                        <span className="photo-step-meta">👷 Worker: विजय कांबळे</span>
                      </div>
                    </div>
                  </div>

                  {/* Supervisor Decision Controls */}
                  <div className="inspector-actions-bar">
                    <div className="inspector-status-text">
                      सध्याची स्थिती: 
                      {selectedTask.supervisorStatus === 'approved' && <strong style={{ color: '#2e6b36', marginLeft: '6px' }}>मंजूर (Approved)</strong>}
                      {selectedTask.supervisorStatus === 'exception' && <strong style={{ color: '#e11d48', marginLeft: '6px' }}>आक्षेप नोंदवला (Exception Raised)</strong>}
                      {selectedTask.supervisorStatus === 'pending' && <strong style={{ color: '#f59e0b', marginLeft: '6px' }}>पुनरावलोकन बाकी (Pending)</strong>}
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button 
                        onClick={() => handleRaiseException(selectedTask.id)}
                        className="btn-exception"
                      >
                        <ShieldAlert size={16} />
                        <span>आक्षेप नोंदवा (Raise Exception)</span>
                      </button>
                      <button 
                        onClick={() => handleApprove(selectedTask.id)}
                        className="btn-approve"
                      >
                        <Check size={16} />
                        <span>मंजूर करा (Approve)</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Absent Workers & Alerts */}
            <div>
              {/* Absent Workers Card */}
              <div className="side-card">
                <div className="side-card-header">
                  <h2 className="side-card-title">गैरहजर कर्मचारी</h2>
                  <span style={{ fontSize: '11px', color: '#e11d48', fontWeight: 700 }}>३ गैरहजर</span>
                </div>
                <ul className="absent-workers-list">
                  <li className="absent-worker-item">
                    <div className="absent-dot"></div>
                    <div>
                      <div className="absent-worker-name">विजय कांबळे</div>
                      <div className="absent-worker-sub">स्थान: शिवाजी नगर (बीट #४)</div>
                    </div>
                  </li>
                  <li className="absent-worker-item">
                    <div className="absent-dot"></div>
                    <div>
                      <div className="absent-worker-name">स्वाती जाधव</div>
                      <div className="absent-worker-sub">स्थान: गणपती मंदिर (बीट #२)</div>
                    </div>
                  </li>
                  <li className="absent-worker-item">
                    <div className="absent-dot"></div>
                    <div>
                      <div className="absent-worker-name">अजय शिंदे</div>
                      <div className="absent-worker-sub">स्थान: विश्रामबाग (बीट #७)</div>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Alerts and Warnings Card */}
              <div className="side-card">
                <div className="side-card-header">
                  <h2 className="side-card-title">इशारे आणि चेतावण्या फलक</h2>
                  <span style={{ fontSize: '11px', color: '#f59e0b', fontWeight: 700 }}>स्मार्ट अलर्ट्स</span>
                </div>
                
                {/* Orange Alert */}
                <div className="alert-item-orange" onClick={() => setSelectedTask(tasks[2])}>
                  <div className="alert-item-header">
                    <AlertTriangle size={16} />
                    <span>इशारा (Missing Evidence)</span>
                  </div>
                  <div className="alert-item-body">
                    काम ID: 108 - स्वच्छता, गणपती मंदिर -<br/>
                    <strong>फोटो पुरावा गहाळ</strong>
                  </div>
                </div>
                
                {/* Red Alert */}
                <div className="alert-item-red" onClick={() => setSelectedTask(tasks[4])}>
                  <div className="alert-item-header">
                    <ShieldAlert size={16} />
                    <span>चेतावणी (Delayed Task)</span>
                  </div>
                  <div className="alert-item-body">
                    काम ID: 112 - रस्ते दुरुस्ती, विश्रामबाग -<br/>
                    <strong>काम अद्याप सुरू नाही (वेळ उलटून गेली)</strong>
                  </div>
                </div>
              </div>

              {/* One Task One Record Feature Card */}
              <div className="usp-feature-box">
                <h3 className="usp-title">One Task → One Record</h3>
                <p className="usp-desc">
                  प्रत्येक काम हे कामगार, GPS स्थान, वेळेचा ठसा आणि Before/After फोटोशी जोडलेले आहे.
                </p>
                <div className="usp-live-status">
                  <span>सिस्टम स्थिती</span>
                  <span style={{ color: '#86efac' }}>● थेट सुरू (Live)</span>
                </div>
              </div>

            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
