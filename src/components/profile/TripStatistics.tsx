
import React from 'react';
import { Card } from '@/components/common/Card';
import { MapPin, Calendar, Clock, Plane } from 'lucide-react';

interface TripStatisticsProps {
  statistics: {
    totalTrips: number;
    completedTrips: number;
    upcomingTrips: number;
    draftTrips: number;
  };
}

export const TripStatistics: React.FC<TripStatisticsProps> = ({ statistics }) => {
  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Trip Statistics</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Plane className="h-4 w-4 text-blue-600" />
            </div>
            <span className="text-gray-700">Total Trips</span>
          </div>
          <span className="font-semibold text-gray-900">{statistics.totalTrips}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <MapPin className="h-4 w-4 text-green-600" />
            </div>
            <span className="text-gray-700">Completed Trips</span>
          </div>
          <span className="font-semibold text-gray-900">{statistics.completedTrips}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Calendar className="h-4 w-4 text-orange-600" />
            </div>
            <span className="text-gray-700">Upcoming Trips</span>
          </div>
          <span className="font-semibold text-gray-900">{statistics.upcomingTrips}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Clock className="h-4 w-4 text-purple-600" />
            </div>
            <span className="text-gray-700">Draft Trips</span>
          </div>
          <span className="font-semibold text-gray-900">{statistics.draftTrips}</span>
        </div>
      </div>
    </Card>
  );
};
