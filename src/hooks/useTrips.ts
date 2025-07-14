
import { useState, useEffect } from 'react';
import { tripService, TripWithItinerary } from '@/services/tripService';
import { useToast } from '@/hooks/use-toast';

export const useTrips = () => {
  const [trips, setTrips] = useState<TripWithItinerary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const data = await tripService.getUserTrips();
      setTrips(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching trips:', err);
      setError('Failed to load trips');
      toast({
        title: "Error",
        description: "Failed to load trips. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const createTrip = async (tripData: {
    destination: string;
    startDate: string;
    endDate: string;
    duration: number;
  }) => {
    try {
      const newTrip = await tripService.createTrip(tripData);
      await fetchTrips(); // Refresh the list
      toast({
        title: "Success",
        description: "Trip created successfully!",
      });
      return newTrip;
    } catch (err) {
      console.error('Error creating trip:', err);
      toast({
        title: "Error",
        description: "Failed to create trip. Please try again.",
        variant: "destructive",
      });
      throw err;
    }
  };

  const deleteTrip = async (tripId: string) => {
    try {
      await tripService.deleteTrip(tripId);
      await fetchTrips(); // Refresh the list
      toast({
        title: "Success",
        description: "Trip deleted successfully!",
      });
    } catch (err) {
      console.error('Error deleting trip:', err);
      toast({
        title: "Error",
        description: "Failed to delete trip. Please try again.",
        variant: "destructive",
      });
      throw err;
    }
  };

  return {
    trips,
    loading,
    error,
    fetchTrips,
    createTrip,
    deleteTrip
  };
};
