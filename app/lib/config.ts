// lib/config.ts

// URL de base de ton API
const BASE_API_URL = "http://192.168.1.116:3001";

// Fonction pour générer l'URL complète avec un endpoint dynamique
export const getApiUrl = (endpoint: string) => `${BASE_API_URL}${endpoint}`;