export type CrowdLevel = 'low' | 'moderate' | 'high' | 'critical';

export interface TouristPlace {
  id: string;
  name: string;
  slug: string;
  description: string;
  city: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
  category: PlaceCategory;
  tags: string[];
  images: string[];
  emoji: string;
  entryFeeIndian: number;
  entryFeeForeign: number;
  openingTime: string;
  closingTime: string;
  avgCrowdByHour: number[];
  avgCrowdByDay: number[];
  avgCrowdByMonth: number[];
  peakMonths: number[];
  offMonths: number[];
  accessibilityScore: number;
  accessibilityInfo: AccessibilityInfo;
  hiddenGemScore: number;
  experienceQualityScore: number;
  photographyRules: string;
  dressCode: string;
  rating: number;
  reviewCount: number;
  liveCrowdPct: number;
  crowdLevel: CrowdLevel;
  waitTimeMins: number;
  visitorCount: number;
  bestVisitWindow: string;
  bestVisitConfidence: number;
  parkingAvailable: boolean;
  parkingFreeSpaces: number;
  isVerified: boolean;
}

export type PlaceCategory = 'temple' | 'fort' | 'beach' | 'museum' | 'park' | 'waterfall' | 'market' | 'monument' | 'palace' | 'lake' | 'sanctuary';

export interface AccessibilityInfo {
  wheelchairAccess: boolean;
  rampAvailable: boolean;
  elevatorAvailable: boolean;
  accessibleRestrooms: boolean;
  description: string;
}

export interface CrowdReading {
  placeId: string;
  recordedAt: string;
  crowdPercentage: number;
  visitorCount: number;
  waitTimeMinutes: number;
  source: 'iot_sensor' | 'satellite' | 'telecom' | 'social' | 'community';
  confidenceScore: number;
}

export interface CrowdPrediction {
  placeId: string;
  predictedFor: string;
  predictedCrowdPct: number;
  confidenceScore: number;
  weatherFactor: number;
  eventFactor: number;
  holidayFactor: number;
  socialFactor: number;
}

export interface CrowdAlert {
  id: string;
  userId: string;
  placeId: string;
  visitDate: string;
  threshold: number;
  channel: 'email' | 'whatsapp' | 'push' | 'sms';
  isActive: boolean;
  preferredTimeStart?: string;
  preferredTimeEnd?: string;
}

export interface Itinerary {
  id: string;
  userId: string;
  title: string;
  startDate: string;
  endDate: string;
  homeCity: string;
  groupType: 'solo' | 'couple' | 'family' | 'group' | 'senior';
  days: ItineraryDay[];
  totalCost: number;
  shareUrl: string;
}

export interface ItineraryDay {
  date: string;
  dayNumber: number;
  stops: ItineraryStop[];
}

export interface ItineraryStop {
  placeId: string;
  placeName: string;
  arrivalTime: string;
  departureTime: string;
  crowdPrediction: number;
  crowdLevel: CrowdLevel;
  waitTime: number;
  entryFee: number;
  duration: string;
  travelTimeFromPrev?: string;
  distanceFromPrev?: string;
  notes?: string;
  type: 'visit' | 'meal' | 'travel' | 'rest';
}

export interface CommunityCheckin {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  placeId: string;
  crowdLevel: CrowdLevel;
  waitTimeMins: number;
  note: string;
  photoUrl?: string;
  createdAt: string;
  helpfulVotes: number;
  isVerified: boolean;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  placeId: string;
  rating: number;
  text: string;
  crowdExperienced: CrowdLevel;
  visitDate: string;
  photos: string[];
  createdAt: string;
  helpfulCount: number;
}

export interface NearbyFacility {
  id: string;
  placeId: string;
  type: 'parking' | 'restroom' | 'food' | 'first_aid' | 'atm' | 'wifi' | 'prayer_room' | 'children_area';
  name: string;
  latitude: number;
  longitude: number;
  distance: string;
  status: 'available' | 'busy' | 'closed';
  details: Record<string, any>;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  placeCards?: PlaceCardData[];
  quickActions?: QuickAction[];
  isStreaming?: boolean;
}

export interface PlaceCardData {
  id: string;
  name: string;
  crowdPct: number;
  crowdLevel: CrowdLevel;
  waitTime: number;
  bestTime: string;
  entryFee: number;
  emoji: string;
}

export interface QuickAction {
  label: string;
  icon: string;
  action: 'set_alert' | 'add_to_trip' | 'view_details' | 'show_on_map' | 'share';
  placeId?: string;
}

export interface SearchResult {
  id: string;
  name: string;
  city: string;
  state: string;
  slug: string;
  emoji: string;
  thumbnailUrl: string;
  liveCrowdPct: number;
  crowdLevel: CrowdLevel;
  waitTimeMins: number;
  bestVisitTime: string;
  distanceKm?: number;
  category: PlaceCategory;
  rating: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  homeCity?: string;
  explorerPoints: number;
  subscriptionTier?: 'free' | 'pro';
  badges: Badge[];
  savedPlaces: string[];
  totalCheckins: number;
  memberSince?: string;
  joinedDate?: string;
}

export interface Badge {
  id: string;
  name: string;
  emoji: string;
  description: string;
  earnedAt?: string;
  isEarned?: boolean;
}

export interface CrowdScoreBreakdown {
  totalScore: number;
  factors: CrowdFactor[];
  confidence: number;
  modelVersion: string;
}

export interface CrowdFactor {
  name: string;
  impact: number;
  description: string;
}

export interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  icon: string;
  crowdImpact: number;
  crowdImpactDescription: string;
}

export interface EventInfo {
  id: string;
  name: string;
  date: string;
  crowdMultiplier: number;
  description: string;
  affectedPlaces: string[];
}
