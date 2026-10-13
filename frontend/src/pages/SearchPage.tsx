import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, MapPin, Clock, Users, Star, Filter, ChevronDown, Grid3X3, List } from 'lucide-react';
import { useStore } from '../store/useStore';
import { places, getCrowdLabel, getCrowdLevelFromPct } from '../data/places';
import PlaceCard from '../components/common/PlaceCard';

const CATEGORIES = ['All', 'Temple', 'Fort', 'Beach', 'Monument', 'Palace', 'Museum', 'Park', 'Lake', 'Waterfall', 'Historical', 'Nature'];
const CROWD_FILTERS = ['Any', 'Low', 'Moderate', 'High', 'Critical'];
const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'crowd-low', label: 'Crowd: Low to High' },
  { value: 'crowd-high', label: 'Crowd: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'wait-low', label: 'Shortest Wait' },
  { value: 'hidden-gem', label: 'Hidden Gem Score' },
];

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState('All');
  const [crowdFilter, setCrowdFilter] = useState('Any');
  const [sortBy, setSortBy] = useState('relevance');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [freeEntryOnly, setFreeEntryOnly] = useState(false);
  const [openNowOnly, setOpenNowOnly] = useState(false);

  const filteredPlaces = useMemo(() => {
    let result = [...places];

    // Text search
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        p.state.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }

    // Category
    if (category !== 'All') {
      result = result.filter(p =>
        p.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Crowd level
    if (crowdFilter !== 'Any') {
      result = result.filter(p =>
        getCrowdLabel(p.crowdLevel).toLowerCase() === crowdFilter.toLowerCase()
      );
    }

    // Free entry
    if (freeEntryOnly) {
      result = result.filter(p => p.entryFeeIndian === 0);
    }

    // Sorting
    switch (sortBy) {
      case 'crowd-low':
        result.sort((a, b) => a.liveCrowdPct - b.liveCrowdPct);
        break;
      case 'crowd-high':
        result.sort((a, b) => b.liveCrowdPct - a.liveCrowdPct);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'wait-low':
        result.sort((a, b) => a.waitTimeMins - b.waitTimeMins);
        break;
      case 'hidden-gem':
        result.sort((a, b) => b.hiddenGemScore - a.hiddenGemScore);
        break;
    }

    return result;
  }, [query, category, crowdFilter, sortBy, freeEntryOnly, openNowOnly]);

  return (
    <div className="min-h-screen bg-bg-primary pt-20">
      {/* Search Header */}
      <div className="bg-surface border-b border-border sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search destinations, cities, or experiences..."
                className="w-full pl-12 pr-4 py-3 bg-bg-secondary rounded-xl text-sm outline-none focus:ring-2 focus:ring-accent/20 transition-all"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${
                showFilters ? 'border-accent bg-accent-light text-accent' : 'border-border text-text-secondary hover:border-accent/30'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="text-sm font-medium hidden sm:inline">Filters</span>
            </button>
          </div>

          {/* Categories */}
          <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1 scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`chip whitespace-nowrap ${
                  category === cat
                    ? 'bg-accent text-white border-accent'
                    : ''
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-surface border-b border-border animate-slide-up">
          <div className="max-w-7xl mx-auto px-4 py-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 block">Crowd Level</label>
              <div className="flex flex-wrap gap-2">
                {CROWD_FILTERS.map((f) => (
                  <button
                    key={f}
                    onClick={() => setCrowdFilter(f)}
                    className={`chip text-xs ${crowdFilter === f ? 'bg-accent text-white border-accent' : ''}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 block">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-field w-full text-sm"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block">Quick Filters</label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={freeEntryOnly}
                  onChange={(e) => setFreeEntryOnly(e.target.checked)}
                  className="accent-accent"
                />
                <span className="text-sm text-text-secondary">Free Entry</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={openNowOnly}
                  onChange={(e) => setOpenNowOnly(e.target.checked)}
                  className="accent-accent"
                />
                <span className="text-sm text-text-secondary">Open Now</span>
              </label>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setCategory('All');
                  setCrowdFilter('Any');
                  setSortBy('relevance');
                  setFreeEntryOnly(false);
                  setOpenNowOnly(false);
                }}
                className="btn-ghost text-sm w-full"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Results header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-display font-semibold text-text-primary">
              {query ? `Results for "${query}"` : 'All Destinations'}
            </h2>
            <p className="text-sm text-text-secondary">
              {filteredPlaces.length} destination{filteredPlaces.length !== 1 ? 's' : ''} found
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                viewMode === 'grid' ? 'bg-accent text-white' : 'bg-bg-secondary text-text-muted'
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                viewMode === 'list' ? 'bg-accent text-white' : 'bg-bg-secondary text-text-muted'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Place grid/list */}
        {filteredPlaces.length > 0 ? (
          <div className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'
              : 'space-y-4'
          }>
            {filteredPlaces.map((place) => (
              <PlaceCard key={place.slug} place={place as any} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto bg-bg-secondary rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-text-muted" />
            </div>
            <h3 className="text-lg font-display font-semibold text-text-primary mb-2">No destinations found</h3>
            <p className="text-sm text-text-secondary max-w-md mx-auto">
              Try adjusting your search or filters. We have {places.length} destinations across India.
            </p>
            <button
              onClick={() => {
                setQuery('');
                setCategory('All');
                setCrowdFilter('Any');
              }}
              className="btn-primary mt-4"
            >
              Clear Search
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
