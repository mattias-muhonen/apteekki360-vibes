import { Link } from 'react-router-dom';
import Page from '../../components/Page';
import './Confirmation.css';

const Confirmation = () => (
  <Page 
    title="Booking Confirmation" 
    subtitle="Your test has been successfully booked. Here are your next steps."
  >
    <div className="page-content">
      <div className="confirmation-card">
        <div className="confirmation-icon">✅</div>
        <h2>Booking Confirmed!</h2>
        <p>Your testosterone panel test has been successfully scheduled.</p>
        
        <div className="booking-details">
          <div className="detail-row">
            <span className="label">Test Type:</span>
            <span className="value">Comprehensive Testosterone Panel</span>
          </div>
          <div className="detail-row">
            <span className="label">Location:</span>
            <span className="value">Apteekki360, Siltasaarenkatu 18, Helsinki</span>
          </div>
          <div className="detail-row">
            <span className="label">Date & Time:</span>
            <span className="value">Tomorrow, 10:00 AM</span>
          </div>
          <div className="detail-row">
            <span className="label">Total Cost:</span>
            <span className="value">€89.90</span>
          </div>
        </div>

        <div className="next-steps">
          <h3>Preparation Instructions</h3>
          <ul>
            <li>Fast for 8-12 hours before your test</li>
            <li>Avoid alcohol 24 hours prior</li>
            <li>Bring a valid ID</li>
            <li>Arrive 15 minutes early</li>
          </ul>
        </div>
      </div>
    </div>

    <div className="page-actions">
      <Link to="/dashboard" className="action-button primary">View Dashboard</Link>
      <Link to="/catalog" className="action-button secondary">Browse Supplements</Link>
    </div>
  </Page>
);

export default Confirmation;
