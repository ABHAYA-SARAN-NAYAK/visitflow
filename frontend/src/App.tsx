import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import HomePage from './pages/HomePage';
import PlaceDetailPage from './pages/PlaceDetailPage';
import SearchPage from './pages/SearchPage';
import TripPlannerPage from './pages/TripPlannerPage';
import ProfilePage from './pages/ProfilePage';
import SeenaChat from './components/chat/SeenaChat';
import AuthModal from './components/auth/AuthModal';
import AlertModal from './components/alerts/AlertModal';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-bg-primary">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/place/:slug" element={<PlaceDetailPage />} />
            <Route path="/trip-planner" element={<TripPlannerPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </main>
        <SeenaChat />
        <AuthModal />
        <AlertModal />
      </div>
    </Router>
  );
}
