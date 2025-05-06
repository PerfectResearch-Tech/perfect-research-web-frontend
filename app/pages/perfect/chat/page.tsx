"use client";
import Loading from "@/app/components/Loading/Loading";
import MainSession from "@/app/components/perfect/main/chat/MainSession";
import SideBar from "@/app/components/perfect/sider/chat/SideBar";
import { getApiUrl } from "@/app/lib/config";
// Page Component (Composant principal de la page)
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const Page = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatList, setChatList] = useState<any[]>([]);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      router.push("/pages/authentication/login");
    } else {
      setIsLoading(false);
    }
  }, [router]);

  const handleNewChat = () => {
    setMessages([]);
    setActiveChatId(null);
  };

  const fetchChatMessages = async (chatId: string) => {
    const token = localStorage.getItem("accessToken");
    const userId = localStorage.getItem("user");

    if (!token || !userId) {
      console.error("Vous devez être connecté pour effectuer cette action.");
      return;
    }

    console.log(chatId);

    try {
      const response = await fetch(`${getApiUrl(`/messages/${chatId}`)}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des messages");
      }

      const messages = await response.json();

      console.log(messages);

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

  // Fonction pour récupérer les chats de l'utilisateur
  const fetchUserChats = async () => {
    const token = localStorage.getItem("accessToken");
    const userId = localStorage.getItem("user");

    if (!token || !userId) {
      console.error("Vous devez être connecté pour effectuer cette action.");
      return;
    }

    try {
      const response = await fetch(`${getApiUrl(`/chats/${userId}`)}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des chats");
      }

      const chats = await response.json();
      setChatList(chats);
    } catch (error) {
      console.error("Erreur lors de la récupération des chats :", error);
      toast.error("Erreur lors de la récupération des chats");
    }
  };

  if (isLoading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
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

// "use client";
// import Loading from "@/app/components/Loading/Loading";
// import MainSession from "@/app/components/perfect/main/chat/MainSession";
// import SideBar from "@/app/components/perfect/sider/chat/SideBar";
// import { useRouter } from "next/navigation";
// import React, { useEffect, useState } from "react";

// const page = () => {
//   const router = useRouter();
//   const [isLoading, setIsLoading] = useState(true); // Pour gérer le chargement initial

//   useEffect(() => {
//     // Vérifie si l'utilisateur est connecté (par exemple, via un token dans localStorage)
//     const accessToken = localStorage.getItem("accessToken");

//     if (!accessToken) {
//       // Redirige vers la page de connexion si pas de token
//       router.push("/pages/authentication/login");
//     } else {
//       // Si connecté, termine le chargement
//       setIsLoading(false);
//     }
//   }, [router]); // Dépendance sur router pour éviter des boucles infinies

//   if (isLoading) {
//     return (
//       <div>
//         <Loading />
//       </div>
//     ); // Affiche un loader pendant la vérification
//   }
//   return (
//     <div className="flex min-h-screen">
//       <SideBar />
//       <div className="main flex-1 p-6">
//         <MainSession />
//       </div>
//     </div>

//     <main className="flex h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
//       <SideBar />
//       <div className="flex-1">
//         <MainSession />
//       </div>
//     </main>
//   );
// };

// export default page;
