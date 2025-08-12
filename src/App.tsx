
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Chat from './features/chat/Chat';
import Recommendations from './features/recommendations/Recommendations';
import Auth from './features/auth/Auth';
import Dashboard from './features/dashboard/Dashboard';
import Lab from './features/lab/Lab';
import Booking from './features/booking/Booking';
import Catalog from './features/catalog/Catalog';
import Insights from './features/insights/Insights';
import Confirmation from './features/confirmation/Confirmation';
import Tiers from './features/tiers/Tiers';
import Landing from './features/landing/Landing';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/chat" element={
          <div className="main-layout">
            <nav className="sidebar">
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/chat">Health Assessment</Link></li>
                <li><Link to="/recommendations">Recommendations</Link></li>
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li><Link to="/lab">Lab Results</Link></li>
                <li><Link to="/booking">Book Test</Link></li>
                <li><Link to="/catalog">Products</Link></li>
                <li><Link to="/insights">Insights</Link></li>
                <li><Link to="/confirmation">Booking Confirmation</Link></li>
                <li><Link to="/tiers">Member Tiers</Link></li>
                <li><Link to="/auth">Login/Register</Link></li>
              </ul>
            </nav>
            <main className="content">
              <Chat />
            </main>
          </div>
        } />
        <Route path="/recommendations" element={
          <div className="main-layout">
            <nav className="sidebar">
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/chat">Health Assessment</Link></li>
                <li><Link to="/recommendations">Recommendations</Link></li>
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li><Link to="/lab">Lab Results</Link></li>
                <li><Link to="/booking">Book Test</Link></li>
                <li><Link to="/catalog">Products</Link></li>
                <li><Link to="/insights">Insights</Link></li>
                <li><Link to="/confirmation">Booking Confirmation</Link></li>
                <li><Link to="/tiers">Member Tiers</Link></li>
                <li><Link to="/auth">Login/Register</Link></li>
              </ul>
            </nav>
            <main className="content">
              <Recommendations />
            </main>
          </div>
        } />
        <Route path="/dashboard" element={
          <div className="main-layout">
            <nav className="sidebar">
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/chat">Health Assessment</Link></li>
                <li><Link to="/recommendations">Recommendations</Link></li>
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li><Link to="/lab">Lab Results</Link></li>
                <li><Link to="/booking">Book Test</Link></li>
                <li><Link to="/catalog">Products</Link></li>
                <li><Link to="/insights">Insights</Link></li>
                <li><Link to="/confirmation">Booking Confirmation</Link></li>
                <li><Link to="/tiers">Member Tiers</Link></li>
                <li><Link to="/auth">Login/Register</Link></li>
              </ul>
            </nav>
            <main className="content">
              <Dashboard />
            </main>
          </div>
        } />
        <Route path="/lab" element={
          <div className="main-layout">
            <nav className="sidebar">
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/chat">Health Assessment</Link></li>
                <li><Link to="/recommendations">Recommendations</Link></li>
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li><Link to="/lab">Lab Results</Link></li>
                <li><Link to="/booking">Book Test</Link></li>
                <li><Link to="/catalog">Products</Link></li>
                <li><Link to="/insights">Insights</Link></li>
                <li><Link to="/confirmation">Booking Confirmation</Link></li>
                <li><Link to="/tiers">Member Tiers</Link></li>
                <li><Link to="/auth">Login/Register</Link></li>
              </ul>
            </nav>
            <main className="content">
              <Lab />
            </main>
          </div>
        } />
        <Route path="/booking" element={
          <div className="main-layout">
            <nav className="sidebar">
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/chat">Health Assessment</Link></li>
                <li><Link to="/recommendations">Recommendations</Link></li>
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li><Link to="/lab">Lab Results</Link></li>
                <li><Link to="/booking">Book Test</Link></li>
                <li><Link to="/catalog">Products</Link></li>
                <li><Link to="/insights">Insights</Link></li>
                <li><Link to="/confirmation">Booking Confirmation</Link></li>
                <li><Link to="/tiers">Member Tiers</Link></li>
                <li><Link to="/auth">Login/Register</Link></li>
              </ul>
            </nav>
            <main className="content">
              <Booking />
            </main>
          </div>
        } />
        <Route path="/catalog" element={
          <div className="main-layout">
            <nav className="sidebar">
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/chat">Health Assessment</Link></li>
                <li><Link to="/recommendations">Recommendations</Link></li>
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li><Link to="/lab">Lab Results</Link></li>
                <li><Link to="/booking">Book Test</Link></li>
                <li><Link to="/catalog">Products</Link></li>
                <li><Link to="/insights">Insights</Link></li>
                <li><Link to="/confirmation">Booking Confirmation</Link></li>
                <li><Link to="/tiers">Member Tiers</Link></li>
                <li><Link to="/auth">Login/Register</Link></li>
              </ul>
            </nav>
            <main className="content">
              <Catalog />
            </main>
          </div>
        } />
        <Route path="/insights" element={
          <div className="main-layout">
            <nav className="sidebar">
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/chat">Health Assessment</Link></li>
                <li><Link to="/recommendations">Recommendations</Link></li>
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li><Link to="/lab">Lab Results</Link></li>
                <li><Link to="/booking">Book Test</Link></li>
                <li><Link to="/catalog">Products</Link></li>
                <li><Link to="/insights">Insights</Link></li>
                <li><Link to="/confirmation">Booking Confirmation</Link></li>
                <li><Link to="/tiers">Member Tiers</Link></li>
                <li><Link to="/auth">Login/Register</Link></li>
              </ul>
            </nav>
            <main className="content">
              <Insights />
            </main>
          </div>
        } />
        <Route path="/confirmation" element={
          <div className="main-layout">
            <nav className="sidebar">
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/chat">Health Assessment</Link></li>
                <li><Link to="/recommendations">Recommendations</Link></li>
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li><Link to="/lab">Lab Results</Link></li>
                <li><Link to="/booking">Book Test</Link></li>
                <li><Link to="/catalog">Products</Link></li>
                <li><Link to="/insights">Insights</Link></li>
                <li><Link to="/confirmation">Booking Confirmation</Link></li>
                <li><Link to="/tiers">Member Tiers</Link></li>
                <li><Link to="/auth">Login/Register</Link></li>
              </ul>
            </nav>
            <main className="content">
              <Confirmation />
            </main>
          </div>
        } />
        <Route path="/tiers" element={
          <div className="main-layout">
            <nav className="sidebar">
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/chat">Health Assessment</Link></li>
                <li><Link to="/recommendations">Recommendations</Link></li>
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li><Link to="/lab">Lab Results</Link></li>
                <li><Link to="/booking">Book Test</Link></li>
                <li><Link to="/catalog">Products</Link></li>
                <li><Link to="/insights">Insights</Link></li>
                <li><Link to="/confirmation">Booking Confirmation</Link></li>
                <li><Link to="/tiers">Member Tiers</Link></li>
                <li><Link to="/auth">Login/Register</Link></li>
              </ul>
            </nav>
            <main className="content">
              <Tiers />
            </main>
          </div>
        } />
        <Route path="/auth" element={
          <div className="main-layout">
            <nav className="sidebar">
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/chat">Health Assessment</Link></li>
                <li><Link to="/recommendations">Recommendations</Link></li>
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li><Link to="/lab">Lab Results</Link></li>
                <li><Link to="/booking">Book Test</Link></li>
                <li><Link to="/catalog">Products</Link></li>
                <li><Link to="/insights">Insights</Link></li>
                <li><Link to="/confirmation">Booking Confirmation</Link></li>
                <li><Link to="/tiers">Member Tiers</Link></li>
                <li><Link to="/auth">Login/Register</Link></li>
              </ul>
            </nav>
            <main className="content">
              <Auth />
            </main>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
