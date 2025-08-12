import { Link } from 'react-router-dom';
import Page from '../../components/Page';
import './Tiers.css';

const Tiers = () => (
  <Page 
    title="Member Tier System" 
    subtitle="Choose your membership level and unlock exclusive benefits and pricing."
  >
    <div className="page-content">
      <div className="tiers-grid">
        <div className="tier-card">
          <h3>Visitor</h3>
          <div className="tier-price">Free</div>
          <ul className="tier-features">
            <li>Basic health assessment</li>
            <li>View product recommendations</li>
            <li>Access to public content</li>
          </ul>
          <div className="tier-button current">Current Plan</div>
        </div>

        <div className="tier-card">
          <h3>Registered</h3>
          <div className="tier-price">Free</div>
          <ul className="tier-features">
            <li>Save assessment results</li>
            <li>Track progress over time</li>
            <li>Basic lab result storage</li>
            <li>Email notifications</li>
          </ul>
          <Link to="/auth" className="tier-button primary">Register Now</Link>
        </div>

        <div className="tier-card featured">
          <div className="tier-badge">Most Popular</div>
          <h3>Member</h3>
          <div className="tier-price">€19.90/month</div>
          <ul className="tier-features">
            <li>15-25% savings on all products</li>
            <li>PDF lab report upload & parsing</li>
            <li>Priority booking for tests</li>
            <li>Advanced health analytics</li>
            <li>Personal health consultations</li>
            <li>Exclusive member content</li>
          </ul>
          <Link to="/auth" className="tier-button primary">Upgrade to Member</Link>
        </div>
      </div>
    </div>

    <div className="page-actions">
      <Link to="/catalog" className="action-button primary">Browse Products</Link>
      <Link to="/dashboard" className="action-button secondary">View Dashboard</Link>
    </div>
  </Page>
);

export default Tiers;
