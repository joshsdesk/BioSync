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


/**
 * Sports Service
 * Handles fetching, managing, and creating sports categories and definitions.
 */
export const sportsService = {
  /**
   * Retrieves all available sports, including both default and user-customized ones.
   * Forces mock data if Supabase client is unavailable.
   * @returns {Promise<Array>} List of sport objects
   */
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

  /**
   * Filters sports by their category.
   * @param {string} category - The category to filter by (e.g., 'Team Sports')
   * @returns {Promise<Array>} List of sports in the category
   */
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

  /**
   * Adds a new custom sport to the database.
   * @param {Object} sportData - The sport data object
   * @param {string} sportData.name - Name of the sport
   * @param {string} sportData.category - Category of the sport
   * @param {string} sportData.user_id - UUID of the creator
   * @returns {Promise<Object>} The created sport object
   */
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

  /**
   * Retrieves custom sports created by a specific user (from main table).
   * @param {string} userId - UUID of the user
   * @returns {Promise<Array>} List of user's custom sports
   */
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

  /**
   * Retrieves custom variations of sports from the separate custom_sports table.
   * @param {string} userId - UUID of the user
   * @returns {Promise<Array>}
   */
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

  /**
   * Adds a personalized sport variation to the custom_sports table.
   * @param {Object} sportData - Data for the custom sport
   * @returns {Promise<Object>} Created custom sport
   */
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

  /**
   * Searches for sports by name (case-insensitive).
   * @param {string} searchTerm - The name to search for
   * @returns {Promise<Array>} List of matching sports
   */
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

  /**
   * Retrieves a single sport by its ID.
   * @param {string|number} sportId - ID of the sport
   * @returns {Promise<Object>} Sport object
   */
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

  /**
   * Retrieves a custom sport variation by ID.
   * @param {string|number} sportId - ID of the custom sport
   * @returns {Promise<Object>} Custom sport object
   */
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

  /**
   * Deletes a user-created sport from the main sports table.
   * @param {string|number} sportId - ID of the sport
   * @param {string} userId - ID of the requesting user (must match creator)
   * @returns {Promise<boolean>} Success status
   */
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

  /**
   * Deletes a personalized custom sport.
   * @param {string|number} sportId - ID of the custom sport
   * @param {string} userId - ID of the requesting user
   * @returns {Promise<boolean>} Success status
   */
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

  /**
   * Retrieves a list of all unique sport categories.
   * @returns {Promise<Array>} List of category strings
   */
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