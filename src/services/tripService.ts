
import { supabase } from '@/integrations/supabase/client';
import { Trip, DayItinerary, Activity, Meal } from '@/types/Trip';

export interface CreateTripRequest {
  destination: string;
  startDate: string;
  endDate: string;
  duration: number;
}

export interface TripWithItinerary {
  id: string;
  destination: string;
  start_date: string;
  end_date: string;
  duration: number;
  status: 'draft' | 'confirmed' | 'completed';
  created_at: string;
  updated_at: string;
  day_itineraries: Array<{
    id: string;
    day_number: number;
    date: string;
    accommodation: string | null;
    activities: Array<{
      id: string;
      name: string;
      description: string | null;
      location: string | null;
      duration: number | null;
      cost: number | null;
      category: string | null;
      latitude: number | null;
      longitude: number | null;
    }>;
    meals: Array<{
      id: string;
      meal_type: string | null;
      restaurant: string | null;
      cuisine: string | null;
      cost: number | null;
      location: string | null;
    }>;
  }>;
}

export const tripService = {
  async createTrip(tripData: CreateTripRequest) {
    const { data, error } = await supabase
      .from('trips')
      .insert({
        user_id: (await supabase.auth.getUser()).data.user?.id,
        destination: tripData.destination,
        start_date: tripData.startDate,
        end_date: tripData.endDate,
        duration: tripData.duration,
        status: 'draft'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getUserTrips() {
    const { data, error } = await supabase
      .from('trips')
      .select(`
        *,
        day_itineraries (
          *,
          activities (*),
          meals (*)
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as TripWithItinerary[];
  },

  async getTripById(tripId: string) {
    const { data, error } = await supabase
      .from('trips')
      .select(`
        *,
        day_itineraries (
          *,
          activities (*),
          meals (*)
        )
      `)
      .eq('id', tripId)
      .single();

    if (error) throw error;
    return data as TripWithItinerary;
  },

  async updateTrip(tripId: string, updates: Partial<CreateTripRequest>) {
    const { data, error } = await supabase
      .from('trips')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', tripId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteTrip(tripId: string) {
    const { error } = await supabase
      .from('trips')
      .delete()
      .eq('id', tripId);

    if (error) throw error;
  },

  async createDayItinerary(tripId: string, dayData: {
    day_number: number;
    date: string;
    accommodation?: string;
  }) {
    const { data, error } = await supabase
      .from('day_itineraries')
      .insert({
        trip_id: tripId,
        day_number: dayData.day_number,
        date: dayData.date,
        accommodation: dayData.accommodation
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async addActivity(dayItineraryId: string, activityData: {
    name: string;
    description?: string;
    location?: string;
    duration?: number;
    cost?: number;
    category?: string;
    latitude?: number;
    longitude?: number;
  }) {
    const { data, error } = await supabase
      .from('activities')
      .insert({
        day_itinerary_id: dayItineraryId,
        ...activityData
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async addMeal(dayItineraryId: string, mealData: {
    meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    restaurant?: string;
    cuisine?: string;
    cost?: number;
    location?: string;
  }) {
    const { data, error } = await supabase
      .from('meals')
      .insert({
        day_itinerary_id: dayItineraryId,
        ...mealData
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
