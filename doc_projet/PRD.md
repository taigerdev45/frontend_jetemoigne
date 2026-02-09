# Product Requirements Document (PRD) - Jetemoigne-TV

## 1. Vision du Projet
**Jetemoigne-TV** est une plateforme web chrétienne inspirée des grandes chaînes comme EMCI TV. Elle vise à offrir un espace multimédia (vidéo, audio, écrit) dédié aux témoignages, à l'évangélisation et aux programmes chrétiens, tout en facilitant le soutien communautaire (dons, bénévolat, partenariats).

## 2. Objectifs Stratégiques
- Fournir une interface épurée et rassurante (Design "Blue Clarity").
- Centraliser les témoignages chrétiens sous divers formats.
- Permettre la diffusion en direct et la gestion de programmes catégorisés.
- Faciliter le financement des projets via un système de dons transparent avec preuve de transaction.
- Offrir un outil d'administration complet pour la gestion du contenu et des finances.

## 3. Public Cible
- **Public :** Fidèles chrétiens, personnes en quête de témoignages, donateurs potentiels.
- **Admin :** Administrateurs de la chaîne, comptables, gestionnaires de contenu, modérateurs.

## 4. Structure Détaillée des Interfaces

### 4.1 Interface Publique (Front-Office)
*Design : Lumineux, accueillant, navigation intuitive style "Bento Grid".*

- **Accueil (Le Hub) :** 
    - Header avec flou (backdrop-blur).
    - Bento Grid dynamique : Tuile XL (Direct avec badge pulsant), Tuile L (Programme vedette), Tuile M (Projet avec barre de progression), Tuile S (Citation témoignage).
    - Section Pub & Partenariats (Bannière horizontale).
    - Carrousel Ouvrages.
- **Direct :** Lecteur HLS/RTMP, filtres "Pills" (Podcast, Témoignage, Évangélisation, Concert), sidebar programme.
- **Nos Programmes :** Système de filtrage par Type et Format (Audio, Écrit, Vidéo). Modale de lecture pour contenu externe (YouTube/TikTok).
- **Témoignages :** Galerie mixte (Vidéo, Audio avec waveforms, Écrit). Formulaire flottant "Je Témoigne" avec upload Dropzone.
- **Projets :** Cartes d'avancement avec barre de progression et bouton de contribution.
- **Soutenir :** Compteurs animés (Bénévoles, Partenaires), centre d'action à 3 onglets (Bénévolat, Partenariat, Don Financier) avec module d'upload de preuve.
- **Autres :** Bibliothèque PDF et mur publicitaire.

### 4.2 Interface Administration (Blue Control)
*Design : Professionnel, dense en informations mais lisible.*

- **Dashboard :** KPIs (Visiteurs, Contenus, Finances, Attractivité) avec graphiques Recharts (Courbes et Camemberts).
- **Dons et Finances :** Tableau historique filtrable et système de validation des preuves de transaction.
- **Gestion du Contenu :**
    - **Onglet Programmes :** CRUD avec gestion des embeds externes.
    - **Onglet Témoignages :** Workflow de traitement (Lecture -> Décision [Modifier/Rejeter/Valider] -> Programmation).
- **Projets :** Créateur de projet avec budget, assignation multi-intervenants et gestion des étapes (Milestones).
- **Gestion du Personnel :** Gestion des rôles, annuaire des bénévoles (par compétence) et partenaires (par activité/pays).
- **Pub et Ouvrages :** 
    - Gestion publicitaire (Upload Vidéo/Image, redirection, durée de campagne).
    - Gestion des ouvrages (Upload PDF, prix/gratuité, miniatures).
- **Configuration & Paramètres :**
    - Configuration paiements (Numéros Airtel/Moov Money).
    - Règles de preuve (Checkbox activation/désactivation capture d'écran par type).
    - Paramètres généraux (Maintenance, SEO, Titre).

## 5. Spécifications Techniques

### 5.1 Stack Frontend (2026)
- **Framework :** Next.js 15+ (App Router).
- **Styling :** Tailwind CSS avec Design System "Blue Clarity".
- **Composants :** Shadcn/UI (customisé : rounded-2xl, shadow-blue-100).
- **Animations :** Framer Motion.
- **Charts :** Recharts.
- **State Management :** Redux.

### 5.2 Stack Backend
- **Framework :** NestJS.
- **Base de Données :** PostgreSQL (Supabase).
- **ORM :** Prisma.
- **Stockage :** Supabase Storage (Média, Preuves de transaction).
- **Temps Réel :** WebSockets / Supabase Realtime (Stats Dashboard).
- **Sécurité :** RLS (Row Level Security) de Supabase, JWT, Rotation de tokens, 2FA obligatoire pour Admin/Comptable.

## 6. Schéma de Base de Données (PostgreSQL)

### 6.1 Types Énumérés (Enums)
- `user_role` : super_admin, admin, manager, accountant, observer.
- `program_category` : info, jeunesse_cinema, divertissement, podcast, evangelisation, concert, temoignage_live, autre.
- `content_format` : video, audio, ecrit.
- `testimony_status` : recu, en_lecture, valide, rejete, programme.
- `support_type` : don_financier, don_materiel, benevolat, partenariat.
- `transaction_status` : en_attente, verifie, rejete.

### 6.2 Tables Principales
- **profiles :** Extension de `auth.users` (Supabase). Gère les rôles et infos utilisateurs.
- **programs :** Contenu multimédia, gestion des lives, slugs SEO, compteurs de vues.
- **testimonies :** Workflow de validation, stockage des médias, programmation de publication.
- **projects :** Vision, objectifs financiers, barres de progression.
- **project_milestones :** Étapes clés des projets.
- **project_team :** Assignation des intervenants aux projets.
- **transactions :** Suivi des dons/achats, stockage des captures de preuve, validation comptable.
- **volunteers & partners :** Gestion des bénévoles (compétences, disponibilité) et des partenaires (pays, domaine).
- **books & ads :** Catalogue des ouvrages PDF et gestion des campagnes publicitaires (clics, vues, dates).
- **app_settings :** Configuration globale (Numéros de paiement, mode maintenance).
- **analytics_daily :** Statistiques quotidiennes consolidées pour le Dashboard.

### 6.3 Configuration du Stockage (Supabase Buckets)
- `testimonies-media` : Fichiers audios/vidéos des témoignages.
- `transaction-proofs` : Captures d'écran des paiements (Accès Privé).
- `books-files` : Fichiers PDF des ouvrages.
- `public-assets` : Miniatures, logos, bannières publicitaires.

### 6.4 Sécurité & RLS (Row Level Security)

#### Fonctions de Sécurité (Helpers)
- `is_staff_member()` : Vérifie si l'utilisateur a un rôle Staff (Admin, Manager, Accountant, etc.).
- `is_admin_or_super()` : Vérifie si l'utilisateur est Admin ou Super Admin.
- `has_financial_access()` : Vérifie si l'utilisateur a accès aux finances (Admin + Accountant).

#### Politiques d'Accès (Policies)
- **Contenu Public (Programs, Projects, Books) :** Lecture libre pour tous (`SELECT`), gestion réservée au Staff (`ALL`).
- **Publicités :** Lecture publique uniquement pour les pubs actives (`is_active = true`).
- **Témoignages :** 
    - Public : Dépôt libre (`INSERT`), lecture limitée aux statuts `valide` ou `programme`.
    - Staff : Gestion totale et modération.
- **Transactions & Finances :** 
    - Public : Dépôt de preuve (`INSERT`), lecture **interdite** pour préserver la confidentialité.
    - Finance : Accès complet pour les comptables et admins.
- **Profils :** Lecture propre profil pour chaque utilisateur, accès annuaire pour le Staff, gestion des rôles pour l'Admin.
- **Stockage (Buckets) :** 
    - `transaction-proofs` : Upload public, lecture réservée au Staff Financier.
    - `testimonies-media` : Upload public, lecture publique (éventuellement via Signed URLs pour plus de sécurité).

#### Résumé des Accès par Rôle

| Table | Public / Anonyme | Gestionnaire (Manager) | Comptable | Admin / Super |
| --- | --- | --- | --- | --- |
| *Programmes* | Lecture Seule | Lecture + Écriture | Lecture Seule | Total |
| *Témoignages* | Dépôt + Lecture (Validés) | Modération (Tout) | Lecture (Tout) | Total |
| *Transactions* | Dépôt (Aveugle) | ⛔ Accès Refusé | Validation + Vue | Total |
| *Projets* | Lecture Seule | Lecture + Écriture | Lecture Seule | Total |
| *Settings* | Lecture (Numéros) | Lecture | Lecture | Total |

## 7. Design System "Blue Clarity"
- **Couleurs :** 
  - Principal : #60A5FA (Sky Blue)
  - Secondaire : #3B82F6 (Royal Soft)
  - Fond : #F0F9FF (Alice Blue)
  - Texte : #1E3A8A (Deep Blue)
- **Typographie :** Inter/Montserrat (Titres), Roboto (Corps).
- **Effets :** Glassmorphism, Backdrop-blur, Gradients linéaires.

## 7. Critères de Succès
- Expérience utilisateur fluide et sans friction.
- Sécurisation totale des flux financiers.
- Temps de chargement optimisé pour les contenus multimédias.
- Interface d'administration intuitive pour les non-techniciens.
