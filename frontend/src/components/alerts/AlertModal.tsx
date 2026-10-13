import { useState } from 'react';
import { X, Bell, Calendar, Clock, Sliders, Smartphone, Mail, MessageCircle, Send as SendIcon, CheckCircle, MapPin } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { places } from '../../data/places';

export default function AlertModal() {
  const { isAlertModalOpen, closeAlertModal, alertModalPlace } = useStore();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [settings, setSettings] = useState({
    threshold: 40,
    channels: ['push'] as string[],
    visitDate: '',
    timeWindow: 'morning',
  });

  if (!isAlertModalOpen) return null;

  const place = alertModalPlace
    ? places.find(p => p.slug === alertModalPlace)
    : null;

  const toggleChannel = (ch: string) => {
    setSettings(prev => ({
      ...prev,
      channels: prev.channels.includes(ch)
        ? prev.channels.filter(c => c !== ch)
        : [...prev.channels, ch],
    }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setStep(1);
      closeAlertModal();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-accent text-white">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5" />
            <div>
              <h3 className="font-display font-semibold">Smart Crowd Alert</h3>
              <p className="text-xs text-white/70">
                {place ? place.name : 'Get notified at the right time'}
              </p>
            </div>
          </div>
          <button onClick={closeAlertModal} className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Success */}
        {submitted ? (
          <div className="p-10 text-center">
            <div className="w-16 h-16 mx-auto bg-green-100 text-accent rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-display font-semibold text-text-primary mb-2">Alert Set!</h3>
            <p className="text-sm text-text-secondary">
              We'll notify you when crowd drops below <strong>{settings.threshold}%</strong>
              {place && ` at ${place.name}`}.
            </p>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            {/* Place info if set */}
            {place && (
              <div className="flex items-center gap-3 p-3 bg-bg-secondary rounded-xl">
                <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={place.images[0]}
                    alt={place.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold text-sm">{place.name}</p>
                  <p className="text-xs text-text-secondary flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {place.city}, {place.state}
                  </p>
                </div>
              </div>
            )}

            {/* Threshold */}
            <div>
              <label className="text-sm font-semibold text-text-primary flex items-center gap-2 mb-3">
                <Sliders className="w-4 h-4 text-accent" />
                Crowd Threshold
              </label>
              <div className="space-y-2">
                <input
                  type="range"
                  min="10"
                  max="80"
                  step="5"
                  value={settings.threshold}
                  onChange={(e) => setSettings(prev => ({ ...prev, threshold: parseInt(e.target.value) }))}
                  className="w-full accent-accent"
                />
                <div className="flex justify-between text-xs text-text-muted">
                  <span>Very Quiet (10%)</span>
                  <span className="font-semibold text-accent">Alert at {settings.threshold}%</span>
                  <span>Busy (80%)</span>
                </div>
              </div>
            </div>

            {/* Visit Date */}
            <div>
              <label className="text-sm font-semibold text-text-primary flex items-center gap-2 mb-3">
                <Calendar className="w-4 h-4 text-accent" />
                Planned Visit Date (optional)
              </label>
              <input
                type="date"
                value={settings.visitDate}
                onChange={(e) => setSettings(prev => ({ ...prev, visitDate: e.target.value }))}
                className="input-field w-full text-sm"
              />
            </div>

            {/* Time Window */}
            <div>
              <label className="text-sm font-semibold text-text-primary flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-accent" />
                Preferred Time Window
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'morning', label: 'Morning', sub: '6–11 AM' },
                  { id: 'afternoon', label: 'Afternoon', sub: '11–4 PM' },
                  { id: 'evening', label: 'Evening', sub: '4–9 PM' },
                ].map((tw) => (
                  <button
                    key={tw.id}
                    onClick={() => setSettings(prev => ({ ...prev, timeWindow: tw.id }))}
                    className={`p-3 rounded-xl text-center border-2 transition-all ${
                      settings.timeWindow === tw.id
                        ? 'border-accent bg-accent-light'
                        : 'border-border hover:border-accent/30'
                    }`}
                  >
                    <p className="text-xs font-semibold">{tw.label}</p>
                    <p className="text-[10px] text-text-muted">{tw.sub}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Notification Channels */}
            <div>
              <label className="text-sm font-semibold text-text-primary flex items-center gap-2 mb-3">
                <Smartphone className="w-4 h-4 text-accent" />
                Notification Channels
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'push', icon: Smartphone, label: 'Push' },
                  { id: 'email', icon: Mail, label: 'Email' },
                  { id: 'whatsapp', icon: MessageCircle, label: 'WhatsApp' },
                  { id: 'sms', icon: SendIcon, label: 'SMS' },
                ].map((ch) => (
                  <button
                    key={ch.id}
                    onClick={() => toggleChannel(ch.id)}
                    className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                      settings.channels.includes(ch.id)
                        ? 'border-accent bg-accent-light text-accent'
                        : 'border-border text-text-secondary hover:border-accent/30'
                    }`}
                  >
                    <ch.icon className="w-4 h-4" />
                    <span className="text-xs font-semibold">{ch.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={settings.channels.length === 0}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              <Bell className="w-4 h-4" />
              Set Smart Alert
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
