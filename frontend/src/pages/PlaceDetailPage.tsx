import { useParams, useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import {
  ArrowLeft, Heart, Share2, Bell, MapPin, Clock, Users, Star, Car, AlertTriangle,
  Calendar, Camera, Accessibility, Info, ChevronRight, ExternalLink, CheckCircle2,
  ThumbsUp, TrendingUp, TrendingDown, Sun, Cloud, Droplets, Wind
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useStore } from '../store/useStore';
import CrowdRingMeter from '../components/common/CrowdRingMeter';
import CrowdBadge from '../components/common/CrowdBadge';
import { getCrowdColor, getCrowdLevelFromPct, getCrowdLabel } from '../data/places';

export default function PlaceDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { places, savedPlaces, toggleSavedPlace, toggleChat, addToTrip } = useStore();
  const [showAlertModal, setShowAlertModal] = useState(false);

  const place = places.find(p => p.slug === slug);
  if (!place) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-display font-bold mb-2">Place not found</h2>
          <button onClick={() => navigate('/')} className="btn-primary mt-4">Go Home</button>
        </div>
      </div>
    );
  }

  const isSaved = savedPlaces.includes(place.id);

  // 24-hour forecast data
  const hourlyData = place.avgCrowdByHour.map((pct, hour) => ({
    hour: `${hour.toString().padStart(2, '0')}:00`,
    label: hour === 0 ? '12AM' : hour === 12 ? '12PM' : hour < 12 ? `${hour}AM` : `${hour - 12}PM`,
    crowd: pct,
    level: getCrowdLevelFromPct(pct),
  }));

  // 7-day heatmap data
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const hours = Array.from({ length: 16 }, (_, i) => i + 6); // 6 AM to 10 PM
  const heatmapData = days.map((day, di) => ({
    day,
    hours: hours.map(h => {
      const base = place.avgCrowdByHour[h];
      const dayFactor = place.avgCrowdByDay[di] / 70;
      return Math.max(5, Math.min(98, Math.round(base * dayFactor)));
    }),
  }));

  // Alternatives
  const alternatives = places
    .filter(p => p.id !== place.id && p.state === place.state)
    .sort((a, b) => a.liveCrowdPct - b.liveCrowdPct)
    .slice(0, 4);

  // Crowd score breakdown
  const dayOfWeek = new Date().getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  const breakdown = [
    { name: `Day of week (${days[dayOfWeek === 0 ? 6 : dayOfWeek - 1]})`, impact: isWeekend ? 22 : -8, description: isWeekend ? 'Weekend boost' : 'Weekday reduction' },
    { name: 'Weather (Sunny, 28°C)', impact: 12, description: 'Good weather attracts more visitors' },
    { name: 'Social media activity', impact: 9, description: 'Above average mentions today' },
    { name: 'Historical baseline', impact: -15, description: 'March average lower than peak months' },
    { name: 'Community check-ins', impact: 6, description: 'Recent reports suggest moderate crowd' },
    { name: 'School holidays', impact: 0, description: 'No school holidays currently active' },
  ];

  // Mock community checkins
  const checkins = [
    { name: 'Neha R.', time: '12 min ago', crowd: 'Moderate', wait: 20, note: 'East gate is less crowded than main entrance', verified: true },
    { name: 'Rohit K.', time: '45 min ago', crowd: 'High', wait: 35, note: 'Bring water, it\'s very hot inside. Photography is wonderful.', verified: true },
    { name: 'Priya S.', time: '2 hours ago', crowd: 'Moderate', wait: 15, note: 'Manageable queues, good experience overall', verified: false },
  ];

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Hero */}
      <div className="relative">
        <div className="h-64 sm:h-80 lg:h-96 bg-gradient-to-br from-accent/30 to-accent/10 relative">
          <img
            src={place.images[0]}
            alt={place.name}
            className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        </div>

        {/* Back button + actions */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-sm hover:bg-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <button onClick={() => toggleSavedPlace(place.id)} className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm transition-colors ${isSaved ? 'bg-red-500 text-white' : 'bg-white/90 backdrop-blur-sm hover:bg-white'}`}>
              <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
            </button>
            <button className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-sm hover:bg-white transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Hero content */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-xs font-medium text-white/90 bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-full">{place.category}</span>
              {place.isVerified && (
                <span className="text-xs font-medium text-white/90 bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Verified
                </span>
              )}
              {place.tags.slice(0, 3).map(tag => (
                <span key={tag} className="text-xs text-white/80 bg-white/10 px-2 py-0.5 rounded-full">{tag}</span>
              ))}
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-1">
              {place.emoji} {place.name}
            </h1>
            <p className="text-white/80 text-sm flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> {place.city}, {place.state}
              <span className="mx-1">·</span>
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> {place.rating} ({place.reviewCount.toLocaleString()} reviews)
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">

            {/* Live Crowd Status Card */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-lg font-semibold">Live Crowd Status</h2>
                <div className="flex items-center gap-1.5 text-xs text-text-muted">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  Updated 30 sec ago
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <CrowdRingMeter percentage={place.liveCrowdPct} />
                <div className="flex-1 space-y-3">
                  <div className="p-3 bg-bg-secondary rounded-xl">
                    <p className="text-sm text-text-primary leading-relaxed">
                      {place.liveCrowdPct > 70
                        ? `⚠️ ${place.name} is experiencing high visitor volume right now. Current wait at main entrance is approximately ${place.waitTimeMins} minutes. Consider visiting during the recommended quiet window.`
                        : place.liveCrowdPct > 40
                        ? `${place.name} has manageable crowds right now. Wait time is around ${place.waitTimeMins} minutes. A reasonable time to visit.`
                        : `🌿 ${place.name} is quiet right now — great time to visit! Minimal to no wait expected.`
                      }
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-2 bg-bg-secondary rounded-lg">
                      <Users className="w-4 h-4 mx-auto text-accent mb-1" />
                      <p className="text-lg font-bold">{place.visitorCount.toLocaleString()}</p>
                      <p className="text-[10px] text-text-muted">Visitors</p>
                    </div>
                    <div className="text-center p-2 bg-bg-secondary rounded-lg">
                      <Clock className="w-4 h-4 mx-auto text-accent mb-1" />
                      <p className="text-lg font-bold">{place.waitTimeMins}</p>
                      <p className="text-[10px] text-text-muted">Min Wait</p>
                    </div>
                    <div className="text-center p-2 bg-bg-secondary rounded-lg">
                      <Car className="w-4 h-4 mx-auto text-accent mb-1" />
                      <p className="text-lg font-bold">{place.parkingFreeSpaces}</p>
                      <p className="text-[10px] text-text-muted">Parking Free</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Recommendation */}
            <div className="bg-accent text-white rounded-card p-5 shadow-card">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <Star className="w-4 h-4" />
                </div>
                <h3 className="font-display font-semibold">AI Recommendation</h3>
              </div>
              <p className="text-xl font-display font-bold mb-1">
                ✅ Best time: {place.bestVisitWindow}
              </p>
              <p className="text-sm text-white/80">
                {place.bestVisitConfidence}% confident · Based on historical patterns, weather, and 40+ signals
              </p>
              <div className="flex gap-2 mt-3">
                <button onClick={() => setShowAlertModal(true)} className="px-4 py-2 bg-white text-accent text-sm font-semibold rounded-xl hover:bg-white/90 transition-colors flex items-center gap-1.5">
                  <Bell className="w-4 h-4" /> Set Alert
                </button>
                <button onClick={() => { addToTrip(place); navigate('/trip-planner'); }} className="px-4 py-2 bg-white/20 text-white text-sm font-semibold rounded-xl hover:bg-white/30 transition-colors flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" /> Add to Trip
                </button>
              </div>
            </div>

            {/* 24-Hour Forecast */}
            <div className="card p-6">
              <h2 className="font-display text-lg font-semibold mb-4">24-Hour Crowd Forecast</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={hourlyData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                    <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#8C8A82' }} interval={2} />
                    <YAxis tick={{ fontSize: 10, fill: '#8C8A82' }} domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{ background: '#fff', border: '1px solid #E4E2DA', borderRadius: '12px', fontSize: '12px' }}
                      formatter={(value: number) => [`${value}% — ${getCrowdLabel(getCrowdLevelFromPct(value))}`, 'Crowd']}
                    />
                    <Bar dataKey="crowd" radius={[4, 4, 0, 0]}>
                      {hourlyData.map((entry, index) => (
                        <Cell key={index} fill={getCrowdColor(entry.level)} fillOpacity={0.85} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-text-muted mt-2 text-center">
                Hover over bars for exact crowd percentage and wait time
              </p>
            </div>

            {/* 7-Day Heatmap */}
            <div className="card p-6">
              <h2 className="font-display text-lg font-semibold mb-4">7-Day Weekly Heatmap</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr>
                      <th className="text-left py-2 pr-3 text-text-muted font-medium"></th>
                      {hours.map(h => (
                        <th key={h} className="text-center py-2 px-1 text-text-muted font-medium">
                          {h < 12 ? `${h}A` : h === 12 ? '12P' : `${h - 12}P`}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {heatmapData.map((row) => (
                      <tr key={row.day}>
                        <td className="py-1 pr-3 font-medium text-text-primary">{row.day}</td>
                        {row.hours.map((val, hi) => (
                          <td key={hi} className="p-0.5">
                            <div
                              className="w-full aspect-square rounded-sm cursor-pointer hover:ring-2 hover:ring-accent/30 transition-all"
                              style={{ backgroundColor: getCrowdColor(getCrowdLevelFromPct(val)), opacity: 0.2 + (val / 100) * 0.8 }}
                              title={`${row.day} ${hours[hi]}:00 — ${val}% ${getCrowdLabel(getCrowdLevelFromPct(val))}`}
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center gap-4 mt-4 justify-center">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#1D6954', opacity: 0.6 }} />
                  <span className="text-xs text-text-muted">Low</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#B8860B', opacity: 0.7 }} />
                  <span className="text-xs text-text-muted">Moderate</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#C85E2A', opacity: 0.8 }} />
                  <span className="text-xs text-text-muted">High</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#B91C1C', opacity: 0.9 }} />
                  <span className="text-xs text-text-muted">Critical</span>
                </div>
              </div>
            </div>

            {/* Crowd Score Breakdown */}
            <div className="card p-6">
              <h2 className="font-display text-lg font-semibold mb-4">Crowd Score Breakdown</h2>
              <p className="text-sm text-text-muted mb-4">Transparency — every factor contributing to today's prediction</p>
              <div className="space-y-3">
                {breakdown.map((factor, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{factor.name}</span>
                        <span className={`text-sm font-bold ${factor.impact > 0 ? 'text-crowd-high' : factor.impact < 0 ? 'text-crowd-low' : 'text-text-muted'}`}>
                          {factor.impact > 0 ? '+' : ''}{factor.impact}%
                        </span>
                      </div>
                      <p className="text-xs text-text-muted">{factor.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                <span className="text-sm text-text-muted">AI Confidence: <strong className="text-accent">{place.bestVisitConfidence}%</strong></span>
                <span className="text-xs text-text-muted">Model: VisitFlow v2.4</span>
              </div>
            </div>

            {/* Community Check-ins */}
            <div className="card p-6">
              <h2 className="font-display text-lg font-semibold mb-4">Community Check-ins</h2>
              <div className="space-y-4">
                {checkins.map((c, i) => (
                  <div key={i} className="flex gap-3 p-3 bg-bg-secondary rounded-xl">
                    <div className="w-8 h-8 bg-accent-light text-accent rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">
                      {c.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium">{c.name}</span>
                        <span className="text-xs text-text-muted">{c.time}</span>
                        {c.verified && (
                          <span className="text-[10px] px-1.5 py-0.5 bg-accent-light text-accent rounded-full font-medium">✓ Verified</span>
                        )}
                      </div>
                      <p className="text-xs text-text-muted mb-1">Crowd: {c.crowd} · Wait: {c.wait} min</p>
                      <p className="text-sm text-text-primary">{c.note}</p>
                      <button className="flex items-center gap-1 mt-2 text-xs text-text-muted hover:text-accent transition-colors">
                        <ThumbsUp className="w-3 h-3" /> Helpful
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <div className="card p-5">
              <h3 className="font-display font-semibold mb-3">Quick Info</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-text-muted flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Hours</span>
                  <span className="font-medium">{place.openingTime} — {place.closingTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-muted">🎟️ Entry (Indian)</span>
                  <span className="font-medium">{place.entryFeeIndian === 0 ? 'Free' : `₹${place.entryFeeIndian}`}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-muted">🎟️ Entry (Foreign)</span>
                  <span className="font-medium">{place.entryFeeForeign === 0 ? 'Free' : `₹${place.entryFeeForeign}`}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-muted flex items-center gap-1.5"><Camera className="w-3.5 h-3.5" /> Photography</span>
                  <span className="font-medium text-xs text-right max-w-[150px]">{place.photographyRules.slice(0, 40)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-muted flex items-center gap-1.5"><Accessibility className="w-3.5 h-3.5" /> Accessibility</span>
                  <span className="font-medium">{place.accessibilityScore}/10</span>
                </div>
                {place.dressCode && place.dressCode !== 'None.' && (
                  <div className="flex items-center justify-between">
                    <span className="text-text-muted">👔 Dress Code</span>
                    <span className="font-medium text-xs text-right max-w-[150px]">{place.dressCode}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Weather */}
            <div className="card p-5">
              <h3 className="font-display font-semibold mb-3 flex items-center gap-2">
                <Sun className="w-4 h-4 text-amber-500" /> Weather Now
              </h3>
              <div className="flex items-center gap-4">
                <span className="text-3xl">☀️</span>
                <div>
                  <p className="text-2xl font-bold">28°C</p>
                  <p className="text-xs text-text-muted">Clear skies</p>
                </div>
              </div>
              <p className="text-xs text-text-muted mt-3 p-2 bg-crowd-moderate-bg rounded-lg">
                ☀️ Sunny weather adds +12% visitors vs baseline. Consider early morning visit.
              </p>
            </div>

            {/* Alternatives */}
            <div className="card p-5">
              <h3 className="font-display font-semibold mb-3">Quieter Alternatives</h3>
              <div className="space-y-3">
                {alternatives.map((alt) => (
                  <button
                    key={alt.id}
                    onClick={() => navigate(`/place/${alt.slug}`)}
                    className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-bg-secondary transition-colors text-left"
                  >
                    <span className="text-xl">{alt.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{alt.name}</p>
                      <p className="text-xs text-text-muted">{alt.city}</p>
                    </div>
                    <CrowdBadge level={alt.crowdLevel} pct={alt.liveCrowdPct} small />
                  </button>
                ))}
              </div>
            </div>

            {/* Ask Seena */}
            <div className="card p-5 bg-accent-light border-accent/20">
              <h3 className="font-display font-semibold mb-2 text-accent">💬 Ask Seena</h3>
              <p className="text-xs text-text-muted mb-3">Get instant answers about this place</p>
              <div className="space-y-2">
                {[
                  `Best time to visit ${place.name}?`,
                  `Parking near ${place.name}`,
                  `Plan a day trip including ${place.name}`,
                ].map((q, i) => (
                  <button
                    key={i}
                    onClick={() => toggleChat()}
                    className="w-full text-left text-xs px-3 py-2 bg-surface rounded-lg hover:bg-white transition-colors text-accent font-medium"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="card p-5">
              <h3 className="font-display font-semibold mb-2">About</h3>
              <p className="text-sm text-text-muted leading-relaxed">{place.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
