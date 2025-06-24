"use client";
import Loading from "@/app/components/Loading/Loading";
import MainSession from "@/app/components/perfect/main/chat/MainSession";
import SideBar from "@/app/components/perfect/sider/chat/SideBar";
import { getApiUrl } from "@/app/lib/config";
// import type { Message, Chat } from "@/app/types";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

type Message = {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  createdAt: string;
};

type Chat = {
  id: string;
  title: string;
  lastMessage?: string;
  updatedAt: string;
};

const Page = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
 const [messages, setMessages] = useState<Message[]>([]);
const [chatList, setChatList] = useState<Chat[]>([]);

  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const userIdStored = localStorage.getItem("user");

    if (!accessToken || !userIdStored) {
      router.push("/pages/authentication/login");
      return;
    }

    setUserId(userIdStored);

    const checkUserProfileStatus = async () => {
      try {
        const response = await fetch(`${getApiUrl(`/user/${userIdStored}`)}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || `HTTP ${response.status}`);
        }

        const contentType = response.headers.get("Content-Type");
        if (!contentType?.includes("application/json")) {
          throw new Error("Le serveur n'a pas renvoyé de JSON");
        }

        const userData = await response.json();

        if (!userData) {
          throw new Error("Données utilisateur manquantes");
        }

        const isAdmin = userData.role === "ADMIN";
        const isProfileComplete = userData.isProfileComplete;

        if (!isAdmin && !isProfileComplete) {
          setShowProfilePopup(true);
        }
      } catch (error) {
        console.error("Erreur :", error);
        toast.error(error instanceof Error ? error.message : "Erreur inconnue");

        if (error instanceof Error && error.message.includes("401")) {
          router.push("/pages/authentication/login");
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkUserProfileStatus();
  }, [router]);

  const handleNewChat = () => {
    setMessages([]);
    setActiveChatId(null);
  };

  const fetchChatMessages = async (chatId: string) => {
    const token = localStorage.getItem("accessToken");
    const userId = localStorage.getItem("user");

    if (!token || !userId) return;

    try {
      const response = await fetch(`${getApiUrl(`/messages/${chatId}`)}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Erreur lors de la récupération des messages");

      const messages: Message[] = await response.json();
      setMessages(messages);
    } catch (error) {
      console.error("Erreur lors de la récupération des messages :", error);
      toast.error("Erreur lors de la récupération des messages");
    }
  };

  const handleSelectChat = (chatId: string) => {
    setActiveChatId(chatId);
    fetchChatMessages(chatId);
  };

  const fetchUserChats = async () => {
    const token = localStorage.getItem("accessToken");
    const userId = localStorage.getItem("user");

    if (!token || !userId) return;

    try {
      const response = await fetch(`${getApiUrl(`/chats/${userId}`)}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Erreur lors de la récupération des chats");

      const chats: Chat[] = await response.json();
      setChatList(chats);
    } catch (error) {
      console.error("Erreur lors de la récupération des chats :", error);
      toast.error("Erreur lors de la récupération des chats");
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 relative">
      {showProfilePopup && (
        <div className="absolute inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-xl shadow-xl text-center max-w-md w-full">
            <h2 className="text-lg regular mb-4">Profil incomplet</h2>
            <p className="mb-6 regular">
              Votre profil est incomplet. Voulez-vous le compléter maintenant ?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  window.location.href = `/pages/authentication/onboarding/step-one?user=${userId}`;
                }}
                className="bg-blue-600 regular text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Compléter maintenant
              </button>
              <button
                onClick={() => setShowProfilePopup(false)}
                className="bg-orange-500 regular text-white px-4 py-2 rounded-lg transition"
              >
                Continuer plus tard
              </button>
            </div>
          </div>
        </div>
      )}

      <SideBar
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        activeChatId={activeChatId}
        chatList={chatList}
      />
      <div className="flex-1 relative">
        <MainSession
          activeChatId={activeChatId}
          setActiveChatId={setActiveChatId}
          initialMessages={messages}
          fetchUserChats={fetchUserChats}
        />
      </div>
    </div>
  );
};

export default Page;
