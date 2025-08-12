import { Link } from 'react-router-dom';
import Page from '../../components/Page';
import './Booking.css';

const Booking = () => (
  <Page 
    title="Test Booking System" 
    subtitle="Schedule your testosterone panel and lab tests with our partner laboratories."
  >
    <div className="page-content">
      <div className="booking-placeholder">
        <h2>Book Your Lab Test</h2>
        <p>Complete appointment scheduling for testosterone panels and health assessments.</p>
        <div className="features-list">
          <div className="feature-item">✓ Multiple lab center locations</div>
          <div className="feature-item">✓ Flexible time slot availability</div>
          <div className="feature-item">✓ Add-on supplement recommendations</div>
          <div className="feature-item">✓ Member pricing with automatic savings</div>
        </div>
      </div>
    </div>

    <div className="page-actions">
      <Link to="/confirmation" className="action-button primary">Continue Booking</Link>
      <Link to="/catalog" className="action-button secondary">Browse Supplements</Link>
    </div>
  </Page>
);

export default Booking;
