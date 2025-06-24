"use client";

import "../../authentication.css";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, Suspense } from "react";

// ✅ Wrapper pour extraire les searchParams de manière sûre dans un Suspense
const ParamsWrapper = ({
  children,
}: {
  children: (params: { user: string; role: string }) => React.ReactNode;
}) => {
  const searchParams = useSearchParams();
  const user = searchParams.get("user") || "";
  const role = searchParams.get("role") || "";

  return <>{children({ user, role })}</>;
};

const Page = () => {
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [universityName, setUniversityName] = useState<string>("");

  const router = useRouter();

  const handleSelection = (value: string) => {
    setSelectedSector(value);
  };

  return (
    <Suspense fallback={<div className="p-10 text-center">Chargement...</div>}>
      <ParamsWrapper>
        {({ user, role }) => {
          const handleNext = () => {
            if (selectedSector && universityName) {
              router.push(
                `/pages/authentication/onboarding/step-three?user=${user}&role=${role}&sector=${selectedSector}&universityName=${encodeURIComponent(
                  universityName
                )}`
              );
            }
          };

          return (
            <div className="auth-page min-h-screen flex flex-col">
              <div className="bg-sky-700 bg-[url('/file2.svg')] step-twoo flex flex-col min-h-screen w-full items-center justify-center">
                <div className="auth-page-all-items px-4 md:px-28 py-10 flex-grow grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(300px,1fr))] h-full gap-6">
                  <div className="bg-white auth-form px-4 md:px-10 max-w-full flex flex-col items-center justify-center">
                    {/* Barre de progression */}
                    <div className="w-full bg-gray-200 h-2 mb-6">
                      <div className="bg-orange-500 h-2" style={{ width: "66%" }}></div>
                    </div>

                    <Image
                      src="/assets/images/png/Plan de travail 1.png"
                      alt="logo"
                      width={150}
                      height={150}
                      className="object-contain"
                    />

                    <h2 className="regular sub-title text-center mt-6">
                      Quelle est le nom de votre Université ?
                    </h2>

                    <div className="flex justify-center mt-6 w-full">
                      <input
                        type="text"
                        value={universityName}
                        onChange={(e) => setUniversityName(e.target.value)}
                        placeholder="Entrez le nom de votre université"
                        className="w-full max-w-md p-4 border rounded-lg text-center text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <h2 className="regular sub-title text-center mt-10">
                      À quel secteur appartient votre université ?
                    </h2>

                    <div className="flex flex-wrap gap-5 justify-center mt-6">
                      {[
                        { label: "Secteur privé", value: "prive" },
                        { label: "Secteur public", value: "public" },
                      ].map(({ label, value }) => (
                        <label key={value} className="cursor-pointer">
                          <input
                            type="radio"
                            name="sector"
                            value={value}
                            className="hidden"
                            checked={selectedSector === value}
                            onChange={() => handleSelection(value)}
                          />
                          <div
                            className={`w-40 p-4 border rounded-lg text-center transition-all duration-300 ${
                              selectedSector === value
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 text-gray-700"
                            }`}
                          >
                            <p className="font-semibold">{label}</p>
                          </div>
                        </label>
                      ))}
                    </div>

                    <div className="flex flex-col md:flex-row justify-center gap-4 w-full max-w-md mt-10">
                      <button
                        onClick={() =>
                          router.push(
                            `/pages/authentication/onboarding/step-one?user=${user}&role=${role}`
                          )
                        }
                        className="w-full md:w-auto px-6 py-2 rounded-lg transition-all duration-300 bg-sky-500 text-white"
                      >
                        Précédent
                      </button>
                      <button
                        onClick={handleNext}
                        disabled={!selectedSector || !universityName}
                        className={`w-full md:w-auto px-6 py-2 rounded-lg transition-all duration-300 ${
                          selectedSector && universityName
                            ? "btn btn-primary text-white"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                      >
                        Suivant
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        }}
      </ParamsWrapper>
    </Suspense>
  );
};

export default Page;
