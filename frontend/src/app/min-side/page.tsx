import Link from 'next/link';

export default function MinSidePage() {
  return (
    <div className="bg-white rounded-b-lg shadow-sm border border-gray-200 border-t-0 p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Link
          href="/min-side/profil"
          className="group bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200 hover:shadow-md transition-all"
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">👤</span>
            <h2 className="text-xl font-semibold text-gray-900">Min profil</h2>
          </div>
          <p className="text-gray-600 mb-4">
            Administrer din profil og kontaktinformasjon
          </p>
          <span className="text-blue-600 font-medium group-hover:underline">
            Gå til profil →
          </span>
        </Link>

        {/* Password Card */}
        <Link
          href="/min-side/passord"
          className="group bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200 hover:shadow-md transition-all"
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">🔐</span>
            <h2 className="text-xl font-semibold text-gray-900">Passord</h2>
          </div>
          <p className="text-gray-600 mb-4">
            Endre passord og sikkerhetsinformasjon
          </p>
          <span className="text-purple-600 font-medium group-hover:underline">
            Administrer passord →
          </span>
        </Link>

        {/* Content Management */}
        <Link
          href="/min-side/innhold"
          className="group bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-200 hover:shadow-md transition-all"
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">📄</span>
            <h2 className="text-xl font-semibold text-gray-900">Mitt innhold</h2>
          </div>
          <p className="text-gray-600 mb-4">
            Administrer caser, verktøy, artikler og arrangementer
          </p>
          <span className="text-green-600 font-medium group-hover:underline">
            Se innhold →
          </span>
        </Link>

        {/* Consents */}
        <Link
          href="/min-side/samtykker"
          className="group bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-lg border border-orange-200 hover:shadow-md transition-all"
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">⚙️</span>
            <h2 className="text-xl font-semibold text-gray-900">Samtykker</h2>
          </div>
          <p className="text-gray-600 mb-4">
            Administrer personverninnstillinger og samtykker
          </p>
          <span className="text-orange-600 font-medium group-hover:underline">
            Endre samtykker →
          </span>
        </Link>

        {/* Membership */}
        <Link
          href="/min-side/medlemskap"
          className="group bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-lg border border-yellow-200 hover:shadow-md transition-all"
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">⭐</span>
            <h2 className="text-xl font-semibold text-gray-900">Medlemskap</h2>
          </div>
          <p className="text-gray-600 mb-4">
            Se medlemsinfo og oppgrader abonnement
          </p>
          <span className="text-yellow-600 font-medium group-hover:underline">
            Se medlemskap →
          </span>
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-lg border border-blue-100">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Hurtighandlinger</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition text-left border border-gray-200">
            <div className="text-3xl mb-2">📝</div>
            <div className="font-semibold text-gray-900">Ny case</div>
            <div className="text-sm text-gray-500 mt-1">Legg til prosjekt</div>
          </button>
          <button className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition text-left border border-gray-200">
            <div className="text-3xl mb-2">🛠️</div>
            <div className="font-semibold text-gray-900">Nytt verktøy</div>
            <div className="text-sm text-gray-500 mt-1">Publiser verktøy</div>
          </button>
          <button className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition text-left border border-gray-200">
            <div className="text-3xl mb-2">📄</div>
            <div className="font-semibold text-gray-900">Ny artikkel</div>
            <div className="text-sm text-gray-500 mt-1">Skriv innlegg</div>
          </button>
          <button className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition text-left border border-gray-200">
            <div className="text-3xl mb-2">📅</div>
            <div className="font-semibold text-gray-900">Nytt arrangement</div>
            <div className="text-sm text-gray-500 mt-1">Opprett event</div>
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
          <div className="text-3xl font-bold text-blue-600">12</div>
          <div className="text-sm text-gray-600 mt-1">Publiserte caser</div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
          <div className="text-3xl font-bold text-green-600">8</div>
          <div className="text-sm text-gray-600 mt-1">Verktøy</div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
          <div className="text-3xl font-bold text-purple-600">25</div>
          <div className="text-sm text-gray-600 mt-1">Artikler</div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
          <div className="text-3xl font-bold text-orange-600">5</div>
          <div className="text-sm text-gray-600 mt-1">Arrangementer</div>
        </div>
      </div>
    </div>
  );
}
