import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import MyArrangementsCard from '@/components/min-side/MyArrangementsCard';

export const metadata: Metadata = {
  title: 'Mine arrangementer | Min Side | BIMVerdi',
  description: 'Se arrangementer du er påmeldt',
};

export default function MinArrangementPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mine arrangementer</h1>
          <p className="text-gray-600 mt-2">
            Oversikt over arrangementer du er påmeldt
          </p>
        </div>
        <Link href="/arrangement">
          <Button>Se alle arrangementer</Button>
        </Link>
      </div>

      <MyArrangementsCard />
    </div>
  );
}
