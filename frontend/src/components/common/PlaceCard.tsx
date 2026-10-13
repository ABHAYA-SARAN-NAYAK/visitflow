import { useNavigate } from 'react-router-dom';
import { Clock, Users, MapPin, Heart, Star } from 'lucide-react';
import { TouristPlace } from '../../types';
import CrowdBadge from '../common/CrowdBadge';
import { useStore } from '../../store/useStore';

interface PlaceCardProps {
  place: TouristPlace;
  compact?: boolean;
}

export default function PlaceCard({ place, compact = false }: PlaceCardProps) {
  const navigate = useNavigate();
  const { savedPlaces, toggleSavedPlace } = useStore();
  const isSaved = savedPlaces.includes(place.id);

  return (
    <div
      onClick={() => navigate(`/place/${place.slug}`)}
      className="card cursor-pointer group overflow-hidden"
    >
      {/* Image */}
      <div className="relative overflow-hidden">
        <div
          className={`bg-gradient-to-br from-accent/20 to-accent/5 ${
            compact ? 'h-36' : 'h-48'
          }`}
        >
          <img
            src={place.images[0]}
            alt={place.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
        {/* Overlay badges */}
        <div className="absolute top-3 left-3">
          <CrowdBadge level={place.crowdLevel} pct={place.liveCrowdPct} />
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleSavedPlace(place.id);
          }}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            isSaved
              ? 'bg-red-500 text-white'
              : 'bg-white/80 backdrop-blur-sm text-text-muted hover:text-red-500'
          }`}
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
        </button>
        {place.hiddenGemScore >= 7 && (
          <div className="absolute bottom-3 left-3 px-2.5 py-1 bg-accent text-white text-[10px] font-bold uppercase tracking-wider rounded-full">
            🌿 Hidden Gem
          </div>
        )}
      </div>

      {/* Content */}
      <div className={`${compact ? 'p-3' : 'p-4'}`}>
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className={`font-display font-semibold text-text-primary truncate ${compact ? 'text-sm' : 'text-base'}`}>
              {place.emoji} {place.name}
            </h3>
            <p className="text-xs text-text-muted mt-0.5 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {place.city}, {place.state}
            </p>
          </div>
          <div className="flex items-center gap-0.5 flex-shrink-0">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="text-xs font-semibold">{place.rating}</span>
          </div>
        </div>

        {!compact && (
          <div className="flex items-center gap-3 mt-3 pt-3 border-t border-border">
            {place.waitTimeMins > 0 && (
              <div className="flex items-center gap-1 text-xs text-text-muted">
                <Clock className="w-3.5 h-3.5" />
                <span>{place.waitTimeMins} min wait</span>
              </div>
            )}
            <div className="flex items-center gap-1 text-xs text-text-muted">
              <Users className="w-3.5 h-3.5" />
              <span>{place.visitorCount.toLocaleString()} visitors</span>
            </div>
          </div>
        )}

        {!compact && (
          <div className="mt-2.5 flex items-center gap-1.5">
            <span className="text-[10px] px-2 py-0.5 bg-accent-light text-accent rounded-full font-medium">
              Best: {place.bestVisitWindow}
            </span>
            {place.entryFeeIndian === 0 && (
              <span className="text-[10px] px-2 py-0.5 bg-crowd-low-bg text-crowd-low rounded-full font-medium">
                Free Entry
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
