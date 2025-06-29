export interface YearData {
  id: string;
  year: number;
  [key: string]: string | number | boolean | null | undefined;
}

export interface UniversityData {
  id: string;
  name: string;
  [key: string]: string | number | boolean | null | undefined;
}

export interface CountryData {
  id: string;
  name: string;
  [key: string]: string | number | boolean | null | undefined;
}

export interface DisciplineData {
  id: string;
  name: string;
  [key: string]: string | number | boolean | null | undefined;
}

export interface UserData {
  id: string;
  username: string;
  email: string;
  role: string;
  active: boolean;
  lastLogin?: number | string;
  [key: string]: string | number | boolean | null | undefined;
}



export type Message = {
  id: string;
  chatId: string | null;
  sender: "USER" | "RAG";
  content: string;
  createdAt: string;
  updatedAt?: string; // Rendu facultatif
};

export type Chat = {
  id: string;
  title: string;
  lastMessage?: string;
  createdAt: string; // ici ce champ est requis selon ton erreur
  updatedAt: string;
};

export type FilterData = {
  yearId: string | null;
  documentTypeId: string | null;
  author: string | null;
  universityId: string | null;
  disciplineId: string | null;
  countryId: string | null;
};

export type DataItem =
  | YearData
  | UniversityData
  | CountryData
  | DisciplineData
  | UserData;
