import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Search, Menu, X, Map, Calendar, User, ChevronDown } from 'lucide-react';
import { useStore } from '../../store/useStore';
import SearchOverlay from '../search/SearchOverlay';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 bg-accent rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                <span className="text-white font-display font-bold text-lg">V</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="font-display text-xl font-semibold text-text-primary tracking-tight">
                  VISIT<span className="text-accent"> FLOW</span>
                </h1>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              <Link
                to="/"
                className="px-4 py-2 text-sm font-medium text-text-muted hover:text-accent hover:bg-accent-light rounded-lg transition-all"
              >
                Explore
              </Link>
              <Link
                to="/search"
                className="px-4 py-2 text-sm font-medium text-text-muted hover:text-accent hover:bg-accent-light rounded-lg transition-all"
              >
                Destinations
              </Link>
              <Link
                to="/trip-planner"
                className="px-4 py-2 text-sm font-medium text-text-muted hover:text-accent hover:bg-accent-light rounded-lg transition-all"
              >
                Trip Planner
              </Link>
            </nav>

            {/* Right Section */}
            <div className="flex items-center gap-2">
              {/* Search Button */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center gap-2 px-3 py-2 bg-bg-secondary hover:bg-bg-primary border border-border rounded-xl text-sm text-text-muted transition-all"
              >
                <Search className="w-4 h-4" />
                <span className="hidden sm:inline">Search destinations...</span>
                <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-surface border border-border rounded text-[10px] text-text-muted">
                  ⌘K
                </kbd>
              </button>

              {/* CTA */}
              <Link
                to="/trip-planner"
                className="hidden sm:flex btn-primary py-2 px-4 text-sm"
              >
                <Calendar className="w-4 h-4 mr-1.5" />
                Plan Trip
              </Link>

              {/* Profile */}
              <button
                onClick={() => navigate('/profile')}
                className="w-9 h-9 bg-accent-light text-accent rounded-xl flex items-center justify-center hover:bg-accent hover:text-white transition-all"
              >
                <User className="w-4 h-4" />
              </button>

              {/* Mobile Menu */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl hover:bg-bg-secondary transition-colors"
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border bg-surface animate-slide-up">
            <nav className="px-4 py-3 space-y-1">
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-text-primary hover:bg-accent-light rounded-lg transition-colors"
              >
                <Map className="w-4 h-4 text-accent" />
                Explore
              </Link>
              <Link
                to="/search"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-text-primary hover:bg-accent-light rounded-lg transition-colors"
              >
                <Search className="w-4 h-4 text-accent" />
                Destinations
              </Link>
              <Link
                to="/trip-planner"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-text-primary hover:bg-accent-light rounded-lg transition-colors"
              >
                <Calendar className="w-4 h-4 text-accent" />
                Trip Planner
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Search Overlay */}
      {isSearchOpen && <SearchOverlay onClose={() => setIsSearchOpen(false)} />}
    </>
  );
}
