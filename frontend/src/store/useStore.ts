import { create } from 'zustand';
import { TouristPlace, ChatMessage, CrowdAlert, User, CrowdLevel } from '../types';
import { places } from '../data/places';

interface AppState {
  // Places
  places: TouristPlace[];
  selectedPlace: TouristPlace | null;
  setSelectedPlace: (place: TouristPlace | null) => void;

  // Search
  searchQuery: string;
  searchResults: TouristPlace[];
  recentSearches: string[];
  setSearchQuery: (query: string) => void;
  searchPlaces: (query: string) => void;
  addRecentSearch: (query: string) => void;

  // Chat
  isChatOpen: boolean;
  chatMessages: ChatMessage[];
  isChatStreaming: boolean;
  toggleChat: () => void;
  addChatMessage: (message: ChatMessage) => void;
  setChatStreaming: (streaming: boolean) => void;
  updateLastChatMessage: (content: string) => void;

  // Alerts
  alerts: CrowdAlert[];
  addAlert: (alert: CrowdAlert) => void;
  isAlertModalOpen: boolean;
  alertModalPlace: string | null;
  openAlertModal: (placeSlug?: string) => void;
  closeAlertModal: () => void;

  // User
  user: User | null;
  isAuthModalOpen: boolean;
  setUser: (user: User | null) => void;
  toggleAuthModal: () => void;
  openAuthModal: () => void;
  closeAuthModal: () => void;

  // Saved Places
  savedPlaces: string[];
  toggleSavedPlace: (placeId: string) => void;

  // Trip Planner
  tripPlaces: TouristPlace[];
  addToTrip: (place: TouristPlace) => void;
  removeFromTrip: (placeId: string) => void;
  clearTrip: () => void;

  // UI
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
}

export const useStore = create<AppState>((set, get) => ({
  // Places
  places: places,
  selectedPlace: null,
  setSelectedPlace: (place) => set({ selectedPlace: place }),

  // Search
  searchQuery: '',
  searchResults: [],
  recentSearches: JSON.parse(localStorage.getItem('recentSearches') || '[]'),
  setSearchQuery: (query) => set({ searchQuery: query }),
  searchPlaces: (query) => {
    if (!query || query.length < 2) {
      set({ searchResults: [] });
      return;
    }
    const q = query.toLowerCase();
    const results = places.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        p.state.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)) ||
        p.category.toLowerCase().includes(q)
    ).slice(0, 8);
    set({ searchResults: results });
  },
  addRecentSearch: (query) => {
    const current = get().recentSearches;
    const updated = [query, ...current.filter((s) => s !== query)].slice(0, 8);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
    set({ recentSearches: updated });
  },

  // Chat
  isChatOpen: false,
  chatMessages: [],
  isChatStreaming: false,
  toggleChat: () => set((state) => ({ isChatOpen: !state.isChatOpen })),
  addChatMessage: (message) =>
    set((state) => ({ chatMessages: [...state.chatMessages, message] })),
  setChatStreaming: (streaming) => set({ isChatStreaming: streaming }),
  updateLastChatMessage: (content) =>
    set((state) => {
      const messages = [...state.chatMessages];
      if (messages.length > 0) {
        messages[messages.length - 1] = {
          ...messages[messages.length - 1],
          content,
          isStreaming: false,
        };
      }
      return { chatMessages: messages };
    }),

  // Alerts
  alerts: [],
  addAlert: (alert) => set((state) => ({ alerts: [...state.alerts, alert] })),
  isAlertModalOpen: false,
  alertModalPlace: null,
  openAlertModal: (placeSlug) => set({ isAlertModalOpen: true, alertModalPlace: placeSlug || null }),
  closeAlertModal: () => set({ isAlertModalOpen: false, alertModalPlace: null }),

  // User
  user: null,
  isAuthModalOpen: false,
  setUser: (user) => set({ user }),
  toggleAuthModal: () => set((state) => ({ isAuthModalOpen: !state.isAuthModalOpen })),
  openAuthModal: () => set({ isAuthModalOpen: true }),
  closeAuthModal: () => set({ isAuthModalOpen: false }),

  // Saved Places
  savedPlaces: JSON.parse(localStorage.getItem('savedPlaces') || '[]'),
  toggleSavedPlace: (placeId) => {
    const current = get().savedPlaces;
    const updated = current.includes(placeId)
      ? current.filter((id) => id !== placeId)
      : [...current, placeId];
    localStorage.setItem('savedPlaces', JSON.stringify(updated));
    set({ savedPlaces: updated });
  },

  // Trip Planner
  tripPlaces: [],
  addToTrip: (place) =>
    set((state) => {
      if (state.tripPlaces.find((p) => p.id === place.id)) return state;
      return { tripPlaces: [...state.tripPlaces, place] };
    }),
  removeFromTrip: (placeId) =>
    set((state) => ({
      tripPlaces: state.tripPlaces.filter((p) => p.id !== placeId),
    })),
  clearTrip: () => set({ tripPlaces: [] }),

  // UI
  activeFilter: 'All',
  setActiveFilter: (filter) => set({ activeFilter: filter }),
}));
