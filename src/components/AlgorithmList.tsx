import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { algorithms } from '../data/algorithms';
import { useAlgorithmProgress, type ProgressStatus } from '../hooks/useAlgorithmProgress';

const statusLabel: Record<Exclude<ProgressStatus, null>, string> = {
  'needs-work': 'Needs Work',
  comfortable: 'Comfortable',
  complete: 'Complete',
};

const AlgorithmList: React.FC = () => {
  const { getStatus } = useAlgorithmProgress();
  const [search, setSearch] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filtered = useMemo(
    () =>
      algorithms.filter((algo) => {
        const status = getStatus(algo.id);

        if (
          search &&
          !algo.name.toLowerCase().includes(search.toLowerCase()) &&
          !algo.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
        ) {
          return false;
        }

        if (difficultyFilter !== 'all' && algo.difficulty !== difficultyFilter) {
          return false;
        }

        if (statusFilter !== 'all') {
          if (statusFilter === 'needs-work' && status !== 'needs-work') return false;
          if (statusFilter === 'comfortable' && status !== 'comfortable') return false;
          if (statusFilter === 'complete' && status !== 'complete') return false;
        }

        return true;
      }),
    [search, difficultyFilter, statusFilter, getStatus]
  );

  const difficultyColors = {
    Easy: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    Medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    Hard: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8 space-y-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Algorithm Drill</h1>
        <p className="text-gray-600 dark:text-gray-400">Master common algorithms through spaced repetition.</p>
        
        <div className="flex flex-col md:flex-row gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <input
            type="text"
            placeholder="Search by name or tag..."
            className="flex-1 px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="all">All difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="all">All statuses</option>
            <option value="needs-work">Needs Work</option>
            <option value="comfortable">Comfortable</option>
            <option value="complete">Complete</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((algo) => {
          const status = getStatus(algo.id);
          return (
            <Link 
              key={algo.id} 
              to={`/algorithms/${algo.id}`}
              className="block group h-full"
            >
              <div className="h-full bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {algo.name}
                  </h2>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${difficultyColors[algo.difficulty]}`}>
                    {algo.difficulty}
                  </span>
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 line-clamp-2">
                  {algo.summary}
                </p>

                <div className="flex flex-wrap gap-2 mt-auto">
                  <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                    {algo.category}
                  </span>
                  {status && (
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        status === 'needs-work'
                          ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200'
                          : status === 'comfortable'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200'
                          : 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200'
                      }`}
                    >
                      {statusLabel[status]}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-lg">No algorithms match your filters.</p>
        </div>
      )}
    </div>
  );
};

export default AlgorithmList;
