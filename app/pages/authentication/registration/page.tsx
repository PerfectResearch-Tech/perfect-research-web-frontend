"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import "../authentication.css";
import PrimaryButton from "@/app/components/generals/buttons/PrimaryButton";
import { useRouter } from "next/navigation";
import Loading from "@/app/components/Loading/Loading";
import { toast, Toaster } from "sonner";
import ButtonLoading from "@/app/components/Loading/ButtonLoading";
import { getApiUrl } from "@/app/lib/config";

const Registration = () => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [verifyPassword, setVerifyPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, boolean>>({
    username: false,
    email: false,
    password: false,
    verifyPassword: false,
  });
  const router = useRouter();

  // Ajout pour la validation en temps réel
  const [passwordStrength, setPasswordStrength] = useState({
    isValid: false,
    hasUpperCase: false,
    hasNumber: false,
    hasVowel: false,
    hasSpecial: false,
    validLength: false,
    validChars: true,
  });

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      router.push("/pages/admin/home");
    } else {
      setIsLoading(false);
    }
  }, [router]);

  // Validation en temps réel
  useEffect(() => {
    const strength = passwordValidate(verifyPassword);
    setPasswordStrength(strength);
  }, [verifyPassword]);

  const passwordValidate = (p: string) => {
    const hasUpperCase = /[A-Z]/.test(p);
    const hasNumber = /[0-9]/.test(p);
    const hasVowel = /[aeiou]/.test(p);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(p);
    const validLength = p.length >= 7 && p.length <= 13;
    const validChars = /^[A-Za-z0-9!@#$%^&*(),.?":{}|<>]{0,13}$/.test(p);

    return {
      isValid:
        hasUpperCase &&
        hasNumber &&
        hasVowel &&
        hasSpecial &&
        validLength &&
        validChars,
      hasUpperCase,
      hasNumber,
      hasVowel,
      hasSpecial,
      validLength,
      validChars,
    };
  };

  const handlerRegister = async (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsLoading(true);
    e.preventDefault();

    setFieldErrors({
      username: !username,
      email: !email,
      password: !password,
      verifyPassword: !verifyPassword,
    });

    if (!passwordValidate(password)) {
      toast.error(
        'Le mot de passe doit contenir au moins une majuscule, un chiffre, une voyelle, un caractère spécial (!@#$%^&*(),.?":{}|<>), et avoir entre 7 et 13 caractères.'
      );
      setIsLoading(false);
      return;
    }

    if (password !== verifyPassword) {
      toast.error("Les mots de passe ne correspondent pas.");
      setIsLoading(false);
      return;
    }

    if (!username || !email || !password || !verifyPassword) {
      setError("Veuillez remplir tous les champs.");
      setIsLoading(false);
      return;
    }

    const userData = {
      username,
      email,
      password,
    };

    try {
      const response = await fetch(getApiUrl("/auth/signup"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      console.log("res : ", response)

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de l'inscription");
      }

      // Récupérer les données de la réponse
      const data = await response.json();
      console.log("Réponse de l'API :", data);
      const userId = data.id;

      console.log("Réponse de l'API :", data);
      console.log("Inscription réussie ! User ID :", userId);

      toast.success(data.message);

      // Rediriger avec le userId dans l'URL
      // window.location.href = `/pages/authentication/onboarding/step-one?user=${userId}`;
            window.location.href = `/pages/perfect/chat?user=${userId}`;
    } catch (error) {
      console.error("Erreur lors de l'inscription :", error);

      if (error instanceof Error) {
        setError(
          error.message || "Une erreur est survenue lors de l'inscription."
        );
        toast.error(error.message);
      } else {
        setError("Une erreur inconnue est survenue lors de l'inscription.");
        toast.error("Une erreur inconnue est survenue lors de l'inscription.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Calcul de la force pour la barre de progression
  const getStrengthPercentage = () => {
    const criteriaMet = [
      passwordStrength.hasUpperCase,
      passwordStrength.hasNumber,
      passwordStrength.hasVowel,
      passwordStrength.hasSpecial,
      passwordStrength.validLength,
    ].filter(Boolean).length;
    return (criteriaMet / 5) * 100;
  };

  const getStrengthColor = () => {
    const percentage = getStrengthPercentage();
    if (percentage <= 40) return "bg-red-500";
    if (percentage <= 80) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="bg-sky-500 bg-[url('/file2.svg')] min-h-screen flex flex-col">
      <Toaster richColors position="top-right" />
      <div className="auth-height flex flex-col min-h-screen w-full items-center justify-center">
        <div className="auth-page-all-items px-4 md:px-28 py-10 flex-grow grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(300px,1fr))] h-full gap-6">
          {/* Image masquée sur mobile (sm et en dessous) */}
          {/* <div className="text-center hidden md:block">
            <Image
              src="/assets/images/svg/register-img.svg"
              alt="image"
              width={400}
              height={400}
              layout="contain"
            />
          </div> */}

          <div className="bg-white auth-form px-4 md:px-10 flex flex-col items-center justify-center">
            <br />
            <br />
            <span className="">
              <Image
                src="/assets/images/png/Plan de travail 1.png"
                alt="logo"
                width={150}
                height={150}
                className="object-contain"
              />
            </span>

            <br />

            <h2 className="regular sub-title">Créer un nouveau compte</h2>
            <br />
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form>
              <label
                htmlFor="username"
                className={`regular ${fieldErrors.username ? "text-red-500" : ""}`}
                // className={`regular ${fieldErrors.email ? "text-red-500" : "text-black"}`}
              >
                Nom d'utilisateur
              </label>
              <input
                type="text"
                placeholder="Votre Nom d'utilisateur ici..."
                id="username"
                className={`auth-input regular  bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-gray-700 font-medium ${fieldErrors.username ? "border-red-500" : ""
                  }`}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <label
                htmlFor="email"
                className={fieldErrors.email ? "text-red-500" : "regular"}
              >
                Email
              </label>
              <input
                type="email"
                placeholder="Votre Email ici..."
                id="email"
                className={`auth-input regular  bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-gray-700 font-medium ${fieldErrors.email ? "border-red-500" : ""
                  }`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label
                htmlFor="password"
                className={fieldErrors.password ? "text-red-500" : "regular"}
              >
                Mot de passe
              </label>
              <input
                type="password"
                placeholder="Votre mot de passe ici..."
                id="password"
                className={`auth-input regular  bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-gray-700 font-medium ${fieldErrors.password ? "border-red-500" : ""
                  }`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label
                htmlFor="confim-password"
                className={fieldErrors.verifyPassword ? "text-red-500" : "regular"}
              >
                Mot de passe de confirmation
              </label>
              <input
                type="password"
                placeholder="Le même mot de passe ici..."
                id="confim-password"
                className={`auth-input regular  bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-gray-700 font-medium ${fieldErrors.verifyPassword ? "border-red-500" : ""
                  }`}
                value={verifyPassword}
                onChange={(e) => setVerifyPassword(e.target.value)}
              />

              {/* Ajout : Feedback en temps réel */}
              {verifyPassword.length > 0 && (
                <div className="mt-2">
                  <div className="w-full h-2 bg-gray-200 rounded">
                    <div
                      className={`h-full rounded ${getStrengthColor()}`}
                      style={{ width: `${getStrengthPercentage()}%` }}
                    />
                  </div>
                  <div className="text-sm mt-2">
                    <p
                      className={
                        passwordStrength.validLength
                          ? "text-green-500"
                          : "text-red-500 regular"
                      }
                    >
                      {passwordStrength.validLength ? "✓" : "✗"} 7-13 caractères
                    </p>
                    <p
                      className={
                        passwordStrength.hasUpperCase
                          ? "text-green-500"
                          : "text-red-500 regular"
                      }
                    >
                      {passwordStrength.hasUpperCase ? "✓" : "✗"} Majuscule
                    </p>
                    <p
                      className={
                        passwordStrength.hasNumber
                          ? "text-green-500"
                          : "text-red-500 regular"
                      }
                    >
                      {passwordStrength.hasNumber ? "✓" : "✗"} Chiffre
                    </p>
                    <p
                      className={
                        passwordStrength.hasVowel
                          ? "text-green-500"
                          : "text-red-500 regular"
                      }
                    >
                      {passwordStrength.hasVowel ? "✓" : "✗"} Voyelle
                    </p>
                    <p
                      className={
                        passwordStrength.hasSpecial
                          ? "text-green-500"
                          : "text-red-500 regular"
                      }
                    >
                      {passwordStrength.hasSpecial ? "✓" : "✗"} Caractère
                      spécial
                    </p>
                    {!passwordStrength.validChars && (
                      <p className="text-red-500 regular">✗ Caractères non autorisés</p>
                    )}
                  </div>
                </div>
              )}

              <br />
              <br />

              {isLoading ? (
                <div className="btn btn-primary text-center w-full items-center justify-center">
                  <ButtonLoading />
                </div>
              ) : (
                <PrimaryButton onClick={handlerRegister} text="S'inscrire" />
              )}
            </form>

            <br />

            <p className="text-center">
              Vous avez déjà un compte ?{" "}
              <Link
                href="/pages/authentication/login"
                className="text-blue-600"
              >
                Se connecter
              </Link>
            </p>
            <br />

            <h3 className="text-gray-500">- OU -</h3>

            <br />

            <div>
              <button className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-gray-700 font-medium">
                <Image
                  src="/assets/images/png/google.png"
                  alt="Google Icon"
                  width={24}
                  height={24}
                />
                <span>S'inscrire avec Google</span>
              </button>
            </div>

            <br />
            <br />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;
