
import { useState, useEffect } from 'react';
import { preferencesService } from '@/services/preferencesService';
import { UserPreferences } from '@/types/User';
import { useToast } from '@/hooks/use-toast';

export const usePreferences = () => {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const fetchPreferences = async () => {
    try {
      setLoading(true);
      const data = await preferencesService.getUserPreferences();
      setPreferences(data);
    } catch (error) {
      console.error('Error fetching preferences:', error);
      toast({
        title: "Error",
        description: "Failed to load preferences.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const savePreferences = async (newPreferences: UserPreferences) => {
    try {
      setSaving(true);
      await preferencesService.saveUserPreferences(newPreferences);
      setPreferences(newPreferences);
      toast({
        title: "Success",
        description: "Preferences saved successfully!",
      });
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast({
        title: "Error",
        description: "Failed to save preferences. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchPreferences();
  }, []);

  return {
    preferences,
    loading,
    saving,
    fetchPreferences,
    savePreferences
  };
};
