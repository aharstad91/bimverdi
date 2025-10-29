'use client';

import { useState } from 'react';
import { TiptapEditor } from '@/components/articles/TiptapEditor';

export default function TestTiptapPage() {
  const [content, setContent] = useState('<p>Test av Tiptap editor...</p>');
  const [savedContent, setSavedContent] = useState('');

  const handleSave = () => {
    setSavedContent(content);
    console.log('Saved HTML:', content);
  };

  const wordCount = content
    .replace(/<[^>]*>/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 0).length;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-2">🧪 Tiptap Editor Test</h1>
        <p className="text-gray-600 mb-8">
          Phase 0.1: React-Quill Setup Test → Tiptap Implementation
        </p>

        {/* Editor */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Editor</h2>
          <TiptapEditor
            content={content}
            onChange={setContent}
            placeholder="Skriv noe her for å teste editoren..."
          />

          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Ordtelling: <strong>{wordCount}</strong> ord
            </div>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              💾 Lagre (console.log)
            </button>
          </div>
        </div>

        {/* Preview */}
        {savedContent && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Preview (Lagret HTML)</h2>
            <div
              className="prose prose-sm max-w-none border rounded-lg p-4 bg-gray-50"
              dangerouslySetInnerHTML={{ __html: savedContent }}
            />
          </div>
        )}

        {/* Raw HTML */}
        {savedContent && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Raw HTML Output</h2>
            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-xs">
              {savedContent}
            </pre>
          </div>
        )}

        {/* Test Checklist */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
          <h3 className="font-semibold text-blue-900 mb-3">✅ Test Checklist:</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>✓ Bold, Italic, Underline fungerer?</li>
            <li>✓ H2, H3 headings fungerer?</li>
            <li>✓ Bullet list og numbered list fungerer?</li>
            <li>✓ Link insertion fungerer?</li>
            <li>✓ Image insertion fungerer? (test med WP media URL)</li>
            <li>✓ Character counter vises?</li>
            <li>✓ HTML output ser OK ut?</li>
            <li>✓ Responsivt design på mobil?</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
