"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import "../authentication.css";
import PrimaryButton from "@/app/components/generals/buttons/PrimaryButton";
import { useRouter } from "next/navigation";
import Loading from "@/app/components/Loading/Loading";
import { toast, Toaster } from "sonner";
import ButtonLoading from "@/app/components/Loading/ButtonLoading";
import { getApiUrl } from "@/app/lib/config";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, boolean>>({
    email: false,
    password: false,
  });
  const router = useRouter();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      router.push("/pages/admin/home");
    } else {
      setIsLoading(false);
    }
  }, [router]);

  const handleLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // Réinitialiser les erreurs de champ
    setFieldErrors({
      email: !email,
      password: !password,
    });

    // Validation de base
    if (!email || !password) {
      setError("Veuillez remplir tous les champs.");
      setIsLoading(false);
      return;
    }

    try {
      // Appel à l'API de connexion
      const response = await fetch(`${getApiUrl("/auth/signin")}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de la connexion");
      } else if (response.status === 401) {
        toast.error("Email ou mot de passe incorrect");
        setIsLoading(false);
        return;
      }

      // Récupérer la réponse JSON
      const responseData = await response.json();

      // Extraire les tokens et les informations de l'utilisateur
      const { accessToken, refreshToken } = responseData.tokens;
      const user = responseData.user;

      // Stocker les tokens dans le localStorage
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", user.id);

      // Vérifier le rôle directement sur l'objet user
      if (user.role === "ADMIN") {
        localStorage.setItem("isAdmin", JSON.stringify(true));
        console.log("Utilisateur est admin");
      }

      // Rediriger l'utilisateur vers une page sécurisée
      router.push("/pages/admin/home");
      // window.location.href = "/pages/admin/home";
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);

      if (error instanceof Error) {
        setError(
          error.message || "Une erreur est survenue lors de la connexion."
        );
        toast.error(error.message);
      } else {
        setError("Une erreur inconnue est survenue lors de la connexion.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page min-h-screen flex flex-col">
      <Toaster richColors position="top-right" />
      <div className="bg-sky-500 flex flex-col min-h-screen w-full bg-[url('/file2.svg')]">
        <div className="auth-page-all-items px-4 md:px-28 py-10 flex-grow grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(300px,1fr))] h-full gap-6">
          {/* Image masquée sur mobile (sm et en dessous) */}
          <div className="text-center hidden md:block">
            <Image
              src="/assets/images/svg/register-img.svg"
              alt="image"
              width={400}
              height={400}
              layout="contain"
            />
          </div>

          <div className="bg-white auth-form px-4 md:px-10 flex flex-col items-center justify-center">
            <br />
            <br />
            <div className="">
              <Image
                src="/assets/images/png/Plan de travail 1.png"
                alt="logo"
                width={150}
                height={150}
                className="object-contain"
              />
            </div>

            <br />

            <h2 className="black sub-title text-center">
              Connectez-vous à votre compte
            </h2>
            <br />
            {error && <p className="text-red-500 text-center">{error}</p>}
            <form>
              <label
                htmlFor="email"
                className={fieldErrors.email ?  "text-red-500" : "" }
              >
                Email
              </label>
              <input
                type="email"
                placeholder="Votre Email ici..."
                id="email"
                className={`auth-input regular  bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-gray-700 font-medium ${
                  fieldErrors.email ? "border-red-500" : ""
                }` }
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label
                htmlFor="password"
                className={fieldErrors.password ? "text-red-500" : ""}
              >
                Mot de passe
              </label>
              <input
                type="password"
                placeholder="Votre mot de passe ici..."
                id="password"
                className={`auth-input regular  bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-gray-700 font-medium ${
                  fieldErrors.password ? "border-red-500" : ""
                }`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <p className="text-center regular">
                Mot de passe oublié ?{" "}
                <Link
                  href="/pages/authentication/forgotten-password/otp"
                  className=" text-[var(--secondary-color)]"
                >
                  Récupérer
                </Link>
              </p>
              <br />
              <br />
              {isLoading ? (
                <div className="btn btn-primary text-center w-full items-center justify-center">
                  <ButtonLoading />
                </div>
              ) : (
                <PrimaryButton onClick={handleLogin} text="Se connecter" />
              )}
            </form>

            <br />

            <p className="text-center regular">
              Vous n'avez pas de compte ?{" "}
              <Link
                href="/pages/authentication/registration"
                className="text-blue-600"
              >
                Créez-en un
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
                <span>Se connecter avec google</span>
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

export default Login;
