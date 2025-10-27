export default function MedlemskapPage() {
  return (
    <div className="bg-white rounded-b-lg border border-gray-200 border-t-0 p-6">
      <div className="max-w-4xl">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Medlemskap</h2>
          <p className="text-gray-600 mt-1">
            Administrer ditt medlemskap og fakturainformasjon
          </p>
        </div>

        {/* Current Membership */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-lg p-6 mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-2xl font-bold text-gray-900">
                  Premium Medlemskap
                </h3>
                <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-medium">
                  Aktiv
                </span>
              </div>
              <p className="text-gray-600">
                Fullt tilgang til alle funksjoner og innhold
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">4.990,-</div>
              <div className="text-sm text-gray-600">kr/år</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white/60 backdrop-blur rounded-lg p-4 border border-blue-100">
              <div className="text-sm text-gray-600 mb-1">Medlem siden</div>
              <div className="font-semibold text-gray-900">Januar 2024</div>
            </div>
            <div className="bg-white/60 backdrop-blur rounded-lg p-4 border border-blue-100">
              <div className="text-sm text-gray-600 mb-1">Neste fornyelse</div>
              <div className="font-semibold text-gray-900">15. jan 2025</div>
            </div>
            <div className="bg-white/60 backdrop-blur rounded-lg p-4 border border-blue-100">
              <div className="text-sm text-gray-600 mb-1">
                Automatisk fornyelse
              </div>
              <div className="font-semibold text-green-600">✓ Aktivert</div>
            </div>
          </div>
        </div>

        {/* Membership Features */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Inkludert i ditt medlemskap
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <span className="text-2xl">✓</span>
              <div>
                <div className="font-medium text-gray-900">
                  Ubegrenset tilgang
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Tilgang til alle caser, verktøy og artikler
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <span className="text-2xl">✓</span>
              <div>
                <div className="font-medium text-gray-900">
                  Prioritert support
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Rask respons fra vårt supportteam
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <span className="text-2xl">✓</span>
              <div>
                <div className="font-medium text-gray-900">
                  Gratis arrangementer
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Tilgang til alle webinarer og workshops
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <span className="text-2xl">✓</span>
              <div>
                <div className="font-medium text-gray-900">Nettverksgruppe</div>
                <div className="text-sm text-gray-600 mt-1">
                  Eksklusiv tilgang til BIM-faggruppen
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <span className="text-2xl">✓</span>
              <div>
                <div className="font-medium text-gray-900">
                  Premium verktøy
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Tilgang til betalte plugins og ressurser
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <span className="text-2xl">✓</span>
              <div>
                <div className="font-medium text-gray-900">
                  Sertifikater
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Få sertifikat for gjennomførte kurs
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Upgrade Options */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Oppgraderingsalternativer
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Enterprise Plan */}
            <div className="border-2 border-gray-200 rounded-lg p-6 hover:border-blue-300 transition">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">🏢</span>
                <h4 className="text-xl font-bold text-gray-900">
                  Enterprise
                </h4>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                Kontakt oss
              </div>
              <p className="text-gray-600 mb-4">
                Skreddersydde løsninger for større organisasjoner
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-green-600">✓</span>
                  <span>Alt i Premium</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-green-600">✓</span>
                  <span>Ubegrenset brukere</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-green-600">✓</span>
                  <span>Dedikert kundekontakt</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-green-600">✓</span>
                  <span>Tilpasset opplæring</span>
                </li>
              </ul>
              <button className="w-full px-4 py-2 border-2 border-gray-900 text-gray-900 rounded-lg hover:bg-gray-900 hover:text-white transition font-medium">
                Kontakt salg
              </button>
            </div>

            {/* Team Plan */}
            <div className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">👥</span>
                <h4 className="text-xl font-bold text-gray-900">Team</h4>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                12.990,-
              </div>
              <p className="text-sm text-gray-600 mb-4">kr/år for 5 brukere</p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-green-600">✓</span>
                  <span>Alt i Premium</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-green-600">✓</span>
                  <span>Opptil 5 teammedlemmer</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-green-600">✓</span>
                  <span>Delt ressursbibliotek</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-green-600">✓</span>
                  <span>Team-rapportering</span>
                </li>
              </ul>
              <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium">
                Oppgrader til Team
              </button>
            </div>
          </div>
        </div>

        {/* Payment & Billing */}
        <div className="border-t border-gray-200 pt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Betaling og fakturering
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded flex items-center justify-center text-white font-bold text-xs">
                  VISA
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    •••• •••• •••• 4242
                  </div>
                  <div className="text-sm text-gray-600">Utløper 12/2025</div>
                </div>
              </div>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm">
                Endre
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div>
                <div className="font-medium text-gray-900">
                  Fakturahistorikk
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Se og last ned tidligere fakturaer
                </div>
              </div>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm">
                Se historikk
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div>
                <div className="font-medium text-gray-900">
                  Automatisk fornyelse
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Medlemskapet fornyes automatisk hvert år
                </div>
              </div>
              <button className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition text-sm">
                Deaktiver
              </button>
            </div>
          </div>
        </div>

        {/* Cancel Membership */}
        <div className="border-t border-gray-200 pt-8 mt-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Avslutt medlemskap
            </h3>
            <p className="text-gray-600 mb-4">
              Du vil miste tilgang til alle Premium-funksjoner når medlemskapet
              avsluttes. Medlemskapet vil være aktivt frem til{' '}
              <strong>15. januar 2025</strong>.
            </p>
            <button className="px-6 py-2 border-2 border-red-600 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition font-medium">
              Avslutt medlemskap
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
