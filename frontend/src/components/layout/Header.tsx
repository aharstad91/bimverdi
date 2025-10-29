import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center text-2xl font-bold text-blue-600">
              BIMVerdi
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/artikler" className="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-blue-600">
                Artikler
              </Link>
              <Link href="/deltakere" className="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-blue-600">
                Deltakere
              </Link>
              <Link href="/verktoy" className="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-blue-600">
                Verktøy
              </Link>
              <Link href="/caser" className="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-blue-600">
                Caser
              </Link>
              <Link href="/arrangement" className="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-blue-600">
                Arrangementer
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <Link
              href="/min-side"
              className="ml-4 px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Min Side
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
