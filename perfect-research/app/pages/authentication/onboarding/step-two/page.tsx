"use client"; // Directive pour marquer le fichier comme un composant client

import "../../authentication.css"; // Ajuste le chemin selon ton arborescence
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";

const Page = () => {
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [universityName, setUniversityName] = useState<string>(""); // État pour le nom de l'université
  const router = useRouter();
  const searchParams = useSearchParams(); // Récupère les paramètres d'URL
  const role = searchParams.get("role"); // Récupère le rôle passé depuis step-one
  const user = searchParams.get("user");

  const handleSelection = (value: string) => {
    setSelectedSector(value);
  };

  const handleNext = () => {
    if (selectedSector && universityName) {
      // Vérifie que le secteur et le nom sont remplis
      // Redirige vers une étape suivante avec les paramètres
      router.push(
        `/pages/authentication/onboarding/step-three?user=${user}&role=${role}&sector=${selectedSector}&universityName=${encodeURIComponent(
          universityName
        )}`
      );
    }
  };

  return (
    <div className="auth-page min-h-screen flex flex-col">
      <div className="step-twoo flex flex-col min-h-screen w-full">
        <div className="auth-page-all-items px-4 md:px-28 py-10 flex-grow grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(300px,1fr))] h-full gap-6">
          {/* Image masquée sur mobile (sm et en dessous) */}
          <div className="text-center hidden md:block">
            <Image
              src="/assets/images/svg/onboarding-second-step.svg"
              alt="image"
              width={400}
              height={400}
              className="object-contain"
            />
          </div>

          <div className="bg-white auth-form px-4 md:px-10 max-w-full flex flex-col items-center justify-center">
            {/* Barre de progression */}
            <div className="w-full bg-gray-200 h-2 mb-6">
              <div className="bg-blue-500 h-2" style={{ width: "66%" }}></div>
            </div>

            <br />
            <br />
            <span className="h-24 w-24 bg-gray-200 inline-block"></span>
            <br />

            <h2 className="righteous sub-title text-center">
              Quelle est le nom de votre Université ?
            </h2>
            <br />

            {/* Input pour le nom de l'université */}
            <div className="flex justify-center">
              <input
                type="text"
                value={universityName}
                onChange={(e) => setUniversityName(e.target.value)}
                placeholder="Entrez le nom de votre université"
                className="w-full max-w-md p-4 border rounded-lg text-center text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <br />
            <br />
            <h2 className="righteous sub-title text-center">
              À quel secteur appartient votre université ?
            </h2>

            <br />

            {/* Section des options */}
            <div className="flex flex-wrap gap-5 justify-center">
              {/* Option 1: Secteur privé */}
              <label className="cursor-pointer">
                <input
                  type="radio"
                  name="sector"
                  value="prive"
                  className="hidden"
                  checked={selectedSector === "prive"}
                  onChange={() => handleSelection("prive")}
                />
                <div
                  className={`w-40 p-4 border rounded-lg text-center transition-all duration-300 ${
                    selectedSector === "prive"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  <p className="font-semibold">Secteur privé</p>
                </div>
              </label>

              {/* Option 2: Secteur public */}
              <label className="cursor-pointer">
                <input
                  type="radio"
                  name="sector"
                  value="public"
                  className="hidden"
                  checked={selectedSector === "public"}
                  onChange={() => handleSelection("public")}
                />
                <div
                  className={`w-40 p-4 border rounded-lg text-center transition-all duration-300 ${
                    selectedSector === "public"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  <p className="font-semibold">Secteur public</p>
                </div>
              </label>
            </div>

            <br />
            <br />
            <br />

            <div className="flex justify-center gap-4">
              <button
                onClick={() =>
                  router.push(
                    `/pages/authentication/onboarding/step-one?user=${user}&role=${role}`
                  )
                }
                className="px-6 py-2 rounded-lg transition-all duration-300 bg-gray-500 text-white hover:bg-gray-600"
              >
                Précédent
              </button>
              <button
                onClick={handleNext}
                disabled={!selectedSector || !universityName}
                className={`px-6 py-2 rounded-lg transition-all duration-300 ${
                  selectedSector && universityName
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Suivant
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
