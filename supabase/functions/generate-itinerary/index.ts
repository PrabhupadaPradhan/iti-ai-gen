import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Generate itinerary function called');
    
    const { tripId, destination, startDate, endDate, duration, preferences } = await req.json();
    
    console.log('Request data:', { tripId, destination, startDate, endDate, duration });

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get Gemini API key
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    
    if (!geminiApiKey) {
      console.error('GEMINI_API_KEY not found');
      return new Response(
        JSON.stringify({ error: 'Gemini API key not configured' }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Simple prompt for Gemini
    const prompt = `Create a ${duration}-day travel itinerary for ${destination} from ${startDate} to ${endDate}. 
Budget: ${preferences?.budgetRange || 'medium'}
Group: ${preferences?.groupSize || 'solo'}
Activities: ${preferences?.activities?.join(', ') || 'general sightseeing'}

Return ONLY valid JSON in this exact format:
{
  "days": [
    {
      "day_number": 1,
      "date": "${startDate}",
      "accommodation": "Hotel name and address",
      "activities": [
        {
          "name": "Activity name",
          "description": "Brief description", 
          "location": "Specific location with address",
          "duration": 120,
          "category": "sightseeing",
          "cost": 30
        }
      ],
      "meals": [
        {
          "meal_type": "lunch",
          "restaurant": "Restaurant name",
          "cuisine": "Local cuisine type",
          "location": "Restaurant address",
          "cost": 20
        }
      ]
    }
  ]
}`;

    console.log('Calling Gemini API...');

    // Call Gemini API with retry logic
    let geminiResponse;
    let attempts = 0;
    const maxAttempts = 3;
    
    while (attempts < maxAttempts) {
      attempts++;
      console.log(`Gemini API attempt ${attempts}/${maxAttempts}`);
      
      try {
        geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: prompt
              }]
            }],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 8192,
            }
          })
        });

        if (geminiResponse.ok) {
          break;
        } else if (geminiResponse.status === 503 && attempts < maxAttempts) {
          console.log(`Gemini API returned 503, retrying in ${attempts * 2} seconds...`);
          await new Promise(resolve => setTimeout(resolve, attempts * 2000));
          continue;
        } else {
          const error = await geminiResponse.text();
          console.error('Gemini API error:', error);
          throw new Error(`Gemini API failed: ${geminiResponse.status} - ${error}`);
        }
      } catch (fetchError) {
        console.error(`Gemini API fetch error on attempt ${attempts}:`, fetchError);
        if (attempts === maxAttempts) {
          throw new Error(`Gemini API failed after ${maxAttempts} attempts: ${fetchError.message}`);
        }
        await new Promise(resolve => setTimeout(resolve, attempts * 2000));
      }
    }

    const geminiData = await geminiResponse.json();
    console.log('Gemini response received');

    let itineraryText = geminiData.candidates[0].content.parts[0].text;
    
    // Clean up the response to extract JSON
    if (itineraryText.includes('```json')) {
      itineraryText = itineraryText.split('```json')[1].split('```')[0];
    } else if (itineraryText.includes('```')) {
      itineraryText = itineraryText.split('```')[1].split('```')[0];
    }
    
    let itineraryData;
    try {
      itineraryData = JSON.parse(itineraryText.trim());
    } catch (parseError) {
      console.error('Failed to parse Gemini response as JSON:', parseError);
      console.log('Raw response:', itineraryText);
      throw new Error('Invalid JSON response from AI');
    }

    console.log('Parsed itinerary data:', itineraryData);

    // Save itinerary to database
    const days = itineraryData.days || [];
    
    for (const day of days) {
      console.log(`Processing day ${day.day_number}`);
      
      // Create day itinerary
      const { data: dayItinerary, error: dayError } = await supabase
        .from('day_itineraries')
        .insert({
          trip_id: tripId,
          day_number: day.day_number,
          date: day.date,
          accommodation: day.accommodation
        })
        .select()
        .single();

      if (dayError) {
        console.error('Error creating day itinerary:', dayError);
        throw dayError;
      }

      console.log(`Created day itinerary: ${dayItinerary.id}`);

      // Add activities
      if (day.activities && day.activities.length > 0) {
        for (const activity of day.activities) {
          const { error: activityError } = await supabase
            .from('activities')
            .insert({
              day_itinerary_id: dayItinerary.id,
              name: activity.name,
              description: activity.description,
              location: activity.location,
              duration: activity.duration,
              cost: activity.cost,
              category: activity.category
            });

          if (activityError) {
            console.error('Error creating activity:', activityError);
          }
        }
      }

      // Add meals
      if (day.meals && day.meals.length > 0) {
        for (const meal of day.meals) {
          const { error: mealError } = await supabase
            .from('meals')
            .insert({
              day_itinerary_id: dayItinerary.id,
              meal_type: meal.meal_type,
              restaurant: meal.restaurant,
              cuisine: meal.cuisine,
              location: meal.location,
              cost: meal.cost
            });

          if (mealError) {
            console.error('Error creating meal:', mealError);
          }
        }
      }
    }

    // Update trip status
    const { error: updateError } = await supabase
      .from('trips')
      .update({ 
        status: 'confirmed',
        updated_at: new Date().toISOString()
      })
      .eq('id', tripId);

    if (updateError) {
      console.error('Error updating trip status:', updateError);
    }

    console.log('Itinerary generation completed successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Itinerary generated successfully',
        tripId: tripId
      }), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in generate-itinerary function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to generate itinerary',
        details: error.toString()
      }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});