# CONTEXTE ET LIGNE DIRECTRICE - JETEMOIGNE-TV

Ce document sert de référence absolue pour maintenir la cohérence du projet et éviter toute dérive par rapport à la vision initiale.

## 1. VISION DU PROJET
**Jetemoigne-TV** est une plateforme web chrétienne inspirée des grandes chaînes (type EMCI TV) mais avec une identité propre centrée sur le témoignage, l'évangélisation et le soutien communautaire.
- **Mission** : Diffuser du contenu inspirant (vidéo, audio, écrit) et faciliter le soutien aux projets de la chaîne.
- **Valeurs** : Clarté, Transparence, Modernité, Spiritualité.

## 2. DESIGN SYSTEM : "BLUE CLARITY"
L'interface doit inspirer confiance et sérénité.
- **Couleurs Clés** :
  - Primary : `#60A5FA` (Sky Blue)
  - Secondary : `#3B82F6` (Royal Soft)
  - Background : `#F0F9FF` (Alice Blue) - *Jamais de blanc pur.*
  - Text : `#1E3A8A` (Deep Blue) - *Jamais de noir pur.*
- **Style Visuel** :
  - Bordures : `rounded-2xl` (très arrondi).
  - Ombres : `shadow-blue-100` (légères et bleutées).
  - Effets : Glassmorphism, Backdrop-blur sur les headers et modales.
  - Mise en page : Bento Grid pour l'accueil.

## 3. STACK TECHNIQUE (MODERNE 2026)
- **Frontend** : Next.js 15 (App Router), TypeScript, Tailwind CSS, Shadcn/UI, Framer Motion.
- **Backend** : NestJS, Prisma ORM, PostgreSQL.
- **BaaS** : Supabase (Auth, Storage, RLS, Realtime).
- **Médias** : Video.js (HLS), Wavesurfer.js (Audio), Recharts (Stats).

## 4. ARCHITECTURE FONCTIONNELLE DÉTAILLÉE

### 4.1 Côté Public (Interface Utilisateur)
1. **Page d'Accueil** : Hub central regroupant tous les modules avec redirections appropriées. Inclut des publicités, le flux direct, les projets en cours, les derniers programmes, les partenariats et les ouvrages vedettes.
2. **Direct** : Espace dédié aux contenus en direct, catégorisés par type (Podcast, Témoignage, Évangélisation, Concert, etc.).
3. **Nos Programmes** : Catalogue multimédia (Audio, Écrit, Vidéo) classé par intitulé. Catégories principales : Informations, Jeunesse et Cinéma, Divertissement.
4. **Témoignages** : Galerie de tous les témoignages (Écrit, Audio, Vidéo) avec un formulaire d'envoi pour les utilisateurs.
5. **Projets** : Vitrine des actions de la chaîne (Présentation, Vision, Valeurs) et promotion des besoins spécifiques.
6. **Soutenir** : Tableau de bord de transparence avec chiffres clés (Nombre de bénévoles, partenaires, dons, solde de compte). Bouton d'action pour soutenir via 3 formulaires spécifiques (Don, Bénévolat, Partenariat).
7. **Autres** : Bibliothèque d'ouvrages (Gratuits et Payants) et mur publicitaire dédié.

### 4.2 Côté Admin ("Blue Control")
1. **Dashboard** : Statistiques intuitives (Visiteurs, vues par interface, programmes par catégorie, témoignages, projets, soutien par type, évolution des dons, attractivité des contenus/pubs) via graphiques, camemberts et diagrammes.
2. **Dons et Finances** : Historique complet des paiements d'ouvrages, des publicités et gestion des dons (Matériel et Financier).
3. **Gestion du Contenu (Double Onglet)** :
   - **Programmes** : Publication multiformat (Vidéo, Audio). Gestion des liens externes (YouTube, Facebook, TikTok) avec lecture intégrée via fenêtre contextuelle. Types : Lives, Interviews, Direct, Enseignement, Exhortation, Délivrance, Couverture, Programmes chrétiens, Talk show, etc.
   - **Témoignages** : Workflow de modération en 3 étapes :
     - Étape 1 : Lecture/Analyse du média (Audio/Vidéo/Texte).
     - Étape 2 : Décision (Modifier, Rejeter avec confirmation, Valider).
     - Étape 3 : Programmation de la publication avec confirmation.
4. **Projets** : Création et gestion (Informations, assignation d'intervenants, état d'avancement, étapes du projet).
5. **Gestion du Personnel** : 
   - Utilisateurs : Gestion des rôles (Super Admin, Admin, Gestionnaire, Comptable, Observateur).
   - Bénévoles : Catégorisation par domaine de compétence.
   - Partenaires : Catégorisation par domaine d'activité et pays.
6. **Pub et Ouvrage** : Gestion des publications publicitaires (Vidéo/Image) et des ouvrages PDF.
7. **Configuration** : Paramétrage des numéros de paiement (Airtel Money, Moov Money). Gestion de la jointure obligatoire des captures d'écran de transaction (Optionnel pour les dons, Obligatoire pour les publicités et ouvrages).
8. **Paramètres** : Réglages généraux de la plateforme.

## 5. SÉCURITÉ & DONNÉES
- **RLS (Row Level Security)** : Protection stricte des données au niveau de la base de données.
- **Auth** : JWT + 2FA pour les rôles Admin et Comptable.
- **Storage** : Buckets sécurisés avec politiques d'accès par rôle.
- **Validation** : Liaison obligatoire entre Capture d'écran (Preuve) et Transaction (via jointure dans le formulaire de paiement).

## 6. LIGNE DIRECTRICE DE DÉVELOPPEMENT
- **Priorité à l'UX** : Toujours privilégier la fluidité et la clarté visuelle.
- **Modularité** : Composants réutilisables basés sur Shadcn/UI.
- **Performance** : Optimisation des médias (compression, redimensionnement).
- **Documentation** : Maintenir `progresse.txt` et `schema.sql` à jour à chaque étape majeure.
