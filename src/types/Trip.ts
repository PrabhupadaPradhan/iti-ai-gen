import { UserPreferences } from './User';

export interface Trip {
  id: string;
  userId: string;
  destination: string;
  startDate: Date;
  endDate: Date;
  duration: number;
  preferences: UserPreferences;
  itinerary: DayItinerary[];
  transportation: TransportationOption[];
  accommodation: AccommodationOption[];
  packingList: PackingItem[];
  status: 'draft' | 'confirmed' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

export interface DayItinerary {
  day: number;
  date: Date;
  activities: Activity[];
  meals: Meal[];
  accommodation: string;
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  location: string;
  duration: number;
  cost: number;
  category: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface Meal {
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  restaurant: string;
  cuisine: string;
  cost: number;
  location: string;
}

export interface TransportationOption {
  type: 'flight' | 'train' | 'bus' | 'car' | 'taxi';
  from: string;
  to: string;
  duration: string;
  cost: number;
  provider: string;
}

export interface AccommodationOption {
  name: string;
  type: 'hotel' | 'hostel' | 'apartment' | 'resort';
  location: string;
  pricePerNight: number;
  rating: number;
  amenities: string[];
}

export interface PackingItem {
  category: string;
  items: string[];
}
