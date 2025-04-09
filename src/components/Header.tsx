import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, Calendar, Settings, LineChart, X } from 'lucide-react';

// Custom logo component that matches our favicon
const TradeTrackrLogo = () => (
  <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" rx="8" fill="#0F172A"/>
    <path d="M8 22V16" stroke="#6EE7B7" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M13 22V10" stroke="#6EE7B7" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M18 22V14" stroke="#6EE7B7" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M23 22V12" stroke="#6EE7B7" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M7 15L14 9L19 13L25 7" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="25" cy="7" r="2" fill="#6EE7B7"/>
  </svg>
);

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  return (
    <header className="bg-tradeDark/90 backdrop-blur-md sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 flex items-center justify-center">
              <TradeTrackrLogo />
            </div>
            <span className="text-xl font-bold text-white">TradeTrackr</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-1">
            <NavLink to="/" icon={<TradeTrackrLogo />} label="Dashboard" isActive={location.pathname === '/'} />
            <NavLink to="/users" icon={<Users className="w-4 h-4" />} label="Participants" isActive={location.pathname === '/users'} />
            <NavLink to="/weeks" icon={<Calendar className="w-4 h-4" />} label="Trades" isActive={location.pathname.startsWith('/weeks')} />
            <NavLink to="/reports" icon={<LineChart className="w-4 h-4" />} label="Reports" isActive={location.pathname === '/reports'} />
            <NavLink to="/settings" icon={<Settings className="w-4 h-4" />} label="Settings" isActive={location.pathname === '/settings'} />
          </nav>
          
          <div className="md:hidden">
            <button 
              className="p-2 rounded-lg bg-tradeLight/20 hover:bg-tradeLight/30 transition-colors"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-white" />
              ) : (
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'} absolute w-full bg-tradeDark/95 backdrop-blur-md shadow-lg`}>
        <div className="px-2 pt-2 pb-3 space-y-1 divide-y divide-tradeLight/10">
          <MobileNavLink to="/" label="Dashboard" icon={<TradeTrackrLogo />} isActive={location.pathname === '/'} onClick={() => setMobileMenuOpen(false)} />
          <MobileNavLink to="/users" label="Participants" icon={<Users className="w-5 h-5" />} isActive={location.pathname === '/users'} onClick={() => setMobileMenuOpen(false)} />
          <MobileNavLink to="/weeks" label="Trades" icon={<Calendar className="w-5 h-5" />} isActive={location.pathname.startsWith('/weeks')} onClick={() => setMobileMenuOpen(false)} />
          <MobileNavLink to="/reports" label="Reports" icon={<LineChart className="w-5 h-5" />} isActive={location.pathname === '/reports'} onClick={() => setMobileMenuOpen(false)} />
          <MobileNavLink to="/settings" label="Settings" icon={<Settings className="w-5 h-5" />} isActive={location.pathname === '/settings'} onClick={() => setMobileMenuOpen(false)} />
        </div>
      </div>
    </header>
  );
};

interface NavLinkProps {
  to: string;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ to, label, icon, isActive }) => {
  return (
    <Link 
      to={to} 
      className={`flex items-center space-x-1 px-3 py-2 rounded-lg ${
        isActive 
          ? 'bg-tradeHighlight/20 text-tradeHighlight' 
          : 'text-white hover:bg-tradeLight/20'
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

interface MobileNavLinkProps {
  to: string;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}

const MobileNavLink: React.FC<MobileNavLinkProps> = ({ to, label, icon, isActive, onClick }) => {
  return (
    <Link 
      to={to} 
      className={`flex items-center space-x-3 px-4 py-3 rounded-md font-medium ${
        isActive 
          ? 'bg-tradeHighlight/20 text-tradeHighlight' 
          : 'text-white'
      }`}
      onClick={onClick}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

export default Header; 