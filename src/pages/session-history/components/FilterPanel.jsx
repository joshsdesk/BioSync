import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const FilterPanel = ({ 
  filters, 
  onFilterChange, 
  onClearFilters, 
  isExpanded, 
  onToggleExpanded 
}) => {
  const sportOptions = [
    { value: 'all', label: 'All Sports' },
    { value: 'basketball', label: 'Basketball' },
    { value: 'tennis', label: 'Tennis' },
    { value: 'golf', label: 'Golf' },
    { value: 'running', label: 'Running' },
    { value: 'swimming', label: 'Swimming' },
    { value: 'weightlifting', label: 'Weightlifting' },
    { value: 'soccer', label: 'Soccer' }
  ];

  const scoreRangeOptions = [
    { value: 'all', label: 'All Scores' },
    { value: '90-100', label: 'Excellent (90-100)' },
    { value: '80-89', label: 'Good (80-89)' },
    { value: '70-79', label: 'Average (70-79)' },
    { value: '60-69', label: 'Below Average (60-69)' },
    { value: '0-59', label: 'Needs Improvement (0-59)' }
  ];

  const sortOptions = [
    { value: 'date-desc', label: 'Newest First' },
    { value: 'date-asc', label: 'Oldest First' },
    { value: 'score-desc', label: 'Highest Score' },
    { value: 'score-asc', label: 'Lowest Score' },
    { value: 'sport', label: 'Sport Type' }
  ];

  const handleFilterChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <div className="bg-card border border-border rounded-lg">
      {/* Filter Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <Icon name="Filter" size={20} className="text-muted-foreground" />
          <h3 className="font-semibold text-card-foreground">Filters</h3>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            iconName="RotateCcw"
            onClick={onClearFilters}
          >
            Clear All
          </Button>
          <Button
            variant="ghost"
            size="icon"
            iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
            onClick={onToggleExpanded}
          />
        </div>
      </div>
      {/* Filter Content */}
      {isExpanded && (
        <div className="p-4 space-y-4">
          {/* Search */}
          <div>
            <Input
              label="Search Sessions"
              type="search"
              placeholder="Search by sport, exercise, or notes..."
              value={filters?.search}
              onChange={(e) => handleFilterChange('search', e?.target?.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Date Range */}
            <div className="space-y-2">
              <Input
                label="From Date"
                type="date"
                value={filters?.dateFrom}
                onChange={(e) => handleFilterChange('dateFrom', e?.target?.value)}
              />
              <Input
                label="To Date"
                type="date"
                value={filters?.dateTo}
                onChange={(e) => handleFilterChange('dateTo', e?.target?.value)}
              />
            </div>

            {/* Sport Filter */}
            <div>
              <Select
                label="Sport Type"
                options={sportOptions}
                value={filters?.sport}
                onChange={(value) => handleFilterChange('sport', value)}
              />
            </div>

            {/* Score Range */}
            <div>
              <Select
                label="Score Range"
                options={scoreRangeOptions}
                value={filters?.scoreRange}
                onChange={(value) => handleFilterChange('scoreRange', value)}
              />
            </div>

            {/* Sort By */}
            <div>
              <Select
                label="Sort By"
                options={sortOptions}
                value={filters?.sortBy}
                onChange={(value) => handleFilterChange('sortBy', value)}
              />
            </div>
          </div>

          {/* Advanced Filters */}
          <div className="border-t border-border pt-4">
            <h4 className="font-medium text-card-foreground mb-3">Advanced Filters</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-card-foreground">Minimum Score</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={filters?.minScore}
                  onChange={(e) => handleFilterChange('minScore', e?.target?.value)}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0</span>
                  <span className="font-medium">{filters?.minScore}</span>
                  <span>100</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-card-foreground">Session Duration</label>
                <select
                  value={filters?.duration}
                  onChange={(e) => handleFilterChange('duration', e?.target?.value)}
                  className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground"
                >
                  <option value="all">Any Duration</option>
                  <option value="short">Short (&lt; 5 min)</option>
                  <option value="medium">Medium (5-15 min)</option>
                  <option value="long">Long (&gt; 15 min)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-card-foreground">Improvement Trend</label>
                <select
                  value={filters?.improvement}
                  onChange={(e) => handleFilterChange('improvement', e?.target?.value)}
                  className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground"
                >
                  <option value="all">All Sessions</option>
                  <option value="improved">Improved</option>
                  <option value="declined">Declined</option>
                  <option value="stable">Stable</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;