
"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { FaComment, FaPaperPlane, FaMicrophone, FaGlobe, FaCopy } from "react-icons/fa";
import { toast } from "sonner";
import { CircleUserRound, Copy } from "lucide-react";
import { getApiUrl } from "@/app/lib/config";
import { v4 as uuidv4 } from "uuid";
import io, { Socket } from "socket.io-client";
import { Message } from "@/app/types";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";

interface MainSessionProps {
  activeChatId: string | null;
  setActiveChatId: (id: string | null) => void;
  initialMessages: Message[];
  fetchUserChats: () => void;
}

interface ProfilDropdownProps {
  isProfileOpen: boolean;
  setIsProfileOpen: (value: boolean) => void;
  username: string;
  email: string;
  handleLogout: () => void;
}

const ChatLoading = () => (
  <div className="animate-pulse">
    <div className="w-3 h-3 bg-gray-400 rounded-full inline-block mr-1"></div>
    <div className="w-3 h-3 bg-gray-400 rounded-full inline-block mr-1"></div>
    <div className="w-3 h-3 bg-gray-400 rounded-full inline-block"></div>
  </div>
);

const ProfilDropdown = ({
  isProfileOpen,
  setIsProfileOpen,
  username,
  email,
  handleLogout,
}: ProfilDropdownProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };

    if (isProfileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileOpen, setIsProfileOpen]);

  return (
    isProfileOpen && (
      <div
        ref={dropdownRef}
        className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-50 border border-gray-200"
      >
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-medium text-gray-900">Mon Profil</h3>
        </div>
        <div className="p-4">
          <div className="mb-3">
            <p className="text-sm text-gray-500">Nom d'utilisateur</p>
            <p className="font-medium">{username || "Chargement..."}</p>
          </div>
          <div className="mb-4">
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium">{email || "Chargement..."}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Déconnexion
          </button>
        </div>
      </div>
    )
  );
};

const MainSession = ({
  activeChatId,
  setActiveChatId,
  initialMessages,
  fetchUserChats,
}: MainSessionProps) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [companyId, setCompanyId] = useState("");
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const tempMessageIds = useRef<Set<string>>(new Set());

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const copyToClipboard = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast.success("Message copié dans le presse-papiers !");
    } catch (error) {
      console.error("[ERREUR] Échec de la copie :", error);
      toast.error("Échec de la copie du message");
    }
  };

  useEffect(() => {
    console.log("[DEBUG] État messages mis à jour :", messages);
    const messageIds = messages.map((m) => m.id);
    const uniqueIds = new Set(messageIds);
    if (uniqueIds.size !== messageIds.length) {
      console.warn(
        "[AVERTISSEMENT] Doublons détectés dans messages :",
        messageIds
      );
      const uniqueMessages = Array.from(
        new Map(messages.map((m) => [m.id, m])).values()
      );
      setMessages(uniqueMessages);
    }
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const fetchUser = async () => {
    const token = localStorage.getItem("accessToken");
    const userId = localStorage.getItem("user");

    if (!token || !userId) {
      console.error("Vous devez être connecté pour effectuer cette action.");
      return;
    }

    try {
      const response = await fetch(
        `${getApiUrl(`/user/connected/${userId}`)}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok)
        throw new Error("Erreur lors de la récupération de l'utilisateur");

      const user = await response.json();
      setUsername(user.username);
      setEmail(user.email);
      if (user.companyId) {
        setCompanyId(user.companyId);
        console.log("[DEBUG] companyId récupéré:", user.companyId);
      } else {
        setCompanyId("cmbjatwo90000k8hk297pykwi");
      }
    } catch (error) {
      console.error("Erreur lors de la récupération :", error);
      toast.error("Erreur lors de la récupération");
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    socketRef.current = io(getApiUrl(""), {
      auth: { token: `Bearer ${token}` },
    });

    socketRef.current.on("connect", () => {
      console.log("[DEBUG] Connecté au WebSocket:", socketRef.current?.id);
      if (activeChatId) {
        socketRef.current?.emit("joinChat", activeChatId);
        console.log("[DEBUG] Rejoint le chat:", activeChatId);
      }
    });

    socketRef.current.on("messageUpdate", (message: Message) => {
      console.log("[DEBUG] Message WebSocket reçu (messageUpdate):", message);
      setMessages((prev) => {
        const filtered = prev.filter((m) => !tempMessageIds.current.has(m.id));
        const exists = filtered.some((m) => m.id === message.id);
        if (exists) {
          console.log("[DEBUG] Mise à jour message existant:", message.id);
          return filtered.map((m) =>
            m.id === message.id
              ? {
                  id: message.id,
                  chatId: message.chatId,
                  content: message.content,
                  sender: message.sender,
                  createdAt: new Date(
                    message.createdAt || Date.now()
                  ).toISOString(),
                  updatedAt: message.updatedAt
                    ? new Date(message.updatedAt).toISOString()
                    : new Date(message.createdAt || Date.now()).toISOString(),
                }
              : m
          );
        }
        console.log("[DEBUG] Ajout nouveau message:", message.id);
        if (filtered.some((m) => m.id === message.id)) {
          console.warn(
            "[AVERTISSEMENT] Tentative d'ajout d'un message avec ID existant:",
            message.id
          );
          return filtered;
        }
        return [
          ...filtered,
          {
            id: message.id,
            chatId: message.chatId,
            content: message.content,
            sender: message.sender,
            createdAt: new Date(message.createdAt || Date.now()).toISOString(),
            updatedAt: message.updatedAt
              ? new Date(message.updatedAt).toISOString()
              : new Date(message.createdAt || Date.now()).toISOString(),
          },
        ];
      });
      setIsAiTyping(message.sender === "RAG" && message.content === "");
    });

    socketRef.current.on(
      "messageChunk",
      ({ messageId, chunk }: { messageId: string; chunk: string }) => {
        console.log("[DEBUG] Chunk WebSocket reçu:", { messageId, chunk });
        setMessages((prev) => {
          const filtered = prev.filter(
            (m) => !tempMessageIds.current.has(m.id)
          );
          const index = filtered.findIndex((m) => m.id === messageId);
          if (index !== -1) {
            console.log("[DEBUG] Mise à jour chunk pour message:", messageId);
            return filtered.map((m, i) =>
              i === index
                ? {
                    ...m,
                    content: m.content + chunk,
                    updatedAt: new Date().toISOString(),
                  }
                : m
            );
          }
          console.log(
            "[DEBUG] Création nouveau message pour chunk:",
            messageId
          );
          if (filtered.some((m) => m.id === messageId)) {
            console.warn(
              "[AVERTISSEMENT] Tentative d'ajout d'un chunk avec ID existant:",
              messageId
            );
            return filtered;
          }
          return [
            ...filtered,
            {
              id: messageId,
              chatId: activeChatId || "",
              content: chunk,
              sender: "RAG",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ];
        });
        setIsAiTyping(true);
      }
    );

    socketRef.current.on(
      "streamEnd",
      ({ messageId, message }: { messageId: string; message: Message }) => {
        console.log("[DEBUG] Stream terminé (streamEnd):", {
          messageId,
          message,
        });
        setMessages((prev) => {
          const filtered = prev.filter(
            (m) => !tempMessageIds.current.has(m.id)
          );
          tempMessageIds.current.delete(messageId);
          const exists = filtered.some((m) => m.id === messageId);
          if (exists) {
            console.log(
              "[DEBUG] Mise à jour message existant (streamEnd):",
              messageId
            );
            return filtered.map((m) =>
              m.id === messageId
                ? {
                    id: message.id,
                    chatId: message.chatId,
                    content: message.content,
                    sender: message.sender,
                    createdAt: new Date(
                      message.createdAt || Date.now()
                    ).toISOString(),
                    updatedAt: message.updatedAt
                      ? new Date(message.updatedAt).toISOString()
                      : new Date(message.createdAt || Date.now()).toISOString(),
                  }
                : m
            );
          }
          console.log("[DEBUG] Ajout message final (streamEnd):", messageId);
          if (filtered.some((m) => m.id === message.id)) {
            console.warn(
              "[AVERTISSEMENT] Tentative d'ajout d'un message final avec ID existant:",
              message.id
            );
            return filtered;
          }
          return [
            ...filtered,
            {
              id: message.id,
              chatId: message.chatId,
              content: message.content,
              sender: message.sender,
              createdAt: new Date(
                message.createdAt || Date.now()
              ).toISOString(),
              updatedAt: message.updatedAt
                ? new Date(message.updatedAt).toISOString()
                : new Date(message.createdAt || Date.now()).toISOString(),
            },
          ];
        });
        setIsAiTyping(false);
      }
    );

    socketRef.current.on(
      "streamError",
      ({ messageId, error }: { messageId: string; error: string }) => {
        console.error("[ERREUR] Erreur WebSocket (streamError):", error);
        toast.error(error || "Erreur lors de la génération de la réponse");
        setMessages((prev) => {
          const filtered = prev.filter(
            (m) => !tempMessageIds.current.has(m.id)
          );
          tempMessageIds.current.delete(messageId);
          const index = filtered.findIndex((m) => m.id === messageId);
          if (index !== -1) {
            return filtered.map((m, i) =>
              i === index
                ? {
                    ...m,
                    content: "Erreur : impossible de générer la réponse.",
                    updatedAt: new Date().toISOString(),
                  }
                : m
            );
          }
          return filtered;
        });
        setIsAiTyping(false);
      }
    );

    socketRef.current.on("disconnect", () => {
      console.log("[DEBUG] Déconnecté du WebSocket");
    });

    socketRef.current.on("connect_error", (error) => {
      console.error("[ERREUR] Erreur de connexion WebSocket:", error);
      toast.error("Erreur de connexion au WebSocket");
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [activeChatId]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("user");
    window.location.href = "/pages/authentication/login";
  };

  const sendMessageToBackend = async (
    messageContent: string,
    tempId: string
  ) => {
    console.log(
      "[DEBUG] Début de sendMessageToBackend - Message:",
      messageContent,
      "TempId:",
      tempId
    );

    const userId = localStorage.getItem("user");
    const token = localStorage.getItem("accessToken");
    if (!userId || !token) {
      console.error("[ERREUR] Identifiants manquants dans le localStorage");
      toast.error("Session expirée, veuillez vous reconnecter");
      handleLogout();
      return null;
    }

    if (activeChatId) {
      const body = JSON.stringify({
        chatId: activeChatId,
        sender: "USER",
        content: messageContent,
        metadata: {},
      });

      console.log("[DEBUG] Configuration requête /messages:", {
        url: `/messages?companyId=${companyId}`,
        method: "POST",
        body: JSON.parse(body),
      });

      try {
        const response = await fetch(
          `${getApiUrl("/messages")}?companyId=${companyId}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body,
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error(
            "[ERREUR] Requête /messages échouée:",
            response.status,
            errorText
          );
          throw new Error(`Erreur HTTP: ${response.status} - ${errorText}`);
        }

        const responseData = await response.json();
        console.log("[DEBUG] Réponse /messages:", {
          userMessageId: responseData.userMessage.id,
          aiMessageId: responseData.aiMessage.id,
          areIdsDifferent:
            responseData.userMessage.id !== responseData.aiMessage.id,
          allMessages: responseData.allMessages?.map((msg: any) => msg.id),
        });

        if (responseData.userMessage.id === responseData.aiMessage.id) {
          console.error(
            "[ERREUR] Les ID de userMessage et aiMessage sont identiques"
          );
          throw new Error("Les ID renvoyés par le backend ne sont pas uniques");
        }

        if (
          responseData.allMessages &&
          Array.isArray(responseData.allMessages)
        ) {
          setMessages((prev) => {
            const filtered = prev.filter((m) => m.id !== tempId);
            tempMessageIds.current.delete(tempId);
            console.log(
              "[DEBUG] Messages après suppression temporaire:",
              filtered
            );

            const newMessages = responseData.allMessages.map((msg: any) => ({
              id: msg.id,
              chatId: msg.chatId,
              content: msg.content,
              sender: msg.sender,
              createdAt: new Date(msg.createdAt).toISOString(),
              updatedAt: msg.updatedAt
                ? new Date(msg.updatedAt).toISOString()
                : new Date(msg.createdAt).toISOString(),
            }));

            console.log(
              "[DEBUG] Synchronisation avec allMessages:",
              newMessages
            );
            return newMessages;
          });
        } else {
          console.warn(
            "[AVERTISSEMENT] allMessages non fourni, utilisation de userMessage et aiMessage"
          );
          setMessages((prev) => {
            const filtered = prev.filter((m) => m.id !== tempId);
            tempMessageIds.current.delete(tempId);
            console.log(
              "[DEBUG] Messages après suppression temporaire:",
              filtered
            );

            const existingIds = new Set(filtered.map((m) => m.id));
            const newMessages = [];

            if (!existingIds.has(responseData.userMessage.id)) {
              newMessages.push({
                id: responseData.userMessage.id,
                chatId: responseData.userMessage.chatId,
                content: responseData.userMessage.content,
                sender: responseData.userMessage.sender,
                createdAt: new Date(
                  responseData.userMessage.createdAt
                ).toISOString(),
                updatedAt: responseData.userMessage.updatedAt
                  ? new Date(responseData.userMessage.updatedAt).toISOString()
                  : new Date(responseData.userMessage.createdAt).toISOString(),
              });
            } else {
              console.warn(
                "[AVERTISSEMENT] userMessage.id déjà présent:",
                responseData.userMessage.id
              );
            }

            if (!existingIds.has(responseData.aiMessage.id)) {
              newMessages.push({
                id: responseData.aiMessage.id,
                chatId: responseData.aiMessage.chatId,
                content: responseData.aiMessage.content,
                sender: responseData.aiMessage.sender,
                createdAt: new Date(
                  responseData.aiMessage.createdAt
                ).toISOString(),
                updatedAt: responseData.aiMessage.updatedAt
                  ? new Date(responseData.aiMessage.updatedAt).toISOString()
                  : new Date(responseData.aiMessage.createdAt).toISOString(),
              });
            } else {
              console.warn(
                "[AVERTISSEMENT] aiMessage.id déjà présent:",
                responseData.aiMessage.id
              );
            }

            return [...filtered, ...newMessages];
          });
        }

        fetchUserChats();
        return responseData;
      } catch (error) {
        console.error("[ERREUR] sendMessageToBackend /messages:", error);
        toast.error(
          error instanceof Error
            ? error.message
            : "Erreur lors de l'envoi du message"
        );
        setMessages((prev) => {
          const filtered = prev.filter((m) => m.id !== tempId);
          tempMessageIds.current.delete(tempId);
          console.log("[DEBUG] Messages après erreur /messages:", filtered);
          return filtered;
        });
        return null;
      }
    } else {
      const body = JSON.stringify({
        userId,
        question: messageContent,
        companyId,
      });

      console.log("[DEBUG] Configuration requête /chats:", {
        url: "/chats",
        method: "POST",
        body: JSON.parse(body),
      });

      try {
        const response = await fetch(getApiUrl("/chats"), {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body,
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(
            "[ERREUR] Requête /chats échouée:",
            response.status,
            errorText
          );
          throw new Error(`Erreur HTTP: ${response.status} - ${errorText}`);
        }

        const responseData = await response.json();
        console.log("[DEBUG] Réponse /chats:", responseData);

        if (responseData.chatResponse?.id) {
          console.log(
            "[DEBUG] Nouveau chat créé, ID:",
            responseData.chatResponse.id
          );
          setActiveChatId(responseData.chatResponse.id);
          socketRef.current?.emit("joinChat", responseData.chatResponse.id);
          console.log(
            "[DEBUG] Rejoint le chat via WebSocket:",
            responseData.chatResponse.id
          );
          setMessages((prev) => {
            const filtered = prev.filter((m) => m.id !== tempId);
            tempMessageIds.current.delete(tempId);
            console.log(
              "[DEBUG] Messages après suppression temporaire:",
              filtered
            );
            return filtered;
          });
          setMessages(
            responseData.chatResponse.messages.map((msg: any) => ({
              id: msg.id,
              chatId: msg.chatId,
              content: msg.content,
              sender: msg.sender,
              createdAt: new Date(msg.createdAt).toISOString(),
              updatedAt: msg.updatedAt
                ? new Date(msg.updatedAt).toISOString()
                : new Date(msg.createdAt).toISOString(),
            }))
          );
        }

        fetchUserChats();
        return responseData.chatResponse;
      } catch (error) {
        console.error("[ERREUR] sendMessageToBackend /chats:", error);
        toast.error(
          error instanceof Error
            ? error.message
            : "Erreur lors de l'envoi du message"
        );
        setMessages((prev) => {
          const filtered = prev.filter((m) => m.id !== tempId);
          tempMessageIds.current.delete(tempId);
          console.log("[DEBUG] Messages après erreur /chats:", filtered);
          return filtered;
        });
        return null;
      }
    }
  };

  const fetchChatMessages = async (chatId: string) => {
    const token = localStorage.getItem("accessToken");
    const userId = localStorage.getItem("user");

    if (!token || !userId) {
      console.error("Vous devez être connecté pour effectuer cette action.");
      toast.error("Session expirée, veuillez vous reconnecter");
      handleLogout();
      return;
    }

    try {
      const response = await fetch(`${getApiUrl(`/messages/chat/${chatId}`)}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          "[ERREUR] fetchChatMessages échoué:",
          response.status,
          errorText
        );
        throw new Error(`Erreur HTTP: ${response.status} - ${errorText}`);
      }

      const messages = await response.json();
      console.log(
        "[DEBUG] Messages récupérés via fetchChatMessages :",
        messages
      );

      if (!Array.isArray(messages)) {
        console.warn(
          "[AVERTISSEMENT] Aucun message trouvé pour chatId:",
          chatId
        );
        setMessages([]);
        return;
      }

      const newMessages = messages.map((msg: any) => ({
        id: msg.id,
        chatId: msg.chatId,
        content: msg.content,
        sender: msg.sender,
        createdAt: new Date(msg.createdAt).toISOString(),
        updatedAt: msg.updatedAt
          ? new Date(msg.updatedAt).toISOString()
          : new Date(msg.createdAt).toISOString(),
      }));
      setMessages(newMessages);
      console.log(
        "[DEBUG] Messages mis à jour via fetchChatMessages:",
        newMessages
      );
    } catch (error) {
      console.error("[ERREUR] fetchChatMessages:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Erreur lors de la récupération des messages"
      );
      setMessages([]);
    }
  };

  useEffect(() => {
    console.log("[DEBUG] activeChatId changé :", activeChatId);
    if (activeChatId) {
      fetchChatMessages(activeChatId);
      socketRef.current?.emit("joinChat", activeChatId);
      console.log("[DEBUG] Rejoint le chat:", activeChatId);
    } else {
      setMessages([]);
    }
  }, [activeChatId]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isSending) return;

    setIsSending(true);
    const tempId = uuidv4();
    tempMessageIds.current.add(tempId);
    const userMessage: Message = {
      id: tempId,
      chatId: activeChatId || null,
      content: inputValue.trim(),
      sender: "USER",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log("[DEBUG] Ajout message utilisateur temporaire :", {
      tempId,
      userMessage,
    });
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsAiTyping(true);

    const typingTimeout = setTimeout(() => {
      setIsAiTyping(false);
      toast.error("Aucune réponse reçue du serveur après 30 secondes");
      setMessages((prev) => {
        const filtered = prev.filter((m) => m.id !== tempId);
        tempMessageIds.current.delete(tempId);
        console.log("[DEBUG] Messages après timeout:", filtered);
        return filtered;
      });
      setIsSending(false);
    }, 30000);

    try {
      const response = await sendMessageToBackend(inputValue.trim(), tempId);
      if (response) {
        clearTimeout(typingTimeout);
        console.log(
          "[DEBUG] Réponse reçue, messages temporaires nettoyés pour tempId:",
          tempId
        );
      }
    } catch (error) {
      console.error("[ERREUR] handleSendMessage :", error);
      toast.error("Erreur de communication avec le serveur");
      clearTimeout(typingTimeout);
      setIsAiTyping(false);
      setMessages((prev) => {
        const filtered = prev.filter((m) => m.id !== tempId);
        tempMessageIds.current.delete(tempId);
        console.log(
          "[DEBUG] Messages après erreur handleSendMessage:",
          filtered
        );
        return filtered;
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      setInputValue((prev) => prev + " [Message vocal transcrit]");
    } else {
      setIsRecording(true);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button className="md:hidden p-2 rounded-full hover:bg-gray-100">
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <h4 className="font-tertiary text-xl  text-gray-800">
            Perfect Chat
          </h4>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="p-2 rounded-full hover:bg-gray-100"
            aria-label="Ouvrir le menu profil"
          >
            <CircleUserRound className="text-gray-700" size={25} />
          </button>

          <ProfilDropdown
            isProfileOpen={isProfileOpen}
            setIsProfileOpen={setIsProfileOpen}
            username={username}
            email={email}
            handleLogout={handleLogout}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:px-6">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center">
            <div className="max-w-md text-center space-y-4">
              <div className="mb-4">
                <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                  <FaComment size={28} className="text-blue-500" />
                </div>
              </div>
              <h2 className="righteous text-2xl font-bold text-gray-800">
                Salut, je suis Perfect Chat
              </h2>
              <p className="text-gray-600">
                Comment puis-je vous aider aujourd'hui ? <br />
                Posez-moi une question sur votre recherche ou mémoire.
              </p>
            </div>
            </div>
          ) : (
            <div className="space-y-6 pt-4 pb-20">
              {messages.map((message) => {
                console.log("[DEBUG] Rendu message :", message);
                return (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender === "USER" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`relative max-w-[70%] rounded-2xl px-4 py-3 ${
                        message.sender === "USER"
                          ? "bg-blue-100 text-black "
                          : ""
                      }`}
                    >
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeSanitize]}
                        components={{
                          h3: ({ node, ...props }) => (
                            <h3 className="text-lg font-semibold mt-2 mb-1" {...props} />
                          ),
                          strong: ({ node, ...props }) => (
                            <strong className="font-bold" {...props} />
                          ),
                          em: ({ node, ...props }) => (
                            <em className="italic" {...props} />
                          ),
                          ul: ({ node, ...props }) => (
                            <ul className="list-disc pl-5 my-2" {...props} />
                          ),
                          ol: ({ node, ...props }) => (
                            <ol className="list-decimal pl-5 my-2" {...props} />
                          ),
                          li: ({ node, ...props }) => (
                            <li className="my-1" {...props} />
                          ),
                          p: ({ node, ...props }) => (
                            <p className="whitespace-pre-wrap" {...props} />
                          ),
                        }}
                      >
                        {message.content ||
                          (message.sender === "RAG" && isAiTyping
                            ? "En cours de génération..."
                            : "Aucune réponse")}
                      </ReactMarkdown>
                      <div className="flex justify-between items-center mt-1">
                        <button
                          onClick={() => copyToClipboard(message.content)}
                          className="text-gray-500 hover:text-gray-700 focus:outline-none"
                          aria-label={`Copier le message: ${message.content.substring(0, 20)}...`}
                          type="button"
                        >
                          <Copy size={16} />
                        </button>
                        <div className="text-xs opacity-50 text-right">
                          {new Date(message.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {isAiTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-800 rounded-lg px-4 py-3 max-w-[200px]">
                    <div className="flex items-center space-x-2">
                      <ChatLoading />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
      </div>

      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="relative bg-gray-100 rounded-xl border border-gray-300 shadow-sm p-2">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full p-4 text-black pr-12 rounded-xl resize-none focus:outline-none bg-transparent border-0"
              rows={1}
              style={{ minHeight: "60px", maxHeight: "150px" }}
              placeholder="Écrivez votre message ici..."
            />

            <div className="absolute left-2 bottom-2 flex gap-2">
              <button
                type="button"
                className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
              >
                <FaGlobe size={16} />
              </button>
            </div>

            <div className="absolute right-2 bottom-2 flex gap-2">
              <button
                type="button"
                onClick={toggleRecording}
                className={`px-3 py-1 rounded-full transition-colors text-sm font-semibold ${
                  isRecording
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                <FaMicrophone
                  size={16}
                  className={isRecording ? "animate-pulse" : ""}
                />
              </button>
              <button
                type="submit"
                title="Envoyer le message"
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isSending}
                className={`px-3 py-3 rounded-full ${
                  inputValue.trim() && !isSending
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-300 text-gray-500"
                }`}
              >
                <FaPaperPlane size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainSession;
