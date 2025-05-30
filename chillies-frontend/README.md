# Chillies - Application de Gestion de Cocktails

## 📋 Présentation

Chillies est une application web permettant à des clients de commander des cocktails et de suivre l'état de leurs commandes en temps réel.&#x20;

Un back-office est également prévu pour les administrateurs afin de gérer les cocktails, utilisateurs et commandes.

---

## 🚀 Installation et Exécution

### Prérequis

* Node.js (v18+ recommandé)
* MySQL
* npm ou yarn

### Installation

1. Cloner le projet :

```
git clone https://github.com/tonrepo/chillies.git
cd chillies
```

2. Installer les dépendances :

```
npm install
```

3. Configurer l'environnement :
   Créer un fichier `.env` à la racine :

```
DB_HOST=localhost
DB_USER=root
DB_NAME=cocktailbar
JWT_SECRET=5c24f5f783497db0c6c13414f7f21adf92b48de9659a3a794d78297a83869ec2
PORT=3000
```

4. Lancer le backend :

```
cd chillies-backend
npm run dev
```

5. Lancer le frontend :

```
cd chillies-frontend
npm run dev
```

Le site sera disponible sur : `http://localhost:5173`.

---

## 📑 Routes utilisées

### 🎨 Routes qui distribuent des vues (Frontend)

* `/` → Accueil client (liste cocktails + commande + suivi)
* `/login` → Connexion admin
* `/admin` → Dashboard admin
* `/admin/cocktails` → Gestion des cocktails
* `/admin/users` → Gestion des utilisateurs
* `/admin/commande` → Gestion des commandes

### 🔧 API - Routes de données (Backend)

#### Authentification

* `POST /api/auth/login` → Connexion admin
* `GET /api/auth/me` → Récupérer les infos de l'utilisateur connecté

#### Cocktails

* `GET /api/cocktails` → Récupérer tous les cocktails

#### Commandes

* `GET /api/orders` → Récupérer toutes les commandes (admin)
* `GET /api/orders/:id` → Détails d'une commande (admin)
* `POST /api/orders` → Créer une commande (client)
* `PUT /api/orders/:id` → Modifier une commande (admin)
* `PATCH /api/orders/:id/status` → Changer le statut d'une commande (admin)
* `DELETE /api/orders/:id` → Supprimer une commande (admin)

---

## 📝 Synthèse du projet

Le projet Chillies a été réalisé dans un cadre pédagogique en respectant les principes de la méthode Agile Scrum.

### Objectifs principaux

* Réaliser un site web complet client/admin
* Séparer le frontend (React + Vite + MUI) du backend (Express + MySQL)
* Appliquer la méthode Agile avec sprints et backlog

### Outils de gestion

* Trello : Kanban (To Do / In Progress / Done)
* Bloc-Notes : Historique des bugs à régler
* Sprints courts (2 semaines)

### Difficultés rencontrées

* Mise en place du suivi de commande en temps réel

---

## 📅 Planning des sprints

| Sprint | Durée       | Objectifs                                                                 |
| ------ | ----------- | ------------------------------------------------------------------------- |
| 1      | Semaine 1-2 | Initialisation projet, configuration backend + base de données            |
| 2      | Semaine 3-4 | Développement frontend client + affichage cocktails                       |
| 3      | Semaine 5-6 | Ajout commandes + suivi commandes côté client                             |
| 4      | Semaine 7-8 | Création espace admin : login, gestion cocktails, utilisateurs, commandes |
| 5      | Semaine 9   | Corrections, tests, responsive design, amélioration UX/UI                 |

---

## 👥 Équipe

* Développeur : Adem Fellah

---

## 📌 Remarques

Le projet est en version MVP. Des améliorations sont possibles : notifications push, interface mobile optimisée, etc.

---

Merci d'utiliser Chillie's 🍸🎉
