import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, Users, Calendar, Settings, LineChart } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-tradeDark/90 backdrop-blur-md sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-tradeHighlight w-10 h-10 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-tradeBg" />
            </div>
            <span className="text-xl font-bold text-white">TradeTrackr</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-1">
            <NavLink to="/" icon={<BarChart3 className="w-4 h-4" />} label="Dashboard" />
            <NavLink to="/users" icon={<Users className="w-4 h-4" />} label="Participants" />
            <NavLink to="/weeks" icon={<Calendar className="w-4 h-4" />} label="Trades" />
            <NavLink to="/reports" icon={<LineChart className="w-4 h-4" />} label="Reports" />
            <NavLink to="/settings" icon={<Settings className="w-4 h-4" />} label="Settings" />
          </nav>
          
          <div className="md:hidden">
            <button className="p-2 rounded-lg bg-tradeLight/20 hover:bg-tradeLight/30">
              <span className="sr-only">Open menu</span>
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu - hidden by default */}
      <div className="md:hidden hidden">
        <div className="px-2 pt-2 pb-3 space-y-1">
          <MobileNavLink to="/" label="Dashboard" />
          <MobileNavLink to="/users" label="Participants" />
          <MobileNavLink to="/weeks" label="Trades" />
          <MobileNavLink to="/reports" label="Reports" />
          <MobileNavLink to="/settings" label="Settings" />
        </div>
      </div>
    </header>
  );
};

interface NavLinkProps {
  to: string;
  label: string;
  icon: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ to, label, icon }) => {
  return (
    <Link 
      to={to} 
      className="flex items-center space-x-1 px-3 py-2 rounded-lg text-white hover:bg-tradeLight/20"
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

interface MobileNavLinkProps {
  to: string;
  label: string;
}

const MobileNavLink: React.FC<MobileNavLinkProps> = ({ to, label }) => {
  return (
    <Link 
      to={to} 
      className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-tradeLight/20"
    >
      {label}
    </Link>
  );
};

export default Header; 