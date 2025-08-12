import { Link } from 'react-router-dom';
import Page from '../../components/Page';
import './Insights.css';

const Insights = () => (
  <Page 
    title="Insights & Recommendations Hub" 
    subtitle="Centralized view of personalized health insights and product recommendations."
  >
    <div className="page-content">
      <div className="insights-placeholder">
        <h2>Health Insights</h2>
        <p>Get comprehensive health analysis and personalized recommendations based on your data.</p>
        <div className="insights-features">
          <div className="insight-feature">📊 Health analysis summary with key findings</div>
          <div className="insight-feature">🎯 Primary recommendation highlighting</div>
          <div className="insight-feature">💊 Secondary recommendations for supplements</div>
          <div className="insight-feature">💰 Featured products with member pricing</div>
        </div>
      </div>
    </div>

    <div className="page-actions">
      <Link to="/dashboard" className="action-button primary">View Dashboard</Link>
      <Link to="/booking" className="action-button secondary">Book Tests</Link>
    </div>
  </Page>
);

export default Insights;
