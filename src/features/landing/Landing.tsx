
import './Landing.css';
import { Link } from 'react-router-dom';
import './Landing.css';

const Landing = () => (
  <div className="landing-page">
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <h2>Health360</h2>
        </div>
        <nav className="nav">
          <Link to="/auth">Login</Link>
          <Link to="/chat" className="nav-cta">Get Started</Link>
        </nav>
      </div>
    </header>

    <main className="main-content">
      <section className="hero">
        <div className="hero-content">
          <h1>Optimize Your Health with AI-Powered Insights</h1>
          <p className="hero-subtitle">
            Get personalized health assessments, expert recommendations, and track your progress 
            with Health360's comprehensive men's health platform.
          </p>
          <div className="cta-section">
            <Link to="/chat" className="cta-button primary">Start Free Assessment</Link>
            <Link to="/catalog" className="cta-button secondary">Browse Products</Link>
          </div>
          <div className="symptom-chips">
            <span>Fatigue & Low Energy</span>
            <span>Testosterone Issues</span>
            <span>Sleep Problems</span>
            <span>Stress Management</span>
            <span>Nutrition Guidance</span>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="features-content">
          <h2>Why Choose Health360?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🤖</div>
              <h3>AI Health Assessment</h3>
              <p>Get personalized insights through our intelligent chat system that understands your symptoms and health goals.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🧪</div>
              <h3>Lab Results Tracking</h3>
              <p>Monitor your testosterone levels, energy scores, and other key health metrics with comprehensive tracking tools.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💊</div>
              <h3>Finnish Pharmacy Products</h3>
              <p>Access authentic supplements and health products from trusted Finnish pharmacy Apteekki360.fi.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Progress Dashboard</h3>
              <p>Visualize your health journey with interactive charts and personalized recommendations.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="testimonials">
        <div className="testimonials-content">
          <h2>Trusted by Thousands</h2>
          <div className="testimonials-grid">
            <div className="testimonial">
              <p>"Health360 helped me identify my energy issues and find the right supplements. My testosterone levels improved significantly!"</p>
              <div className="testimonial-author">- Mikko, 34</div>
            </div>
            <div className="testimonial">
              <p>"The AI assessment was incredibly accurate. The recommendations were spot-on and easy to follow."</p>
              <div className="testimonial-author">- Jukka, 41</div>
            </div>
            <div className="testimonial">
              <p>"Finally, a platform that understands men's health. The lab tracking feature is game-changing."</p>
              <div className="testimonial-author">- Antti, 28</div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Health360</h3>
          <p>Your comprehensive men's health optimization platform.</p>
        </div>
        <div className="footer-section">
          <h4>Platform</h4>
          <Link to="/chat">Health Assessment</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/lab">Lab Results</Link>
          <Link to="/catalog">Products</Link>
        </div>
        <div className="footer-section">
          <h4>Services</h4>
          <Link to="/booking">Book Tests</Link>
          <Link to="/insights">Health Insights</Link>
          <Link to="/tiers">Membership</Link>
        </div>
        <div className="footer-section">
          <h4>Support</h4>
          <a href="#contact">Contact Us</a>
          <a href="#privacy">Privacy Policy</a>
          <a href="#terms">Terms of Service</a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2025 Health360. All rights reserved. In partnership with Apteekki360.fi</p>
      </div>
    </footer>
  </div>
);

export default Landing;
