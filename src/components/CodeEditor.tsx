import React from 'react';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-typescript';
import 'prismjs/themes/prism-tomorrow.css'; // Dark theme

interface CodeEditorProps {
  code: string;
  onChange: (code: string) => void;
  readOnly?: boolean;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ code, onChange, readOnly = false }) => {
  return (
    <div className="relative font-mono text-sm border border-gray-700 rounded-lg overflow-hidden bg-[#2d2d2d]">
      <Editor
        value={code}
        onValueChange={onChange}
        highlight={(code) => Prism.highlight(code, Prism.languages.typescript, 'typescript')}
        padding={24}
        style={{
          fontFamily: '"Fira Code", "Fira Mono", monospace',
          fontSize: 14,
          backgroundColor: '#2d2d2d',
          color: '#ccc',
          minHeight: '300px',
        }}
        textareaClassName="focus:outline-none"
        readOnly={readOnly}
      />
    </div>
  );
};

export default CodeEditor;
