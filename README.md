📘 Chillie’s — REST API complète (Node.js, TypeScript, JWT, Sequelize, Swagger, API Key)

Chillie’s est une API REST moderne, sécurisée et documentée, conçue pour gérer :

les cocktails

les commandes (client + admin)

les utilisateurs et permissions

une API publique avec clé d’accès

une intégration tierce (OpenWeather)

Google OAuth (bonus)

un panneau admin React/Vite (client séparé)

Cette API a été développée dans le cadre d’un projet de maîtrise d’une architecture REST complète.

📌 Table des matières

🚀 Fonctionnalités

🧩 Technologies utilisées

📦 Installation locale

⚙️ Configuration environnement (.env)

🗄️ Base de données & ORM

📚 Documentation Swagger

🌦 API Externe (OpenWeather)

🔑 API Publique via API Key

🧱 Architecture du projet

🚀 Déploiement Railway

🧪 Tests (optionnel)

📄 Licence

🚀 Fonctionnalités
🟢 Fonctionnalités principales

CRUD complet sur les cocktails

Gestion complète des commandes (client + admin)

Gestion des utilisateurs (superuser/employee/user)

Authentification JWT

Permissions basées sur les rôles

Architecture REST versionnée /api/v1/...

Documentation Swagger complète

Base de données relationnelle MySQL

🟣 Fonctionnalités bonus incluses

Google OAuth (One Tap)

API publique protégée par API Key dynamique

Intégration de l’API externe OpenWeather

Panneau admin React + Vite

Route météo /weather/:city

🧩 Technologies utilisées
🔥 Backend

Node.js

TypeScript

Express

Sequelize (ORM)

MySQL

JWT (JSON Web Token)

Google OAuth 2.0 (passport.js)

dotenv

Swagger / OpenAPI 3

API Key Middleware

Cors

Express-session

🎨 Frontend Admin (projet séparé)

React

Vite

Axios

TailwindCSS

📦 Installation locale
1️⃣ Cloner le projet
git clone https://github.com/tonCompte/Chillies.git
cd Chillies

2️⃣ Installer les dépendances
npm install

3️⃣ Compiler TypeScript
npm run build

4️⃣ Lancer le serveur
npm start


Le serveur démarre sur :
👉 http://localhost:3000

⚙️ Configuration environnement (.env)

Créer un fichier .env à la racine :

# App
PORT=3000
SESSION_SECRET="secret"

# JWT
JWT_SECRET="your_jwt_secret_here"

# DB (Railway ou local)
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=chillies
DB_DIALECT=mysql

# Weather
OPENWEATHER_API_KEY=your_api_key_here

# Google OAuth
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
GOOGLE_CALLBACK_URL=http://localhost:3000/api/v1/auth/google/callback

🗄️ Base de données & ORM
Sequelize est utilisé pour :

✔ Utiliser MySQL
✔ Définir les modèles (Cocktail, User, Orders, ApiKey…)
✔ Synchronisation automatique
✔ Seeder (cocktails auto-ajoutés)

Commande utile :

npm run seed

📚 Documentation Swagger

📌 Disponible ici :
👉 http://localhost:3000/api-docs

Inclus :

Tous les endpoints documentés

Paramètres

Body JSON

Statuts HTTP

Sécurité (BearerAuth + API Key)

🌦 API Externe (OpenWeather)

Route publique météo :

GET /api/v1/weather/{city}


Exemple :

GET http://localhost:3000/api/v1/weather/Marseille


Réponse :

{
"city": "Marseille",
"temperature": 18.2,
"description": "clear sky"
}

🔑 API Publique via API Key
1️⃣ Générer une API Key (superuser)
POST /api/v1/api-keys/generate
Authorization: Bearer <token>

2️⃣ Appeler une route publique :
GET /api/v1/public/cocktails
x-api-key: <your_key_here>

🧱 Architecture du projet
Chillies/
│
├── config/
│   ├── database.js
│   ├── swagger.js
│
├── controllers/
│   ├── cocktailController.js
│   ├── orderController.js
│   ├── userController.js
│
├── middlewares/
│   ├── authenticateJWT.js
│   ├── checkApiKey.js
│   ├── checkSuperUser.js
│
├── models/
│   ├── User.js
│   ├── Cocktail.js
│   ├── Order.js
│   ├── ApiKey.js
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
1️⃣ Installer le CLI Railway
npm install -g railway

2️⃣ Se connecter
railway login

3️⃣ Initialiser projet
railway init

4️⃣ Lier à GitHub (recommandé)

Railway → New Project → Deploy from GitHub

5️⃣ Ajouter les variables d’environnement (Dashboard Railway → Variables)

JWT_SECRET

DB_HOST / USER / PASSWORD / NAME

OPENWEATHER_API_KEY

GOOGLE_CLIENT_ID

GOOGLE_CLIENT_SECRET

SESSION_SECRET

6️⃣ Déployer

Railway déploie automatiquement dès que tu pushes sur GitHub.

🧪 Tests (optionnel)

Exemple de test Jest pour /api/v1/cocktails :

describe("GET /api/v1/cocktails", () => {
it("should return list of cocktails", async () => {
const res = await request(app).get("/api/v1/cocktails");
expect(res.status).toBe(200);
});
});

📄 Licence

Projet développé dans le cadre d’un exercice pédagogique.
Libre de réutilisation et d’adaptation.
