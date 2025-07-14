
import React from 'react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Settings, DollarSign, Users, Compass, Clock } from 'lucide-react';
import { UserPreferences } from '@/types/User';

interface ProfilePreferencesProps {
  preferences: UserPreferences;
}

export const ProfilePreferences: React.FC<ProfilePreferencesProps> = ({ preferences }) => {
  const getBudgetLabel = (budget: string) => {
    const labels = {
      low: 'Budget-friendly ($)',
      medium: 'Moderate ($$)',
      high: 'High-end ($$$)',
      luxury: 'Luxury ($$$$)'
    };
    return labels[budget as keyof typeof labels] || budget;
  };

  const getGroupSizeLabel = (size: string) => {
    const labels = {
      solo: 'Solo traveler',
      couple: 'Couple',
      family: 'Family',
      friends: 'Friends'
    };
    return labels[size as keyof typeof labels] || size;
  };

  const getAdventureLevelLabel = (level: string) => {
    const labels = {
      low: 'Low - Relaxed',
      medium: 'Medium - Some adventure',
      high: 'High - Thrill-seeking'
    };
    return labels[level as keyof typeof labels] || level;
  };

  const getTravelPaceLabel = (pace: string) => {
    const labels = {
      relaxed: 'Relaxed - Plenty of free time',
      moderate: 'Moderate - Balanced',
      packed: 'Packed - See everything'
    };
    return labels[pace as keyof typeof labels] || pace;
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Travel Preferences</h3>
        <Link to="/preferences">
          <Button variant="outline" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Edit Preferences
          </Button>
        </Link>
      </div>

      <div className="space-y-6">
        {/* Budget & Group */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4 text-gray-500" />
              <span className="font-medium text-gray-700">Budget Range</span>
            </div>
            <Badge variant="secondary">{getBudgetLabel(preferences.budgetRange)}</Badge>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-gray-500" />
              <span className="font-medium text-gray-700">Group Size</span>
            </div>
            <Badge variant="secondary">{getGroupSizeLabel(preferences.groupSize)}</Badge>
          </div>
        </div>

        {/* Adventure & Pace */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Compass className="h-4 w-4 text-gray-500" />
              <span className="font-medium text-gray-700">Adventure Level</span>
            </div>
            <Badge variant="secondary">{getAdventureLevelLabel(preferences.adventureLevel)}</Badge>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="font-medium text-gray-700">Travel Pace</span>
            </div>
            <Badge variant="secondary">{getTravelPaceLabel(preferences.travelPace)}</Badge>
          </div>
        </div>

        {/* Activities */}
        <div>
          <h4 className="font-medium text-gray-700 mb-2">Preferred Activities</h4>
          <div className="flex flex-wrap gap-2">
            {preferences.activities.map((activity) => (
              <Badge key={activity} variant="outline" className="capitalize">
                {activity}
              </Badge>
            ))}
          </div>
        </div>

        {/* Places */}
        <div>
          <h4 className="font-medium text-gray-700 mb-2">Places of Interest</h4>
          <div className="flex flex-wrap gap-2">
            {preferences.placeTypes.map((place) => (
              <Badge key={place} variant="outline" className="capitalize">
                {place}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};
