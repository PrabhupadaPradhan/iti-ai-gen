
import { supabase } from '@/integrations/supabase/client';
import { UserPreferences } from '@/types/User';

interface DatabasePreferences {
  id: string;
  user_id: string;
  food_preferences: string[] | null;
  budget_range: string | null;
  place_types: string[] | null;
  activities: string[] | null;
  accommodation_type: string[] | null;
  transportation_preference: string[] | null;
  adventure_level: string | null;
  dietary_restrictions: string[] | null;
  accessibility_requirements: string[] | null;
  weather_comfort: string | null;
  group_size: string | null;
  languages_spoken: string[] | null;
  travel_pace: string | null;
  created_at: string;
  updated_at: string;
}

export const preferencesService = {
  async getUserPreferences(): Promise<UserPreferences | null> {
    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching preferences:', error);
      return null;
    }

    if (!data) return null;

    return {
      foodPreferences: data.food_preferences || [],
      budgetRange: (data.budget_range as 'low' | 'medium' | 'high' | 'luxury') || 'medium',
      placeTypes: data.place_types || [],
      activities: data.activities || [],
      accommodationType: data.accommodation_type || [],
      transportationPreference: data.transportation_preference || [],
      adventureLevel: (data.adventure_level as 'low' | 'medium' | 'high') || 'medium',
      dietaryRestrictions: data.dietary_restrictions || [],
      accessibilityRequirements: data.accessibility_requirements || [],
      weatherComfort: (data.weather_comfort as 'cold' | 'warm' | 'hot') || 'warm',
      groupSize: (data.group_size as 'solo' | 'couple' | 'family' | 'friends') || 'couple',
      languagesSpoken: data.languages_spoken || [],
      travelPace: (data.travel_pace as 'relaxed' | 'moderate' | 'packed') || 'moderate'
    };
  },

  async saveUserPreferences(preferences: UserPreferences) {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    
    if (!userId) {
      throw new Error('User not authenticated');
    }

    // Check if preferences already exist
    const { data: existingPreferences } = await supabase
      .from('user_preferences')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    const preferenceData = {
      user_id: userId,
      food_preferences: preferences.foodPreferences,
      budget_range: preferences.budgetRange,
      place_types: preferences.placeTypes,
      activities: preferences.activities,
      accommodation_type: preferences.accommodationType,
      transportation_preference: preferences.transportationPreference,
      adventure_level: preferences.adventureLevel,
      dietary_restrictions: preferences.dietaryRestrictions,
      accessibility_requirements: preferences.accessibilityRequirements,
      weather_comfort: preferences.weatherComfort,
      group_size: preferences.groupSize,
      languages_spoken: preferences.languagesSpoken,
      travel_pace: preferences.travelPace,
      updated_at: new Date().toISOString()
    };

    let data, error;

    if (existingPreferences) {
      // Update existing preferences
      ({ data, error } = await supabase
        .from('user_preferences')
        .update(preferenceData)
        .eq('user_id', userId)
        .select()
        .single());
    } else {
      // Insert new preferences
      ({ data, error } = await supabase
        .from('user_preferences')
        .insert(preferenceData)
        .select()
        .single());
    }

    if (error) throw error;
    return data;
  }
};
