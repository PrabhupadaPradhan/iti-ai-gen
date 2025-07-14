
import { useState, useEffect } from 'react';
import { profileService } from '@/services/profileService';
import { User } from '@/types/User';
import { useToast } from '@/hooks/use-toast';

export const useProfile = () => {
  const [profile, setProfile] = useState<User | null>(null);
  const [statistics, setStatistics] = useState({
    totalTrips: 0,
    completedTrips: 0,
    upcomingTrips: 0,
    draftTrips: 0
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const [profileData, statsData] = await Promise.all([
        profileService.getUserProfile(),
        profileService.getTripStatistics()
      ]);
      
      setProfile(profileData);
      setStatistics(statsData);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: {
    fullName?: string;
    email?: string;
    country?: string;
    city?: string;
    profilePicture?: string;
  }) => {
    try {
      setUpdating(true);
      await profileService.updateUserProfile(updates);
      await fetchProfile(); // Refresh profile data
      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    profile,
    statistics,
    loading,
    updating,
    fetchProfile,
    updateProfile
  };
};
