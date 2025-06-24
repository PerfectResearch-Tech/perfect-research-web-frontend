"use client";

import { getApiUrl } from "@/app/lib/config";
import "../../authentication.css";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { toast, Toaster } from "sonner";
import ButtonLoading from "@/app/components/Loading/ButtonLoading";

interface UserData {
  userId: string;
  responses: {
    isStudent: boolean;
    isUniversity: boolean;
    isResearcher: boolean;
    isOther: boolean;
  };
  universityDetails: {
    universityName: string;
    universitySector: string;
    universityAddress: string;
  };
}

const Page = () => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("user");

  const handleSelection = (value: string) => {
    setSelectedOption(value);
  };

  const handleNext = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!selectedOption) return;

    if (selectedOption === "etudiant" || selectedOption === "universite") {
      router.push(
        `/pages/authentication/onboarding/step-two?user=${userId}&role=${selectedOption}`
      );
    } else {
      const userData: UserData = {
        userId: userId || "",
        responses: {
          isStudent: selectedOption === "etudiant",
          isUniversity: selectedOption === "universite",
          isResearcher: selectedOption === "chercheur",
          isOther: selectedOption === "simple_curieux" || selectedOption === "autre",
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
    userData: UserData
  ) => {
    e.preventDefault();

    if (!userId) {
      toast.error("Utilisateur introuvable");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(getApiUrl("/auth/onboarding"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Échec de l'opération");
      }

      const data = await response.json();
      toast.success(data.message);
      router.push(`/pages/authentication/login`);
    } catch (error) {
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
    <div className="auth-page min-h-screen flex flex-col">
      <Toaster richColors position="top-right" />
      <div className="bg-sky-700 step-one bg-[url('/file2.svg')] flex flex-col min-h-screen w-full items-center justify-center">
        <div className="auth-page-all-items px-4 md:px-28 py-10 flex-grow grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(300px,1fr))] h-full gap-6">
          <div className="bg-white auth-form px-4 md:px-10 max-w-full flex flex-col items-center justify-center">
            <div className="w-full bg-gray-200 h-2 mb-6">
          <div className="bg-orange-500 h-2 w-1/3"></div>
            </div>

            <Image
              src="/assets/images/png/Plan de travail 1.png"
              alt="logo"
              width={150}
              height={150}
              className="object-contain"
            />

            <h2 className="regular sub-title text-center mt-6">
              Dites-nous un peu qui vous êtes
            </h2>

            <div className="flex flex-wrap gap-5 justify-center mt-8">
              {[
                { value: "etudiant", label: "Étudiant" },
                { value: "chercheur", label: "Chercheur" },
                { value: "universite", label: "Université" },
                { value: "simple_curieux", label: "Simple Curieux" },
              ].map(({ value, label }) => (
                <label key={value} className="cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value={value}
                    className="hidden"
                    checked={selectedOption === value}
                    onChange={() => handleSelection(value)}
                  />
                  <div
                    className={`w-40 p-4 border rounded-lg text-center transition-all duration-300 ${
                      selectedOption === value
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    <p className="font-semibold">{label}</p>
                  </div>
                </label>
              ))}
            </div>

            <div className="flex justify-center mt-8">
              <p
                onClick={() => handleSelection("autre")}
                className={`cursor-pointer ${
                  selectedOption === "autre" ? "text-blue-500" : "text-gray-700"
                }`}
              >
                Autre
              </p>
            </div>

            <div className="flex justify-center mt-8 w-full">
              {isLoading ? (
                <div className="btn btn-primary text-center w-full flex items-center justify-center">
                  <ButtonLoading />
                </div>
              ) : (
                <button
                  onClick={handleNext}
                  disabled={!selectedOption}
                  className={`px-6 py-2 rounded-lg transition-all duration-300 w-full max-w-xs ${
                    selectedOption
                      ? "btn btn-primary text-white"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {selectedOption === "etudiant" || selectedOption === "universite"
                    ? "Suivant"
                    : "Soumettre"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
