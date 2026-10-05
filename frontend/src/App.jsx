import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './Dashboard';
import MobileApp from './MobileApp';
import { LayoutDashboard, Smartphone, ShieldCheck } from 'lucide-react';

const Landing = () => (
  <div className="landing-container">
    <div className="landing-card">
      <span className="landing-badge">सांगली मिरज कुपवाड महानगरपालिका</span>
      <h1 className="landing-title">फिल्ड सेतू (FieldSetu)</h1>
      <p className="landing-subtitle">
        Field-Work Accountability Platform — Connecting WHO, WHERE, WHEN & WHAT
      </p>
      
      <div className="landing-nav-group">
        <Link to="/dashboard" className="btn-landing-primary">
          <LayoutDashboard size={20} />
          <span>पर्यवेक्षक डॅशबोर्ड (Supervisor Dashboard)</span>
        </Link>
        <Link to="/mobile" className="btn-landing-secondary">
          <Smartphone size={20} />
          <span>कामगार मोबाईल ॲप (Worker Mobile App)</span>
        </Link>
      </div>
      
      <div className="landing-features-box">
        <div className="landing-features-title">One Task → One Verifiable Record</div>
        <ul className="landing-features-list">
          <li>जीपीएस आधारित जिओ-फेन्सिंग हजेरी (Geo Check-in)</li>
          <li>काम सुरू करण्यापूर्वी, दरम्यान व नंतरचे फोटो (Before / During / After Evidence)</li>
          <li>वेळ आणि स्थानाचा पडताळणी ठसा (Timestamp + GPS Linked Record)</li>
          <li>पर्यवेक्षक मंजुरी आणि आक्षेप व्यवस्था (Supervisor Review & Exception Engine)</li>
        </ul>
      </div>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/mobile" element={<MobileApp />} />
      </Routes>
    </Router>
  );
}

export default App;
