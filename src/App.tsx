
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Chat from './features/chat/Chat';
import Recommendations from './features/recommendations/Recommendations';
import Auth from './features/auth/Auth';
import Dashboard from './features/dashboard/Dashboard';
import Plan from './features/plan/Plan';
import Booking from './features/booking/Booking';
import Catalog from './features/catalog/Catalog';
import Insights from './features/insights/Insights';
import Confirmation from './features/confirmation/Confirmation';
import Tiers from './features/tiers/Tiers';
import Landing from './features/landing/Landing';
import Stories from './features/stories/Stories';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/recommendations" element={<Recommendations />} />
          <Route path="/stories" element={<Stories />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/plan" element={
            <ProtectedRoute>
              <Plan />
            </ProtectedRoute>
          } />
          <Route path="/booking" element={<Booking />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/confirmation" element={<Confirmation />} />
          <Route path="/tiers" element={<Tiers />} />
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
