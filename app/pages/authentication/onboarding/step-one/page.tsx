"use client"; // Directive pour marquer le fichier comme un composant client

import { getApiUrl } from "@/app/lib/config";
import "../../authentication.css";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";
import { span } from "framer-motion/client";
import ButtonLoading from "@/app/components/Loading/ButtonLoading";

const page = () => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const searchParams = useSearchParams();
  const userId = searchParams.get("user");

  const handleSelection = (value: string) => {
    setSelectedOption(value);
  };

  const handleNext = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (
      (selectedOption && selectedOption == "etudiant") ||
      selectedOption == "universite"
    ) {
      router.push(
        `/pages/authentication/onboarding/step-two?user=${userId}&role=${selectedOption}`
      );
    } else if (userId && selectedOption == "chercheur") {
      const userData = {
        userId: userId || "",
        responses: {
          isStudent: false,
          isUniversity: false,
          isResearcher: true,
          isOther: false,
        },
        universityDetails: {
          universityName: "",
          universitySector: "",
          universityAddress: "",
        },
      };
      handlerSubmit(e, userData);
    } else {
      const userData = {
        userId: userId || "",
        responses: {
          isStudent: false,
          isUniversity: false,
          isResearcher: false,
          isOther: true,
        },
        universityDetails: {
          universityName: "",
          universitySector: "",
          universityAddress: "",
        },
      };
      handlerSubmit(e, userData);
    }
  };

  const handlerSubmit = async (
    e: React.MouseEvent<HTMLButtonElement>,
    userData: any
  ) => {
    if (!userId) {
      toast.error("Utilisateur introuvable");
      return;
    }
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(getApiUrl("/auth/onboarding"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Echec de l'opération");
      }

      // Récupérer les données de la réponse
      const data = await response.json();
      console.log("Réponse de l'API :", data);

      toast.success(data.message);

      // Rediriger avec le userId dans l'URL
      window.location.href = `/pages/authentication/login`;
    } catch (error) {
      console.error("Echec de l'opération :", error);

      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Une erreur inconnue est survenue.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page min-h-screen flex flex-col ">
      <Toaster richColors position="top-right" />
      <div className="bg-sky-500 step-one bg-[url('/file2.svg')] flex flex-col min-h-screen w-full items-center justify-center">
        <div className="auth-page-all-items px-4 md:px-28 py-10 flex-grow grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(300px,1fr))] h-full gap-6 ">
          {/* Image masquée sur mobile (sm et en dessous) */}
          {/* <div className="text-center hidden md:block">
            <Image
              src="/assets/images/svg/onboarding-first-step.svg"
              alt="image"
              width={400}
              height={400}
              layout="contain"
            />
          </div> */}

          <div className="bg-white auth-form px-4 md:px-10 max-w-full flex flex-col items-center justify-center">
            <div className="w-full bg-gray-200 h-2 mb-6">
              <div className="bg-orange-500 h-2" style={{ width: "33%" }}></div>
            </div>
            <br />
            <br />
            <span className="inline-block">
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
              Dites-nous un peu qui vous êtes 
            </h2>
            <br />
            <br />

            {/* Section des options */}
            <div className="flex flex-wrap gap-5 justify-center">
              {/* Carte 1: Étudiant */}
              <label className="cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="etudiant"
                  className="hidden"
                  checked={selectedOption === "etudiant"}
                  onChange={() => handleSelection("etudiant")}
                />
                <div
                  className={`w-40 p-4 border rounded-lg text-center transition-all duration-300 ${selectedOption === "etudiant"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700"
                    }`}
                >
                  <p className="font-semibold">Étudiant</p>
                </div>
              </label>

              {/* Carte 2: Chercheur */}
              <label className="cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="chercheur"
                  className="hidden"
                  checked={selectedOption === "chercheur"}
                  onChange={() => handleSelection("chercheur")}
                />
                <div
                  className={`w-40 p-4 border rounded-lg text-center transition-all duration-300 ${selectedOption === "chercheur"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700"
                    }`}
                >
                  <p className="font-semibold">Chercheur</p>
                </div>
              </label>

              {/* Carte 3: Université */}
              <label className="cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="universite"
                  className="hidden"
                  checked={selectedOption === "universite"}
                  onChange={() => handleSelection("universite")}
                />
                <div
                  className={`w-40 p-4 border rounded-lg text-center transition-all duration-300 ${selectedOption === "universite"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700"
                    }`}
                >
                  <p className="font-semibold">Université</p>
                </div>
              </label>

              {/* Carte 4: Simple Curieux */}
              <label className="cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="simple_curieux"
                  className="hidden"
                  checked={selectedOption === "simple_curieux"}
                  onChange={() => handleSelection("simple_curieux")}
                />
                <div
                  className={`w-40 p-4 border rounded-lg text-center transition-all duration-300 ${selectedOption === "simple_curieux"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700"
                    }`}
                >
                  <p className="font-semibold">Simple Curieux</p>
                </div>
              </label>
            </div>

            <br />
            <br />
            <br />

            <div className="flex justify-center">
              <p
                onClick={() => handleSelection("autre")}
                className={`cursor-pointer ${selectedOption === "autre" ? "text-blue-500" : "text-gray-700"
                  }`}
              >
                Autre
              </p>
            </div>

            <br />
            <br />

            {/* Bouton Next */}
            <div className="flex justify-center">
              {isLoading ? (
                <div className="btn btn-primary text-center w-full items-center justify-center">
                  <ButtonLoading />
                </div>
              ) : (
                <button
                  onClick={handleNext}
                  disabled={!selectedOption}
                  className={`px-6 py-2 rounded-lg transition-all duration-300 ${selectedOption
                      ? "btn btn-primary text-white "
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                >
                  <span>
                    {selectedOption === "etudiant" ||
                      selectedOption === "universite"
                      ? "Suivant"
                      : "Soumettre"}
                  </span>
                </button>
              )}
            </div>

            <br />
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
