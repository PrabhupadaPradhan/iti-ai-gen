
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/navigation/Navbar';
import { PreferencesForm } from '@/components/preferences/PreferencesForm';
import { UserPreferences } from '@/types/User';
import { Button } from '@/components/common/Button';
import { ArrowLeft } from 'lucide-react';
import { usePreferences } from '@/hooks/usePreferences';
import { useTrips } from '@/hooks/useTrips';

const Preferences: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const destination = location.state?.destination || '';
  
  const { preferences: userPreferences, loading, savePreferences } = usePreferences();
  const { createTrip } = useTrips();
  
  const [preferences, setPreferences] = useState<UserPreferences>({
    foodPreferences: [],
    budgetRange: 'medium',
    placeTypes: [],
    activities: [],
    accommodationType: [],
    transportationPreference: [],
    adventureLevel: 'medium',
    dietaryRestrictions: [],
    accessibilityRequirements: [],
    weatherComfort: 'warm',
    groupSize: 'solo',
    languagesSpoken: ['english'],
    travelPace: 'moderate'
  });

  // Load user's existing preferences when available
  useEffect(() => {
    if (userPreferences) {
      setPreferences(userPreferences);
    }
  }, [userPreferences]);

  const handlePreferencesSubmit = async (updatedPreferences: UserPreferences) => {
    try {
      // Save preferences first
      await savePreferences(updatedPreferences);
      
      // If we have a destination, create a trip and generate itinerary
      if (destination) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() + 7); // Default to next week
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 7); // 7 day trip
        
        const newTrip = await createTrip({
          destination,
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0],
          duration: 7
        });
        
        // Generate itinerary using Gemini AI
        try {
          const response = await fetch(`https://eskufzrcfwjfnlfllyhe.supabase.co/functions/v1/generate-itinerary`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              tripId: newTrip.id,
              destination,
              startDate: startDate.toISOString().split('T')[0],
              endDate: endDate.toISOString().split('T')[0],
              duration: 7,
              preferences: updatedPreferences
            })
          });

          if (!response.ok) {
            throw new Error('Failed to generate itinerary');
          }

          const result = await response.json();
          console.log('Itinerary generated:', result);
        } catch (aiError) {
          console.error('AI generation failed:', aiError);
          // Continue anyway - trip is created, just without AI itinerary
        }
        
        // Navigate to the new trip detail page
        navigate(`/trip/${newTrip.id}`);
      } else {
        // Just navigate back to profile if no destination
        navigate('/profile');
      }
    } catch (error) {
      console.error('Error saving preferences or creating trip:', error);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="space-y-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow">
                  <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={handleBack}
            className="mb-4 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          
          <h1 className="text-3xl font-bold text-gray-900">
            {destination ? `Plan Your Trip to ${destination}` : 'Travel Preferences'}
          </h1>
          <p className="text-gray-600 mt-2">
            {destination 
              ? 'Tell us about your preferences to get a personalized itinerary'
              : 'Update your travel preferences for better recommendations'
            }
          </p>
        </div>
        
        <PreferencesForm 
          preferences={preferences}
          onPreferencesChange={setPreferences}
          onSubmit={handlePreferencesSubmit}
        />
      </div>
    </div>
  );
};

export default Preferences;
