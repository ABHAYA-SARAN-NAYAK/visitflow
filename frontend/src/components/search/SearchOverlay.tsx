import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Mic, Clock, TrendingUp, ArrowRight, MapPin } from 'lucide-react';
import { useStore } from '../../store/useStore';
import CrowdBadge from '../common/CrowdBadge';

interface SearchOverlayProps {
  onClose: () => void;
}

export default function SearchOverlay({ onClose }: SearchOverlayProps) {
  const { searchQuery, searchResults, recentSearches, setSearchQuery, searchPlaces, addRecentSearch, places } = useStore();
  const [query, setQuery] = useState(searchQuery);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const trending = places.filter(p => p.liveCrowdPct > 50).slice(0, 3);

  useEffect(() => {
    inputRef.current?.focus();
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleSearch = useCallback(
    (value: string) => {
      setQuery(value);
      setSearchQuery(value);
      searchPlaces(value);
      setSelectedIndex(-1);
    },
    [setSearchQuery, searchPlaces]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.length >= 2) searchPlaces(query);
    }, 250);
    return () => clearTimeout(timer);
  }, [query, searchPlaces]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, searchResults.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      const place = searchResults[selectedIndex];
      if (place) {
        addRecentSearch(place.name);
        navigate(`/place/${place.slug}`);
        onClose();
      }
    }
  };

  const handleSelect = (slug: string, name: string) => {
    addRecentSearch(name);
    navigate(`/place/${slug}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div
        className="max-w-2xl mx-auto mt-20 mx-4 sm:mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-surface rounded-2xl shadow-chat overflow-hidden border border-border">
          {/* Search Input */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
            <Search className="w-5 h-5 text-text-muted flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search any destination, city, or landmark..."
              className="flex-1 text-base text-text-primary placeholder:text-text-muted outline-none bg-transparent"
            />
            {query && (
              <button onClick={() => handleSearch('')} className="text-text-muted hover:text-text-primary">
                <X className="w-4 h-4" />
              </button>
            )}
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-accent-light text-accent hover:bg-accent hover:text-white transition-colors">
              <Mic className="w-4 h-4" />
            </button>
          </div>

          {/* Results */}
          <div className="max-h-[60vh] overflow-y-auto">
            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="py-2">
                {searchResults.map((place, index) => (
                  <button
                    key={place.id}
                    onClick={() => handleSelect(place.slug, place.name)}
                    className={`w-full flex items-center gap-3 px-5 py-3 text-left hover:bg-bg-secondary transition-colors ${
                      index === selectedIndex ? 'bg-accent-light' : ''
                    }`}
                  >
                    <span className="text-2xl flex-shrink-0">{place.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-text-primary truncate">{place.name}</span>
                        <CrowdBadge level={place.crowdLevel} pct={place.liveCrowdPct} small />
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-text-muted">{place.city}, {place.state}</span>
                        {place.waitTimeMins > 0 && (
                          <span className="text-xs text-text-muted">· ⏱ {place.waitTimeMins} min wait</span>
                        )}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-text-muted flex-shrink-0" />
                  </button>
                ))}
              </div>
            )}

            {/* No Results */}
            {query.length >= 2 && searchResults.length === 0 && (
              <div className="py-8 text-center">
                <p className="text-text-muted text-sm">No destinations found for "{query}"</p>
                <p className="text-text-muted text-xs mt-2">Try a different search term</p>
                <div className="mt-4 space-y-1">
                  <p className="text-xs font-medium text-text-muted uppercase tracking-wider px-5">Trending Now</p>
                  {trending.map((place) => (
                    <button
                      key={place.id}
                      onClick={() => handleSelect(place.slug, place.name)}
                      className="w-full flex items-center gap-3 px-5 py-2.5 text-left hover:bg-bg-secondary transition-colors"
                    >
                      <TrendingUp className="w-4 h-4 text-crowd-high flex-shrink-0" />
                      <span className="text-sm text-text-primary">{place.emoji} {place.name}</span>
                      <CrowdBadge level={place.crowdLevel} pct={place.liveCrowdPct} small />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Default State */}
            {query.length < 2 && (
              <div className="py-3">
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs font-medium text-text-muted uppercase tracking-wider px-5 mb-1">Recent</p>
                    {recentSearches.slice(0, 4).map((search, i) => (
                      <button
                        key={i}
                        onClick={() => handleSearch(search)}
                        className="w-full flex items-center gap-3 px-5 py-2 text-left hover:bg-bg-secondary transition-colors"
                      >
                        <Clock className="w-4 h-4 text-text-muted" />
                        <span className="text-sm text-text-primary">{search}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Popular */}
                <div>
                  <p className="text-xs font-medium text-text-muted uppercase tracking-wider px-5 mb-1">Popular Destinations</p>
                  {places.slice(0, 5).map((place) => (
                    <button
                      key={place.id}
                      onClick={() => handleSelect(place.slug, place.name)}
                      className="w-full flex items-center gap-3 px-5 py-2.5 text-left hover:bg-bg-secondary transition-colors"
                    >
                      <MapPin className="w-4 h-4 text-accent" />
                      <span className="text-sm">{place.emoji} {place.name}</span>
                      <span className="text-xs text-text-muted ml-auto">{place.city}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-5 py-3 border-t border-border bg-bg-primary/50 flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-text-muted">
              <span>↑↓ Navigate</span>
              <span>↵ Select</span>
              <span>Esc Close</span>
            </div>
            <span className="text-xs text-text-muted">{places.length} destinations</span>
          </div>
        </div>
      </div>
    </div>
  );
}
