import { FiBarChart2, FiBriefcase, FiDollarSign, FiLock, FiPieChart, FiShield, FiTarget, FiTrendingUp, FiUser } from "react-icons/fi";

import { IBenefit } from "./types"

export const benefits: IBenefit[] = [
    {
        title: " Recherche et Organisation Intelligente",
        description: "Recherche Contextuelle Trouvez rapidement les sources académiques et professionnelles les plus pertinentes grâce à une IA qui comprend le contexte de votre requête.",
        bullets: [
            {
                title: "Catégorisation Automatique",
                description: "Vos résultats et documents sont automatiquement classés pour une consultation et une gestion plus simples.",
                icon: <FiBarChart2 size={26} />
            },
            {
                title: "Objectifs de Recherche Personnalisés",
                description: "Définissez des sujets ou centres d’intérêt prioritaires pour recevoir des ressources et avancées ciblées.",
                icon: <FiTarget size={26} />
            },
            {
                title: "Alertes & Veille Intelligente",
                description: "Recevez des notifications en temps réel dès qu’un contenu pertinent est publié sur vos thématiques.",
                icon: <FiTrendingUp size={26} />
            }
        ],
        // imageSrc: "/images/mockup-1.webp"
        imageSrc: "/assets/images/png/mockup-3.png"

    },
    {
        title: " Analyse, Synthèse et Collaboration",
        description: "Résumé et Synthèse Automatisés L’IA résume et synthétise les articles, rapports ou études pour vous faire gagner du temps.",
        bullets: [
            {
                title: "Suggestion de Lectures Personnalisées",
                description: "Des recommandations de documents ou d’auteurs adaptés à vos besoins et votre historique de recherche.",
                icon: <FiDollarSign size={26} />
            },
            {
                title: "Dossiers Collaboratifs Regroupez",
                description: "Organisez et partagez des ressources et notes avec vos collègues ou étudiants.",
                icon: <FiBriefcase size={26} />
            },
            {
                title: "Gestion Bibliographique Facile Enregistrez",
                description: "Organisez et exportez vos références selon plusieurs formats standards (APA, MLA, etc.).",
                icon: <FiPieChart size={26} />
            }
        ],
        imageSrc: "/assets/images/png/mockup-4.png"
    },
    {
        title: "Sécurité et Conformité",
        description: "Sécurité de Niveau Professionnel La confidentialité de vos recherches et documents est protégée par une technologie de chiffrement avancée.",
        bullets: [
            {
                title: "Authentification Sécurisée",
                description: "Accédez à la plateforme grâce à la biométrie, la double authentification ou l’authentification académique.",
                icon: <FiLock size={26} />
            },
            {
                title: "Détection de Plagiat en Temps Réel",
                description: "Vos documents sont analysés pour signaler toute similarité avec des sources existantes et garantir l’intégrité académique.",
                icon: <FiUser size={26} />
            },
            {
                title: "Visualisation Interactive des Connaissances ",
                description: "Créez des cartes conceptuelles et explorez les liens entre les thématiques ou chercheurs.",
                icon: <FiShield size={26} />
            }
        ],
        imageSrc: "/assets/images/png/mockup-2.png"
    },
]