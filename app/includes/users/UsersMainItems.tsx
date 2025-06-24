import { getApiUrl } from "@/app/lib/config";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

type User = {
  id: string;
  username: string;
  role: "STUDENT" | "RESEARCHER" | "GUEST" | string;
  active: boolean;
};

type UsersMainProps = {
  data: User;
  fetchData: () => Promise<void>;
};

const UsersMain = ({ data, fetchData }: UsersMainProps) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [newRole, setNewRole] = useState("");

  // Fermer la modale d'édition
  const closeEditModal = () => setIsEditModalOpen(false);

  // Ouvrir la modale de suppression
  const openDeleteModal = () => {
    setIsActive(data.active);
    setIsDeleteModalOpen(true);
  };

  // Fermer la modale de suppression
  const closeDeleteModal = () => setIsDeleteModalOpen(false);

  const openEditModal = () => {
    setNewUserName(data.username);
    setNewRole(data.role);
    setIsActive(data.active);
    setIsEditModalOpen(true);
  };

  useEffect(() => {
    setNewUserName(data.username);
    setNewRole(data.role);
  }, [data]);

  const handleDelete = async (id: string, isActive: boolean) => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    const apiUrl = `${getApiUrl(`/admin/${id}/toggle-block`)}`;

    try {
      const response = await fetch(apiUrl, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, active: isActive }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de l'opération");
      }

      toast.success(
        `Utilisateur ${isActive ? "activé" : "bloqué"} avec succès !`
      );
    } catch (err) {
      toast.error("Une erreur est survenue lors de la modification");
      console.error(err);
    } finally {
      setIsLoading(false);
      fetchData();
      closeDeleteModal();
    }
  };

  const handleUpdate = async (
    id: string,
    newUserName: string,
    newRole: string
  ) => {
    setIsLoading(true);
    const token = localStorage.getItem("accessToken");

    if (!token) return;

    if (!newUserName) {
      toast.error("Veuillez renseigner le nom de l'utilisateur.");
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
        body: JSON.stringify({ id, username: newUserName, role: newRole }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de la mise à jour");
      }

      toast.success("Utilisateur modifié avec succès");
    } catch {
      toast.error("Une erreur est survenue lors de la modification");
    } finally {
      setIsLoading(false);
      fetchData();
      closeEditModal();
    }
  };

  return (
    <div className="flex flex-row gap-8">
      <button
        onClick={openEditModal}
        aria-label="Modifier l'utilisateur"
        title="Modifier l'utilisateur"
      >
        <Image
          src="/assets/icons/editer.png"
          alt="Modifier"
          height={20}
          width={20}
        />
      </button>

      <button
        onClick={openDeleteModal}
        aria-label="Supprimer l'utilisateur"
        title="Supprimer l'utilisateur"
      >
        <Image
          src="/assets/icons/supprimer.png"
          alt="Supprimer"
          height={20}
          width={20}
        />
      </button>

      {/* Modale d'édition */}
      {isEditModalOpen && (
        <div
          onClick={closeEditModal}
          className="pointer-events-auto fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative m-4 p-4 w-2/5 min-w-[40%] max-w-[40%] rounded-lg bg-white shadow-sm"
          >
            <h3 className="text-xl font-medium text-slate-800 pb-4">
              Modifier l&apos;utilisateur : {newUserName}
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
            aria-label="Rôle de l'utilisateur"
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
            <div className="flex justify-end gap-2 pt-4">
              <button
                onClick={closeEditModal}
                className="rounded-md py-2 px-4 text-sm text-slate-600 hover:bg-slate-100"
              >
                Annuler
              </button>
              <button
                onClick={() => handleUpdate(data.id, newUserName, newRole)}
                className="btn btn-primary py-2 px-4 text-sm text-white"
                disabled={isLoading}
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
          className="pointer-events-auto fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative m-4 p-4 w-2/5 min-w-[40%] max-w-[40%] rounded-lg bg-white shadow-sm"
          >
            <h3 className="text-xl font-medium text-slate-800 pb-4">
              {isActive
                ? "Bloquer l&apos;utilisateur"
                : "Activer l&apos;utilisateur"}
            </h3>
            <br />
            <select
            aria-label="etat"
              onChange={(e) => setIsActive(e.target.value === "true")}
              value={isActive.toString()}
              className="w-full p-4 border"
            >
              <option value="true">Activé</option>
              <option value="false">Bloqué</option>
            </select>
            <br />
            <br />
            <div className="flex justify-end gap-2 pt-4">
              <button
                onClick={closeDeleteModal}
                className="rounded-md py-2 px-4 text-sm text-slate-600 hover:bg-slate-100"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDelete(data.id, isActive)}
                className="btn btn-primary py-2 px-4 text-sm text-white"
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
