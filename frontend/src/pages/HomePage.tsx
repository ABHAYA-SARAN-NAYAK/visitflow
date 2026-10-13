import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Sparkles, TrendingUp, MapPin, ArrowRight, Clock, ChevronRight, Star, Zap, Shield, Bot, Map } from 'lucide-react';
import { useStore } from '../store/useStore';
import PlaceCard from '../components/common/PlaceCard';
import CrowdBadge from '../components/common/CrowdBadge';

const categories = ['All', 'Temple', 'Fort', 'Beach', 'Monument', 'Palace', 'Museum', 'Park', 'Lake', 'Waterfall'];

export default function HomePage() {
  const { places, toggleChat, activeFilter, setActiveFilter } = useStore();
  const [showAllTrending, setShowAllTrending] = useState(false);
  const navigate = useNavigate();

  const filteredPlaces = activeFilter === 'All'
    ? places
    : places.filter(p => p.category.toLowerCase() === activeFilter.toLowerCase());

  const trendingPlaces = [...places].sort((a, b) => b.liveCrowdPct - a.liveCrowdPct).slice(0, 6);
  const quietPlaces = [...places].sort((a, b) => a.liveCrowdPct - b.liveCrowdPct).slice(0, 6);
  const hiddenGems = places.filter(p => p.hiddenGemScore >= 6).slice(0, 6);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-accent/5 via-bg-primary to-bg-primary pt-8 pb-16 sm:pt-12 sm:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            {/* Live indicator */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent-light rounded-full mb-6">
              <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              <span className="text-xs font-semibold text-accent">Live crowd data for {places.length} destinations</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-text-primary leading-tight">
              Know before you go.{' '}
              <span className="text-gradient">Always.</span>
            </h1>
            <p className="mt-4 text-lg text-text-muted max-w-2xl mx-auto leading-relaxed">
              Real-time AI crowd predictions for every tourist destination. 
              Avoid queues, find hidden gems, and plan the perfect visit — all powered by 40+ data signals.
            </p>

            {/* Search Bar */}
            <div className="mt-8 max-w-xl mx-auto">
              <button
                onClick={() => {
                  const event = new KeyboardEvent('keydown', { key: 'k', metaKey: true });
                  window.dispatchEvent(event);
                }}
                className="w-full flex items-center gap-3 px-5 py-4 bg-surface border border-border rounded-2xl shadow-card hover:shadow-card-hover transition-all text-left group"
              >
                <Search className="w-5 h-5 text-text-muted group-hover:text-accent transition-colors" />
                <span className="flex-1 text-text-muted">Search Taj Mahal, Jaipur, beaches...</span>
                <kbd className="hidden sm:flex items-center gap-0.5 px-2 py-1 bg-bg-secondary border border-border rounded-lg text-xs text-text-muted">
                  ⌘K
                </kbd>
              </button>
            </div>

            {/* Quick Stats */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
              <div className="flex items-center gap-2 text-sm text-text-muted">
                <Zap className="w-4 h-4 text-accent" />
                <span><strong className="text-text-primary">94.7%</strong> prediction accuracy</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-text-muted">
                <Shield className="w-4 h-4 text-accent" />
                <span><strong className="text-text-primary">90 sec</strong> update frequency</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-text-muted">
                <Map className="w-4 h-4 text-accent" />
                <span><strong className="text-text-primary">{places.length}+</strong> destinations</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ask Seena CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-10 relative z-10">
        <button
          onClick={toggleChat}
          className="w-full max-w-2xl mx-auto flex items-center gap-4 p-4 sm:p-5 bg-accent text-white rounded-2xl shadow-float hover:shadow-xl transition-all group"
        >
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <Bot className="w-6 h-6" />
          </div>
          <div className="flex-1 text-left">
            <h3 className="font-display font-semibold text-base">Ask Seena anything</h3>
            <p className="text-sm text-white/80 mt-0.5">
              "Plan a 2-day Agra trip" · "Is Taj Mahal crowded?" · "Hidden gems near Jaipur"
            </p>
          </div>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform flex-shrink-0" />
        </button>
      </section>

      {/* Category Filters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeFilter === cat
                  ? 'bg-accent text-white shadow-sm'
                  : 'bg-surface border border-border text-text-muted hover:border-accent/30 hover:text-accent'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Trending Now */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="section-title flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-crowd-high" />
              Trending Now
            </h2>
            <p className="text-sm text-text-muted mt-1">Popular destinations with live crowd levels</p>
          </div>
          <Link to="/search" className="btn-ghost flex items-center gap-1 text-accent">
            View all <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {trendingPlaces.map((place) => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </div>
      </section>

      {/* Best Time to Visit Now */}
      <section className="bg-bg-secondary py-12 mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="section-title flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-accent" />
                Great Time to Visit
              </h2>
              <p className="text-sm text-text-muted mt-1">Quiet destinations perfect for visiting right now</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {quietPlaces.map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        </div>
      </section>

      {/* Hidden Gems */}
      {hiddenGems.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="section-title">🌿 Hidden Gems</h2>
              <p className="text-sm text-text-muted mt-1">Under-visited wonders most tourists miss</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {hiddenGems.map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        </section>
      )}

      {/* How It Works */}
      <section className="bg-accent/5 py-16 mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title text-center mb-10">How VISIT FLOW Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '📡',
                title: '40+ Data Signals',
                description: 'IoT sensors, satellite imagery, telecom data, social media, and community reports — fused every 90 seconds.',
              },
              {
                icon: '🤖',
                title: 'AI Prediction Engine',
                description: 'ML models analyse patterns to predict crowd levels 48 hours ahead with 94.7% accuracy.',
              },
              {
                icon: '💬',
                title: 'Ask Seena',
                description: 'Our AI assistant plans trips, finds quiet windows, and answers any travel question in natural language.',
              },
            ].map((item, i) => (
              <div key={i} className="card p-6 text-center">
                <span className="text-4xl">{item.icon}</span>
                <h3 className="font-display font-semibold text-lg mt-4 mb-2">{item.title}</h3>
                <p className="text-sm text-text-muted leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-surface py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                  <span className="text-white font-display font-bold text-sm">V</span>
                </div>
                <span className="font-display font-semibold">VISIT FLOW</span>
              </div>
              <p className="text-xs text-text-muted leading-relaxed">
                Know before you go. Real-time AI crowd predictions for every tourist destination.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">Product</h4>
              <ul className="space-y-2 text-xs text-text-muted">
                <li><a href="#" className="hover:text-accent transition-colors">Live Crowd Data</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Trip Planner</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Crowd Alerts</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Hidden Gems</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">Company</h4>
              <ul className="space-y-2 text-xs text-text-muted">
                <li><a href="#" className="hover:text-accent transition-colors">About</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">For Tourism Boards</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">API</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">Legal</h4>
              <ul className="space-y-2 text-xs text-text-muted">
                <li><a href="#" className="hover:text-accent transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t border-border flex items-center justify-between">
            <p className="text-xs text-text-muted">© 2026 VISIT FLOW. All rights reserved.</p>
            <p className="text-xs text-text-muted">Made with ❤️ in India</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
