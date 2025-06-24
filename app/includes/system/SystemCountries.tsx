import Loading from "@/app/components/Loading/Loading";
import { getApiUrl } from "@/app/lib/config";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";

interface SystemCountriesProps {
  id: string;
  name: string;
  fetchData: () => Promise<void>; // Typage correct de la fonction
}

const SystemCountries: React.FC<SystemCountriesProps> = ({
  id,
  name,
  fetchData,
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const openEditModal = (item: string) => {
    setItemToEdit(item);
    setIsEditModalOpen(true);
  };

  useEffect(() => {
    setNewName(name);
  }, [name]);

  const closeEditModal = () => setIsEditModalOpen(false);
  const openDeleteModal = () => setIsDeleteModalOpen(true);
  const closeDeleteModal = () => setIsDeleteModalOpen(false);

  const handleDelete = async (countryId: string) => {
    const token = localStorage.getItem("accessToken");
    if (!token)
      return toast.error(
        "Vous devez être connecté pour effectuer cette action."
      );

    const apiUrl = `${getApiUrl("/admin/country")}/${countryId}`;

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
          errorData.message || "Erreur lors de la suppression du pays"
        );
      }

      toast.success("Pays supprimé avec succès !");
      fetchData();
      closeDeleteModal();
    } catch (error: unknown) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Une erreur inconnue est survenue."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (countryId: string, newCountryName: string) => {
    setIsLoading(true);
    const token = localStorage.getItem("accessToken");

    if (!token) {
      toast.error("Vous devez être connecté pour effectuer cette action.");
      setIsLoading(false);
      return;
    }

    if (!newCountryName.trim()) {
      toast.error("Veuillez renseigner le nom du pays.");
      setIsLoading(false);
      return;
    }

    const apiUrl = `${getApiUrl("/admin/country")}/${countryId}`;

    try {
      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newCountryName }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Erreur lors de la mise à jour du pays"
        );
      }

      toast.success("Pays modifié avec succès !");
      fetchData();
      closeEditModal();
    } catch (error: unknown) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Une erreur inconnue est survenue."
      );
    } finally {
      setIsLoading(false);
    }
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
                onClick={() => openEditModal(name)}
                title="Éditer le pays"
              >
                <Image
                  src="/assets/icons/editer.png"
                  alt="Éditer"
                  height={20}
                  width={20}
                />
              </button>
              <button onClick={openDeleteModal} title="Supprimer le pays">
                <Image
                  src="/assets/icons/supprimer.png"
                  alt="Supprimer"
                  height={20}
                  width={20}
                />
              </button>
            </div>
          </div>

          {/* Modal édition */}
          {isEditModalOpen && (
            <div
              onClick={closeEditModal}
              className="fixed inset-0 z-50 grid place-items-center bg-black bg-opacity-60 backdrop-blur-sm"
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="relative m-4 p-4 w-2/5 rounded-lg bg-white shadow-sm"
              >
                <h3 className="text-xl font-medium text-slate-800 pb-4">
                  Éditer l&apos;élément : {itemToEdit}
                </h3>
                <input
                  onChange={(e) => setNewName(e.target.value)}
                  type="text"
                  className="w-full p-4 border"
                  placeholder={`Modifier ${itemToEdit}`}
                  value={newName}
                />
                <div className="flex justify-end pt-4 gap-4">
                  <button
                    onClick={closeEditModal}
                    className="rounded-md py-2 px-4 text-sm text-slate-600 hover:bg-slate-100"
                    type="button"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={() => handleUpdate(id, newName)}
                    className="btn btn-primary py-2 px-4 text-sm text-white"
                    type="button"
                  >
                    Sauvegarder
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal suppression */}
          {isDeleteModalOpen && (
            <div
              onClick={closeDeleteModal}
              className="fixed inset-0 z-50 grid place-items-center bg-black bg-opacity-60 backdrop-blur-sm"
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="relative m-4 p-4 w-2/5 rounded-lg bg-white shadow-sm"
              >
                <h3 className="text-xl font-medium text-slate-800 pb-4">
                  Êtes-vous sûr de vouloir supprimer cet élément ?
                </h3>
                <div className="flex justify-end pt-4 gap-4">
                  <button
                    onClick={closeDeleteModal}
                    className="rounded-md py-2 px-4 text-sm text-slate-600 hover:bg-slate-100"
                    type="button"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={() => handleDelete(id)}
                    className="bg-red-600 py-2 px-4 rounded-md text-sm text-white hover:bg-red-700"
                    type="button"
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

export default SystemCountries;
