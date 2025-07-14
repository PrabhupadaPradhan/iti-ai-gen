
export interface User {
  id: string;
  fullName: string;
  email: string;
  country: string;
  city: string;
  profilePicture?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  foodPreferences: string[];
  budgetRange: 'low' | 'medium' | 'high' | 'luxury';
  placeTypes: string[];
  activities: string[];
  accommodationType: string[];
  transportationPreference: string[];
  adventureLevel: 'low' | 'medium' | 'high';
  dietaryRestrictions: string[];
  accessibilityRequirements: string[];
  weatherComfort: 'cold' | 'warm' | 'hot';
  groupSize: 'solo' | 'couple' | 'family' | 'friends';
  languagesSpoken: string[];
  travelPace: 'relaxed' | 'moderate' | 'packed';
}
