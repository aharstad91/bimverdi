import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              BIM-verdiskapning i Norge
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Plattformen som samler BIM-ekspertise, verktøy og best practice
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/bli-medlem"
                className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition"
              >
                Bli medlem
              </Link>
              <Link
                href="/om-oss"
                className="px-8 py-3 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-600 transition"
              >
                Les mer
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Utforsk BIMVerdi</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Link href="/medlemsbedrifter" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition">
              <div className="text-blue-600 text-4xl mb-4">🏢</div>
              <h3 className="text-xl font-semibold mb-2">Medlemsbedrifter</h3>
              <p className="text-gray-600">
                Finn BIM-eksperter og samarbeidspartnere
              </p>
            </Link>
            
            <Link href="/verktoy" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition">
              <div className="text-blue-600 text-4xl mb-4">🛠️</div>
              <h3 className="text-xl font-semibold mb-2">Verktøy</h3>
              <p className="text-gray-600">
                Oversikt over BIM-verktøy og ressurser
              </p>
            </Link>
            
            <Link href="/caser" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition">
              <div className="text-blue-600 text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-2">Caser</h3>
              <p className="text-gray-600">
                Lær av vellykkede BIM-prosjekter
              </p>
            </Link>
            
            <Link href="/arrangementer" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition">
              <div className="text-blue-600 text-4xl mb-4">📅</div>
              <h3 className="text-xl font-semibold mb-2">Arrangementer</h3>
              <p className="text-gray-600">
                Prosjekter, webinarer og konferanser
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Klar til å bli en del av BIM-fellesskapet?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Få tilgang til Min Side med selvbetjening, profil og medlemsfordeler
          </p>
          <Link
            href="/min-side"
            className="inline-block px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition"
          >
            Gå til Min Side
          </Link>
        </div>
      </section>
    </div>
  );
}
