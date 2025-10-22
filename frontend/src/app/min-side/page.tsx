export default function MinSidePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">Min Side</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Min profil</h2>
          <p className="text-gray-600 mb-4">
            Administrer din profil og kontaktinformasjon
          </p>
          <button className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
            Rediger profil
          </button>
        </div>

        {/* Content Management */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Mitt innhold</h2>
          <ul className="space-y-2 text-gray-600">
            <li>• Mine caser</li>
            <li>• Mine verktøy</li>
            <li>• Mine artikler</li>
            <li>• Mine arrangementer</li>
          </ul>
          <button className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
            Administrer innhold
          </button>
        </div>

        {/* Consents */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Samtykker</h2>
          <p className="text-gray-600 mb-4">
            Administrer dine personverninnstillinger
          </p>
          <button className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
            Endre samtykker
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-blue-100 p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-6">Hurtighandlinger</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition text-left">
            <div className="text-2xl mb-2">📝</div>
            <div className="font-semibold">Ny case</div>
          </button>
          <button className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition text-left">
            <div className="text-2xl mb-2">🛠️</div>
            <div className="font-semibold">Nytt verktøy</div>
          </button>
          <button className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition text-left">
            <div className="text-2xl mb-2">📄</div>
            <div className="font-semibold">Ny artikkel</div>
          </button>
          <button className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition text-left">
            <div className="text-2xl mb-2">📅</div>
            <div className="font-semibold">Nytt arrangement</div>
          </button>
        </div>
      </div>

      {/* Membership Info */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Medlemskap</h2>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-600">Medlemsnivå: <span className="font-semibold text-blue-600">Premium</span></p>
            <p className="text-gray-600 mt-1">Medlem siden: Januar 2024</p>
          </div>
          <button className="px-6 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition">
            Oppgrader
          </button>
        </div>
      </div>
    </div>
  );
}
