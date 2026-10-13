import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Clock, Users, Sparkles, ChevronRight, ChevronLeft, Plus, X, Star, Download, Share2, Edit3, Trash2, GripVertical, Bot } from 'lucide-react';
import { useStore } from '../store/useStore';
import { places, getCrowdLabel, getCrowdColor, getCrowdBgColor, getCrowdLevelFromPct } from '../data/places';

const POPULAR_CITIES = ['Agra', 'Jaipur', 'Delhi', 'Mumbai', 'Goa', 'Mysore', 'Udaipur', 'Varanasi'];

export default function TripPlannerPage() {
  const navigate = useNavigate();
  const { toggleChat } = useStore();
  const [step, setStep] = useState(1);
  const [tripSettings, setTripSettings] = useState({
    destinations: [] as string[],
    startDate: '',
    endDate: '',
    travelStyle: 'balanced',
    groupSize: 2,
    interests: [] as string[],
  });
  const [generatedItinerary, setGeneratedItinerary] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const cityPlaces = (city: string) =>
    places.filter(p => p.city.toLowerCase() === city.toLowerCase());

  const addDestination = (city: string) => {
    if (!tripSettings.destinations.includes(city)) {
      setTripSettings(prev => ({
        ...prev,
        destinations: [...prev.destinations, city],
      }));
    }
  };

  const removeDestination = (city: string) => {
    setTripSettings(prev => ({
      ...prev,
      destinations: prev.destinations.filter(d => d !== city),
    }));
  };

  const toggleInterest = (interest: string) => {
    setTripSettings(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const generateItinerary = async () => {
    setIsGenerating(true);
    await new Promise(r => setTimeout(r, 2500));

    const allPlaces = tripSettings.destinations.flatMap(city =>
      cityPlaces(city).map(p => ({ ...p, city }))
    );

    // Sort by optimal crowd window
    const sorted = allPlaces.sort((a, b) => a.liveCrowdPct - b.liveCrowdPct);

    const days = [];
    const placesPerDay = Math.ceil(sorted.length / Math.max(1, Math.ceil((sorted.length) / 3)));

    for (let i = 0; i < sorted.length; i += placesPerDay) {
      const dayPlaces = sorted.slice(i, i + placesPerDay);
      days.push({
        day: days.length + 1,
        title: `Day ${days.length + 1} — ${dayPlaces[0]?.city || 'Exploring'}`,
        stops: dayPlaces.map((p, j) => ({
          time: j === 0 ? '07:00 AM' : j === 1 ? '10:30 AM' : j === 2 ? '02:00 PM' : '04:30 PM',
          place: p,
          duration: '2 hours',
          crowdPrediction: Math.max(10, p.liveCrowdPct - 20 + Math.random() * 15),
          notes: j === 0
            ? 'Arrive early for best experience. Low crowd expected.'
            : `Crowd builds up by afternoon. ${p.waitTimeMins} min wait expected.`,
        })),
      });
    }

    setGeneratedItinerary({
      title: `${tripSettings.destinations.join(' → ')} Trip`,
      days,
      totalCost: allPlaces.reduce((s, p) => s + p.entryFeeIndian * tripSettings.groupSize, 0),
      totalPlaces: allPlaces.length,
      crowdOptimized: true,
    });
    setIsGenerating(false);
    setStep(4);
  };

  return (
    <div className="min-h-screen bg-bg-primary pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold text-text-primary mb-2">
            AI Trip Planner
          </h1>
          <p className="text-text-secondary max-w-lg mx-auto">
            Build crowd-optimized itineraries. Our AI schedules visits during the lowest crowd windows.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[
            { n: 1, label: 'Destinations' },
            { n: 2, label: 'Details' },
            { n: 3, label: 'Preferences' },
            { n: 4, label: 'Itinerary' },
          ].map((s, i) => (
            <div key={s.n} className="flex items-center gap-2">
              <button
                onClick={() => s.n < step && setStep(s.n)}
                className={`w-9 h-9 rounded-full text-sm font-semibold flex items-center justify-center transition-all ${
                  step >= s.n
                    ? 'bg-accent text-white'
                    : 'bg-bg-secondary text-text-muted'
                }`}
              >
                {s.n}
              </button>
              <span className={`text-xs font-medium hidden sm:inline ${step >= s.n ? 'text-accent' : 'text-text-muted'}`}>
                {s.label}
              </span>
              {i < 3 && <ChevronRight className="w-4 h-4 text-text-muted" />}
            </div>
          ))}
        </div>

        {/* Step 1: Destinations */}
        {step === 1 && (
          <div className="card p-6 animate-fade-in space-y-6">
            <div>
              <h2 className="text-lg font-display font-semibold mb-1">Where do you want to go?</h2>
              <p className="text-sm text-text-secondary">Pick one or more cities to visit</p>
            </div>

            {/* Selected */}
            {tripSettings.destinations.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tripSettings.destinations.map((city) => (
                  <span key={city} className="flex items-center gap-2 bg-accent-light text-accent px-3 py-2 rounded-xl text-sm font-medium">
                    <MapPin className="w-3.5 h-3.5" />
                    {city}
                    <button onClick={() => removeDestination(city)} className="hover:text-red-500">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Popular cities */}
            <div>
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Popular Destinations</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {POPULAR_CITIES.map((city) => {
                  const cp = cityPlaces(city);
                  const selected = tripSettings.destinations.includes(city);
                  return (
                    <button
                      key={city}
                      onClick={() => selected ? removeDestination(city) : addDestination(city)}
                      className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                        selected
                          ? 'border-accent bg-accent-light'
                          : 'border-border hover:border-accent/30'
                      }`}
                    >
                      <p className="font-semibold text-sm">{city}</p>
                      <p className="text-xs text-text-muted">{cp.length} places</p>
                      {selected && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-accent text-white rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={tripSettings.destinations.length === 0}
              className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2"
            >
              Continue <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 2: Details */}
        {step === 2 && (
          <div className="card p-6 animate-fade-in space-y-6">
            <div>
              <h2 className="text-lg font-display font-semibold mb-1">Trip Details</h2>
              <p className="text-sm text-text-secondary">Help us plan the perfect schedule</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-text-primary flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-accent" /> Start Date
                </label>
                <input
                  type="date"
                  value={tripSettings.startDate}
                  onChange={(e) => setTripSettings(prev => ({ ...prev, startDate: e.target.value }))}
                  className="input-field w-full text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-text-primary flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-accent" /> End Date
                </label>
                <input
                  type="date"
                  value={tripSettings.endDate}
                  onChange={(e) => setTripSettings(prev => ({ ...prev, endDate: e.target.value }))}
                  className="input-field w-full text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-text-primary flex items-center gap-2 mb-3">
                <Users className="w-4 h-4 text-accent" /> Group Size
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setTripSettings(prev => ({ ...prev, groupSize: Math.max(1, prev.groupSize - 1) }))}
                  className="w-10 h-10 rounded-xl border-2 border-border flex items-center justify-center hover:border-accent"
                >
                  -
                </button>
                <span className="text-lg font-semibold w-12 text-center">{tripSettings.groupSize}</span>
                <button
                  onClick={() => setTripSettings(prev => ({ ...prev, groupSize: prev.groupSize + 1 }))}
                  className="w-10 h-10 rounded-xl border-2 border-border flex items-center justify-center hover:border-accent"
                >
                  +
                </button>
                <span className="text-sm text-text-muted">people</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="btn-ghost flex items-center gap-2">
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="btn-primary flex items-center gap-2"
              >
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Preferences */}
        {step === 3 && (
          <div className="card p-6 animate-fade-in space-y-6">
            <div>
              <h2 className="text-lg font-display font-semibold mb-1">Your Preferences</h2>
              <p className="text-sm text-text-secondary">We'll tailor the itinerary to your style</p>
            </div>

            <div>
              <label className="text-sm font-semibold text-text-primary mb-3 block">Travel Style</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'relaxed', emoji: '🧘', label: 'Relaxed', sub: '2 places/day' },
                  { id: 'balanced', emoji: '⚖️', label: 'Balanced', sub: '3 places/day' },
                  { id: 'packed', emoji: '🏃', label: 'Packed', sub: '4+ places/day' },
                ].map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setTripSettings(prev => ({ ...prev, travelStyle: style.id }))}
                    className={`p-4 rounded-xl border-2 text-center transition-all ${
                      tripSettings.travelStyle === style.id
                        ? 'border-accent bg-accent-light'
                        : 'border-border hover:border-accent/30'
                    }`}
                  >
                    <span className="text-2xl">{style.emoji}</span>
                    <p className="text-sm font-semibold mt-1">{style.label}</p>
                    <p className="text-xs text-text-muted">{style.sub}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-text-primary mb-3 block">Interests</label>
              <div className="flex flex-wrap gap-2">
                {['History', 'Architecture', 'Photography', 'Nature', 'Spirituality', 'Food', 'Adventure', 'Culture', 'Art', 'Shopping'].map((interest) => (
                  <button
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    className={`chip ${
                      tripSettings.interests.includes(interest)
                        ? 'bg-accent text-white border-accent'
                        : ''
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="btn-ghost flex items-center gap-2">
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button
                onClick={generateItinerary}
                disabled={isGenerating}
                className="btn-primary flex items-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate Itinerary
                  </>
                )}
              </button>
            </div>

            {/* Generating animation */}
            {isGenerating && (
              <div className="text-center py-8 animate-fade-in">
                <div className="w-16 h-16 mx-auto bg-accent-light text-accent rounded-full flex items-center justify-center mb-4 animate-pulse">
                  <Sparkles className="w-8 h-8" />
                </div>
                <p className="text-sm text-text-secondary">
                  Analyzing crowd patterns across {tripSettings.destinations.length} cities...
                </p>
                <p className="text-xs text-text-muted mt-1">
                  Optimizing visit times for lowest crowd experience
                </p>
              </div>
            )}
          </div>
        )}

        {/* Step 4: Generated Itinerary */}
        {step === 4 && generatedItinerary && (
          <div className="animate-fade-in space-y-6">
            {/* Summary Card */}
            <div className="card p-6 bg-gradient-to-r from-accent to-accent/80 text-white">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-white/70 uppercase tracking-wider font-semibold">AI-Generated Itinerary</p>
                  <h2 className="text-xl font-display font-bold mt-1">{generatedItinerary.title}</h2>
                  <div className="flex items-center gap-4 mt-3 text-sm text-white/80">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" /> {generatedItinerary.days.length} days
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" /> {generatedItinerary.totalPlaces} places
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" /> {tripSettings.groupSize} people
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center">
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-white/20 flex items-center justify-between">
                <p className="text-sm">
                  💰 Total entry fees: <strong>₹{generatedItinerary.totalCost}</strong> ({tripSettings.groupSize} people)
                </p>
                <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Crowd Optimized
                </span>
              </div>
            </div>

            {/* Day cards */}
            {generatedItinerary.days.map((day: any) => (
              <div key={day.day} className="card overflow-hidden">
                <div className="px-6 py-4 bg-bg-secondary border-b border-border">
                  <h3 className="font-display font-semibold text-text-primary">{day.title}</h3>
                </div>
                <div className="p-6 space-y-4">
                  {day.stops.map((stop: any, j: number) => {
                    const crowdLevel = getCrowdLevelFromPct(stop.crowdPrediction);
                    return (
                      <div key={j} className="flex gap-4">
                        {/* Timeline */}
                        <div className="flex flex-col items-center">
                          <div className="w-10 h-10 rounded-xl bg-accent-light text-accent flex items-center justify-center text-xs font-bold">
                            {stop.time.split(' ')[0]}
                          </div>
                          {j < day.stops.length - 1 && (
                            <div className="w-px flex-1 bg-border my-2" />
                          )}
                        </div>
                        {/* Content */}
                        <div className="flex-1 pb-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-semibold text-text-primary">{stop.place.emoji} {stop.place.name}</h4>
                              <p className="text-xs text-text-secondary flex items-center gap-1 mt-0.5">
                                <MapPin className="w-3 h-3" /> {stop.place.city} · {stop.duration}
                              </p>
                            </div>
                            <span
                              className="px-2.5 py-1 rounded-full text-xs font-semibold"
                              style={{
                                color: getCrowdColor(crowdLevel),
                                backgroundColor: getCrowdBgColor(crowdLevel),
                              }}
                            >
                              {Math.round(stop.crowdPrediction)}% {getCrowdLabel(crowdLevel)}
                            </span>
                          </div>
                          <p className="text-xs text-text-muted mt-2">{stop.notes}</p>
                          <div className="flex items-center gap-3 mt-2 text-xs text-text-secondary">
                            <span>⏱ ~{stop.place.waitTimeMins} min wait</span>
                            <span>🎟️ ₹{stop.place.entryFeeIndian}/person</span>
                            <span>⭐ {stop.place.rating}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              <button onClick={() => setStep(3)} className="btn-ghost flex items-center gap-2">
                <Edit3 className="w-4 h-4" /> Regenerate
              </button>
              <button
                onClick={toggleChat}
                className="btn-secondary flex items-center gap-2"
              >
                <Bot className="w-4 h-4" /> Ask Seena to Adjust
              </button>
              <button className="btn-primary flex items-center gap-2">
                <Download className="w-4 h-4" /> Export PDF
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
