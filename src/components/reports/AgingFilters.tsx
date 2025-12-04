import React, { useState } from 'react';
import { Search, Filter, X, ChevronDown } from 'lucide-react';

export interface FilterOptions {
  searchTerm: string;
  riskLevels: string[];
  agingBuckets: string[];
  amountRange: { min: number; max: number };
  collectionStatus: string[];
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

interface AgingFiltersProps {
  onFilterChange: (filters: FilterOptions) => void;
  totalCount: number;
  filteredCount: number;
}

const AgingFilters: React.FC<AgingFiltersProps> = ({
  onFilterChange,
  totalCount,
  filteredCount
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    searchTerm: '',
    riskLevels: [],
    agingBuckets: [],
    amountRange: { min: 0, max: 1000000 },
    collectionStatus: [],
    sortBy: 'total',
    sortOrder: 'desc'
  });

  const updateFilters = (updates: Partial<FilterOptions>) => {
    const newFilters = { ...filters, ...updates };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const toggleArrayFilter = (key: 'riskLevels' | 'agingBuckets' | 'collectionStatus', value: string) => {
    const currentArray = filters[key];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    updateFilters({ [key]: newArray });
  };

  const clearAllFilters = () => {
    const defaultFilters: FilterOptions = {
      searchTerm: '',
      riskLevels: [],
      agingBuckets: [],
      amountRange: { min: 0, max: 1000000 },
      collectionStatus: [],
      sortBy: 'total',
      sortOrder: 'desc'
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  const activeFilterCount =
    filters.riskLevels.length +
    filters.agingBuckets.length +
    filters.collectionStatus.length +
    (filters.searchTerm ? 1 : 0);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <Search size={20} className="text-gray-400" />
          </div>
          <input
            type="text"
            value={filters.searchTerm}
            onChange={(e) => updateFilters({ searchTerm: e.target.value })}
            placeholder="Search by customer/vendor name..."
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none bg-white/60 backdrop-blur-sm"
          />
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all ${
            showFilters
              ? 'bg-blue-600 text-white'
              : 'bg-white/60 backdrop-blur-sm border-2 border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Filter size={20} />
          Filters
          {activeFilterCount > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
          <ChevronDown size={16} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </button>

        {activeFilterCount > 0 && (
          <button
            onClick={clearAllFilters}
            className="px-6 py-3 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl font-semibold flex items-center gap-2 transition-colors"
          >
            <X size={20} />
            Clear All
          </button>
        )}
      </div>

      {showFilters && (
        <div className="relative bg-white/60 backdrop-blur-md rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-2xl"></div>

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <h4 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">Risk Level</h4>
              <div className="space-y-2">
                {[
                  { value: 'low', label: 'Low Risk', color: 'bg-green-100 text-green-800' },
                  { value: 'medium', label: 'Medium Risk', color: 'bg-yellow-100 text-yellow-800' },
                  { value: 'high', label: 'High Risk', color: 'bg-orange-100 text-orange-800' },
                  { value: 'critical', label: 'Critical Risk', color: 'bg-red-100 text-red-800' }
                ].map(({ value, label, color }) => (
                  <label key={value} className="flex items-center cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={filters.riskLevels.includes(value)}
                      onChange={() => toggleArrayFilter('riskLevels', value)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className={`ml-3 px-3 py-1 rounded-full text-sm font-semibold ${color} group-hover:opacity-80 transition-opacity`}>
                      {label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">Aging Bucket</h4>
              <div className="space-y-2">
                {[
                  { value: 'current', label: 'Current' },
                  { value: 'days30', label: '1-30 Days' },
                  { value: 'days60', label: '31-60 Days' },
                  { value: 'days90', label: '60+ Days' }
                ].map(({ value, label }) => (
                  <label key={value} className="flex items-center cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={filters.agingBuckets.includes(value)}
                      onChange={() => toggleArrayFilter('agingBuckets', value)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="ml-3 text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                      {label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">Collection Status</h4>
              <div className="space-y-2">
                {[
                  { value: 'current', label: 'Current' },
                  { value: 'contacted', label: 'Contacted' },
                  { value: 'promised', label: 'Promised' },
                  { value: 'escalated', label: 'Escalated' }
                ].map(({ value, label }) => (
                  <label key={value} className="flex items-center cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={filters.collectionStatus.includes(value)}
                      onChange={() => toggleArrayFilter('collectionStatus', value)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="ml-3 text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                      {label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="md:col-span-2">
              <h4 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">Amount Range</h4>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="text-xs text-gray-600 mb-1 block">Min Amount</label>
                  <input
                    type="number"
                    value={filters.amountRange.min}
                    onChange={(e) => updateFilters({
                      amountRange: { ...filters.amountRange, min: Number(e.target.value) }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    placeholder="0"
                  />
                </div>
                <span className="text-gray-400 mt-6">to</span>
                <div className="flex-1">
                  <label className="text-xs text-gray-600 mb-1 block">Max Amount</label>
                  <input
                    type="number"
                    value={filters.amountRange.max}
                    onChange={(e) => updateFilters({
                      amountRange: { ...filters.amountRange, max: Number(e.target.value) }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    placeholder="1000000"
                  />
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">Sort By</h4>
              <div className="space-y-2">
                <select
                  value={filters.sortBy}
                  onChange={(e) => updateFilters({ sortBy: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                >
                  <option value="customer">Customer Name</option>
                  <option value="total">Total Amount</option>
                  <option value="overdue">Overdue Amount</option>
                  <option value="days90">Oldest Items</option>
                </select>
                <div className="flex gap-2">
                  <button
                    onClick={() => updateFilters({ sortOrder: 'asc' })}
                    className={`flex-1 px-3 py-2 rounded-lg font-semibold text-sm transition-colors ${
                      filters.sortOrder === 'asc'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Ascending
                  </button>
                  <button
                    onClick={() => updateFilters({ sortOrder: 'desc' })}
                    className={`flex-1 px-3 py-2 rounded-lg font-semibold text-sm transition-colors ${
                      filters.sortOrder === 'desc'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Descending
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between text-sm text-gray-600 bg-white/40 backdrop-blur-sm px-4 py-2 rounded-xl border border-gray-200">
        <span>
          Showing <span className="font-bold text-gray-900">{filteredCount}</span> of <span className="font-bold text-gray-900">{totalCount}</span> records
        </span>
        {activeFilterCount > 0 && (
          <span className="text-blue-600 font-semibold">
            {activeFilterCount} filter(s) active
          </span>
        )}
      </div>
    </div>
  );
};

export default AgingFilters;
