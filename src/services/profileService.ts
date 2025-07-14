
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/User';

interface DatabaseProfile {
  id: string;
  full_name: string | null;
  email: string | null;
  country: string | null;
  city: string | null;
  profile_picture: string | null;
  created_at: string;
  updated_at: string;
}

export const profileService = {
  async getUserProfile(): Promise<User | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', (await supabase.auth.getUser()).data.user?.id)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }

    return {
      id: data.id,
      fullName: data.full_name || '',
      email: data.email || '',
      country: data.country || '',
      city: data.city || '',
      profilePicture: data.profile_picture || '',
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };
  },

  async updateUserProfile(updates: {
    fullName?: string;
    email?: string;
    country?: string;
    city?: string;
    profilePicture?: string;
  }) {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('profiles')
      .update({
        full_name: updates.fullName,
        email: updates.email,
        country: updates.country,
        city: updates.city,
        profile_picture: updates.profilePicture,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getTripStatistics() {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const { data: trips, error } = await supabase
      .from('trips')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;

    const totalTrips = trips.length;
    const completedTrips = trips.filter(trip => trip.status === 'completed').length;
    const upcomingTrips = trips.filter(trip => trip.status === 'confirmed' && new Date(trip.start_date) > new Date()).length;
    const draftTrips = trips.filter(trip => trip.status === 'draft').length;

    return {
      totalTrips,
      completedTrips,
      upcomingTrips,
      draftTrips
    };
  }
};
