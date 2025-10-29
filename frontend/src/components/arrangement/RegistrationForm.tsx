'use client';

import { useState, useEffect, FormEvent } from 'react';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface RegistrationFormProps {
  arrangementId: number;
  arrangementTitle: string;
  isLoggedIn?: boolean;
  userEmail?: string;
  userName?: string;
  userPhone?: string;
  userCompany?: string;
  isFull: boolean;
  isDeadlinePassed: boolean;
  membersOnly: boolean;
  isCancelled: boolean;
  isRegistered?: boolean;
}

interface FormData {
  navn: string;
  epost: string;
  telefon: string;
  bedrift: string;
  kommentarer: string;
  vilkar: boolean;
}

interface FormErrors {
  [key: string]: string;
}

export function RegistrationForm({
  arrangementId,
  arrangementTitle,
  isLoggedIn = false,
  userEmail = '',
  userName = '',
  userPhone = '',
  userCompany = '',
  isFull,
  isDeadlinePassed,
  membersOnly,
  isCancelled,
  isRegistered = false,
}: RegistrationFormProps) {
  const [formData, setFormData] = useState<FormData>({
    navn: userName || '',
    epost: userEmail || '',
    telefon: userPhone || '',
    bedrift: userCompany || '',
    kommentarer: '',
    vilkar: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [actuallyRegistered, setActuallyRegistered] = useState(isRegistered);
  const [checkingRegistration, setCheckingRegistration] = useState(false);

  // Function to check registration status
  const checkRegistration = async () => {
    if (!isLoggedIn || !userEmail) {
      setActuallyRegistered(false);
      return;
    }

    setCheckingRegistration(true);
    try {
      const response = await fetch(
        `/api/arrangements/${arrangementId}/check-registration?email=${encodeURIComponent(userEmail)}`,
        {
          cache: 'no-store'
        }
      );

      if (response.ok) {
        const data = await response.json();
        setActuallyRegistered(data.registered || false);
      }
    } catch (error) {
      console.error('Error checking registration:', error);
      // Fall back to server-provided value
      setActuallyRegistered(isRegistered);
    } finally {
      setCheckingRegistration(false);
    }
  };

  // Check registration status on mount (client-side)
  useEffect(() => {
    checkRegistration();
  }, [arrangementId, isLoggedIn, userEmail, isRegistered]);

  // Handle unregister
  const handleUnregister = async () => {
    if (!confirm('Er du sikker på at du vil avmelde deg fra dette arrangementet?')) {
      return;
    }

    setIsSubmitting(true);
    setServerError(null);

    try {
      const response = await fetch(
        `/api/arrangements/my-arrangements?arrangementId=${arrangementId}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Kunne ikke avmelde fra arrangement');
      }

      // Success - check registration status again (should show form)
      await checkRegistration();
    } catch (error) {
      console.error('Unregister error:', error);
      setServerError(
        error instanceof Error ? error.message : 'Kunne ikke avmelde fra arrangementet. Vennligst prøv igjen.'
      );
      setIsSubmitting(false);
    }
  };

  // Show different messages based on arrangement status
  if (isCancelled) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-900">Arrangementet er avlyst</h3>
            <p className="mt-1 text-sm text-red-700">
              Dette arrangementet er dessverre avlyst. Ta kontakt med BIMverdi for mer informasjon.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isDeadlinePassed) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-amber-900">Påmeldingsfristen har gått ut</h3>
            <p className="mt-1 text-sm text-amber-700">
              Påmeldingsfristen for dette arrangementet har dessverre gått ut.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isFull) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-amber-900">Arrangementet er fullt</h3>
            <p className="mt-1 text-sm text-amber-700">
              Dette arrangementet er dessverre fullt booket. Ta kontakt med oss for å bli satt på venteliste.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (membersOnly && !isLoggedIn) {
    return (
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900">Kun for medlemmer</h3>
            <p className="mt-1 text-sm text-blue-700">
              Dette arrangementet er kun for medlemmer. Du må være logget inn som medlem for å melde deg på.
            </p>
            <a
              href="/min-side"
              className="mt-3 inline-block rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Logg inn
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Show loading while checking registration
  if (checkingRegistration) {
    return (
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <div className="flex items-center justify-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
          <p className="text-sm text-gray-600">Sjekker påmeldingsstatus...</p>
        </div>
      </div>
    );
  }

  if (actuallyRegistered) {
    return (
      <div className="space-y-4">
        {serverError && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
              <p className="text-sm text-red-700">{serverError}</p>
            </div>
          </div>
        )}
        <div className="rounded-lg border border-green-200 bg-green-50 p-6">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 flex-1">
              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-green-900">Du er allerede påmeldt</h3>
                <p className="mt-1 text-sm text-green-700">
                  Du er allerede påmeldt dette arrangementet. Du vil motta påminnelse på e-post.
                </p>
              </div>
            </div>
            <button
              onClick={handleUnregister}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-red-700 bg-white border border-red-300 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
            >
              {isSubmitting ? 'Avmelder...' : 'Meld av'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show success message
  if (isSuccess) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-6 animate-in fade-in duration-500">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="h-6 w-6 text-green-600 mt-0.5" />
          <div>
            <h3 className="text-lg font-semibold text-green-900">Påmelding vellykket!</h3>
            <p className="mt-2 text-sm text-green-700">
              Du er nå påmeldt <strong>{arrangementTitle}</strong>.
            </p>
            <p className="mt-1 text-sm text-green-700">
              Du vil motta en bekreftelse på e-post med mer informasjon.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Client-side validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Navn
    if (!formData.navn.trim() || formData.navn.trim().length < 2) {
      newErrors.navn = 'Navn er påkrevd (minst 2 tegn)';
    }

    // E-post
    if (!formData.epost.trim()) {
      newErrors.epost = 'E-post er påkrevd';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.epost)) {
      newErrors.epost = 'Ugyldig e-postadresse';
    }

    // Telefon
    if (!formData.telefon.trim()) {
      newErrors.telefon = 'Telefon er påkrevd';
    } else if (formData.telefon.replace(/[^0-9]/g, '').length < 8) {
      newErrors.telefon = 'Telefonnummer må ha minst 8 siffer';
    }

    // Vilkår
    if (!formData.vilkar) {
      newErrors.vilkar = 'Du må godta vilkårene for påmelding';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setServerError(null);
    setErrors({});

    // Validate
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        `/api/arrangements/${arrangementId}/register`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        // Handle validation errors from server
        if (data.data?.errors) {
          setErrors(data.data.errors);
        } else {
          setServerError(data.message || 'Noe gikk galt. Vennligst prøv igjen.');
        }
        return;
      }

      // Success!
      setIsSuccess(true);

      // Scroll to success message
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    } catch (error) {
      console.error('Registration error:', error);
      setServerError('Kunne ikke koble til serveren. Vennligst prøv igjen.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Meld deg på</h3>

      {serverError && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
            <p className="text-sm text-red-700">{serverError}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Navn */}
        <div>
          <label htmlFor="navn" className="block text-sm font-medium text-gray-700 mb-1">
            Fullt navn <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="navn"
            name="navn"
            value={formData.navn}
            onChange={handleChange}
            className={`w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.navn ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Ola Nordmann"
          />
          {errors.navn && (
            <p className="mt-1 text-sm text-red-600">{errors.navn}</p>
          )}
        </div>

        {/* E-post */}
        <div>
          <label htmlFor="epost" className="block text-sm font-medium text-gray-700 mb-1">
            E-post <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="epost"
            name="epost"
            value={formData.epost}
            onChange={handleChange}
            className={`w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.epost ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="ola@example.com"
          />
          {errors.epost && (
            <p className="mt-1 text-sm text-red-600">{errors.epost}</p>
          )}
        </div>

        {/* Telefon */}
        <div>
          <label htmlFor="telefon" className="block text-sm font-medium text-gray-700 mb-1">
            Telefon <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            id="telefon"
            name="telefon"
            value={formData.telefon}
            onChange={handleChange}
            className={`w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.telefon ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="+47 123 45 678"
          />
          {errors.telefon && (
            <p className="mt-1 text-sm text-red-600">{errors.telefon}</p>
          )}
        </div>

        {/* Bedrift */}
        <div>
          <label htmlFor="bedrift" className="block text-sm font-medium text-gray-700 mb-1">
            Bedrift/Organisasjon
          </label>
          <input
            type="text"
            id="bedrift"
            name="bedrift"
            value={formData.bedrift}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Din bedrift"
          />
        </div>

        {/* Kommentarer */}
        <div>
          <label htmlFor="kommentarer" className="block text-sm font-medium text-gray-700 mb-1">
            Kommentarer eller spørsmål
          </label>
          <textarea
            id="kommentarer"
            name="kommentarer"
            value={formData.kommentarer}
            onChange={handleChange}
            rows={3}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Eventuelle kommentarer eller spørsmål..."
          />
        </div>

        {/* Vilkår */}
        <div>
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              name="vilkar"
              checked={formData.vilkar}
              onChange={handleChange}
              className={`mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 ${
                errors.vilkar ? 'border-red-500' : ''
              }`}
            />
            <span className="text-sm text-gray-700">
              Jeg godtar{' '}
              <a href="/vilkar" className="text-blue-600 hover:underline">
                vilkårene for påmelding
              </a>{' '}
              og samtykker til at BIMverdi behandler mine personopplysninger i henhold til{' '}
              <a href="/personvern" className="text-blue-600 hover:underline">
                personvernerklæringen
              </a>
              . <span className="text-red-500">*</span>
            </span>
          </label>
          {errors.vilkar && (
            <p className="mt-1 text-sm text-red-600">{errors.vilkar}</p>
          )}
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              Sender påmelding...
            </span>
          ) : (
            'Meld meg på'
          )}
        </button>

        <p className="text-xs text-gray-500 text-center">
          <span className="text-red-500">*</span> = Påkrevd felt
        </p>
      </form>
    </div>
  );
}
