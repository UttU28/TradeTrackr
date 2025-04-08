import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Participants from './pages/Participants';
import Weeks from './pages/Weeks';
import WeekDetail from './pages/WeekDetail';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-tradeBg flex flex-col">
        <Header />
        
        <main className="flex-1 pb-20">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/users" element={<Participants />} />
            <Route path="/weeks" element={<Weeks />} />
            <Route path="/weeks/:weekId" element={<WeekDetail />} />
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