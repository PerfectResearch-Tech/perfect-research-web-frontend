import DataTable from "@/app/components/admin/DataTable/DataTable";
import { getApiUrl } from "@/app/lib/config";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import { toast } from "sonner";

const UsersMain = ({ data, fetchData }: { data: any; fetchData: any }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isActive, setIsActive] = useState<boolean>(true); // Par défaut à "true" (Actif)
  const [newRole, setNewRole] = useState("");
  const [error, setError] = useState("");

  // Fermer la modale d'édition
  const closeEditModal = () => setIsEditModalOpen(false);

  // Ouvrir la modale de suppression
  const openDeleteModal = () => {
    setIsActive(data.active);
    setIsDeleteModalOpen(true);
  };

  // Fermer la modale de suppression
  const closeDeleteModal = () => setIsDeleteModalOpen(false);

  const openEditModal = (item: any) => {
    setNewUserName(data.username);
    setNewRole(data.role);
    setIsActive(data.active);
    setIsEditModalOpen(true);
  };

  useEffect(() => {
    setNewUserName(data.username);
    // console.log(name);
  }, [data]);

  const handleDelete = async (id: string, isActive: boolean) => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      setError("Vous devez être connecté pour effectuer cette action.");
      return;
    }

    const apiUrl = `${getApiUrl(`/admin/${id}/toggle-block`)}`;

    try {
      const response = await fetch(apiUrl, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: id,
          active: isActive,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Erreur lors de la mise à jour de l'Utiisateur"
        );
      }

      toast.success(
        `Utilisateur ${isActive ? "activé" : "bloqué"} avec succès !`
      );

      console.log(response);
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

    closeDeleteModal();
  };

  const handleUpdate = async (
    id: string,
    newUserName: string,
    newRole: string
  ) => {
    setIsLoading(true);
    const token = localStorage.getItem("accessToken");

    if (!token) {
      setError("Vous devez être connecté pour effectuer cette action.");
      return;
    }

    if (!newUserName) {
      toast.error("Veuillez renseigner le nom du pays.");
      setIsLoading(false);
      return;
    }

    const apiUrl = `${getApiUrl("/admin/update-role")}/${id}`;

    try {
      const response = await fetch(apiUrl, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: id,
          username: newUserName,
          role: newRole,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Erreur lors de la mise à jour de l'Utiisateur"
        );
      }

      toast.success("Utilisateur modifié avec succès");

      console.log(response);
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
    <div className="flex flex-row gap-8">
      <button onClick={() => openEditModal({ newUserName, newRole })}>
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
      {/* 
      <button height={20} width={20}>
        <FaEye className="text-blue-600" />
      </button> */}

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
              Éditer l'utilisateur : {newUserName}
            </h3>
            <input
              onChange={(e) => setNewUserName(e.target.value)}
              type="text"
              className="w-full p-4 border"
              placeholder={`Modifier ${newUserName}`}
              value={newUserName}
            />

            <br />

            <br />
            <select
              onChange={(e) => setNewRole(e.target.value)}
              value={newRole}
              className="w-full p-4 border"
            >
              <option value={newRole}>
                {newRole === "STUDENT"
                  ? "Étudiant"
                  : newRole === "RESEARCHER"
                  ? "Chercheur"
                  : newRole === "GUEST"
                  ? "Invité"
                  : newRole}
              </option>
              {newRole !== "STUDENT" && (
                <option value="STUDENT">Étudiant</option>
              )}
              {newRole !== "RESEARCHER" && (
                <option value="RESEARCHER">Chercheur</option>
              )}
              {newRole !== "GUEST" && <option value="GUEST">Invité</option>}
            </select>
            <br />

            <br />

            <div className="flex shrink-0 flex-wrap items-center pt-4 justify-end">
              <button
                onClick={closeEditModal}
                className="rounded-md border border-transparent py-2 px-4 text-center text-sm transition-all text-slate-600 hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100"
                type="button"
              >
                Annuler
              </button>
              <button
                onClick={() => handleUpdate(data.id, newUserName, newRole)}
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
              {isActive ? "Bloquer l'utilisateur" : "Activer l'utilisateur"}
            </h3>
            <br />
            <select
              onChange={(e) => setIsActive(e.target.value === "true")}
              value={isActive.toString()}
              className="w-full p-4 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            >
              <option value="true">Activé</option>
              <option value="false">Bloqué</option>
            </select>
            <br />
            <br />

            <div className="flex shrink-0 flex-wrap items-center pt-4 justify-end">
              <button
                onClick={closeDeleteModal}
                className="rounded-md border border-transparent py-2 px-4 text-center text-sm transition-all text-slate-600 hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100"
                type="button"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDelete(data.id, isActive)}
                className="btn btn-primary"
                type="button"
              >
                Appliquer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersMain;
