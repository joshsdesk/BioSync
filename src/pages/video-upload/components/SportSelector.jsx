import React, { useState, useEffect } from 'react';
import { Plus, X, Check, AlertCircle, Info } from 'lucide-react';
import { sportsService } from '../../../services/sportsService';
import { useAuth } from '../../../contexts/AuthContext';

const SportSelector = ({ selectedSport, onSportChange, className = "" }) => {
  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customSportData, setCustomSportData] = useState({
    name: '',
    category: 'martial_arts',
    description: ''
  });
  const [submittingCustom, setSubmittingCustom] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    loadSports();
  }, []);

  const loadSports = async () => {
    try {
      setLoading(true);
      const sportsData = await sportsService?.getAllSports();
      setSports(sportsData);
    } catch (err) {
      setError('Failed to load sports categories');
      console.error('Error loading sports:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredSports = sports?.filter(sport =>
    sport?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
    sport?.category?.toLowerCase()?.includes(searchTerm?.toLowerCase())
  );

  // Group sports by category for better organization
  const groupedSports = filteredSports?.reduce((groups, sport) => {
    const category = sport?.category || 'other';
    if (!groups?.[category]) {
      groups[category] = [];
    }
    groups?.[category]?.push(sport);
    return groups;
  }, {});

  const handleCustomSportSubmit = async (e) => {
    e?.preventDefault();

    if (!user) {
      setError('Please sign in to add custom sports');
      return;
    }

    if (!customSportData?.name?.trim()) {
      setError('Sport name is required');
      return;
    }

    try {
      setSubmittingCustom(true);
      setError(null);

      const newSport = await sportsService?.addUserSport({
        name: customSportData?.name?.trim(),
        category: customSportData?.category,
        description: customSportData?.description?.trim() || null,
        user_id: user?.id
      });

      // Add the new sport to the local list
      setSports(prev => [...prev, newSport]);

      // Select the newly created sport
      onSportChange(newSport);

      // Reset form and close
      setCustomSportData({ name: '', category: 'martial_arts', description: '' });
      setShowCustomForm(false);

    } catch (err) {
      setError(err?.message || 'Failed to add custom sport');
    } finally {
      setSubmittingCustom(false);
    }
  };

  const cancelCustomForm = () => {
    setShowCustomForm(false);
    setCustomSportData({ name: '', category: 'martial_arts', description: '' });
    setError(null);
  };

  const getSportCategoryLabel = (category) => {
    const categoryLabels = {
      'martial_arts': 'Martial Arts',
      'basketball': 'Basketball',
      'tennis': 'Tennis',
      'golf': 'Golf',
      'soccer': 'Soccer',
      'baseball': 'Baseball',
      'swimming': 'Swimming',
      'running': 'Running',
      'weightlifting': 'Weight Lifting',
      'volleyball': 'Volleyball',
      'gymnastics': 'Gymnastics',
      'boxing': 'Boxing',
      'cycling': 'Cycling',
      'track_field': 'Track & Field',
      'individual': 'Individual Sports',
      'team': 'Team Sports',
      'combat': 'Combat Sports',
      'water': 'Water Sports',
      'winter': 'Winter Sports',
      'extreme': 'Extreme Sports',
      'custom': 'Custom Sports',
      'other': 'Other Sports'
    };
    return categoryLabels?.[category] || category;
  };

  if (loading) {
    return (
      <div className={`space-y-2 ${className}`}>
        <label className="block text-sm font-medium text-gray-700">Sport Category</label>
        <div className="animate-pulse bg-gray-200 h-10 rounded-md"></div>
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        Sport Category
      </label>

      {/* Search functionality */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search sports (e.g., 'sumo', 'martial arts', 'basketball')"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e?.target?.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
          <AlertCircle size={16} />
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {!showCustomForm ? (
        <>
          {/* Enhanced sport selection with grouped options */}
          <select
            value={selectedSport?.id || ''}
            onChange={(e) => {
              const sportId = parseInt(e.target.value);
              const sport = sports?.find(s => s?.id === sportId);
              if (sport) {
                onSportChange(sport);
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a sport...</option>
            {Object?.entries(groupedSports)?.map(([category, categorySports]) => (
              <optgroup key={category} label={getSportCategoryLabel(category)}>
                {categorySports?.map((sport) => (
                  <option key={sport?.id} value={sport?.id}>
                    {sport?.name}
                    {sport?.is_custom && ' (Custom)'}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>

          {/* Martial Arts suggestion */}
          {searchTerm?.toLowerCase()?.includes('sumo') && filteredSports?.length > 0 && (
            <div className="flex items-center gap-2 p-2 bg-blue-50 border border-blue-200 rounded-md text-blue-700 text-sm">
              <Info size={16} />
              <span>
                Found Sumo Wrestling! Also check out other martial arts like Judo, Brazilian Jiu-Jitsu, and Muay Thai.
              </span>
            </div>
          )}

          <button
            type="button"
            onClick={() => setShowCustomForm(true)}
            className="flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
          >
            <Plus size={16} />
            Can't find your sport? Add it here
          </button>
        </>
      ) : (
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-900">Add Custom Sport</h4>
            <button
              onClick={cancelCustomForm}
              className="text-gray-400 hover:text-gray-600"
              disabled={submittingCustom}
            >
              <X size={16} />
            </button>
          </div>

          <form onSubmit={handleCustomSportSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Sport Name *
              </label>
              <input
                type="text"
                value={customSportData?.name}
                onChange={(e) => setCustomSportData(prev => ({ ...prev, name: e?.target?.value }))}
                placeholder="e.g., Aikido, Kendo, Capoeira, Parkour..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                disabled={submittingCustom}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={customSportData?.category}
                onChange={(e) => setCustomSportData(prev => ({ ...prev, category: e?.target?.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                disabled={submittingCustom}
              >
                <option value="martial_arts">Martial Arts</option>
                <option value="individual">Individual Sport</option>
                <option value="team">Team Sport</option>
                <option value="combat">Combat Sport</option>
                <option value="water">Water Sport</option>
                <option value="winter">Winter Sport</option>
                <option value="extreme">Extreme Sport</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Description (Optional)
              </label>
              <textarea
                value={customSportData?.description}
                onChange={(e) => setCustomSportData(prev => ({ ...prev, description: e?.target?.value }))}
                placeholder="Brief description of the sport and key movements..."
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                disabled={submittingCustom}
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={submittingCustom || !customSportData?.name?.trim()}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submittingCustom ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Adding...
                  </>
                ) : (
                  <>
                    <Check size={16} />
                    Add Sport
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={cancelCustomForm}
                disabled={submittingCustom}
                className="px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </form>

          {!user && (
            <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-700">
              Please sign in to add custom sports to the database
            </div>
          )}
        </div>
      )}

      {selectedSport && (
        <div className="text-sm text-gray-600">
          Selected: <span className="font-medium">{selectedSport?.name}</span>
          {selectedSport?.category && (
            <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
              {getSportCategoryLabel(selectedSport?.category)}
            </span>
          )}
          {selectedSport?.is_custom && (
            <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
              Custom Sport
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default SportSelector;