
import React from 'react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { UserPreferences } from '@/types/User';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

interface PreferencesFormProps {
  preferences: UserPreferences;
  onPreferencesChange: (preferences: UserPreferences) => void;
  onSubmit: (preferences: UserPreferences) => void;
}

export const PreferencesForm: React.FC<PreferencesFormProps> = ({
  preferences,
  onPreferencesChange,
  onSubmit
}) => {
  const updatePreference = <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => {
    onPreferencesChange({
      ...preferences,
      [key]: value
    });
  };

  const toggleArrayPreference = <K extends keyof UserPreferences>(
    key: K,
    value: string,
    currentArray: string[]
  ) => {
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    
    updatePreference(key, newArray as UserPreferences[K]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(preferences);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Budget Range */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Budget Range</h3>
        <Select 
          value={preferences.budgetRange} 
          onValueChange={(value: 'low' | 'medium' | 'high' | 'luxury') => 
            updatePreference('budgetRange', value)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select your budget range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Budget-friendly ($)</SelectItem>
            <SelectItem value="medium">Moderate ($$)</SelectItem>
            <SelectItem value="high">High-end ($$$)</SelectItem>
            <SelectItem value="luxury">Luxury ($$$$)</SelectItem>
          </SelectContent>
        </Select>
      </Card>

      {/* Group Size */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Group Size</h3>
        <Select 
          value={preferences.groupSize} 
          onValueChange={(value: 'solo' | 'couple' | 'family' | 'friends') => 
            updatePreference('groupSize', value)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select group size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="solo">Solo traveler</SelectItem>
            <SelectItem value="couple">Couple</SelectItem>
            <SelectItem value="family">Family</SelectItem>
            <SelectItem value="friends">Friends</SelectItem>
          </SelectContent>
        </Select>
      </Card>

      {/* Activities */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Preferred Activities</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {['culture', 'food', 'history', 'nature', 'adventure', 'nightlife', 'shopping', 'art', 'technology'].map((activity) => (
            <div key={activity} className="flex items-center space-x-2">
              <Checkbox
                id={activity}
                checked={preferences.activities.includes(activity)}
                onCheckedChange={() => 
                  toggleArrayPreference('activities', activity, preferences.activities)
                }
              />
              <Label htmlFor={activity} className="capitalize">
                {activity}
              </Label>
            </div>
          ))}
        </div>
      </Card>

      {/* Place Types */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Places of Interest</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {['museums', 'landmarks', 'temples', 'beaches', 'parks', 'markets', 'galleries', 'theaters'].map((place) => (
            <div key={place} className="flex items-center space-x-2">
              <Checkbox
                id={place}
                checked={preferences.placeTypes.includes(place)}
                onCheckedChange={() => 
                  toggleArrayPreference('placeTypes', place, preferences.placeTypes)
                }
              />
              <Label htmlFor={place} className="capitalize">
                {place}
              </Label>
            </div>
          ))}
        </div>
      </Card>

      {/* Adventure Level */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Adventure Level</h3>
        <Select 
          value={preferences.adventureLevel} 
          onValueChange={(value: 'low' | 'medium' | 'high') => 
            updatePreference('adventureLevel', value)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select adventure level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low - Relaxed and comfortable</SelectItem>
            <SelectItem value="medium">Medium - Some adventure</SelectItem>
            <SelectItem value="high">High - Thrill-seeking</SelectItem>
          </SelectContent>
        </Select>
      </Card>

      {/* Travel Pace */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Travel Pace</h3>
        <Select 
          value={preferences.travelPace} 
          onValueChange={(value: 'relaxed' | 'moderate' | 'packed') => 
            updatePreference('travelPace', value)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select travel pace" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="relaxed">Relaxed - Plenty of free time</SelectItem>
            <SelectItem value="moderate">Moderate - Balanced schedule</SelectItem>
            <SelectItem value="packed">Packed - See everything</SelectItem>
          </SelectContent>
        </Select>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" size="lg" className="min-w-[200px]">
          Generate My Itinerary
        </Button>
      </div>
    </form>
  );
};
