import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import SessionCard from './components/SessionCard';
import FilterPanel from './components/FilterPanel';
import ProgressChart from './components/ProgressChart';
import SessionComparison from './components/SessionComparison';
import ExportModal from './components/ExportModal';

const SessionHistory = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [selectedSessions, setSelectedSessions] = useState([]);
  const [comparisonSessions, setComparisonSessions] = useState([]);
  const [showComparison, setShowComparison] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [chartType, setChartType] = useState('line');
  const [viewMode, setViewMode] = useState('list'); // list, grid
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    sport: 'all',
    dateFrom: '',
    dateTo: '',
    scoreRange: 'all',
    sortBy: 'date-desc',
    minScore: 0,
    duration: 'all',
    improvement: 'all'
  });

  // Mock session data
  const mockSessions = [
  {
    id: 1,
    sport: 'Basketball',
    exercise: 'Free Throw Analysis',
    date: '2024-10-20T14:30:00Z',
    duration: '8:45',
    score: 87,
    improvement: 5,
    thumbnail: "https://images.unsplash.com/photo-1591498237542-1974148f6f02",
    thumbnailAlt: 'Basketball player shooting free throw in indoor court with proper form',
    focusAreas: [
    { name: 'Shooting Form', score: 89 },
    { name: 'Follow Through', score: 85 },
    { name: 'Balance', score: 87 }],

    recommendations: [
    'Focus on consistent elbow alignment during release phase',
    'Improve follow-through extension for better arc consistency',
    'Practice balance drills to enhance shooting stability'],

    notes: 'Good improvement in shooting consistency. Continue working on follow-through.'
  },
  {
    id: 2,
    sport: 'Tennis',
    exercise: 'Forehand Technique',
    date: '2024-10-18T16:15:00Z',
    duration: '12:30',
    score: 92,
    improvement: 8,
    thumbnail: "https://images.unsplash.com/photo-1714291067169-0ad497681c83",
    thumbnailAlt: 'Tennis player executing forehand stroke on outdoor court with proper racquet positioning',
    focusAreas: [
    { name: 'Racquet Path', score: 94 },
    { name: 'Body Rotation', score: 90 },
    { name: 'Contact Point', score: 92 }],

    recommendations: [
    'Excellent racquet path consistency, maintain current technique',
    'Continue working on hip rotation timing',
    'Practice contact point drills for power optimization'],

    notes: 'Significant improvement in forehand power and accuracy.'
  },
  {
    id: 3,
    sport: 'Golf',
    exercise: 'Driver Swing Analysis',
    date: '2024-10-16T10:00:00Z',
    duration: '15:20',
    score: 78,
    improvement: -2,
    thumbnail: "https://images.unsplash.com/photo-1693163613081-ad955609fec7",
    thumbnailAlt: 'Golfer mid-swing with driver on tee box showing full body rotation and club position',
    focusAreas: [
    { name: 'Backswing', score: 82 },
    { name: 'Impact Position', score: 75 },
    { name: 'Follow Through', score: 77 }],

    recommendations: [
    'Work on maintaining spine angle throughout swing',
    'Focus on hip rotation timing for better impact position',
    'Practice tempo drills for more consistent timing'],

    notes: 'Need to work on consistency. Focus on fundamentals.'
  },
  {
    id: 4,
    sport: 'Running',
    exercise: 'Gait Analysis',
    date: '2024-10-14T07:30:00Z',
    duration: '6:15',
    score: 85,
    improvement: 3,
    thumbnail: "https://images.unsplash.com/photo-1677679130775-6721bb413733",
    thumbnailAlt: 'Runner in motion on track showing proper running form with good posture and stride',
    focusAreas: [
    { name: 'Stride Length', score: 87 },
    { name: 'Cadence', score: 83 },
    { name: 'Posture', score: 85 }],

    recommendations: [
    'Maintain current stride length, good efficiency',
    'Work on increasing cadence slightly for better performance',
    'Continue posture work, showing good improvement'],

    notes: 'Good progress in running efficiency. Keep up the training.'
  },
  {
    id: 5,
    sport: 'Swimming',
    exercise: 'Freestyle Stroke',
    date: '2024-10-12T18:45:00Z',
    duration: '10:00',
    score: 89,
    improvement: 6,
    thumbnail: "https://images.unsplash.com/photo-1682468156314-b2e7ae438364",
    thumbnailAlt: 'Swimmer performing freestyle stroke in pool with proper arm extension and body position',
    focusAreas: [
    { name: 'Arm Stroke', score: 91 },
    { name: 'Body Position', score: 88 },
    { name: 'Breathing', score: 87 }],

    recommendations: [
    'Excellent arm stroke technique, maintain consistency',
    'Continue working on body rotation timing',
    'Practice bilateral breathing for better balance'],

    notes: 'Strong improvement in stroke efficiency and speed.'
  },
  {
    id: 6,
    sport: 'Weightlifting',
    exercise: 'Deadlift Form',
    date: '2024-10-10T19:20:00Z',
    duration: '11:45',
    score: 82,
    improvement: 4,
    thumbnail: "https://images.unsplash.com/photo-1674748596342-8fd299450a71",
    thumbnailAlt: 'Athlete performing deadlift in gym with proper bar position and back alignment',
    focusAreas: [
    { name: 'Bar Path', score: 85 },
    { name: 'Back Position', score: 80 },
    { name: 'Hip Hinge', score: 81 }],

    recommendations: [
    'Good bar path consistency, keep practicing',
    'Focus on maintaining neutral spine throughout lift',
    'Work on hip hinge mobility and timing'],

    notes: 'Solid technique improvement. Continue progressive loading.'
  }];


  useEffect(() => {
    setSessions(mockSessions);
    setFilteredSessions(mockSessions);
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, sessions]);

  const applyFilters = () => {
    let filtered = [...sessions];

    // Search filter
    if (filters?.search) {
      filtered = filtered?.filter((session) =>
      session?.sport?.toLowerCase()?.includes(filters?.search?.toLowerCase()) ||
      session?.exercise?.toLowerCase()?.includes(filters?.search?.toLowerCase()) ||
      session?.notes?.toLowerCase()?.includes(filters?.search?.toLowerCase())
      );
    }

    // Sport filter
    if (filters?.sport !== 'all') {
      filtered = filtered?.filter((session) =>
      session?.sport?.toLowerCase() === filters?.sport?.toLowerCase()
      );
    }

    // Date range filter
    if (filters?.dateFrom) {
      filtered = filtered?.filter((session) =>
      new Date(session.date) >= new Date(filters.dateFrom)
      );
    }
    if (filters?.dateTo) {
      filtered = filtered?.filter((session) =>
      new Date(session.date) <= new Date(filters.dateTo)
      );
    }

    // Score range filter
    if (filters?.scoreRange !== 'all') {
      const [min, max] = filters?.scoreRange?.split('-')?.map(Number);
      filtered = filtered?.filter((session) =>
      session?.score >= min && session?.score <= max
      );
    }

    // Minimum score filter
    if (filters?.minScore > 0) {
      filtered = filtered?.filter((session) => session?.score >= filters?.minScore);
    }

    // Duration filter
    if (filters?.duration !== 'all') {
      filtered = filtered?.filter((session) => {
        const minutes = parseInt(session?.duration?.split(':')?.[0]);
        switch (filters?.duration) {
          case 'short':return minutes < 5;
          case 'medium':return minutes >= 5 && minutes <= 15;
          case 'long':return minutes > 15;
          default:return true;
        }
      });
    }

    // Improvement filter
    if (filters?.improvement !== 'all') {
      filtered = filtered?.filter((session) => {
        switch (filters?.improvement) {
          case 'improved':return session?.improvement > 0;
          case 'declined':return session?.improvement < 0;
          case 'stable':return session?.improvement === 0;
          default:return true;
        }
      });
    }

    // Sort
    filtered?.sort((a, b) => {
      switch (filters?.sortBy) {
        case 'date-desc':
          return new Date(b.date) - new Date(a.date);
        case 'date-asc':
          return new Date(a.date) - new Date(b.date);
        case 'score-desc':
          return b?.score - a?.score;
        case 'score-asc':
          return a?.score - b?.score;
        case 'sport':
          return a?.sport?.localeCompare(b?.sport);
        default:
          return 0;
      }
    });

    setFilteredSessions(filtered);
  };

  const handleSessionSelect = (sessionId, isSelected) => {
    if (isSelected) {
      setSelectedSessions((prev) => [...prev, sessionId]);
    } else {
      setSelectedSessions((prev) => prev?.filter((id) => id !== sessionId));
    }
  };

  const handleViewSession = (session) => {
    navigate('/analysis-results', { state: { sessionId: session?.id } });
  };

  const handleCompareSession = (session) => {
    if (comparisonSessions?.length < 5 && !comparisonSessions?.find((s) => s?.id === session?.id)) {
      setComparisonSessions((prev) => [...prev, session]);
    }
    if (comparisonSessions?.length >= 1) {
      setShowComparison(true);
    }
  };

  const handleExportSession = (session) => {
    setShowExportModal(true);
  };

  const handleBulkExport = () => {
    const sessionsToExport = sessions?.filter((session) =>
    selectedSessions?.includes(session?.id)
    );
    setShowExportModal(true);
  };

  const handleBulkCompare = () => {
    const sessionsToCompare = sessions?.filter((session) =>
    selectedSessions?.includes(session?.id)
    )?.slice(0, 5);
    setComparisonSessions(sessionsToCompare);
    setShowComparison(true);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      sport: 'all',
      dateFrom: '',
      dateTo: '',
      scoreRange: 'all',
      sortBy: 'date-desc',
      minScore: 0,
      duration: 'all',
      improvement: 'all'
    });
  };

  const getChartData = () => {
    return filteredSessions?.map((session) => ({
      date: session?.date,
      score: session?.score,
      sport: session?.sport,
      improvement: session?.improvement
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 pb-20 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Session History</h1>
                <p className="mt-2 text-muted-foreground">
                  Review your biomechanical analysis progress and track improvements over time
                </p>
              </div>
              <div className="mt-4 sm:mt-0 flex items-center space-x-2">
                <Button
                  variant="outline"
                  iconName="Plus"
                  onClick={() => navigate('/video-capture')}>

                  New Session
                </Button>
                {selectedSessions?.length > 0 &&
                <>
                    <Button
                    variant="outline"
                    iconName="BarChart3"
                    onClick={handleBulkCompare}
                    disabled={selectedSessions?.length < 2}>

                      Compare ({selectedSessions?.length})
                    </Button>
                    <Button
                    variant="outline"
                    iconName="Download"
                    onClick={handleBulkExport}>

                      Export ({selectedSessions?.length})
                    </Button>
                  </>
                }
              </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <Icon name="Activity" size={20} className="text-primary" />
                  <div>
                    <div className="text-2xl font-bold text-card-foreground">{sessions?.length}</div>
                    <div className="text-sm text-muted-foreground">Total Sessions</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <Icon name="TrendingUp" size={20} className="text-success" />
                  <div>
                    <div className="text-2xl font-bold text-card-foreground">
                      {sessions?.length > 0 ? Math.round(sessions?.reduce((sum, s) => sum + s?.score, 0) / sessions?.length) : 0}
                    </div>
                    <div className="text-sm text-muted-foreground">Avg Score</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <Icon name="Target" size={20} className="text-warning" />
                  <div>
                    <div className="text-2xl font-bold text-card-foreground">
                      {sessions?.length > 0 ? Math.max(...sessions?.map((s) => s?.score)) : 0}
                    </div>
                    <div className="text-sm text-muted-foreground">Best Score</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <Icon name="Calendar" size={20} className="text-accent" />
                  <div>
                    <div className="text-2xl font-bold text-card-foreground">
                      {sessions?.filter((s) => s?.improvement > 0)?.length}
                    </div>
                    <div className="text-sm text-muted-foreground">Improved</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Chart */}
          <div className="mb-8">
            <ProgressChart
              data={getChartData()}
              chartType={chartType}
              onChartTypeChange={setChartType} />

          </div>

          {/* Filters */}
          <div className="mb-6">
            <FilterPanel
              filters={filters}
              onFilterChange={setFilters}
              onClearFilters={clearFilters}
              isExpanded={isFilterExpanded}
              onToggleExpanded={() => setIsFilterExpanded(!isFilterExpanded)} />

          </div>

          {/* View Controls */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                {filteredSessions?.length} of {sessions?.length} sessions
              </span>
              {filteredSessions?.length !== sessions?.length &&
              <Button
                variant="ghost"
                size="sm"
                iconName="X"
                onClick={clearFilters}>

                  Clear Filters
                </Button>
              }
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="flex items-center border border-border rounded-lg">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-l-lg transition-biomech ${
                  viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`
                  }>

                  <Icon name="List" size={16} />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-r-lg transition-biomech ${
                  viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`
                  }>

                  <Icon name="Grid3X3" size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Sessions List */}
          <div className="space-y-4">
            {filteredSessions?.length === 0 ?
            <div className="text-center py-12">
                <Icon name="Search" size={48} className="text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No sessions found</h3>
                <p className="text-muted-foreground mb-4">
                  {sessions?.length === 0 ?
                "You haven't recorded any sessions yet. Start your first analysis!" : "Try adjusting your filters to find the sessions you're looking for."
                }
                </p>
                <Button
                variant="default"
                iconName="Plus"
                onClick={() => navigate('/video-capture')}>

                  Record New Session
                </Button>
              </div> :

            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'
            }>
                {filteredSessions?.map((session) =>
              <SessionCard
                key={session?.id}
                session={session}
                onView={handleViewSession}
                onCompare={handleCompareSession}
                onExport={handleExportSession}
                isSelected={selectedSessions?.includes(session?.id)}
                onSelect={handleSessionSelect} />

              )}
              </div>
            }
          </div>
        </div>
      </main>
      {/* Session Comparison Modal */}
      {showComparison &&
      <SessionComparison
        sessions={comparisonSessions}
        onClose={() => setShowComparison(false)}
        onRemoveSession={(sessionId) => {
          setComparisonSessions((prev) => prev?.filter((s) => s?.id !== sessionId));
        }} />

      }
      {/* Export Modal */}
      {showExportModal &&
      <ExportModal
        sessions={selectedSessions?.length > 0 ?
        sessions?.filter((s) => selectedSessions?.includes(s?.id)) :
        sessions
        }
        onClose={() => setShowExportModal(false)}
        onExport={(exportData) => {
          console.log('Exporting:', exportData);
          setShowExportModal(false);
          // Here you would implement the actual export functionality
        }} />

      }
    </div>);

};

export default SessionHistory;