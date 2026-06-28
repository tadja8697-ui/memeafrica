# 🚀 MemeAfrica - Générateur de Memes Multimodal

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB.svg)](https://reactjs.org/)
[![Express](https://img.shields.io/badge/Express-4.22-000000.svg)](https://expressjs.com/)
[![Gemini](https://img.shields.io/badge/Gemini-API-4285F4.svg)](https://ai.google.dev/)

**MemeAfrica** est une application mobile et web qui génère automatiquement des **memes humoristiques contextualisés** à partir de texte, d'images ou de notes vocales, en utilisant l'intelligence artificielle **Google Gemini**. Ce projet est développé dans le cadre du cours **ICT202** (Groupe 2).

---

## 📋 Table des Matières

1. [Fonctionnalités](#-fonctionnalités-principales)
2. [Architecture du Projet](#-architecture-du-projet)
3. [Installation et Configuration](#-installation-et-configuration)
4. [Configuration des Clés API](#-configuration-des-clés-api)
5. [Lancer le Projet en Local](#-lancer-le-projet-en-local)
6. [Utilisation de l'API](#-utilisation-de-lapi)
7. [Structure du Code](#-structure-du-code-détaillée)
8. [Commentaires du Code](#-commentaires-du-code)
9. [Dépendances](#-dépendances-principales)
10. [Résolution des Problèmes](#-résolution-des-problèmes-courants)
11. [Contributeurs](#-contributeurs)

---

## ✨ Fonctionnalités Principales

| Fonctionnalité | Description |
|----------------|-------------|
| **📝 Context Reader** | Analyse le ton d'un texte et génère un meme adapté (fallback culturel inclus). |
| **🎤 Voice-to-Meme** | Transcrit une note vocale et crée un meme correspondant au message. |
| **🖼️ Status Remixer** | Ajoute du texte généré par IA sur une image importée par l'utilisateur. |
| **🌍 Adaptation Culturelle** | Utilise un dictionnaire d'expressions locales (Cameroun, Nigeria, etc.) pour un humour plus pertinent. |
| **📱 Mobile & Web** | Interface React Native (via Capacitor) pour une expérience mobile native et web. |

---

## 🏗️ Architecture du Projet

Le projet est structuré en deux parties principales qui communiquent via une API REST :
memeafrica/
├── 📁 backend/ # Serveur Express (Node.js)
│ ├── 📄 server.ts # Point d'entrée principal du serveur
│ ├── 📁 src/
│ │ ├── 📁 config/ # Configuration (Multer, Gemini)
│ │ ├── 📁 middlewares/ # CORS, gestion d'erreurs, 404
│ │ └── 📁 routes/ # Routes API
│ └── 📁 uploads/ # Dossier pour les fichiers uploadés
│
└── 📁 frontend/ # Application React/Vite (mobile & web)
├── 📁 src/ # Composants React, styles, hooks
├── 📄 index.html # Page HTML principale
└── 📄 vite.config.ts # Configuration Vite

text

---

## 🛠️ Installation et Configuration

### Prérequis
- **Node.js** (version 18 ou supérieure) : [Télécharger ici](https://nodejs.org/)
- **Git** : [Télécharger ici](https://git-scm.com/)
- **Compte Google** : pour obtenir une clé API Gemini

---

### 1. Cloner le dépôt

```bash
git clone https://github.com/tadja8697-ui/memeafrica.git
cd memeafrica
2. Installation des dépendances
Backend (depuis la racine du projet)
bash
# Installer toutes les dépendances du backend
npm install
Frontend (si vous avez un dossier séparé)
bash
cd frontend
npm install
cd ..
🔑 Configuration des Clés API
Obtenir une clé API Gemini
Rendez-vous sur Google AI Studio

Connectez-vous avec votre compte Google

Cliquez sur le bouton "Get API Key"

Cliquez sur "Create API Key"

Sélectionnez "Create API key in new project" (ou un projet existant)

Copiez la clé générée (elle commence par AIza...)

Configurer le fichier .env
À la racine du projet, créez un fichier .env (vous pouvez copier .env.example si présent) :

bash
# Copier le fichier d'exemple
cp .env.example .env  # Sur Linux/Mac
copy .env.example .env  # Sur Windows (PowerShell)
Contenu du fichier .env :

env
# Port du serveur
PORT=3000

# Clé API Google Gemini
GEMINI_API_KEY=VOTRE_CLE_GEMINI_ICI
⚠️ Important : Ne committez jamais votre fichier .env ! Il est déjà dans .gitignore.

🚀 Lancer le Projet en Local
Démarrer le Backend
bash
# Depuis la racine du projet
npm run dev
Le serveur sera accessible sur : http://localhost:3000

Vous devriez voir :

text
🚀 MemeAfrica server running on http://localhost:3000
Démarrer le Frontend (si séparé)
bash
cd frontend
npm run dev    ,   Le serveur sera accessible sur : http://localhost:3000

Vous devriez voir :

text
🚀 MemeAfrica server running on http://localhost:3000
Démarrer le Frontend (si séparé)
bash
cd frontend
npm run dev
Le frontend sera accessible sur : http://localhost:5173

🧪 Utilisation de l'API
Routes disponibles
Méthode	Route	Description	Corps de la requête
GET	/	Page d'accueil avec documentation	-
GET	/api/test	Vérifie que le serveur fonctionne	-
GET	/api/health	Vérifie l'état du serveur	-
POST	/api/analyze-context	Analyse un texte et génère des memes	{ "text": "..." }
POST	/api/generate-meme	Génère un meme depuis un prompt	{ "prompt": "..." }
Exemples avec curl
Tester le serveur :

bash
curl http://localhost:3000/api/test
Générer un meme depuis un texte :

bash
curl -X POST http://localhost:3000/api/analyze-context \
  -H "Content-Type: application/json" \
  -d '{"text": "Je suis en retard au travail, le patron va me tuer"}'
Générer un meme depuis un prompt :

bash
curl -X POST http://localhost:3000/api/generate-meme \
  -H "Content-Type: application/json" \
  -d '{"prompt": "un lion qui conduit un danfo dans le traffic"}'
📁 Structure du Code (Détaillée)
text
memeafrica/
│
├── 📄 server.ts                      # Serveur Express (routes, middlewares, Gemini)
│
├── 📁 src/
│   ├── 📁 config/
│   │   ├── 📄 gemini.ts              # Configuration du client Gemini
│   │   └── 📄 multer.ts              # Configuration de l'upload de fichiers
│   │
│   ├── 📁 middlewares/
│   │   ├── 📄 cors.ts                # Middleware CORS
│   │   ├── 📄 errorHandler.ts        # Gestion globale des erreurs
│   │   └── 📄 notFound.ts            # Gestion des routes 404
│   │
│   └── 📁 routes/
│       └── 📄 test.ts                # Routes de test
│
└── 📁 uploads/                       # Dossier des fichiers uploadés
📝 Commentaires du Code
Tous les fichiers principaux sont commentés en français pour faciliter la compréhension et la maintenance.

Exemple de commentaires dans server.ts
typescript
/**
 * ============================================================
 * FICHIER : server.ts
 * DESCRIPTION : Point d'entrée du serveur Express.
 * Ce fichier initialise l'application, configure les middlewares,
 * définit les routes API et démarre le serveur.
 * ============================================================
 */

// ============================================================
// 1. CONFIGURATION INITIALE
// ============================================================

// Charger les variables d'environnement depuis le fichier .env
dotenv.config();

// ============================================================
// 2. MIDDLEWARES GLOBAUX
// ============================================================

// Middleware CORS - Permet les requêtes depuis d'autres origines
app.use(corsMiddleware);
Exemple dans src/config/multer.ts
typescript
/**
 * ============================================================
 * FICHIER : src/config/multer.ts
 * DESCRIPTION : Configuration de Multer pour l'upload de fichiers.
 * ============================================================
 */

/**
 * Filtrage des types de fichiers autorisés.
 * Seuls les images et l'audio sont acceptés.
 */
const fileFilter = (req: any, file: any, cb: any) => {
  const allowed = ["image/jpeg", "image/png", "image/gif", "audio/mpeg", "audio/wav"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Format non supporté"), false);
  }
};
📦 Dépendances Principales
Backend
Package	Version	Utilité
express	^4.22.2	Serveur HTTP
@google/genai	^2.10.0	API Google Gemini
multer	^1.4.5	Upload de fichiers
cors	^2.8.5	Gestion CORS
dotenv	^17.4.2	Variables d'environnement
typescript	^5.8.3	Typage statique
Frontend
Package	Version	Utilité
react	^19.2.7	Bibliothèque UI
vite	^6.4.3	Build tool
tailwindcss	^4.3.1	Framework CSS
typescript	^5.8.3	Typage statique
🐛 Résolution des Problèmes Courants
Problème	Solution
GEMINI_API_KEY not configured	Vérifiez que .env contient votre clé API Gemini
Port 3000 already in use	Changez le port dans .env ou tuez le processus : taskkill /F /IM node.exe
Cannot find module 'cors'	Installez la dépendance : npm install cors
API key not valid	Vérifiez que vous avez une clé Gemini valide (commence par AIza...)
LF will be replaced by CRLF	Avertissement Git lié aux fins de ligne (ignorable)

📄 Licence
Ce projet est développé dans le cadre pédagogique du cours ICT202 (Groupe 11). 
