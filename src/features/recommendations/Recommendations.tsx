import { Link } from 'react-router-dom';
import Page from '../../components/Page';
import './Recommendations.css';

const Recommendations = () => (
  <Page 
    title="Your Personalized Recommendations" 
    subtitle="Based on your health assessment, here are tailored product and service recommendations."
  >
    <div className="page-content">
      <section className="recommendations-section">
        <div className="section-header">
          <h2>Primary Recommendations</h2>
          <p>Essential steps for your health optimization journey</p>
        </div>

        <div className="recommendation-cards">
          <div className="recommendation-card featured">
            <div className="card-badge">Recommended</div>
            <h3>Comprehensive Testosterone Panel</h3>
            <p>Get detailed insights into your hormonal health with our complete testosterone analysis.</p>
            <div className="price">€89.90</div>
            <Link to="/booking" className="card-button primary">Book Test</Link>
          </div>

          <div className="recommendation-card">
            <h3>D-Vitamin 4000 IU</h3>
            <p>High-quality vitamin D supplement to support energy levels and overall wellbeing.</p>
            <div className="price">€24.90</div>
            <Link to="/catalog" className="card-button secondary">View Product</Link>
          </div>

          <div className="recommendation-card">
            <h3>Magnesium Complex</h3>
            <p>Premium magnesium blend to improve sleep quality and reduce stress levels.</p>
            <div className="price">€32.50</div>
            <Link to="/catalog" className="card-button secondary">View Product</Link>
          </div>
        </div>
      </section>

      <section className="insights-section">
        <div className="insights-grid">
          <div className="insight-card">
            <div className="insight-icon">🎯</div>
            <h3>Your Health Score</h3>
            <div className="score">72/100</div>
            <p>Good foundation with room for optimization</p>
          </div>
          <div className="insight-card">
            <div className="insight-icon">⚡</div>
            <h3>Energy Level</h3>
            <div className="score moderate">Moderate</div>
            <p>Can be improved with targeted interventions</p>
          </div>
          <div className="insight-card">
            <div className="insight-icon">💤</div>
            <h3>Sleep Quality</h3>
            <div className="score low">Needs Attention</div>
            <p>Priority area for health improvement</p>
          </div>
        </div>
      </section>

      <section className="next-steps">
        <h2>Your Health Journey</h2>
        <div className="steps-container">
          <div className="step completed">
            <div className="step-number">1</div>
            <h4>Health Assessment</h4>
            <p>✓ Completed</p>
          </div>
          <div className="step current">
            <div className="step-number">2</div>
            <h4>Get Testing</h4>
            <p>Book your lab tests</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h4>Track Progress</h4>
            <p>Monitor improvements</p>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <h4>Optimize</h4>
            <p>Fine-tune your approach</p>
          </div>
        </div>
      </section>
    </div>

    <div className="page-actions">
      <Link to="/dashboard" className="action-button primary">View Dashboard</Link>
      <Link to="/auth" className="action-button secondary">Save Progress</Link>
    </div>
  </Page>
);

export default Recommendations;
