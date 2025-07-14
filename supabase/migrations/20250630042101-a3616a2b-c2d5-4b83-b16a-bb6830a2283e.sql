
-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  country TEXT,
  city TEXT,
  profile_picture TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user preferences table
CREATE TABLE public.user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  food_preferences TEXT[],
  budget_range TEXT CHECK (budget_range IN ('low', 'medium', 'high', 'luxury')),
  place_types TEXT[],
  activities TEXT[],
  accommodation_type TEXT[],
  transportation_preference TEXT[],
  adventure_level TEXT CHECK (adventure_level IN ('low', 'medium', 'high')),
  dietary_restrictions TEXT[],
  accessibility_requirements TEXT[],
  weather_comfort TEXT CHECK (weather_comfort IN ('cold', 'warm', 'hot')),
  group_size TEXT CHECK (group_size IN ('solo', 'couple', 'family', 'friends')),
  languages_spoken TEXT[],
  travel_pace TEXT CHECK (travel_pace IN ('relaxed', 'moderate', 'packed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create trips table
CREATE TABLE public.trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  destination TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  duration INTEGER NOT NULL,
  status TEXT CHECK (status IN ('draft', 'confirmed', 'completed')) DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create day itineraries table
CREATE TABLE public.day_itineraries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID REFERENCES public.trips(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL,
  date DATE NOT NULL,
  accommodation TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create activities table
CREATE TABLE public.activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_itinerary_id UUID REFERENCES public.day_itineraries(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  location TEXT,
  duration INTEGER, -- in minutes
  cost DECIMAL(10,2),
  category TEXT,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create meals table
CREATE TABLE public.meals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_itinerary_id UUID REFERENCES public.day_itineraries(id) ON DELETE CASCADE,
  meal_type TEXT CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  restaurant TEXT,
  cuisine TEXT,
  cost DECIMAL(10,2),
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.day_itineraries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for user preferences
CREATE POLICY "Users can view their own preferences" ON public.user_preferences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences" ON public.user_preferences
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences" ON public.user_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for trips
CREATE POLICY "Users can view their own trips" ON public.trips
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own trips" ON public.trips
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own trips" ON public.trips
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own trips" ON public.trips
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for day itineraries
CREATE POLICY "Users can view their trip itineraries" ON public.day_itineraries
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.trips 
    WHERE trips.id = day_itineraries.trip_id 
    AND trips.user_id = auth.uid()
  ));

CREATE POLICY "Users can create itineraries for their trips" ON public.day_itineraries
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM public.trips 
    WHERE trips.id = day_itineraries.trip_id 
    AND trips.user_id = auth.uid()
  ));

CREATE POLICY "Users can update their trip itineraries" ON public.day_itineraries
  FOR UPDATE USING (EXISTS (
    SELECT 1 FROM public.trips 
    WHERE trips.id = day_itineraries.trip_id 
    AND trips.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete their trip itineraries" ON public.day_itineraries
  FOR DELETE USING (EXISTS (
    SELECT 1 FROM public.trips 
    WHERE trips.id = day_itineraries.trip_id 
    AND trips.user_id = auth.uid()
  ));

-- Create RLS policies for activities
CREATE POLICY "Users can view activities in their trips" ON public.activities
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.day_itineraries di
    JOIN public.trips t ON t.id = di.trip_id
    WHERE di.id = activities.day_itinerary_id 
    AND t.user_id = auth.uid()
  ));

CREATE POLICY "Users can create activities for their trips" ON public.activities
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM public.day_itineraries di
    JOIN public.trips t ON t.id = di.trip_id
    WHERE di.id = activities.day_itinerary_id 
    AND t.user_id = auth.uid()
  ));

CREATE POLICY "Users can update activities in their trips" ON public.activities
  FOR UPDATE USING (EXISTS (
    SELECT 1 FROM public.day_itineraries di
    JOIN public.trips t ON t.id = di.trip_id
    WHERE di.id = activities.day_itinerary_id 
    AND t.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete activities from their trips" ON public.activities
  FOR DELETE USING (EXISTS (
    SELECT 1 FROM public.day_itineraries di
    JOIN public.trips t ON t.id = di.trip_id
    WHERE di.id = activities.day_itinerary_id 
    AND t.user_id = auth.uid()
  ));

-- Create RLS policies for meals
CREATE POLICY "Users can view meals in their trips" ON public.meals
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.day_itineraries di
    JOIN public.trips t ON t.id = di.trip_id
    WHERE di.id = meals.day_itinerary_id 
    AND t.user_id = auth.uid()
  ));

CREATE POLICY "Users can create meals for their trips" ON public.meals
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM public.day_itineraries di
    JOIN public.trips t ON t.id = di.trip_id
    WHERE di.id = meals.day_itinerary_id 
    AND t.user_id = auth.uid()
  ));

CREATE POLICY "Users can update meals in their trips" ON public.meals
  FOR UPDATE USING (EXISTS (
    SELECT 1 FROM public.day_itineraries di
    JOIN public.trips t ON t.id = di.trip_id
    WHERE di.id = meals.day_itinerary_id 
    AND t.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete meals from their trips" ON public.meals
  FOR DELETE USING (EXISTS (
    SELECT 1 FROM public.day_itineraries di
    JOIN public.trips t ON t.id = di.trip_id
    WHERE di.id = meals.day_itinerary_id 
    AND t.user_id = auth.uid()
  ));

-- Create function to automatically create user profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
