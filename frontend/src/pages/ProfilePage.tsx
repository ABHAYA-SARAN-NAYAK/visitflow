import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Star, Award, Calendar, Heart, Clock, LogOut, Settings, Camera, ChevronRight, Bell, Compass, Trophy, Flame, Target, Shield, Zap } from 'lucide-react';
import { useStore } from '../store/useStore';
import { places, getCrowdLabel, getCrowdColor } from '../data/places';
import CrowdBadge from '../components/common/CrowdBadge';

const MOCK_CHECKINS = [
  { id: '1', placeName: 'Taj Mahal', city: 'Agra', date: '2 days ago', crowdLevel: 'moderate' as const, emoji: '🕌', rating: 5 },
  { id: '2', placeName: 'Hawa Mahal', city: 'Jaipur', date: '5 days ago', crowdLevel: 'low' as const, emoji: '🏰', rating: 4 },
  { id: '3', placeName: 'India Gate', city: 'Delhi', date: '1 week ago', crowdLevel: 'high' as const, emoji: '🇮🇳', rating: 4 },
  { id: '4', placeName: 'Hampi', city: 'Karnataka', date: '2 weeks ago', crowdLevel: 'low' as const, emoji: '🏛️', rating: 5 },
  { id: '5', placeName: 'Baga Beach', city: 'Goa', date: '3 weeks ago', crowdLevel: 'moderate' as const, emoji: '🏖️', rating: 3 },
];

const MOCK_BADGES = [
  { id: 'b1', name: 'Early Bird', emoji: '🌅', description: 'Visited 3 places before 8 AM', earned: true },
  { id: 'b2', name: 'Crowd Dodger', emoji: '🥷', description: 'Visited 5 places at LOW crowd', earned: true },
  { id: 'b3', name: 'Explorer', emoji: '🧭', description: 'Visited 10 different destinations', earned: true },
  { id: 'b4', name: 'Heritage Lover', emoji: '🏰', description: 'Visited 5 forts or palaces', earned: true },
  { id: 'b5', name: 'Temple Trail', emoji: '🛕', description: 'Visited 5 temples', earned: false },
  { id: 'b6', name: 'Beach Bum', emoji: '🏖️', description: 'Visited 3 beaches', earned: false },
  { id: 'b7', name: 'Night Owl', emoji: '🦉', description: 'Visited 3 places after 6 PM', earned: false },
  { id: 'b8', name: 'Weekend Warrior', emoji: '⚔️', description: '10 weekend check-ins', earned: false },
];

export default function ProfilePage() {
  const { user, savedPlaces, setUser, openAuthModal } = useStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'checkins' | 'saved' | 'badges' | 'stats'>('checkins');

  const savedPlaceData = places.filter(p => savedPlaces.includes(p.slug));

  if (!user) {
    return (
      <div className="min-h-screen bg-bg-primary pt-20 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 mx-auto bg-accent-light text-accent rounded-full flex items-center justify-center mb-4">
            <Compass className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-display font-bold text-text-primary mb-2">
            Start Your Journey
          </h2>
          <p className="text-text-secondary mb-6">
            Sign in to track your visits, earn badges, save favorite places, and get personalized crowd predictions.
          </p>
          <button onClick={openAuthModal} className="btn-primary">
            Sign In / Create Account
          </button>
        </div>
      </div>
    );
  }

  const earnedBadges = MOCK_BADGES.filter(b => b.earned);
  const lockedBadges = MOCK_BADGES.filter(b => !b.earned);

  return (
    <div className="min-h-screen bg-bg-primary pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Profile Header */}
        <div className="card overflow-hidden mb-6">
          <div className="h-32 bg-gradient-to-r from-accent via-accent/80 to-emerald-600 relative">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
              }} />
            </div>
          </div>

          <div className="px-6 pb-6 -mt-12 relative">
            <div className="flex items-end gap-4 mb-4">
              <div className="relative">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-24 h-24 rounded-2xl border-4 border-white shadow-lg bg-white object-cover"
                />
                <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-accent text-white rounded-xl flex items-center justify-center shadow-md hover:scale-105 transition-transform">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 pt-12">
                <h1 className="text-xl font-display font-bold text-text-primary">{user.name}</h1>
                <p className="text-sm text-text-secondary">{user.email}</p>
              </div>
              <button className="w-10 h-10 rounded-xl bg-bg-secondary text-text-muted hover:text-text-primary flex items-center justify-center">
                <Settings className="w-5 h-5" />
              </button>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-4 gap-3">
              {[
                { icon: Flame, label: 'Explorer Points', value: user.explorerPoints, color: 'text-orange-500' },
                { icon: MapPin, label: 'Check-ins', value: user.totalCheckins, color: 'text-accent' },
                { icon: Heart, label: 'Saved', value: savedPlaceData.length, color: 'text-pink-500' },
                { icon: Trophy, label: 'Badges', value: earnedBadges.length, color: 'text-yellow-500' },
              ].map((stat) => (
                <div key={stat.label} className="bg-bg-secondary rounded-xl p-3 text-center">
                  <stat.icon className={`w-5 h-5 mx-auto ${stat.color}`} />
                  <p className="text-lg font-bold text-text-primary mt-1">{stat.value}</p>
                  <p className="text-[10px] text-text-muted font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-bg-secondary p-1 rounded-xl mb-6">
          {[
            { id: 'checkins' as const, label: 'Check-ins', icon: MapPin },
            { id: 'saved' as const, label: 'Saved', icon: Heart },
            { id: 'badges' as const, label: 'Badges', icon: Award },
            { id: 'stats' as const, label: 'Stats', icon: Target },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-accent shadow-sm'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'checkins' && (
          <div className="space-y-3 animate-fade-in">
            {MOCK_CHECKINS.map((checkin) => (
              <div key={checkin.id} className="card p-4 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="w-12 h-12 bg-bg-secondary rounded-xl flex items-center justify-center text-2xl">
                  {checkin.emoji}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm text-text-primary">{checkin.placeName}</h4>
                  <p className="text-xs text-text-secondary">{checkin.city} · {checkin.date}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${i < checkin.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`}
                      />
                    ))}
                  </div>
                  <span
                    className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase"
                    style={{
                      color: getCrowdColor(checkin.crowdLevel),
                      backgroundColor: getCrowdColor(checkin.crowdLevel) + '15',
                    }}
                  >
                    {checkin.crowdLevel}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'saved' && (
          <div className="animate-fade-in">
            {savedPlaceData.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {savedPlaceData.map((place) => (
                  <div
                    key={place.slug}
                    onClick={() => navigate(`/place/${place.slug}`)}
                    className="card p-4 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <img
                      src={place.images[0]}
                      alt={place.name}
                      className="w-16 h-16 rounded-xl object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm text-text-primary truncate">{place.emoji} {place.name}</h4>
                      <p className="text-xs text-text-secondary">{place.city}, {place.state}</p>
                      <p className="text-xs text-text-muted mt-1">Best time: {place.bestVisitWindow}</p>
                    </div>
                    <CrowdBadge level={place.crowdLevel} pct={place.liveCrowdPct} small />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Heart className="w-12 h-12 mx-auto text-text-muted mb-3" />
                <p className="text-text-secondary">No saved places yet</p>
                <button onClick={() => navigate('/search')} className="btn-primary mt-3 text-sm">
                  Explore Destinations
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'badges' && (
          <div className="animate-fade-in space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-text-primary mb-3">Earned ({earnedBadges.length})</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {earnedBadges.map((badge) => (
                  <div key={badge.id} className="card p-4 text-center">
                    <div className="text-3xl mb-2">{badge.emoji}</div>
                    <p className="text-sm font-semibold text-text-primary">{badge.name}</p>
                    <p className="text-[10px] text-text-muted mt-1">{badge.description}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-text-muted mb-3">Locked ({lockedBadges.length})</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {lockedBadges.map((badge) => (
                  <div key={badge.id} className="card p-4 text-center opacity-50">
                    <div className="text-3xl mb-2 grayscale">{badge.emoji}</div>
                    <p className="text-sm font-semibold text-text-muted">{badge.name}</p>
                    <p className="text-[10px] text-text-muted mt-1">{badge.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="animate-fade-in grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="card p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">Crowd Avoidance Score</p>
                  <p className="text-2xl font-bold text-accent">87%</p>
                </div>
              </div>
              <p className="text-xs text-text-muted">You visit during low-crowd windows 87% of the time. Better than 92% of VISIT FLOW users!</p>
            </div>

            <div className="card p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">Time Saved</p>
                  <p className="text-2xl font-bold text-orange-600">4.2 hrs</p>
                </div>
              </div>
              <p className="text-xs text-text-muted">Total wait time saved by visiting during AI-recommended windows.</p>
            </div>

            <div className="card p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">Places Visited</p>
                  <p className="text-2xl font-bold text-blue-600">{user.totalCheckins}</p>
                </div>
              </div>
              <p className="text-xs text-text-muted">Across 4 states and 6 cities. You're in the top 15% of explorers!</p>
            </div>

            <div className="card p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">Favorite Day</p>
                  <p className="text-2xl font-bold text-purple-600">Tuesday</p>
                </div>
              </div>
              <p className="text-xs text-text-muted">You tend to visit on Tuesdays — smart choice, it's statistically the least crowded day!</p>
            </div>

            <div className="card p-5 sm:col-span-2">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-yellow-100 text-yellow-600 rounded-xl flex items-center justify-center">
                  <Star className="w-5 h-5" />
                </div>
                <p className="text-sm font-semibold text-text-primary">Explorer Level</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-bg-secondary rounded-full h-3">
                  <div className="bg-gradient-to-r from-accent to-emerald-400 h-full rounded-full transition-all" style={{ width: `${Math.min(100, (user.explorerPoints / 500) * 100)}%` }} />
                </div>
                <span className="text-sm font-semibold text-accent">{user.explorerPoints}/500 XP</span>
              </div>
              <p className="text-xs text-text-muted mt-2">
                {500 - user.explorerPoints} more points to reach <strong>Silver Explorer</strong> level. Keep visiting!
              </p>
            </div>
          </div>
        )}

        {/* Logout */}
        <div className="mt-8 text-center">
          <button
            onClick={() => {
              setUser(null);
              navigate('/');
            }}
            className="text-sm text-text-muted hover:text-red-500 flex items-center gap-2 mx-auto transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
