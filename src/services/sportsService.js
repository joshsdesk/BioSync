import { supabase } from '../lib/supabase';

// Mock Data for fallback
const MOCK_SPORTS = [
  { id: 1, name: 'Basketball', category: 'Team Sports' },
  { id: 2, name: 'Soccer', category: 'Team Sports' },
  { id: 3, name: 'Tennis', category: 'Racquet Sports' },
  { id: 4, name: 'Golf', category: 'Individual Sports' },
  { id: 5, name: 'Baseball', category: 'Team Sports' },
  { id: 6, name: 'Running', category: 'Endurance' },
  { id: 7, name: 'Weightlifting', category: 'Strength' },
  { id: 8, name: 'Swimming', category: 'Aquatics' },
  { id: 9, name: 'Volleyball', category: 'Team Sports' },
  { id: 10, name: 'Sumo Wrestling', category: 'Martial Arts' }
];

const isMockMode = !supabase;

export const sportsService = {
  // Get all sports (default + user-created from sports table)
  async getAllSports() {
    // Force mock mode if no supabase client
    if (isMockMode || !supabase) return MOCK_SPORTS;
    try {
      const { data, error } = await supabase?.from('sports')?.select('*')?.order('name');

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.warn('Error fetching sports (falling back to mock):', error);
      return MOCK_SPORTS;
    }
  },

  // Get sports by category
  async getSportsByCategory(category) {
    if (isMockMode) return MOCK_SPORTS.filter(s => s.category === category);
    try {
      const { data, error } = await supabase?.from('sports')?.select('*')?.eq('category', category)?.order('name');

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.warn('Error fetching sports by category (falling back to mock):', error);
      return MOCK_SPORTS.filter(s => s.category === category);
    }
  },

  // Add a user-created sport to the sports table
  async addUserSport(sportData) {
    if (isMockMode) {
      console.log('Mock add user sport:', sportData);
      return { ...sportData, id: Date.now(), is_custom: true };
    }
    try {
      // Check if sport already exists in sports table
      const { data: existingSport } = await supabase?.from('sports')?.select('id, name')?.ilike('name', sportData?.name)?.single();

      if (existingSport) {
        throw new Error('This sport already exists in our database');
      }

      const { data, error } = await supabase?.from('sports')?.insert([{
        name: sportData?.name,
        category: sportData?.category || 'custom',
        description: sportData?.description,
        is_custom: true,
        created_by: sportData?.user_id,
        movement_focus: sportData?.movement_focus || []
      }])?.select()?.single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error adding user sport:', error);
      throw error;
    }
  },

  // Get user's custom sports from sports table
  async getUserSports(userId) {
    if (isMockMode) return [];
    try {
      const { data, error } = await supabase?.from('sports')?.select('*')?.eq('created_by', userId)?.eq('is_custom', true)?.order('name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user sports:', error);
      throw error;
    }
  },

  // Get user's custom sports from custom_sports table
  async getUserCustomSports(userId) {
    if (isMockMode) return [];
    try {
      const { data, error } = await supabase?.from('custom_sports')?.select('*')?.eq('user_id', userId)?.order('name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user custom sports:', error);
      throw error;
    }
  },

  // Add a sport to user's custom_sports table (for personal variations)
  async addUserCustomSport(sportData) {
    if (isMockMode) return { ...sportData, id: Date.now() };
    try {
      // Check if user already created this sport
      const { data: existingUserSport } = await supabase?.from('custom_sports')?.select('id')?.eq('user_id', sportData?.user_id)?.ilike('name', sportData?.name)?.single();

      if (existingUserSport) {
        throw new Error('You have already added this sport to your custom sports');
      }

      const { data, error } = await supabase?.from('custom_sports')?.insert([{
        name: sportData?.name,
        description: sportData?.description,
        movement_types: sportData?.movement_types || [],
        user_id: sportData?.user_id
      }])?.select()?.single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error adding user custom sport:', error);
      throw error;
    }
  },

  // Search sports by name
  async searchSports(searchTerm) {
    if (isMockMode) return MOCK_SPORTS.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));
    try {
      const { data: sports, error: sportsError } = await supabase?.from('sports')?.select('*')?.ilike('name', `%${searchTerm}%`)?.order('name');

      if (sportsError) throw sportsError;

      return sports || [];
    } catch (error) {
      console.warn('Error searching sports (falling back to mock):', error);
      return MOCK_SPORTS.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
  },

  // Get sport by ID from sports table
  async getSportById(sportId) {
    if (isMockMode) return MOCK_SPORTS.find(s => s.id === sportId);
    try {
      const { data: sport, error: sportError } = await supabase?.from('sports')?.select('*')?.eq('id', sportId)?.single();

      if (sportError) throw sportError;
      return sport;
    } catch (error) {
      console.error('Error fetching sport by ID:', error);
      throw error;
    }
  },

  // Get custom sport by ID from custom_sports table
  async getCustomSportById(sportId) {
    if (isMockMode) return null;
    try {
      const { data: sport, error: sportError } = await supabase?.from('custom_sports')?.select('*')?.eq('id', sportId)?.single();

      if (sportError) throw sportError;
      return sport;
    } catch (error) {
      console.error('Error fetching custom sport by ID:', error);
      throw error;
    }
  },

  // Delete user sport from sports table (only for sport creator)
  async deleteUserSport(sportId, userId) {
    if (isMockMode) return true;
    try {
      const { error } = await supabase?.from('sports')?.delete()?.eq('id', sportId)?.eq('created_by', userId)?.eq('is_custom', true);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting user sport:', error);
      throw error;
    }
  },

  // Delete user custom sport from custom_sports table (only for sport creator)
  async deleteUserCustomSport(sportId, userId) {
    if (isMockMode) return true;
    try {
      const { error } = await supabase?.from('custom_sports')?.delete()?.eq('id', sportId)?.eq('user_id', userId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting user custom sport:', error);
      throw error;
    }
  },

  // Get all available sport categories
  async getSportCategories() {
    if (isMockMode) return [...new Set(MOCK_SPORTS.map(s => s.category))];
    try {
      const { data, error } = await supabase?.from('sports')?.select('category')?.not('category', 'is', null);

      if (error) throw error;

      // Extract unique categories
      const categories = [...new Set(data?.map(item => item?.category))];
      return categories || [];
    } catch (error) {
      console.warn('Error fetching categories (falling back to mock):', error);
      return [...new Set(MOCK_SPORTS.map(s => s.category))];
    }
  }
};