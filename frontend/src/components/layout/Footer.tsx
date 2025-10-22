import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">BIMVerdi</h3>
            <p className="text-gray-400">
              Norsk plattform for BIM-verdiskapning
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Kataloger</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/medlemsbedrifter" className="hover:text-white">Medlemsbedrifter</Link></li>
              <li><Link href="/verktoy" className="hover:text-white">Verktøy</Link></li>
              <li><Link href="/caser" className="hover:text-white">Caser</Link></li>
              <li><Link href="/arrangementer" className="hover:text-white">Arrangementer</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Om oss</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/om-oss" className="hover:text-white">Om BIMVerdi</Link></li>
              <li><Link href="/artikler" className="hover:text-white">Artikler</Link></li>
              <li><Link href="/kontakt" className="hover:text-white">Kontakt</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Medlemskap</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/bli-medlem" className="hover:text-white">Bli medlem</Link></li>
              <li><Link href="/min-side" className="hover:text-white">Min Side</Link></li>
              <li><Link href="/personvern" className="hover:text-white">Personvern</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} BIMVerdi. Alle rettigheter reservert.</p>
        </div>
      </div>
    </footer>
  );
}
