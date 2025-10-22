import type { Metadata } from 'next';
import Link from 'next/link';
import { RegisterForm } from '@/components/auth/RegisterForm';

export const metadata: Metadata = {
  title: 'Registrer deg | BimVerdi',
  description: 'Opprett en gratis BimVerdi-konto',
};

export default function RegisterPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Opprett konto</h1>
          <p className="mt-2 text-gray-600">
            Få tilgang til BimVerdi-plattformen
          </p>
        </div>

        <div className="mt-8 rounded-lg border bg-white p-8 shadow-sm">
          <RegisterForm />
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
          Har du allerede en konto?{' '}
          <Link href="/logg-inn" className="text-blue-600 hover:underline">
            Logg inn her
          </Link>
        </p>
      </div>
    </div>
  );
}
