import { Link } from 'react-router-dom';
import Page from '../../components/Page';
import './Catalog.css';

const Catalog = () => (
  <Page 
    title="Product Catalog" 
    subtitle="Premium supplements and health products from Finnish pharmacy Apteekki360.fi"
  >
    <div className="page-content">
      <section className="filters-section">
        <div className="filters">
          <select className="filter-select">
            <option>All Categories</option>
            <option>Vitamins</option>
            <option>Minerals</option>
            <option>Testosterone Support</option>
            <option>Energy & Sleep</option>
          </select>
          <select className="filter-select">
            <option>Sort by Price</option>
            <option>Low to High</option>
            <option>High to Low</option>
          </select>
          <input type="search" placeholder="Search products..." className="search-input" />
        </div>
      </section>

      <section className="products-grid">
        <div className="product-card featured">
          <div className="product-badge">Member -25%</div>
          <h3>D-Vitamin 4000 IU</h3>
          <div className="product-rating">★★★★★ (127 reviews)</div>
          <p>High-quality vitamin D supplement for immune support and energy optimization.</p>
          <div className="price-section">
            <div className="member-price">€18.70</div>
            <div className="regular-price">€24.90</div>
          </div>
          <button className="product-button">Add to Cart</button>
        </div>

        <div className="product-card">
          <h3>Magnesium Complex</h3>
          <div className="product-rating">★★★★☆ (89 reviews)</div>
          <p>Premium magnesium blend for better sleep quality and stress reduction.</p>
          <div className="price-section">
            <div className="member-price">€24.40</div>
            <div className="regular-price">€32.50</div>
          </div>
          <button className="product-button">Add to Cart</button>
        </div>

        <div className="product-card">
          <h3>Omega-3 Premium</h3>
          <div className="product-rating">★★★★★ (203 reviews)</div>
          <p>High-potency fish oil for heart health and cognitive function.</p>
          <div className="price-section">
            <div className="member-price">€29.90</div>
            <div className="regular-price">€39.90</div>
          </div>
          <button className="product-button">Add to Cart</button>
        </div>

        <div className="product-card">
          <h3>Zinc + Selenium</h3>
          <div className="product-rating">★★★★☆ (156 reviews)</div>
          <p>Essential minerals for testosterone production and immune function.</p>
          <div className="price-section">
            <div className="member-price">€18.70</div>
            <div className="regular-price">€24.90</div>
          </div>
          <button className="product-button">Add to Cart</button>
        </div>

        <div className="product-card">
          <h3>B-Complex Advanced</h3>
          <div className="product-rating">★★★★★ (98 reviews)</div>
          <p>Complete B-vitamin complex for energy metabolism and nervous system support.</p>
          <div className="price-section">
            <div className="member-price">€22.40</div>
            <div className="regular-price">€29.90</div>
          </div>
          <button className="product-button">Add to Cart</button>
        </div>

        <div className="product-card">
          <h3>Ashwagandha KSM-66</h3>
          <div className="product-rating">★★★★☆ (174 reviews)</div>
          <p>Clinically studied adaptogen for stress management and testosterone support.</p>
          <div className="price-section">
            <div className="member-price">€33.70</div>
            <div className="regular-price">€44.90</div>
          </div>
          <button className="product-button">Add to Cart</button>
        </div>
      </section>

      <section className="member-benefits-section">
        <div className="benefits-card">
          <h2>Become a Member</h2>
          <p>Save 15-25% on all products with exclusive member pricing</p>
          <Link to="/tiers" className="benefits-button">View Membership</Link>
        </div>
      </section>
    </div>

    <div className="page-actions">
      <Link to="/booking" className="action-button primary">Book Lab Test</Link>
      <Link to="/dashboard" className="action-button secondary">View Dashboard</Link>
    </div>
  </Page>
);

export default Catalog;
