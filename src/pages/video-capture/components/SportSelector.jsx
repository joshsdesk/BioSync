import React, { useState, useEffect, useContext } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { sportsService } from '../../../services/sportsService';
import { AuthContext } from '../../../contexts/AuthContext';

const SportSelector = ({ selectedSport, onSportChange, disabled }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [sports, setSports] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customSportData, setCustomSportData] = useState({
    name: '',
    description: '',
    category: 'custom'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useContext(AuthContext);

  // Fetch sports on component mount
  useEffect(() => {
    fetchSports();
  }, []);

  const fetchSports = async () => {
    try {
      setIsLoading(true);
      const allSports = await sportsService?.getAllSports();
      setSports(allSports || []);
    } catch (error) {
      console.error('Error loading sports:', error);
      setSports([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSportSelect = (sport) => {
    onSportChange(sport);
    setIsExpanded(false);
  };

  const handleCustomSportSubmit = async (e) => {
    e?.preventDefault();
    if (!user?.id) {
      alert('Please log in to add custom sports');
      return;
    }

    try {
      setIsLoading(true);
      await sportsService?.addUserSport({
        ...customSportData,
        user_id: user?.id
      });
      
      // Reset form and refresh sports list
      setCustomSportData({ name: '', description: '', category: 'custom' });
      setShowCustomForm(false);
      await fetchSports();
      
      alert('Custom sport added successfully!');
    } catch (error) {
      console.error('Error adding custom sport:', error);
      alert(error?.message || 'Failed to add custom sport');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (term) => {
    setSearchTerm(term);
    if (term?.trim()) {
      try {
        const searchResults = await sportsService?.searchSports(term);
        setSports(searchResults || []);
      } catch (error) {
        console.error('Error searching sports:', error);
      }
    } else {
      fetchSports();
    }
  };

  const selectedSportData = sports?.find(sport => sport?.id === selectedSport || sport?.name?.toLowerCase() === selectedSport?.toLowerCase());

  const filteredSports = searchTerm 
    ? sports?.filter(sport => sport?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()))
    : sports;

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Sport Selection</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            disabled={disabled || isLoading}
          >
            <Icon name={isExpanded ? "ChevronUp" : "ChevronDown"} size={16} />
          </Button>
        </div>

        {/* Selected Sport Display */}
        {selectedSportData && (
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Activity" size={20} className="text-primary-foreground" />
              </div>
              <div>
                <h4 className="font-medium text-foreground">{selectedSportData?.name}</h4>
                <p className="text-sm text-muted-foreground">{selectedSportData?.description || 'Sport analysis and technique improvement'}</p>
              </div>
            </div>
            
            {selectedSportData?.movement_focus && selectedSportData?.movement_focus?.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Focus Areas
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedSportData?.movement_focus?.map((area, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {selectedSportData?.is_custom && (
              <div className="mt-2 flex items-center space-x-2">
                <Icon name="User" size={14} className="text-accent" />
                <span className="text-xs text-accent font-medium">Custom Sport</span>
              </div>
            )}
          </div>
        )}

        {/* Expanded Sports Selection */}
        {isExpanded && (
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Input
                type="text"
                placeholder="Search sports..."
                value={searchTerm}
                onChange={(e) => handleSearch(e?.target?.value)}
                className="pl-10"
              />
              <Icon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-8">
                <Icon name="Loader2" size={24} className="animate-spin text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Loading sports...</span>
              </div>
            )}

            {/* Sports Grid */}
            {!isLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                {filteredSports?.map((sport) => (
                  <button
                    key={sport?.id}
                    onClick={() => handleSportSelect(sport?.id)}
                    disabled={disabled}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      selectedSport === sport?.id || selectedSport === sport?.name
                        ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50 hover:bg-muted/50'
                    } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        selectedSport === sport?.id || selectedSport === sport?.name ? 'bg-primary text-primary-foreground' : 'bg-muted'
                      }`}>
                        <Icon name="Activity" size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-foreground truncate">{sport?.name}</h4>
                        {sport?.is_custom && (
                          <span className="text-xs text-accent">Custom</span>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{sport?.description || 'Sport analysis and technique improvement'}</p>
                  </button>
                ))}

                {/* Add Custom Sport Button */}
                <button
                  onClick={() => setShowCustomForm(true)}
                  disabled={disabled || !user}
                  className="p-4 rounded-lg border-2 border-dashed border-border hover:border-primary/50 hover:bg-muted/50 transition-all text-left cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                      <Icon name="Plus" size={16} />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">Add Custom Sport</h4>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">Create your own sport category</p>
                </button>
              </div>
            )}

            {/* No Sports Found */}
            {!isLoading && filteredSports?.length === 0 && (
              <div className="text-center py-8">
                <Icon name="Search" size={48} className="mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No sports found</p>
                {searchTerm && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchTerm('');
                      fetchSports();
                    }}
                    className="mt-2"
                  >
                    Clear search
                  </Button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Custom Sport Form Modal */}
        {showCustomForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-foreground mb-4">Add Custom Sport</h3>
              
              <form onSubmit={handleCustomSportSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Sport Name *
                  </label>
                  <Input
                    type="text"
                    value={customSportData?.name}
                    onChange={(e) => setCustomSportData(prev => ({ ...prev, name: e?.target?.value }))}
                    placeholder="e.g., Parkour, Rock Climbing"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Description
                  </label>
                  <textarea
                    value={customSportData?.description}
                    onChange={(e) => setCustomSportData(prev => ({ ...prev, description: e?.target?.value }))}
                    placeholder="Brief description of the sport and key movement patterns"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    rows="3"
                  />
                </div>

                <div className="flex space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowCustomForm(false);
                      setCustomSportData({ name: '', description: '', category: 'custom' });
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={!customSportData?.name?.trim() || isLoading}
                    className="flex-1"
                  >
                    {isLoading ? (
                      <>
                        <Icon name="Loader2" size={16} className="animate-spin mr-2" />
                        Adding...
                      </>
                    ) : (
                      'Add Sport'
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Auto-Detection Notice */}
        <div className="flex items-center space-x-2 p-3 bg-accent/10 rounded-lg">
          <Icon name="Sparkles" size={16} className="text-accent" />
          <div className="text-sm">
            <span className="font-medium text-foreground">AI Enhancement: </span>
            <span className="text-muted-foreground">
              System learns from new sports to improve future analysis
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SportSelector;