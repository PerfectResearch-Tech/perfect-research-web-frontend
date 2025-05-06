import Loading from "@/app/components/Loading/Loading";
import { getApiUrl } from "@/app/lib/config";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";

const SystemCountries = ({
  id,
  name,
  fetchData,
}: {
  id: string;
  name: string;
  fetchData: any;
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(""); // Variable pour l'élément à éditer
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  // Ouvrir la modale d'édition
  const openEditModal = (item: any) => {
    setItemToEdit(item);
    setIsEditModalOpen(true);
  };

  useEffect(() => {
    setNewName(name);
    // console.log(name);
  }, [name]);

  // Fermer la modale d'édition
  const closeEditModal = () => setIsEditModalOpen(false);

  // Ouvrir la modale de suppression
  const openDeleteModal = () => setIsDeleteModalOpen(true);

  // Fermer la modale de suppression
  const closeDeleteModal = () => setIsDeleteModalOpen(false);

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      setError("Vous devez être connecté pour effectuer cette action.");
      return;
    }

    // const apiUrl = `http://192.168.1.205:3001/admin/country/${id}`;
    const apiUrl = `${getApiUrl("/admin/country")}/${id}`;

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
          errorData.message || "Erreur lors de la suppression du Pays"
        );
      }

      // console.log("Pays supprimée avec succès !");
      toast.success("Pays supprimée avec succès !");

      // Réinitialiser l'état d'erreur après une suppression réussie
      setError("");
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
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

  const handleUpdate = async (id: string, newName: string) => {
    setIsLoading(true);
    const token = localStorage.getItem("accessToken");

    if (!token) {
      setError("Vous devez être connecté pour effectuer cette action.");
      return;
    }

    if (!newName) {
      toast.error("Veuillez renseigner le nom du pays.");
      setIsLoading(false);
      return;
    }

    // const apiUrl = `http://192.168.1.205:3001/admin/country/${id}`;
    const apiUrl = `${getApiUrl("/admin/country")}/${id}`;

    try {
      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newName }), // Envoie la nouvelle année dans le corps de la requête
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Erreur lors de la mise à jour du pays"
        );
      }

      console.log(response);

      // console.log("Pays modifiée avec succès !");
      toast.success("Pays modifiée avec succès !");

      // Réinitialiser l'état d'erreur après une modification réussie
      setError("");
    } catch (error) {
      // console.error("Erreur lors de la modification :", error);
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

  return (
    <div>
      {isLoading ? (
        <Loading />
      ) : (
        <div>
          <Toaster richColors position="top-right" />

          <div>
            {/* <br />
            {error && <p className="text-red-500 text-center">{error}</p>}
            <br /> */}
            <div>
              {/* Contenu principal pour Togo */}
              <div className="flex flex-row justify-between py-2">
                {/* <p>{name}</p> */}

                <div className="flex flex-row gap-8">
                  <button onClick={() => openEditModal("Togo")}>
                    <Image
                      src={"/assets/icons/editer.png"}
                      alt="editer"
                      height={20}
                      width={20}
                    />
                  </button>
                  <button onClick={openDeleteModal}>
                    <Image
                      src={"/assets/icons/supprimer.png"}
                      alt="supprimer"
                      height={20}
                      width={20}
                    />
                  </button>
                </div>
              </div>

              {/* Modale d'édition */}
              {isEditModalOpen && (
                <div
                  onClick={closeEditModal}
                  className="pointer-events-auto fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 opacity-100 backdrop-blur-sm transition-opacity duration-300"
                >
                  <div
                    onClick={(e) => e.stopPropagation()} // Pour éviter la fermeture en cliquant à l'intérieur
                    className="relative m-4 p-4 w-2/5 min-w-[40%] max-w-[40%] rounded-lg bg-white shadow-sm"
                  >
                    <h3 className="text-xl font-medium text-slate-800 pb-4">
                      Éditer l'élément : {itemToEdit}
                    </h3>
                    <input
                      onChange={(e) => setNewName(e.target.value)}
                      type="text"
                      className="w-full p-4 border"
                      placeholder={`Modifier ${itemToEdit}`}
                      value={newName}
                    />
                    <div className="flex shrink-0 flex-wrap items-center pt-4 justify-end">
                      <button
                        onClick={closeEditModal}
                        className="rounded-md border border-transparent py-2 px-4 text-center text-sm transition-all text-slate-600 hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100"
                        type="button"
                      >
                        Annuler
                      </button>
                      <button
                        onClick={() => handleUpdate(id, newName)}
                        className="rounded-md btn btn-primary py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-green-700 focus:shadow-none active:bg-green-700"
                        type="button"
                      >
                        Sauvegarder
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Modale de suppression */}
              {isDeleteModalOpen && (
                <div
                  onClick={closeDeleteModal}
                  className="pointer-events-auto fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 opacity-100 backdrop-blur-sm transition-opacity duration-300"
                >
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="relative m-4 p-4 w-2/5 min-w-[40%] max-w-[40%] rounded-lg bg-white shadow-sm"
                  >
                    <h3 className="text-xl font-medium text-slate-800 pb-4">
                      Êtes-vous sûr de vouloir supprimer cet élément ?
                    </h3>
                    <div className="flex shrink-0 flex-wrap items-center pt-4 justify-end">
                      <button
                        onClick={closeDeleteModal}
                        className="rounded-md border border-transparent py-2 px-4 text-center text-sm transition-all text-slate-600 hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100"
                        type="button"
                      >
                        Annuler
                      </button>
                      <button
                        onClick={() => handleDelete(id)}
                        className="rounded-md bg-red-600 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-red-700 focus:shadow-none active:bg-red-700"
                        type="button"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemCountries;
