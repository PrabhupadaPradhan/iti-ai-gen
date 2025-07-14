import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/navigation/Navbar';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { tripService, TripWithItinerary } from '@/services/tripService';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Calendar, MapPin, Users, Clock, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

const TripDetail: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [trip, setTrip] = useState<TripWithItinerary | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const fetchTrip = async () => {
      if (!tripId) return;
      
      try {
        const data = await tripService.getTripById(tripId);
        setTrip(data);
      } catch (error) {
        console.error('Error fetching trip:', error);
        toast({
          title: "Error",
          description: "Failed to load trip details. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [tripId, toast]);

  const handleGenerateItinerary = async () => {
    if (!trip) return;
    
    setGenerating(true);
    try {
      const response = await fetch(`https://eskufzrcfwjfnlfllyhe.supabase.co/functions/v1/generate-itinerary`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tripId: trip.id,
          destination: trip.destination,
          startDate: trip.start_date,
          endDate: trip.end_date,
          duration: trip.duration,
          preferences: {
            budgetRange: 'medium',
            groupSize: 'solo',
            activities: ['sightseeing', 'culture']
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate itinerary');
      }

      const result = await response.json();
      
      toast({
        title: "Success",
        description: "Itinerary generated successfully! Refreshing...",
      });

      // Refresh the trip data
      setTimeout(async () => {
        const updatedTrip = await tripService.getTripById(trip.id);
        setTrip(updatedTrip);
      }, 2000);

    } catch (error) {
      console.error('Error generating itinerary:', error);
      toast({
        title: "Error",
        description: "Failed to generate itinerary. Please try again.",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow">
                  <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                  <div className="h-20 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📍</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Trip not found</h3>
            <p className="text-gray-500">The trip you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/my-trips')} className="mt-4">
              Back to My Trips
            </Button>
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
            onClick={() => navigate('/my-trips')}
            className="mb-4 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to My Trips
          </Button>
          
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{trip.destination}</h1>
              <div className="flex items-center gap-6 mt-2 text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{format(new Date(trip.start_date), 'MMM dd')} - {format(new Date(trip.end_date), 'MMM dd, yyyy')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{trip.duration} days</span>
                </div>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              trip.status === 'confirmed' ? 'bg-green-100 text-green-800' :
              trip.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
              'bg-blue-100 text-blue-800'
            }`}>
              {trip.status}
            </span>
          </div>
        </div>

        {trip.day_itineraries && trip.day_itineraries.length > 0 ? (
          <div className="space-y-6">
            {trip.day_itineraries
              .sort((a, b) => a.day_number - b.day_number)
              .map((day) => (
                <Card key={day.id} className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Day {day.day_number} - {format(new Date(day.date), 'MMMM dd, yyyy')}
                  </h3>
                  
                  {day.accommodation && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-900">Accommodation</h4>
                      <p className="text-blue-700">{day.accommodation}</p>
                    </div>
                  )}

                  {day.activities && day.activities.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">Activities</h4>
                      <div className="space-y-2">
                        {day.activities.map((activity) => (
                          <div key={activity.id} className="p-3 bg-gray-50 rounded-lg">
                            <h5 className="font-medium">{activity.name}</h5>
                            {activity.description && (
                              <p className="text-gray-600 text-sm">{activity.description}</p>
                            )}
                            {activity.location && (
                              <div className="flex items-center gap-1 mt-1">
                                <MapPin className="h-3 w-3 text-gray-400" />
                                <span className="text-sm text-gray-500">{activity.location}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {day.meals && day.meals.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Meals</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        {day.meals.map((meal) => (
                          <div key={meal.id} className="p-2 bg-green-50 rounded-lg">
                            <h6 className="font-medium capitalize text-green-900">{meal.meal_type}</h6>
                            {meal.restaurant && (
                              <p className="text-sm text-green-700">{meal.restaurant}</p>
                            )}
                            {meal.cuisine && (
                              <p className="text-xs text-green-600">{meal.cuisine}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              ))}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <div className="text-gray-400 text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No itinerary yet</h3>
            <p className="text-gray-500 mb-4">This trip doesn't have a detailed itinerary.</p>
            <Button onClick={handleGenerateItinerary} disabled={generating}>
              {generating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Itinerary'
              )}
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TripDetail;