import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { getAlgorithmById } from '../data/algorithms';
import CodeBlock from './CodeBlock';
import PracticeArea from './PracticeArea';
import { useAlgorithmProgress, type ProgressStatus } from '../hooks/useAlgorithmProgress';

const AlgorithmDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const algo = id ? getAlgorithmById(id) : undefined;
  const [tab, setTab] = useState<'stub' | 'reference'>('stub');
  const [revealed, setRevealed] = useState(false);
  const { getStatus, setStatus } = useAlgorithmProgress();

  // Reset revealed state when switching to reference tab
  useEffect(() => {
    if (tab === 'stub') {
      setRevealed(false);
    }
  }, [tab]);

  if (!algo) {
    return <Navigate to="/" replace />;
  }

  const status = getStatus(algo.id);

  const handleStatusChange = (newStatus: ProgressStatus) => {
    setStatus(algo.id, newStatus);
  };

  const difficultyColors = {
    Easy: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    Medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    Hard: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Link to="/" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mb-6 inline-block font-medium">
        ← Back to list
      </Link>

      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">{algo.name}</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">{algo.summary}</p>

        <div className="flex flex-wrap gap-3 mb-6">
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
            {algo.category}
          </span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${difficultyColors[algo.difficulty]}`}>
            {algo.difficulty}
          </span>
          {algo.tags.map((t) => (
            <span key={t} className="px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
              #{t}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Current status:</span>
          <div className="flex gap-2">
            <button
              type="button"
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                status === 'needs-work'
                  ? 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/50 dark:text-orange-200 dark:border-orange-800 border'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700'
              }`}
              onClick={() => handleStatusChange('needs-work')}
            >
              Needs Work
            </button>
            <button
              type="button"
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                status === 'comfortable'
                  ? 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-200 dark:border-green-800 border'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700'
              }`}
              onClick={() => handleStatusChange('comfortable')}
            >
              Comfortable
            </button>
            {status && (
              <button
                type="button"
                className="px-4 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                onClick={() => handleStatusChange(null)}
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4">
          <button
            type="button"
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              tab === 'stub'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
            onClick={() => setTab('stub')}
          >
            Stub (Drill)
          </button>
          <button
            type="button"
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              tab === 'reference'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
            onClick={() => setTab('reference')}
          >
            Reference
          </button>
        </div>

        <div className="relative">
          {tab === 'reference' && !revealed ? (
            <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-12 text-center border border-gray-200 dark:border-gray-700">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Try to solve it first! The reference implementation is hidden.
              </p>
              <button
                onClick={() => setRevealed(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
              >
                Reveal Solution
              </button>
            </div>
          ) : (
            <CodeBlock code={tab === 'stub' ? algo.stub : algo.reference} />
          )}
        </div>
      </div>

      <PracticeArea />
    </div>
  );
};

export default AlgorithmDetail;
