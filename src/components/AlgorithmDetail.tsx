import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { transform } from 'sucrase';
import ReactMarkdown from 'react-markdown';
import { getAlgorithmById, algorithms } from '../data/algorithms';
import CodeBlock from './CodeBlock';
import CodeEditor from './CodeEditor';
import { useAlgorithmProgress, type ProgressStatus } from '../hooks/useAlgorithmProgress';

interface TestResult {
  input: string;
  expected: string;
  actual: string;
  passed: boolean;
  error?: string;
}

const AlgorithmDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const algo = id ? getAlgorithmById(id) : undefined;
  const [tab, setTab] = useState<'stub' | 'solution'>('stub');
  const { getStatus, setStatus, getCode, saveCode } = useAlgorithmProgress();
  
  const [userCode, setUserCode] = useState('');
  const [testResults, setTestResults] = useState<TestResult[] | null>(null);
  const [compileError, setCompileError] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);

  const nextAlgoId = useMemo(() => {
    if (!algo) return null;
    const difficultyWeight = { Easy: 1, Medium: 2, Hard: 3 };
    const sorted = [...algorithms].sort(
      (a, b) => difficultyWeight[a.difficulty] - difficultyWeight[b.difficulty]
    );
    const currentIndex = sorted.findIndex((a) => a.id === algo.id);
    if (currentIndex !== -1 && currentIndex < sorted.length - 1) {
      return sorted[currentIndex + 1].id;
    }
    return null;
  }, [algo]);

  // Load saved code or use stub
  useEffect(() => {
    if (algo) {
      const savedCode = getCode(algo.id);
      setUserCode(savedCode || algo.stub);
      setTestResults(null);
      setCompileError(null);
    }
  }, [algo?.id, getCode]);

  // Save code when it changes
  useEffect(() => {
    if (algo && userCode && userCode !== algo.stub) {
      const timeoutId = setTimeout(() => {
        saveCode(algo.id, userCode);
      }, 500); // Debounce for 500ms

      return () => clearTimeout(timeoutId);
    }
  }, [userCode, algo, saveCode]);



  if (!algo) {
    return <Navigate to="/" replace />;
  }

  const status = getStatus(algo.id);

  const handleStatusChange = (newStatus: ProgressStatus) => {
    setStatus(algo.id, newStatus);
  };

  const handleRun = () => {
    // Clear previous results and errors when starting a new run
    setTestResults(null);
    setCompileError(null);

    if (!algo.testCases || algo.testCases.length === 0) {
      setCompileError('No test cases available for this algorithm.');
      return;
    }

    try {
      // 1. Compile TypeScript to JavaScript
      const compiled = transform(userCode, {
        transforms: ['typescript'],
      }).code;

      // 2. Extract function name (simple regex)
      const match = userCode.match(/function\s+(\w+)/);
      if (!match) {
        throw new Error('Could not find a function definition.');
      }
      const fnName = match[1];

      // 3. Execute in Web Worker with timeout
      const worker = new Worker(new URL('../workers/codeRunner.ts', import.meta.url), {
        type: 'module',
      });

      const timeoutId = setTimeout(() => {
        worker.terminate();
        setCompileError('Time Limit Exceeded: Your code took too long to execute. Check for infinite loops.');
      }, 2000); // 2 second timeout

      worker.onmessage = (e) => {
        clearTimeout(timeoutId);
        const { results, error } = e.data;
        
        if (error) {
          setCompileError(error);
        } else {
          setTestResults(results);
        }
        worker.terminate();
      };

      worker.onerror = (err) => {
        clearTimeout(timeoutId);
        setCompileError(`Worker Error: ${err.message}`);
        worker.terminate();
      };

      worker.postMessage({
        code: compiled,
        fnName,
        testCases: algo.testCases,
      });

    } catch (err: any) {
      setCompileError(err.message);
    }
  };

  const difficultyColors = {
    Easy: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    Medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    Hard: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <Link to="/" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
          ← Back to list
        </Link>
        {nextAlgoId && (
          <Link
            to={`/algorithms/${nextAlgoId}`}
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium flex items-center gap-1"
          >
            Next Algorithm →
          </Link>
        )}
      </div>

      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">{algo.name}</h1>
        <div className="text-xl text-gray-600 dark:text-gray-300 mb-6 leading-relaxed prose dark:prose-invert max-w-none">
          <ReactMarkdown>{algo.summary}</ReactMarkdown>
        </div>

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
                  ? 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/50 dark:text-blue-200 dark:border-blue-800 border'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700'
              }`}
              onClick={() => handleStatusChange('comfortable')}
            >
              Comfortable
            </button>
            <button
              type="button"
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                status === 'complete'
                  ? 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-200 dark:border-green-800 border'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700'
              }`}
              onClick={() => handleStatusChange('complete')}
            >
              Complete
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
              tab === 'solution'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
            onClick={() => setTab('solution')}
          >
            Solution
          </button>
        </div>

        <div className="relative">
          {tab === 'solution' ? (
            <CodeBlock code={algo.solution} />
          ) : (
            <div className="space-y-4">
              <CodeEditor code={userCode} onChange={setUserCode} />
              
              <div className="flex justify-end gap-2">
                {algo.hint && (
                  <button
                    onClick={() => setShowHint(!showHint)}
                    className="px-6 py-2 bg-yellow-100 text-yellow-800 border border-yellow-200 rounded-md font-medium hover:bg-yellow-200 transition-colors shadow-sm flex items-center gap-2 dark:bg-yellow-900/30 dark:text-yellow-200 dark:border-yellow-800"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    {showHint ? 'Hide Hint' : 'Show Hint'}
                  </button>
                )}
                <button
                  onClick={handleRun}
                  className="px-6 py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 transition-colors shadow-sm flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  Run Code
                </button>
              </div>

              {showHint && algo.hint && (
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg text-yellow-800 dark:text-yellow-200 text-sm leading-relaxed prose dark:prose-invert max-w-none">
                  <strong className="block mb-2">Hint:</strong>
                  <ReactMarkdown>{algo.hint}</ReactMarkdown>
                </div>
              )}

              {compileError && (
                <div className="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 font-mono text-sm whitespace-pre-wrap">
                  <strong>Compilation Error:</strong>
                  <br />
                  {compileError}
                </div>
              )}

              {testResults && testResults.every(r => r.passed) && status !== 'complete' && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="font-medium text-green-800 dark:text-green-200">All tests passed! 🎉</p>
                      <p className="text-sm text-green-700 dark:text-green-300">Great job! Ready to mark this as complete?</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleStatusChange('complete')}
                    className="px-4 py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 transition-colors shadow-sm"
                  >
                    Mark as Complete
                  </button>
                </div>
              )}

              {testResults && (
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700 font-medium text-gray-700 dark:text-gray-300">
                    Test Results
                  </div>
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {testResults.map((res, idx) => (
                      <div key={idx} className={`p-4 ${res.passed ? 'bg-green-50/50 dark:bg-green-900/10' : 'bg-red-50/50 dark:bg-red-900/10'}`}>
                        <div className="flex items-start gap-3">
                          <div className={`mt-1 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${res.passed ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                            {res.passed ? (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                          <div className="flex-1 font-mono text-sm">
                            <div className="mb-1">
                              <span className="text-gray-500 dark:text-gray-400">Input:</span>{' '}
                              <span className="text-gray-900 dark:text-gray-200">{res.input}</span>
                            </div>
                            {res.error ? (
                              <div className="text-red-600 dark:text-red-400">
                                Error: {res.error}
                              </div>
                            ) : (
                              <>
                                <div className="mb-1">
                                  <span className="text-gray-500 dark:text-gray-400">Expected:</span>{' '}
                                  <span className="text-gray-900 dark:text-gray-200">{res.expected}</span>
                                </div>
                                <div>
                                  <span className="text-gray-500 dark:text-gray-400">Actual:</span>{' '}
                                  <span className={`font-bold ${res.passed ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                    {res.actual}
                                  </span>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default AlgorithmDetail;
