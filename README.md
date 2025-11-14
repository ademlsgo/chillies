📘 Chillie’s — Projet REST (Node.js, Express, MySQL, Sequelize, JWT)

Chillie’s est une API REST complète permettant de gérer :

les cocktails

les commandes

les utilisateurs (roles : user / employee / superuser)

une API publique via API Key dynamique

une intégration météo via l’API externe OpenWeather

une authentification sécurisée (JWT + Google OAuth)

une documentation Swagger

Ce projet a été réalisé dans le cadre du module :
Maîtrise d’une API REST & Architecture client-serveur.

📌 Fonctionnalités
🔐 Authentification & Permissions

Login Admin (superuser / employee)

JWT (Bearer Token)

Google OAuth One Tap (bonus)

Rôles utilisateur : user, employee, superuser

🍹 Gestion des Cocktails (CRUD complet)

GET all cocktails

GET cocktail by ID

POST / PUT / DELETE (routes protégées)

🛒 Gestion des Commandes

Création de commande (client)

Récupération / modification / suppression (admin)

🔑 API Publique & API Keys dynamiques

Génération d’une API key (superuser)

Accès public aux cocktails via x-api-key

🌦 API Externe — OpenWeather

/api/v1/weather/:city → météo en temps réel

📚 Swagger

Accessible ici :
👉 /api-docs

🧩 Technologies utilisées

Node.js

Express

Sequelize ORM

MySQL (Railway)

JWT

bcrypt

dotenv

Swagger (OpenAPI 3)

Google OAuth 2.0

CORS

📦 Installation locale
1️⃣ Cloner le projet
git clone https://github.com/tonCompte/chillies.git
cd chillies-backend

2️⃣ Installer les dépendances
npm install

3️⃣ Créer un fichier .env
PORT=3000
SESSION_SECRET=your_session_secret

# JWT
JWT_SECRET=your_jwt_secret

# DB Railway
DB_HOST=...
DB_USER=...
DB_PASSWORD=...
DB_NAME=...
DB_DIALECT=mysql

# OpenWeather API
OPENWEATHER_API_KEY=your_weather_key

# Google OAuth
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_CALLBACK_URL=http://localhost:3000/api/v1/auth/google/callback

4️⃣ Lancer l’application
npm start


Serveur lancé sur :
👉 http://localhost:3000

🗄️ Base de données (MySQL)

Modèles disponibles :

User

Cocktail

Order

ApiKey

Relations :

User → ApiKey (1-N)

📚 Documentation Swagger

Accessible à :

http://localhost:3000/api-docs


Inclus :

paramètres

schémas

sécurité

rôles

réponses

🔑 API Publique via API Key
1️⃣ Générer une API Key
POST /api/v1/api-keys/generate
Authorization: Bearer <token superuser>

2️⃣ Consommer l’API publique
GET /api/v1/public/cocktails
x-api-key: <clé>

🌦 Route Météo (API externe)
GET /api/v1/weather/Marseille


Exemple de réponse :

{
"city": "Marseille",
"temperature": 18.2,
"description": "clear sky"
}

🧱 Structure du projet
chillies-backend/
│
├── config/
│   ├── database.js
│   ├── swagger.js
│
├── controllers/
│
├── middlewares/
│
├── models/
│   ├── User.js
│   ├── Cocktail.js
│   ├── ApiKey.js
│   ├── Order.js
│
├── routes/
│   ├── authRoutes.js
│   ├── cocktailRoutes.js
│   ├── orderRoutes.js
│   ├── userRoutes.js
│   ├── apiKeyRoutes.js
│   ├── publicRoutes.js
│   ├── weatherRoutes.js
│
└── server.js

🚀 Déploiement Railway
1️⃣ Push GitHub

Railway détecte automatiquement les pushes.

2️⃣ Configuration des variables Railway

Ajouter dans Variables :

SESSION_SECRET

JWT_SECRET

DB_HOST / USER / PASSWORD / NAME

OPENWEATHER_API_KEY

GOOGLE_CLIENT_ID

GOOGLE_CLIENT_SECRET

3️⃣ URL de production
https://ton-projet.up.railway.app


Swagger live :

https://ton-projet.up.railway.app/api-docs

📄 Licence

Projet réalisé dans un cadre pédagogique.
Libre à la réutilisation et modification.
