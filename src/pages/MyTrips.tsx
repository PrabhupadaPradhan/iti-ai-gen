
import React from 'react';
import { Navbar } from '@/components/navigation/Navbar';
import { TripList } from '@/components/trips/TripList';
import { Button } from '@/components/common/Button';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const MyTrips: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Trips</h1>
            <p className="text-gray-600 mt-2">Manage and view your travel itineraries</p>
          </div>
          <Link to="/">
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Plan New Trip
            </Button>
          </Link>
        </div>
        
        <TripList />
      </div>
    </div>
  );
};

export default MyTrips;
