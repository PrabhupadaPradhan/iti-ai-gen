
import React from 'react';
import { Navbar } from '@/components/navigation/Navbar';
import { ProfileInfo } from '@/components/profile/ProfileInfo';
import { ProfilePreferences } from '@/components/profile/ProfilePreferences';
import { AccountSettings } from '@/components/profile/AccountSettings';
import { TripStatistics } from '@/components/profile/TripStatistics';
import { useProfile } from '@/hooks/useProfile';
import { usePreferences } from '@/hooks/usePreferences';

const Profile: React.FC = () => {
  const { profile, statistics, loading: profileLoading } = useProfile();
  const { preferences, loading: preferencesLoading } = usePreferences();

  const loading = profileLoading || preferencesLoading;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="h-20 bg-gray-200 rounded"></div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="h-40 bg-gray-200 rounded"></div>
                </div>
              </div>
              <div className="space-y-8">
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="h-32 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-gray-600">Profile not found.</p>
          </div>
        </div>
      </div>
    );
  }

  // Default preferences if none exist
  const defaultPreferences = preferences || {
    foodPreferences: [],
    budgetRange: 'medium' as const,
    placeTypes: [],
    activities: [],
    accommodationType: [],
    transportationPreference: [],
    adventureLevel: 'medium' as const,
    dietaryRestrictions: [],
    accessibilityRequirements: [],
    weatherComfort: 'warm' as const,
    groupSize: 'couple' as const,
    languagesSpoken: [],
    travelPace: 'moderate' as const
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600 mt-2">Manage your account and travel preferences</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            <ProfileInfo user={profile} />
            <ProfilePreferences preferences={defaultPreferences} />
          </div>
          
          {/* Right Column */}
          <div className="space-y-8">
            <TripStatistics statistics={statistics} />
            <AccountSettings />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
