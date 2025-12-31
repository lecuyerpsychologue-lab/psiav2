# TheraSpace - Application de Bien-être Numérique

Application React moderne de bien-être mental destinée aux adolescents et jeunes adultes. Développée avec React 18, Vite, et Tailwind CSS.

## 🎯 Objectif

TheraSpace est une application "thérapeute de poche" qui offre un ensemble d'outils thérapeutiques accessibles, engageants et cliniquement pertinents.

## ✨ Fonctionnalités

### Authentification
- Inscription avec pseudo, date de naissance, email et mot de passe
- Connexion sécurisée avec hashage côté client
- Stockage localStorage
- Système de streak (flammes quotidiennes)

### Dashboard
- Hub central avec accès à tous les modules
- **Bouton SOS** prioritaire avec:
  - Appel rapide 3114 (Prévention suicide)
  - Appel rapide 15 (Urgences)
  - SMS d'urgence pré-rempli
  - Fiche de crise personnalisable
- Toggle mode sombre/clair
- Compteur de streak

### Modules Disponibles

#### 🎭 Humeur (Check-in quotidien)
- Sélection d'émotion parmi 8 choix stylisés
- Slider d'intensité (1-10)
- Note rapide optionnelle
- Historique des humeurs

#### 🌬️ Respiration (Cohérence cardiaque)
- Timer visuel animé
- Cycle 4-2-6 (inspire, bloque, expire)
- Compteur de cycles
- Design immersif avec cercle dynamique

#### ⚓ Ancrage (5-4-3-2-1)
- Technique de grounding guidée
- 5 étapes progressives
- Interface immersive
- Message de clôture apaisant

#### 📝 Journal
- Création et gestion de notes
- Horodatage automatique
- Suppression avec confirmation

#### 💬 PsIA (Chat thérapeutique)
- Interface type messagerie
- Réponses contextuelles
- Disclaimer permanent
- Historique de conversation

#### ✨ Oracle (Sagesse symbolique)
- Contes et fables inspirants
- 8 histoires pré-configurées
- Format court et impactant
- Design mystique

### Modules en développement
- **Écho**: Jeu de situation avec analyse IA
- **Héros**: Quiz d'estime de soi + programme 60 jours
- **Identité**: Interview en 3 parties avec synthèse IA

## 🛠️ Stack Technique

- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icônes**: Lucide React
- **Backend**: Vercel Serverless Functions
- **AI**: Mistral AI (configuration requise)
- **Stockage**: localStorage
- **Déploiement**: Vercel

## 📦 Installation

```bash
npm install
```

## 🚀 Développement

```bash
npm run dev
```

Le serveur de développement démarre sur http://localhost:3000

## 🏗️ Build Production

```bash
npm run build
```

## 🎨 Design System

### Palette de Couleurs (Mode Clair)
- **Fond Global**: `#FDFBF7` (Crème)
- **Texte Principal**: `#2D3748` (Gris Ardoise)
- **Accent 1**: `#FF8FAB` (Corail)
- **Accent 2**: `#2A9D8F` (Teal)
- **Accent 3**: `#E9C46A` (Jaune Solaire)

### Mode Sombre
- Toggle manuel
- Palette adaptée pour confort visuel

### UI/UX
- Glassmorphism (cartes translucides avec backdrop-blur)
- Bords très arrondis (`rounded-3xl`)
- Typographie: 'Outfit' (Google Font)
- Icônes SVG style Lucide avec effet glow
- Application plein écran (`100dvh`)
- PWA installable

## 🔐 Configuration

### Variables d'environnement (pour Vercel)

```env
MISTRAL_API_KEY=votre_clé_mistral_ai
```

## 📱 PWA

L'application est configurable en tant que Progressive Web App:
- Manifest.json configuré
- Installation sur l'écran d'accueil
- Expérience native sur mobile

## 🏥 Ressources d'Urgence

L'application intègre toujours les numéros d'urgence français:
- **3114**: Prévention suicide (gratuit, 24/7)
- **15**: Urgences médicales

## 📂 Structure du Projet

```
psiav2/
├── api/
│   └── chat.js              # Serverless Mistral AI
├── public/
│   ├── manifest.json        # PWA
│   └── logo.svg             # Logo
├── src/
│   ├── components/
│   │   ├── auth/            # Login, Register
│   │   ├── dashboard/       # Dashboard, SOS
│   │   ├── modules/         # Tous les modules
│   │   └── ui/              # Composants réutilisables
│   ├── contexts/            # Auth, Theme
│   ├── utils/               # Helpers, AI
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── vercel.json
```

## 📄 License

Ce projet est développé pour lecuyerpsychologue-lab.

## 🤝 Contribution

Projet privé - Contributions limitées aux membres autorisés.

---

**Important**: Cette application est un outil d'accompagnement et ne remplace en aucun cas un suivi thérapeutique professionnel.