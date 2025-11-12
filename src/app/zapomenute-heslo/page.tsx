"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";
import { FaktixLogo } from "@/components/FaktixLogo";
import { CloudBackground } from "@/components/CloudBackground";
import { useAuth } from "@/hooks/useAuth";

import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { resetPassword, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    
    if (!email) {
      setError("Prosím zadejte svůj e-mail");
      return;
    }

    const result = await resetPassword(email);
    
    if (result.success) {
      setSuccess(true);
    } else {
      setError(result.message || "Odeslání e-mailu se nezdařilo");
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) {
      setError(null);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Cloud Background */}
      <CloudBackground />
      
      <div className="w-full max-w-md relative z-10">
        {/* Back to Home */}
        <Link
          href="/"
          className="inline-flex items-center text-gray-400 hover:text-money transition-colors mb-8 backdrop-blur-sm bg-black/30 border border-gray-700/50 px-4 py-2 rounded-lg hover:bg-black/50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Zpět na hlavní stránku
        </Link>

        <Card className="backdrop-blur-md bg-black/40 border-gray-700/50 shadow-2xl shadow-black/50">
          <CardHeader>
            <div className="text-center">
              {/* Logo */}
              <Link href="/" className="inline-flex mb-6">
                <FaktixLogo size="lg" />
              </Link>
              
              <h1 className="text-2xl font-bold text-white mb-2">
                Zapomenuté heslo
              </h1>
              <p className="text-gray-400">
                Zadejte svůj e-mail a pošleme vám odkaz pro obnovení hesla
              </p>
            </div>
          </CardHeader>

          <CardContent>
            {success ? (
              <div className="space-y-6">
                {/* Success Message */}
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6 text-center">
                  <Mail className="w-12 h-12 text-green-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">
                    E-mail odeslán!
                  </h3>
                  <p className="text-gray-300 text-sm">
                    Na adresu <strong>{email}</strong> jsme odeslali odkaz pro obnovení hesla. 
                    Zkontrolujte svou e-mailovou schránku a spam složku.
                  </p>
                </div>

                {/* Back to Login */}
                <div className="text-center">
                  <Link href="/prihlaseni">
                    <Button variant="outline" className="w-full">
                      Zpět na přihlášení
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Error Message */}
                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    E-mail
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={email}
                    onChange={handleEmailChange}
                    className="minimal-input w-full px-3 py-2"
                    placeholder="vas@email.cz"
                    disabled={isLoading}
                  />
                </div>

                {/* Submit Button */}
                <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                  {isLoading ? "Odesílám..." : "Odeslat odkaz"}
                </Button>

                {/* Back to Login */}
                <div className="text-center">
                  <Link
                    href="/prihlaseni"
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    ← Zpět na přihlášení
                  </Link>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}









