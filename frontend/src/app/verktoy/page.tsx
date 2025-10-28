import { Metadata } from 'next';
import Link from 'next/link';
import { getCustomPosts } from '@/lib/wordpress';
import { Tool } from '@/types/wordpress';

export const metadata: Metadata = {
  title: 'Verktøy - BIMVerdi',
  description: 'Oversikt over digitale verktøy og tjenester registrert i BIMVerdi',
};

export default async function VerktoyPage() {
  const tools = await getCustomPosts<Tool>('tools', { perPage: 100 });

  // Sort tools alphabetically by title
  const sortedTools = tools.sort((a, b) =>
    a.title.rendered.localeCompare(b.title.rendered, 'no')
  );

  const categoryLabels: Record<string, string> = {
    'modeling': 'Modellering',
    'coordination': 'Koordinering',
    'visualization': 'Visualisering',
    'analysis': 'Analyse',
    'documentation': 'Dokumentasjon',
    'project_management': 'Prosjektstyring',
  };

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Verktøy</h1>
          <p className="text-gray-600">
            Oversikt over digitale verktøy og tjenester registrert av våre deltakere
          </p>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Totalt <span className="font-semibold text-gray-900">{tools.length}</span> verktøy registrert
            </p>
          </div>
        </div>

        {/* Tools Grid */}
        {sortedTools.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <p className="text-gray-500">Ingen verktøy registrert ennå.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedTools.map((tool) => (
              <Link
                key={tool.id}
                href={`/verktoy/${tool.slug}`}
                className="bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 overflow-hidden group"
              >
                {/* Tool Logo/Header */}
                {tool.acf?.tool_logo?.url ? (
                  <div className="h-32 bg-gray-50 flex items-center justify-center p-4 border-b border-gray-100">
                    <img
                      src={tool.acf.tool_logo.url}
                      alt={tool.acf.tool_logo.alt || tool.title.rendered}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="h-32 bg-linear-to-br from-blue-500 to-blue-700 flex items-center justify-center border-b border-gray-100">
                    <div className="text-white text-4xl font-bold opacity-50">
                      {tool.title.rendered.charAt(0).toUpperCase()}
                    </div>
                  </div>
                )}

                {/* Tool Info */}
                <div className="p-4">
                  <h2 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {tool.title.rendered}
                  </h2>

                  {/* Category Badge */}
                  {tool.acf?.tool_category && (
                    <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded mb-2">
                      {categoryLabels[tool.acf.tool_category] || tool.acf.tool_category}
                    </span>
                  )}

                  {/* Vendor */}
                  {tool.acf?.tool_vendor && (
                    <p className="text-sm text-gray-600 mb-2">
                      Leverandør: {tool.acf.tool_vendor}
                    </p>
                  )}

                  {/* Excerpt */}
                  {tool.excerpt?.rendered && (
                    <div
                      className="text-sm text-gray-600 line-clamp-2"
                      dangerouslySetInnerHTML={{ __html: tool.excerpt.rendered }}
                    />
                  )}

                  {/* Description fallback if no excerpt */}
                  {!tool.excerpt?.rendered && tool.acf?.tool_description && (
                    <div
                      className="text-sm text-gray-600 line-clamp-2"
                      dangerouslySetInnerHTML={{ __html: tool.acf.tool_description }}
                    />
                  )}

                  {/* Website link indicator */}
                  {tool.acf?.tool_website && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <span className="text-xs text-blue-600 group-hover:text-blue-700">
                        Se mer →
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Info box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-2">Er du deltaker?</h3>
          <p className="text-sm text-gray-700 mb-3">
            Som deltaker i BIMVerdi kan du registrere og administrere dine egne verktøy og tjenester.
          </p>
          <Link
            href="/min-side/verktoy"
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Gå til Min Side →
          </Link>
        </div>
      </div>
    </main>
  );
}
