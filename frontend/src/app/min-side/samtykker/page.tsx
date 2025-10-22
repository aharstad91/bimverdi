'use client';

import { useState } from 'react';

interface Consent {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  required: boolean;
}

export default function SamtykkerPage() {
  const [consents, setConsents] = useState<Consent[]>([
    {
      id: 'necessary',
      title: 'Nødvendige informasjonskapsler',
      description:
        'Disse er nødvendige for at nettstedet skal fungere og kan ikke slås av. De brukes vanligvis kun som respons på handlinger du utfører.',
      enabled: true,
      required: true,
    },
    {
      id: 'analytics',
      title: 'Analyse og statistikk',
      description:
        'Hjelper oss å forstå hvordan besøkende bruker nettstedet vårt ved å samle inn og rapportere informasjon anonymt.',
      enabled: true,
      required: false,
    },
    {
      id: 'marketing',
      title: 'Markedsføring',
      description:
        'Brukes til å spore besøkende på tvers av nettsteder for å vise relevante annonser og kampanjer.',
      enabled: false,
      required: false,
    },
    {
      id: 'preferences',
      title: 'Preferanser',
      description:
        'Lar nettstedet huske valg du gjør (som brukernavn, språk eller region) for å gi deg en mer personlig opplevelse.',
      enabled: true,
      required: false,
    },
  ]);

  const handleToggle = (id: string) => {
    setConsents(
      consents.map((consent) =>
        consent.id === id && !consent.required
          ? { ...consent, enabled: !consent.enabled }
          : consent
      )
    );
  };

  return (
    <div className="bg-white rounded-b-lg shadow-sm border border-gray-200 border-t-0 p-6">
      <div className="max-w-3xl">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Personvern og samtykker
          </h2>
          <p className="text-gray-600 mt-1">
            Administrer hvordan vi bruker dine data og informasjon
          </p>
        </div>

        {/* Privacy Settings */}
        <div className="space-y-4 mb-8">
          {consents.map((consent) => (
            <div
              key={consent.id}
              className="border border-gray-200 rounded-lg p-4 hover:border-blue-200 transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900">
                      {consent.title}
                    </h3>
                    {consent.required && (
                      <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full font-medium">
                        Påkrevd
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    {consent.description}
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer ml-4">
                  <input
                    type="checkbox"
                    checked={consent.enabled}
                    disabled={consent.required}
                    onChange={() => handleToggle(consent.id)}
                    className="sr-only peer"
                  />
                  <div
                    className={`w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer 
                    ${
                      consent.enabled
                        ? 'peer-checked:bg-blue-600'
                        : 'bg-gray-200'
                    }
                    ${consent.required ? 'opacity-50 cursor-not-allowed' : ''}
                    peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}
                  ></div>
                </label>
              </div>
            </div>
          ))}
        </div>

        {/* Data Management */}
        <div className="border-t border-gray-200 pt-8 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Dataforvaltning
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div>
                <h4 className="font-medium text-gray-900">Last ned mine data</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Få en kopi av all informasjon vi har lagret om deg
                </p>
              </div>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm font-medium">
                Last ned
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
              <div>
                <h4 className="font-medium text-gray-900">Slett min konto</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Permanent sletting av konto og all tilknyttet data
                </p>
              </div>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium">
                Slett konto
              </button>
            </div>
          </div>
        </div>

        {/* Communication Preferences */}
        <div className="border-t border-gray-200 pt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Kommunikasjonsinnstillinger
          </h3>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="newsletter"
                defaultChecked
                className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div>
                <label
                  htmlFor="newsletter"
                  className="font-medium text-gray-900 cursor-pointer"
                >
                  Nyhetsbrev
                </label>
                <p className="text-sm text-gray-600 mt-1">
                  Motta ukentlige oppdateringer om nye caser, verktøy og
                  arrangementer
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="events"
                defaultChecked
                className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div>
                <label
                  htmlFor="events"
                  className="font-medium text-gray-900 cursor-pointer"
                >
                  Arrangementspåminnelser
                </label>
                <p className="text-sm text-gray-600 mt-1">
                  Få varsler om kommende arrangementer og webinarer
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="product-updates"
                className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div>
                <label
                  htmlFor="product-updates"
                  className="font-medium text-gray-900 cursor-pointer"
                >
                  Produktoppdateringer
                </label>
                <p className="text-sm text-gray-600 mt-1">
                  Informasjon om nye funksjoner og forbedringer
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="promotions"
                className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div>
                <label
                  htmlFor="promotions"
                  className="font-medium text-gray-900 cursor-pointer"
                >
                  Kampanjer og tilbud
                </label>
                <p className="text-sm text-gray-600 mt-1">
                  Spesialtilbud og rabatter på tjenester
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex gap-3 pt-8 border-t border-gray-200 mt-8">
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
            Lagre innstillinger
          </button>
          <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
            Tilbakestill
          </button>
        </div>
      </div>
    </div>
  );
}
