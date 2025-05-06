"use client";
import React, { useEffect, useState } from "react";
import MainSession from "@/app/components/admin/MainSession";
import Sider from "@/app/components/admin/Sider";
import { useRouter } from "next/navigation";
import Loading from "@/app/components/Loading/Loading";

const Page = () => {
  // L'état pour suivre l'élément sélectionné
  const [selectedItem, setSelectedItem] = useState<string>("");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true); // Pour gérer le chargement initial

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      router.push("/pages/authentication/login");
    } else {
      setIsLoading(false);
    }
    setSelectedItem("Documents");
  }, [router]);

  if (isLoading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  return (
    <div className="h-screen">
      <div className="flex h-screen">
        {/* Passer l'état selectedItem à Sider et gérer la sélection */}
        <Sider selectedItem={selectedItem} setSelectedItem={setSelectedItem} />

        <div className="main flex-1 p-6">
          {/* Passer selectedItem à MainSession pour afficher les détails */}
          <MainSession selectedItem={selectedItem} />
        </div>
      </div>
    </div>
  );
};

export default Page;
