import Loading from "@/app/components/Loading/Loading";
import { getApiUrl } from "@/app/lib/config";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";

interface SystemYearsProps {
  id: string;
  year: number;
  fetchData: () => Promise<void>;
}

const SystemYears: React.FC<SystemYearsProps> = ({ id, year, fetchData }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newYear, setNewYear] = useState<string>(year.toString());
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setNewYear(year.toString());
  }, [year]);

  // Ouvrir la modale d'édition
  const openEditModal = () => {
    setIsEditModalOpen(true);
  };

  // Fermer la modale d'édition
  const closeEditModal = () => setIsEditModalOpen(false);

  // Ouvrir la modale de suppression
  const openDeleteModal = () => setIsDeleteModalOpen(true);

  // Fermer la modale de suppression
  const closeDeleteModal = () => setIsDeleteModalOpen(false);

  const handleUpdateYear = async (id: string, newYear: string) => {
    setIsLoading(true);
    const parsedYear = parseInt(newYear, 10);

    if (isNaN(parsedYear)) {
      toast.error("Veuillez renseigner une année valide.");
      setIsLoading(false);
      return;
    }

    const token = localStorage.getItem("accessToken");

    if (!token) {
      setError("Vous devez être connecté pour effectuer cette action.");
      setIsLoading(false);
      return;
    }

    const apiUrl = `${getApiUrl(`/admin/year/${id}`)}`;

    try {
      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ year: parsedYear }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Erreur lors de la mise à jour de l'année"
        );
      }

      toast.success("Année modifiée avec succès !");
      setError("");
    } catch (error) {
      console.error("Erreur lors de la modification :", error);
      toast.error("Une erreur est survenue lors de la modification");
      setError(
        error instanceof Error
          ? error.message
          : "Une erreur inconnue est survenue."
      );
    } finally {
      setIsLoading(false);
    }
    fetchData();
    closeEditModal();
  };

  const handleDelete = async (id: string) => {
    setIsLoading(true);
    const token = localStorage.getItem("accessToken");

    if (!token) {
      setError("Vous devez être connecté pour effectuer cette action.");
      setIsLoading(false);
      return;
    }

    const apiUrl = `${getApiUrl("/admin/year")}/${id}`;

    try {
      const response = await fetch(apiUrl, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Erreur lors de la suppression de l'année"
        );
      }

      toast.success("Année supprimée avec succès !");
      setError("");
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
      toast.error("Une erreur est survenue lors de la suppression");
      setError(
        error instanceof Error
          ? error.message
          : "Une erreur inconnue est survenue."
      );
    } finally {
      setIsLoading(false);
    }

    fetchData();
    closeDeleteModal();
  };

  return (
    <div>
      {isLoading ? (
        <Loading />
      ) : (
        <div>
          <Toaster richColors position="top-right" />

          <div className="flex flex-row justify-between py-2">
            <div className="flex flex-row gap-8">
              <button
                type="button"
                onClick={openEditModal}
                aria-label="Éditer l'année"
              >
                <Image
                  src="/assets/icons/editer.png"
                  alt="Éditer"
                  height={20}
                  width={20}
                />
              </button>
              <button
                type="button"
                onClick={openDeleteModal}
                aria-label="Supprimer l'année"
              >
                <Image
                  src="/assets/icons/supprimer.png"
                  alt="Supprimer"
                  height={20}
                  width={20}
                />
              </button>
            </div>
          </div>

          {isEditModalOpen && (
            <div
              onClick={closeEditModal}
              className="pointer-events-auto fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 opacity-100 backdrop-blur-sm transition-opacity duration-300"
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="relative m-4 p-4 w-2/5 min-w-[40%] max-w=[40%] rounded-lg bg-white shadow-sm"
              >
                <h3 className="text-xl font-medium text-slate-800 pb-4">
                  Éditer l&lsquo;élément : {year}
                </h3>
                <input
                  type="number"
                  className="w-full p-4 border"
                  placeholder="Modifier l'année"
                  value={newYear}
                  onChange={(e) => setNewYear(e.target.value)}
                />
                {error && <p className="text-red-500 text-center">{error}</p>}
                <div className="flex shrink-0 flex-wrap items-center pt-4 justify-end">
                  <button
                    type="button"
                    onClick={closeEditModal}
                    className="rounded-md border border-transparent py-2 px-4 text-center text-sm transition-all text-slate-600 hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100"
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateYear(id, newYear)}
                    className="rounded-md btn btn-primary py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-green-700 focus:shadow-none active:bg-green-700"
                  >
                    Sauvegarder
                  </button>
                </div>
              </div>
            </div>
          )}

          {isDeleteModalOpen && (
            <div
              onClick={closeDeleteModal}
              className="pointer-events-auto fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 opacity-100 backdrop-blur-sm transition-opacity duration-300"
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="relative m-4 p-4 w-2/5 min-w-[40%] max-w=[40%] rounded-lg bg-white shadow-sm"
              >
                <h3 className="text-xl font-medium text-slate-800 pb-4">
                  Êtes-vous sûr de vouloir supprimer cet élément ?
                </h3>
                {error && <p className="text-red-500 text-center">{error}</p>}
                <div className="flex shrink-0 flex-wrap items-center pt-4 justify-end">
                  <button
                    type="button"
                    onClick={closeDeleteModal}
                    className="rounded-md border border-transparent py-2 px-4 text-center text-sm transition-all text-slate-600 hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100"
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(id)}
                    className="rounded-md bg-red-600 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-red-700 focus:shadow-none active:bg-red-700"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SystemYears;