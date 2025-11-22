import React, { useState } from 'react';

interface PracticeAreaProps {
  initialText?: string;
}

const PracticeArea: React.FC<PracticeAreaProps> = ({ initialText = '' }) => {
  const [text, setText] = useState(initialText);

  return (
    <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <h3 className="font-medium text-gray-900 dark:text-white">Your Practice Space</h3>
        <button 
          type="button" 
          onClick={() => setText('')}
          className="text-sm text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
        >
          Clear
        </button>
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        spellCheck={false}
        className="w-full h-64 p-4 font-mono text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 resize-y outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500/20"
        placeholder="// Type your solution here..."
      />
    </div>
  );
};

export default PracticeArea;
