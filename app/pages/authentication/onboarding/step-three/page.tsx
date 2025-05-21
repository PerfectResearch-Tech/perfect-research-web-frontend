"use client"; // Directive pour marquer le fichier comme un composant client

import ButtonLoading from "@/app/components/Loading/ButtonLoading";
import "../../authentication.css"; // Ajuste le chemin selon ton arborescence
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";
import { getApiUrl } from "@/app/lib/config";

const Page = () => {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("user");
  const role = searchParams.get("role");
  const sector = searchParams.get("sector");
  const universityName = searchParams.get("universityName");

  const handleSelection = (value: string) => {
    setSelectedLocation(value);
    setError(null);
  };

  const handlePrevious = () => {
    router.push(
      `/pages/authentication/onboarding/step-two?user=${userId}&role=${role}&sector=${sector}&universityName=${universityName}`
    );
  };

  const handlerSubmit = async (
    e: React.MouseEvent<HTMLButtonElement>,
    userData: any
  ) => {
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

       console.log("res : ", response)
       
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

  const handleFinish = async (e: any) => {
    if (!selectedLocation) return;

    setIsLoading(true);
    setError(null);

    let userData = {};
    try {
      if (role == "universite") {
        userData = {
          userId: userId || "",
          responses: {
            isStudent: false,
            isUniversity: true,
            isResearcher: false,
            isOther: false,
          },
          universityDetails: {
            universityName: universityName || "",
            universitySector: sector || "",
            universityAddress: selectedLocation || "",
          },
        };
      } else {
        userData = {
          userId: userId || "",
          responses: {
            isStudent: true,
            isUniversity: false,
            isResearcher: false,
            isOther: false,
          },
          universityDetails: {
            universityName: universityName || "",
            universitySector: sector || "",
            universityAddress: selectedLocation || "",
          },
        };
      }

      handlerSubmit(e, userData);
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page min-h-screen flex flex-col">
      <div className="bg-sky-500   bg-[url('/file2.svg')] step-three flex flex-col min-h-screen w-full items-center justify-center">
        <div className="auth-page-all-items px-4 md:px-28 py-10 flex-grow grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(300px,1fr))] h-full gap-6">
          {/* Image masquée sur mobile (sm et en dessous) */}
          {/* <div className="text-center hidden md:block">
            <Image
              src="/assets/images/svg/onboarding-tird-step.svg"
              alt="image"
              width={400}
              height={400}
              className="object-contain"
            />
          </div> */}

          <div className="bg-white auth-form px-4 md:px-10 max-w-full flex flex-col items-center justify-center">
            {/* Barre de progression */}
            <div className="w-full bg-gray-200 h-2 mb-6">
              <div className="bg-orange-500 h-2" style={{ width: "100%" }}></div>
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
              Quelle est l'adresse de votre université ?
            </h2>
            <br />
            <br />

            {/* Champ pour entrer l'adresse */}
            <div className="flex justify-center">
              <input
                type="text"
                value={selectedLocation || ""}
                onChange={(e) => handleSelection(e.target.value)}
                placeholder="Entrez votre adresse"
                className="w-full max-w-md p-4 border rounded-lg text-center text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <br />

            {/* Affichage de l'erreur */}
            {error && (
              <div className="text-center text-red-500 mt-4">{error}</div>
            )}

            <br />
            <br />

            {/* Boutons Précédent et Terminer */}
            <div className="flex flex-col md:flex-row justify-center gap-4">
              {/* hover:bg-gray-600 */}
              <button
                onClick={handlePrevious}
                className="w-full md:w-auto px-6 py-2 rounded-lg transition-all duration-300 bg-sky-500 text-white "
              >
                Précédent
              </button>
              <button
                onClick={handleFinish}
                disabled={!selectedLocation || isLoading}
                className={`w-full md:w-auto px-6 py-2 rounded-lg transition-all duration-300 ${selectedLocation && !isLoading
                    ? "btn btn-primary text-white "
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
              >
                {isLoading ? <ButtonLoading /> : "Terminer"}
              </button>
            </div>

            <br />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
