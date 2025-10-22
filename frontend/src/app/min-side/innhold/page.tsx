'use client';

import { useState } from 'react';

type ContentType = 'all' | 'cases' | 'tools' | 'articles' | 'events';

export default function InnholdPage() {
  const [activeTab, setActiveTab] = useState<ContentType>('all');

  return (
    <div className="bg-white rounded-b-lg shadow-sm border border-gray-200 border-t-0 p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Mitt innhold</h2>
        <p className="text-gray-600 mt-1">
          Administrer alt innholdet du har publisert
        </p>
      </div>

      {/* Content Type Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
            activeTab === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Alle (45)
        </button>
        <button
          onClick={() => setActiveTab('cases')}
          className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
            activeTab === 'cases'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          📝 Caser (12)
        </button>
        <button
          onClick={() => setActiveTab('tools')}
          className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
            activeTab === 'tools'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          🛠️ Verktøy (8)
        </button>
        <button
          onClick={() => setActiveTab('articles')}
          className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
            activeTab === 'articles'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          📄 Artikler (20)
        </button>
        <button
          onClick={() => setActiveTab('events')}
          className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
            activeTab === 'events'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          📅 Arrangementer (5)
        </button>
      </div>

      {/* Content List */}
      <div className="space-y-4">
        {/* Example Content Item */}
        <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">📝</span>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    BIM-implementering i storbygg
                  </h3>
                  <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                    <span>Case</span>
                    <span>•</span>
                    <span>Publisert: 15. mars 2024</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      👁️ 247 visninger
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 text-sm ml-11">
                Suksesshistorie fra et stort byggeprosjekt i Oslo sentrum hvor
                BIM-metodikk ble brukt fra start til slutt.
              </p>
            </div>
            <div className="flex gap-2 ml-4">
              <button className="px-3 py-1.5 text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition">
                Rediger
              </button>
              <button className="px-3 py-1.5 text-sm border border-red-300 text-red-600 rounded hover:bg-red-50 transition">
                Slett
              </button>
            </div>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">🛠️</span>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Revit Extension Pack
                  </h3>
                  <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                    <span>Verktøy</span>
                    <span>•</span>
                    <span>Publisert: 10. mars 2024</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      👁️ 189 visninger
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 text-sm ml-11">
                Samling av nyttige plugins og utvidelser for Autodesk Revit som
                effektiviserer arbeidsflyten.
              </p>
            </div>
            <div className="flex gap-2 ml-4">
              <button className="px-3 py-1.5 text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition">
                Rediger
              </button>
              <button className="px-3 py-1.5 text-sm border border-red-300 text-red-600 rounded hover:bg-red-50 transition">
                Slett
              </button>
            </div>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">📄</span>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Fremtidens BIM: AI og maskinlæring
                  </h3>
                  <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                    <span>Artikkel</span>
                    <span>•</span>
                    <span>Publisert: 5. mars 2024</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      👁️ 532 visninger
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 text-sm ml-11">
                En dyptgående artikkel om hvordan kunstig intelligens vil
                revolusjonere BIM-bransjen.
              </p>
            </div>
            <div className="flex gap-2 ml-4">
              <button className="px-3 py-1.5 text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition">
                Rediger
              </button>
              <button className="px-3 py-1.5 text-sm border border-red-300 text-red-600 rounded hover:bg-red-50 transition">
                Slett
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Empty State (shown when no content) */}
      {/* <div className="text-center py-12">
        <div className="text-6xl mb-4">📦</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Ingen innhold ennå
        </h3>
        <p className="text-gray-600 mb-6">
          Begynn å publisere caser, verktøy, artikler eller arrangementer
        </p>
        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          Opprett nytt innhold
        </button>
      </div> */}

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
        <div className="text-sm text-gray-600">Viser 1-10 av 45 elementer</div>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-50 transition text-sm disabled:opacity-50">
            Forrige
          </button>
          <button className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm">
            1
          </button>
          <button className="px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-50 transition text-sm">
            2
          </button>
          <button className="px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-50 transition text-sm">
            3
          </button>
          <button className="px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-50 transition text-sm">
            Neste
          </button>
        </div>
      </div>
    </div>
  );
}
