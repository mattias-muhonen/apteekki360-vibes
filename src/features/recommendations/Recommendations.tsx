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
                    <div className="assessment-summary" style={{ 
                        backgroundColor: '#f8f9fa', 
                        padding: '20px', 
                        borderRadius: '8px', 
                        margin: '20px 0',
                        border: '1px solid #e9ecef'
                    }}>
                        <h3 style={{ marginTop: '0', color: '#495057', fontSize: '18px' }}>Your Assessment Summary</h3>
                        <p style={{ marginBottom: '10px', color: '#6c757d' }}>
                            Based on your health assessment, our AI analysis identified key areas for optimization. 
                            Your responses indicated concerns with energy levels, sleep quality, and overall vitality. 
                            The following recommendations are specifically tailored to address these areas and support your health goals.
                        </p>
                        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '15px' }}>
                            <span style={{ 
                                backgroundColor: '#fff3cd', 
                                color: '#856404', 
                                padding: '6px 12px', 
                                borderRadius: '20px', 
                                fontSize: '14px',
                                border: '1px solid #ffeaa7'
                            }}>
                                🎯 Energy Optimization
                            </span>
                            <span style={{ 
                                backgroundColor: '#d1ecf1', 
                                color: '#0c5460', 
                                padding: '6px 12px', 
                                borderRadius: '20px', 
                                fontSize: '14px',
                                border: '1px solid #bee5eb'
                            }}>
                                💤 Sleep Quality
                            </span>
                            <span style={{ 
                                backgroundColor: '#d4edda', 
                                color: '#155724', 
                                padding: '6px 12px', 
                                borderRadius: '20px', 
                                fontSize: '14px',
                                border: '1px solid #c3e6cb'
                            }}>
                                ⚡ Hormonal Balance
                            </span>
                        </div>
                    </div>
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

            {/* Prominent Lab Upload Call-to-Action - Moved up and redesigned */}
            <section className="lab-interpretation-section" style={{ 
                background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', 
                padding: '40px 20px', 
                borderRadius: '16px', 
                margin: '40px 0',
                position: 'relative',
                overflow: 'hidden',
                border: '1px solid #e2e8f0'
            }}>
                {/* Background decoration */}
                <div style={{
                    position: 'absolute',
                    top: '0',
                    right: '0',
                    width: '120px',
                    height: '120px',
                    background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
                    borderRadius: '50%'
                }}></div>
                <div style={{
                    position: 'absolute',
                    bottom: '0',
                    left: '0',
                    width: '80px',
                    height: '80px',
                    background: 'radial-gradient(circle, rgba(168, 85, 247, 0.1) 0%, transparent 70%)',
                    borderRadius: '50%'
                }}></div>

                <div style={{ 
                    maxWidth: '800px', 
                    margin: '0 auto', 
                    textAlign: 'center', 
                    position: 'relative', 
                    zIndex: 1 
                }}>
                    {/* Badge */}
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '8px 16px',
                        backgroundColor: '#dbeafe',
                        color: '#1e40af',
                        borderRadius: '24px',
                        fontSize: '14px',
                        fontWeight: '500',
                        marginBottom: '24px'
                    }}>
                        <span style={{ marginRight: '8px' }}>✨</span>
                        AI-Powered Health Analysis
                    </div>

                    {/* Main Headline */}
                    <h2 style={{ 
                        fontSize: '36px', 
                        fontWeight: '700', 
                        color: '#1f2937', 
                        marginBottom: '24px',
                        lineHeight: '1.2'
                    }}>
                        Unlock Deeper Insights Into Your Health
                    </h2>

                    {/* Subheadline */}
                    <p style={{ 
                        fontSize: '18px', 
                        color: '#4b5563', 
                        marginBottom: '32px',
                        maxWidth: '600px',
                        margin: '0 auto 32px auto',
                        lineHeight: '1.6'
                    }}>
                        Upload your lab results and get instant AI-powered insights, reviewed by licensed healthcare providers, with personalized action steps tailored to your unique health profile.
                    </p>

                    {/* Feature highlights */}
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                        gap: '24px', 
                        marginBottom: '40px' 
                    }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{
                                width: '64px',
                                height: '64px',
                                backgroundColor: 'white',
                                borderRadius: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 16px auto',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}>
                                <span style={{ fontSize: '24px', color: '#3b82f6' }}>📈</span>
                            </div>
                            <h3 style={{ fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}>Instant Analysis</h3>
                            <p style={{ fontSize: '14px', color: '#6b7280' }}>Get AI-powered insights within seconds of uploading your results</p>
                        </div>
                        
                        <div style={{ textAlign: 'center' }}>
                            <div style={{
                                width: '64px',
                                height: '64px',
                                backgroundColor: 'white',
                                borderRadius: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 16px auto',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}>
                                <span style={{ fontSize: '24px', color: '#8b5cf6' }}>🔒</span>
                            </div>
                            <h3 style={{ fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}>100% Secure</h3>
                            <p style={{ fontSize: '14px', color: '#6b7280' }}>HIPAA-compliant with bank-level security encryption</p>
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        backdropFilter: 'blur(8px)',
                        borderRadius: '16px',
                        padding: '32px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                    }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                            <Link
                                to="/dashboard"
                                className="card-button primary"
                                style={{ 
                                    backgroundColor: '#3b82f6',
                                    color: 'white',
                                    fontWeight: '600',
                                    padding: '16px 32px',
                                    borderRadius: '12px',
                                    textDecoration: 'none',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '12px',
                                    fontSize: '16px',
                                    boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.4)',
                                    transition: 'all 0.2s ease',
                                    border: 'none',
                                    textAlign: 'center'
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.backgroundColor = '#2563eb';
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 6px 20px 0 rgba(59, 130, 246, 0.5)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.backgroundColor = '#3b82f6';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 14px 0 rgba(59, 130, 246, 0.4)';
                                }}
                            >
                                <span style={{ fontSize: '20px' }}>📊</span>
                                Upload My Lab Results
                            </Link>
                            
                            <p style={{ 
                                fontSize: '14px', 
                                color: '#6b7280', 
                                maxWidth: '400px', 
                                margin: '0' 
                            }}>
                                Supported formats: PDF, JPG, PNG • Upload takes less than 30 seconds
                            </p>

                            {/* Trust signals */}
                            <div style={{ 
                                display: 'flex', 
                                flexWrap: 'wrap', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                gap: '16px', 
                                fontSize: '12px', 
                                color: '#6b7280', 
                                paddingTop: '16px', 
                                borderTop: '1px solid #e5e7eb',
                                marginTop: '16px'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <span>🔒</span>
                                    HIPAA Compliant
                                </div>
                                <div style={{ color: '#10b981', fontWeight: '500' }}>
                                    ⭐ Trusted by 10,000+ users
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Social proof testimonial */}
                    <div style={{ 
                        marginTop: '32px', 
                        padding: '16px', 
                        backgroundColor: 'rgba(255, 255, 255, 0.5)', 
                        borderRadius: '12px', 
                        border: '1px solid rgba(255, 255, 255, 0.2)' 
                    }}>
                        <p style={{ 
                            fontSize: '14px', 
                            fontStyle: 'italic', 
                            color: '#4b5563', 
                            marginBottom: '8px' 
                        }}>
                            "The AI analysis helped me understand my cholesterol levels and gave me actionable steps. Within 3 months, my numbers improved significantly!"
                        </p>
                        <p style={{ fontSize: '12px', color: '#6b7280', margin: '0' }}>— Sarah M., verified user</p>
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
    </Page>
);

export default Recommendations;
