
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/navigation/Navbar';
import { SearchBar } from '@/components/search/SearchBar';
import { Card } from '@/components/common/Card';
import { Compass, Clock, Heart, Globe } from 'lucide-react';

export const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleSearch = (destination: string) => {
    console.log('Searching for:', destination);
    // Navigate to preferences page with destination
    navigate('/preferences', { state: { destination } });
  };

  const handleSuggestionSelect = (suggestion: string) => {
    console.log('Selected suggestion:', suggestion);
    navigate('/preferences', { state: { destination: suggestion } });
  };

  const features = [
    {
      icon: <Compass className="h-8 w-8 text-blue-600" />,
      title: 'AI-Powered Planning',
      description: 'Get personalized itineraries based on your preferences and interests'
    },
    {
      icon: <Clock className="h-8 w-8 text-green-600" />,
      title: 'Real-time Updates',
      description: 'Dynamic suggestions that adapt to weather, events, and availability'
    },
    {
      icon: <Heart className="h-8 w-8 text-red-600" />,
      title: 'Tailored Experiences',
      description: 'Every recommendation is customized to your travel style and budget'
    },
    {
      icon: <Globe className="h-8 w-8 text-purple-600" />,
      title: 'Global Coverage',
      description: 'Discover amazing destinations and hidden gems worldwide'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Plan Your Perfect
              <span className="text-blue-600 block">Adventure</span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
              Let AI create personalized itineraries tailored to your preferences, budget, and travel style. 
              Discover amazing destinations with intelligent recommendations.
            </p>
            
            {/* Search Bar */}
            <div className="mb-16">
              <SearchBar 
                onSearch={handleSearch}
                onSuggestionSelect={handleSuggestionSelect}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Choose TravelAI?
          </h2>
          <p className="text-lg text-gray-600">
            Experience the future of travel planning with our intelligent platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <div className="flex flex-col items-center space-y-4">
                <div className="flex items-center justify-center w-16 h-16 bg-gray-50 rounded-full">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of travelers who trust TravelAI for their perfect trips
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate('/signup')}
              className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-50 transition-colors"
            >
              Get Started Free
            </button>
            <button 
              onClick={() => navigate('/login')}
              className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
