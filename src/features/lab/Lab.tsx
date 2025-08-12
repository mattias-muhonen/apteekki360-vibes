import { Link } from 'react-router-dom';
import Page from '../../components/Page';
import './Lab.css';

const Lab = () => (
  <Page 
    title="Lab Results Management" 
    subtitle="Track your testosterone levels and health metrics over time with comprehensive analysis."
  >
    <div className="page-content">
      <section className="lab-overview">
        <div className="overview-cards">
          <div className="overview-card">
            <h3>Latest Results</h3>
            <div className="result-value">485 ng/dL</div>
            <div className="result-label">Total Testosterone</div>
            <div className="result-status normal">Normal Range</div>
          </div>
          <div className="overview-card">
            <h3>Trend</h3>
            <div className="result-value">+12%</div>
            <div className="result-label">3-Month Change</div>
            <div className="result-status improving">Improving</div>
          </div>
          <div className="overview-card">
            <h3>Next Test</h3>
            <div className="result-value">6 weeks</div>
            <div className="result-label">Recommended</div>
            <Link to="/booking" className="result-action">Book Now</Link>
          </div>
        </div>
      </section>

      <section className="results-table-section">
        <div className="section-header">
          <h2>Test History</h2>
          <button className="add-result-button">+ Add Manual Result</button>
        </div>
        
        <div className="results-table">
          <div className="table-header">
            <div>Date</div>
            <div>Test</div>
            <div>Result</div>
            <div>Reference Range</div>
            <div>Status</div>
          </div>
          
          <div className="table-row">
            <div>Dec 15, 2024</div>
            <div>Total Testosterone</div>
            <div>485 ng/dL</div>
            <div>300-1000 ng/dL</div>
            <div className="status normal">Normal</div>
          </div>
          
          <div className="table-row">
            <div>Dec 15, 2024</div>
            <div>Free Testosterone</div>
            <div>12.4 pg/mL</div>
            <div>8.7-25.1 pg/mL</div>
            <div className="status normal">Normal</div>
          </div>
          
          <div className="table-row">
            <div>Sep 22, 2024</div>
            <div>Total Testosterone</div>
            <div>432 ng/dL</div>
            <div>300-1000 ng/dL</div>
            <div className="status low-normal">Low-Normal</div>
          </div>
          
          <div className="table-row">
            <div>Jun 18, 2024</div>
            <div>Total Testosterone</div>
            <div>398 ng/dL</div>
            <div>300-1000 ng/dL</div>
            <div className="status low-normal">Low-Normal</div>
          </div>
        </div>
      </section>

      <section className="upload-section">
        <div className="upload-card">
          <div className="upload-icon">📄</div>
          <h3>Upload Lab Report</h3>
          <p>Drag & drop your PDF lab report or click to browse</p>
          <button className="upload-button">Choose File</button>
          <div className="member-note">
            💎 <strong>Member Feature:</strong> Automatic PDF parsing and result extraction
          </div>
        </div>
      </section>

      <section className="recommendations-section">
        <h2>Based on Your Results</h2>
        <div className="recommendation-items">
          <div className="recommendation-item">
            <div className="rec-icon">✅</div>
            <div className="rec-content">
              <h4>Continue Current Protocol</h4>
              <p>Your testosterone levels are improving. Keep taking your current supplements.</p>
            </div>
          </div>
          <div className="recommendation-item">
            <div className="rec-icon">🔄</div>
            <div className="rec-content">
              <h4>Follow-up Testing</h4>
              <p>Schedule your next testosterone panel in 6-8 weeks to track progress.</p>
            </div>
          </div>
          <div className="recommendation-item">
            <div className="rec-icon">💊</div>
            <div className="rec-content">
              <h4>Consider Adding Zinc</h4>
              <p>Zinc supplementation may help optimize your testosterone production further.</p>
            </div>
          </div>
        </div>
      </section>
    </div>

    <div className="page-actions">
      <Link to="/booking" className="action-button primary">Book Next Test</Link>
      <Link to="/dashboard" className="action-button secondary">View Dashboard</Link>
    </div>
  </Page>
);

export default Lab;
