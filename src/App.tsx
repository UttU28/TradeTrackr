import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Participants from './pages/Participants';
import Weeks from './pages/Weeks';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import ScrollToTop from './components/ScrollToTop';

const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      
      <div className="min-h-screen bg-tradeBg flex flex-col">
        <Header />
        
        <main className="flex-1 pb-20">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/users" element={<Participants />} />
            <Route path="/weeks" element={<Weeks />} />
            {/* Redirect old week detail URLs to the main weeks page */}
            <Route path="/weeks/:weekId" element={<Navigate to="/weeks" replace />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
        
        <footer className="py-6 bg-tradeDark/90 text-white/60 text-center text-sm">
          <div className="container mx-auto px-4">
            <p>TradeTrackr &copy; {new Date().getFullYear()} - Your trading data stays local</p>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;