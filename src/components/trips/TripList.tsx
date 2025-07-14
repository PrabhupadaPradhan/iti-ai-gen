import React from 'react';
import { TripCard } from './TripCard';
import { useTrips } from '@/hooks/useTrips';

export const TripList: React.FC = () => {
  const { trips, loading, error } = useTrips();

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading your trips...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-400 text-6xl mb-4">⚠️</div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">Error loading trips</h3>
        <p className="text-gray-500">{error}</p>
      </div>
    );
  }

  if (trips.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">✈️</div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No trips yet</h3>
        <p className="text-gray-500">Start planning your first adventure!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {trips.map((trip) => (
        <TripCard key={trip.id} trip={trip} />
      ))}
    </div>
  );
};