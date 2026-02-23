# Plan d'Implémentation Ultra-Détaillé - Jetemoigne-TV

Ce document détaille chaque étape technique pour la réalisation de la plateforme Jetemoigne-TV.

## Phase 1 : Initialisation & Socle Technique (Semaine 1)

### 1.1 Environnement Frontend (Next.js 15)
- [x] Initialisation : `npx create-next-app@latest` (TypeScript, Tailwind, App Router).
- [x] Configuration Tailwind : Intégration des tokens "Blue Clarity" dans `globals.css` (Tailwind 4).
- [x] Installation Shadcn/UI : `npx shadcn@latest init` (Style: Default, Radius: 1.0rem/rounded-2xl).
- [x] Fonts : Configuration de Inter & Montserrat dans `globals.css`.
- [x] State Management : Setup de Redux Toolkit pour la gestion globale.

### 1.2 Architecture de la Base de Données (Supabase)
- [x] Création du projet Supabase.
- [x] Exécution du script `schema.sql` (Enums, Tables, RLS).
- [x] Configuration des Buckets Storage : `testimonies-media`, `transaction-proofs`, `books-files`, `public-assets`.
- [x] Setup Prisma : `npx prisma init`, configuration du provider PostgreSQL et synchronisation du schéma.

### 1.3 Socle Backend (NestJS)
- [x] Initialisation NestJS : `nest new backend`.
- [x] Intégration Prisma Service.
- [x] Configuration Swagger pour la documentation API.
- [x] Setup du module Auth avec Passport et JWT.

---

## Phase 2 : Interface Publique (Front-Office)

### 2.1 Layout & Navigation (Blue Clarity)
- [x] Header : Effet `backdrop-blur`, navigation responsive, bouton CTA "Soutenir".
- [x] Footer : Liens utiles, réseaux sociaux, logo secondaire.
- [x] Transitions : Intégration de Framer Motion pour les changements de pages.

### 2.2 Page d'Accueil (Le Hub)
- [x] Hero Section : Bento Grid dynamique (Tailwind Grid).
- [x] Section Statistiques : Chiffres clés (Compteurs animés).
- [x] Tuile Direct : Composant Live avec badge pulsant (CSS Animation).
- [x] Tuile Projets : Barre de progression stylisée (Shadcn Progress).
- [x] Section Pub : Bannière avec dégradé bleu ciel.
- [x] Carrousel Ouvrages : Utilisation d'Embla Carousel / Shadcn Carousel.

### 2.3 Direct & Programmes
- [x] Lecteur Vidéo : Intégration de Video.js ou ReactPlayer pour HLS.
- [x] Filtres Pills : Composant ToggleGroup pour les catégories.
- [x] Grille de Programmes : Cartes avec effet hover bleu doux.
- [x] Modale Pop-up : Fenêtre contextuelle pour YouTube/TikTok (Glassmorphism).

### 2.4 Témoignages (Cœur du site)
- [x] Galerie : Affichage conditionnel (Vidéo/Audio/Écrit).
- [x] Waveform : Intégration de Wavesurfer.js pour les témoignages audio.
- [x] Formulaire "Je Témoigne" :
    - [x] Step 1 : Infos auteur (Form React Hook Form + Zod).
    - [x] Step 2 : Upload média (Dropzone avec prévisualisation).
    - [x] Step 3 : Éditeur riche (TipTap ou Quill) pour le texte.

### 2.5 Soutien & Projets
- [x] Page Projets : Liste détaillée avec milestones.
- [x] Dashboard Transparence : Compteurs animés (Framer Motion `animateNumber`) et Jauge financière.
- [x] Centre d'Action (Soutenir) : 3 onglets (Bénévolat, Partenariat, Don).
- [x] Formulaire de Don : Sélection de montant, upload de capture (Dropzone).
- [x] Formulaires Engagement : Bénévolat et Partenariat avec validation Zod.

### 2.6 Optimisations & Corrections (Terminé)
- [x] Migration Tailwind v4 (Gradients, Z-index).
- [x] Optimisation Images (Next.js Image).
- [x] Intégration Marquee Actualités.
- [x] Fixes UI (Modal z-index, Video Player, Avatar, Tailwind Tokens).
- [x] Nettoyage Linter (React Compiler, Unused vars, Types, date-fns).

### 2.7 Interface "Autres" (Ouvrages & Pubs)
- [x] Page Ouvrages : Layout avec onglets (Bibliothèque / Mur Publicitaire).
- [x] Bibliothèque : Grille de livres avec badges (Gratuit/Prix) et bouton d'action.
- [x] Mur Publicitaire : Grille multimédia pour les partenaires (Images/Vidéos).

### 2.8 Intégration Paiement (Notch Pay)
- [x] Analyse Endpoints Backend : `/api/v1/payments/initiate`.
- [x] Adaptation Frontend : Connexion `DonationForm` avec l'API.
- [x] Gestion du Retour : Pages de succès et d'annulation via URL params.
- [x] Validation : Champs email et montants (Zod).
- [x] Configuration Prod : Mise en place de `NEXT_PUBLIC_API_URL` (Render).

---

## Phase 3 : Interface Admin (Blue Control)

### 3.1 Authentification & Sécurité Admin
- [x] Page de Login : Design professionnel avec affichage/masquage mot de passe, redirection post-login.
- [x] Protection des routes : `proxy.ts` (Next.js 16) serveur-side + garde client dans le layout.
- [x] Sidebar déconnexion : bouton logout branché sur `useAuth().logout()`.
- [x] Header admin : affichage du vrai utilisateur connecté (email + rôle).
- [x] Fix build Vercel : `useSearchParams` isolé dans `<Suspense>`, convention `proxy.ts`.
- [ ] Setup 2FA : Intégration de la double authentification pour les rôles sensibles.

### 3.2 Dashboard & Statistiques
- [x] Sidebar : Navigation foncée (#1E3A8A), icônes Lucide-react.
- [x] Widgets KPI : Cartes avec mini-graphes (Recharts TinyLineChart).
- [x] Graphes principaux : Évolution des dons (AreaChart) et répartition des contenus (PieChart).

### 3.3 Gestion des Modules (CRUD)
- [x] Finance : Tableau des transactions avec filtrage et visualisation des preuves (Mock).
- [x] Contenu (Programmes) : Liste des programmes avec statut (Publié, Brouillon).
- [x] Témoignages (Workflow) : Tableau de modération avec filtres (En attente, Validé, Rejeté).
- [x] Projets : Création, Assignation équipe, Suivi Milestones & Budget.
- [x] Personnel (RH) : Gestion Utilisateurs, Bénévoles (Compétences), Partenaires (Activité/Pays).
- [x] Pubs & Ouvrages : Campagnes publicitaires et Bibliothèque numérique (PDF/Prix).
- [x] Configuration & Paramètres : Gestion générale et sécurité du site.
- [x] Nettoyage & Optimisation : Correction des erreurs linter et imports inutilisés sur l'ensemble des modules Admin.

---

## Phase 4 : Backend Avancé & Logiciel

### 4.1 Traitement des Médias (Service NestJS)
- [ ] Image Service : Sharp pour le redimensionnement et le watermarking bleu.
- [ ] Video/Audio Service : Logique de compression avant upload final.

### 4.2 Temps Réel & Notifications
- [ ] WebSockets : Update en temps réel du compteur de dons sur l'accueil.
- [ ] Notifications : Envoi d'emails (Nodemailer/Resend) lors de la validation d'un témoignage.

---

## Phase 5 : Tests & Finalisation

### 5.1 Qualité & Performance
- [ ] Tests Unitaires : Couverture des services backend et composants UI.
- [ ] SEO : Metadata dynamiques pour les programmes et témoignages.
- [ ] Performance : Optimisation des images (Next/Image) et lazy loading.

### 5.2 Déploiement
- [ ] Pipeline CI/CD : GitHub Actions.
- [ ] Hosting : Vercel (Front) et Railway/Render (Back).
