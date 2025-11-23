import React, { useEffect, useRef } from 'react';
import { EditorView, keymap, lineNumbers, highlightActiveLineGutter, highlightSpecialChars, drawSelection, highlightActiveLine } from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { javascript } from '@codemirror/lang-javascript';
import { syntaxHighlighting, HighlightStyle, bracketMatching } from '@codemirror/language';
import { tags } from '@lezer/highlight';

interface CodeEditorProps {
  code: string;
  onChange: (code: string) => void;
  readOnly?: boolean;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ code, onChange, readOnly = false }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);

  useEffect(() => {
    if (!editorRef.current) return;

    // Custom syntax highlighting with better contrast
    const customHighlighting = HighlightStyle.define([
      { tag: tags.keyword, color: '#ff79c6', fontWeight: 'bold' },
      { tag: tags.function(tags.variableName), color: '#50fa7b' },
      { tag: tags.variableName, color: '#f8f8f2' },
      { tag: tags.typeName, color: '#8be9fd' },
      { tag: tags.propertyName, color: '#f8f8f2' },
      { tag: tags.number, color: '#bd93f9' },
      { tag: tags.string, color: '#f1fa8c' },
      { tag: tags.comment, color: '#6272a4', fontStyle: 'italic' },
      { tag: tags.operator, color: '#ff79c6' },
      { tag: tags.bool, color: '#bd93f9' },
      { tag: tags.null, color: '#bd93f9' },
      { tag: tags.bracket, color: '#f8f8f2' },
    ]);

    // Custom theme for better readability with lighter background
    const customTheme = EditorView.theme({
      '&': {
        fontSize: '16px',
        fontFamily: '"Fira Code", "JetBrains Mono", "Consolas", monospace',
        backgroundColor: '#2d2d2d',
        color: '#f8f8f2',
      },
      '.cm-content': {
        lineHeight: '1.6',
        padding: '12px 0',
        caretColor: '#f8f8f2',
      },
      '.cm-cursor': {
        borderLeftColor: '#f8f8f2',
      },
      '.cm-gutters': {
        fontSize: '14px',
        backgroundColor: '#282a36',
        color: '#6272a4',
        border: 'none',
      },
      '.cm-activeLineGutter': {
        backgroundColor: '#44475a',
        color: '#f8f8f2',
      },
      '.cm-line': {
        padding: '0 8px',
      },
      '.cm-activeLine': {
        backgroundColor: '#44475a55',
      },
      '.cm-selectionBackground, ::selection': {
        backgroundColor: '#44475a !important',
      },
      '&.cm-focused .cm-selectionBackground, &.cm-focused ::selection': {
        backgroundColor: '#44475a !important',
      },
      '.cm-matchingBracket': {
        backgroundColor: '#44475a',
        outline: '1px solid #f8f8f2',
      },
    });

    // Create the editor state with essential extensions
    const state = EditorState.create({
      doc: code,
      extensions: [
        lineNumbers(),
        highlightActiveLineGutter(),
        highlightSpecialChars(),
        history(),
        drawSelection(),
        highlightActiveLine(),
        bracketMatching(),
        syntaxHighlighting(customHighlighting),
        keymap.of([...defaultKeymap, ...historyKeymap]),
        javascript({ typescript: true }),
        customTheme,
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            onChange(update.state.doc.toString());
          }
        }),
        EditorView.editable.of(!readOnly),
      ],
    });

    // Create the editor view
    const view = new EditorView({
      state,
      parent: editorRef.current,
    });

    viewRef.current = view;

    // Cleanup
    return () => {
      view.destroy();
      viewRef.current = null;
    };
  }, []); // Only run once on mount

  // Update the editor content when code prop changes
  useEffect(() => {
    if (viewRef.current) {
      const currentDoc = viewRef.current.state.doc.toString();
      if (currentDoc !== code) {
        viewRef.current.dispatch({
          changes: {
            from: 0,
            to: currentDoc.length,
            insert: code,
          },
        });
      }
    }
  }, [code]);

  return (
    <div 
      ref={editorRef} 
      className="relative font-mono text-sm border border-gray-700 rounded-lg overflow-hidden"
      style={{ minHeight: '300px' }}
    />
  );
};

export default CodeEditor;
