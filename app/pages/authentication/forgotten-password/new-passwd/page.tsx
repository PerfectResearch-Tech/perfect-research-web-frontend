"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import "../../authentication.css";
import PrimaryButton from "@/app/components/generals/buttons/PrimaryButton";
import { useRouter } from "next/navigation";
import Loading from "@/app/components/Loading/Loading";
import { toast, Toaster } from "sonner";
import ButtonLoading from "@/app/components/Loading/ButtonLoading";
import { getApiUrl } from "@/app/lib/config";
import { p } from "framer-motion/client";

const Login = () => {
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, boolean>>({
    email: false,
  });

  const router = useRouter();

  const handleReset = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Réinitialiser les erreurs de champ
    setFieldErrors({
      password: !password,
      confimPassword: !confirmPassword,
    });

    // Validation de base
    if (!password || !confirmPassword) {
      setError("Veuillez remplir tous les champs.");
      toast.error("Veuillez remplir tous les champs.");
      setIsLoading(false);
      return;
    } else if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      toast.error("Les mots de passe ne correspondent pas.");
      setIsLoading(false);
      return;
    }

    try {
      // Appel à l'API de réinitialisation
      const response = await fetch(`${getApiUrl("/auth/reset-password")}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Erreur lors de la réinitialisation"
        );
      }

      // Récupérer la réponse JSON
      const responseData = await response.json();
      console.log("Réponse API :", responseData); // Pour déboguer

      // Pas de tokens ici, juste une confirmation
      toast.success("Un email de réinitialisation a été envoyé !");
      router.push("/pages/authentication/forgotten-password/new-passwd");
    } catch (error) {
      console.error("Erreur lors de la réinitialisation :", error);
      if (error instanceof Error) {
        toast.error(error.message || "Une erreur est survenue.");
      } else {
        toast.error("Une erreur inconnue est survenue.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-sky-500 bg-[url('/file2.svg')] min-h-screen flex flex-col">
      <Toaster richColors position="top-right" />
      <div className="auth-height flex flex-col min-h-screen w-full justify-center items-center">
        <div className="auth-page-all-items px-4 md:px-28 py-10 flex-grow grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(300px,1fr))] h-full gap-6">
          {/* <div className="auth-page-all-items px-28 py-10" > */}

            {/* <div className="text-center hidden md:block">
              <Image
                src="/assets/images/svg/register-img.svg"
                alt="image"
                width={400}
                height={400}
                layout="contain"
              />
            </div> */}


            <div className="bg-white auth-form px-10  ">
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

              <h2 className="regular sub-title text-center">
                Veuillez renseigner votre nouveau mot de passe.
              </h2>
              <br />
              <form>
                <label
                  htmlFor="password"
                  className={fieldErrors.password ? "text-red-500" : "regular " }
                >
                  Mot de passe
                </label>
                <input
                  type="password"
                  placeholder="Votre nouveau mot de passe ici..."
                  id="password"
                  className={`auth-input regular  bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-gray-700 font-medium  ${fieldErrors.password ? "border-red-500" : ""
                    }`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <br />
                <label
                  htmlFor="confirm-password"
                  className={fieldErrors.confirmPassword ? "text-red-500" : "regular"}
                >
                  Confirmation de mot de passe
                </label>
                <input
                  type="password"
                  placeholder="Confirmation de nouveau mot de passe ici..."
                  id="confirm-password"
                  className={`auth-input regular  bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-gray-700 font-medium ${fieldErrors.confimPassword ? "border-red-500" : ""
                    }`}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />

                <br />

                {error && <p className="text-red-500 text-center">{error}</p>}
                <br />
                {isLoading ? (
                  <div className="btn btn-primary text-center w-full items-center justify-center">
                    <ButtonLoading />
                  </div>
                ) : (
                  <PrimaryButton onClick={handleReset} text="Changer" />
                )}
              </form>

              <br />

              <p className="text-center regular">
                Vous vous rappelez de votre mot de passe ?{" "}
                <Link
                  href="/pages/authentication/login"
                  className="text-blue-600"
                >
                  Se connecter
                </Link>
              </p>

              <br />
              <br />
            </div>

          {/* </div> */}


        </div>
      </div>
    </div>
  );
};

export default Login;
