import type { Metadata } from 'next';
import Link from 'next/link';
import { LoginForm } from '@/components/auth/LoginForm';

export const metadata: Metadata = {
  title: 'Logg inn | BimVerdi',
  description: 'Logg inn på din BimVerdi-konto',
};

export default function LoginPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Logg inn</h1>
          <p className="mt-2 text-gray-600">
            Velkommen tilbake til BimVerdi
          </p>
        </div>

        <div className="mt-8 rounded-lg border bg-white p-8 shadow-sm">
          <LoginForm />
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
          Har du ikke en konto?{' '}
          <Link href="/registrer" className="text-blue-600 hover:underline">
            Registrer deg her
          </Link>
        </p>
      </div>
    </div>
  );
}
