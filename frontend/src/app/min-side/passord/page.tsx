import { ChangePasswordSection } from '@/components/profile/ChangePasswordSection';

export default function PassordPage() {
  return (
    <div className="bg-white rounded-b-lg shadow-sm border border-gray-200 border-t-0 p-6">
      <div className="max-w-2xl">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Endre passord</h2>
          <p className="text-gray-600 mt-1">
            Oppdater ditt passord for å holde kontoen din sikker
          </p>
        </div>

        <ChangePasswordSection />

        {/* Additional Security Options */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Ytterligere sikkerhet
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div>
                <h4 className="font-medium text-gray-900">
                  To-faktor autentisering (2FA)
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  Legg til ekstra sikkerhet til kontoen din
                </p>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium">
                Aktiver
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div>
                <h4 className="font-medium text-gray-900">Aktive økter</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Se og administrer enheter som er logget inn
                </p>
              </div>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm font-medium">
                Administrer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

