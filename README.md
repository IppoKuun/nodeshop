# NodeShop

NodeShop est un projet fullstack d'apprentissage construit pour consolider des bases backend avec Express, MongoDB, sessions, validation, middlewares et audit logs.

Statut du projet : learning project / backend foundations. Ce n'est pas un produit e-commerce mature ni une application commerciale.

## Stack

- Frontend : Next.js, React, Tailwind CSS, Axios
- Backend : Node.js, Express, Mongoose, Joi
- Auth : express-session, connect-mongo, cookies httpOnly
- Sécurité : Helmet, CORS whitelist, rate limiting login, validation payloads
- Services : MongoDB Atlas, Cloudinary pour l'upload d'images

## Fonctionnalités

- Catalogue produits public
- Page détail produit
- Connexion admin par session
- CRUD produit réservé aux rôles `owner` et `admin`
- Upload d'images Cloudinary signé côté backend
- Pagination et tri
- Audit logs des actions produit

## Architecture

```text
backend/
  controllers/   Logique applicative Express
  middlewares/   Auth, validation, CSRF origin check, rate limiting
  models/        Modèles Mongoose
  routes/        Routes API
  utils/         Pagination, query builder, sanitize, audit

frontend/
  src/app/       Application Next.js
  src/app/lib/   Client API et configuration d'URL
```

## Variables d'environnement

### Backend

| Nom | Obligatoire | Utilité |
| --- | --- | --- |
| `NODE_ENV` | Oui en prod | Active le comportement production |
| `PORT` | Selon plateforme | Port du serveur Express |
| `MONGO_Url` | Oui | Connexion MongoDB Atlas |
| `SESSION_SECRET` | Oui en prod | Signature des sessions |
| `SESSION_NAME` | Non | Nom du cookie de session |
| `SESSION_MAX_AGE` | Non | Durée de session en secondes |
| `FRONTEND_URL` | Oui | Origine frontend autorisée |
| `CORS_ORIGINS` | Recommandé | Liste d'origines autorisées, séparées par virgule |
| `COOKIE_SAME_SITE` | Recommandé | `none` si frontend/backend sont sur domaines séparés |
| `COOKIE_SECURE` | Recommandé | `true` en production HTTPS |
| `TRUST_PROXY` | Oui sur Render/Railway/Fly | Active les cookies secure derrière proxy |
| `CLOUDINARY_API_KEY` | Si upload | Clé publique Cloudinary |
| `CLOUDINARY_API_SECRET` | Si upload | Secret de signature Cloudinary |

### Frontend

| Nom | Obligatoire | Utilité |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | Oui en prod | URL publique du backend |
| `NEXT_PUBLIC_API_URL_DEV` | Non | URL backend locale |
| `NEXT_PUBLIC_API_URL_PROD` | Non | URL backend production |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Si upload | Cloud name Cloudinary |

## Scripts

Backend :

```bash
cd backend
npm run dev
npm start
npm run seed:users
npm run lint
```

Frontend :

```bash
cd frontend
npm run dev
npm run build
npm start
npm run lint
```

## Setup local

1. Installer les dépendances dans `backend/` et `frontend/`.
2. Créer `backend/.env` avec MongoDB Atlas, session secret, CORS et Cloudinary.
3. Créer `frontend/.env.local` avec l'URL de l'API et le cloud name Cloudinary.
4. Lancer le backend avec `npm run dev`.
5. Lancer le frontend avec `npm run dev`.

Par défaut, le frontend tourne sur `http://localhost:3000` et le backend sur `http://localhost:4000`.

## Déploiement

Recommandation réaliste :

- Frontend : Vercel, root directory `frontend`
- Backend : Railway, Fly.io ou Render, root directory `backend`
- Base de données : MongoDB Atlas

Pour un déploiement frontend/backend sur domaines séparés, configurer les cookies backend avec `COOKIE_SAME_SITE=none`, `COOKIE_SECURE=true` et `TRUST_PROXY=true`.

## Limites connues

- Projet d'apprentissage, pas une boutique prête pour production commerciale.
- Pas encore de tests automatisés métier.
- Backoffice minimal.
- Comptes demo à garder avec rôle lecture seule.
- Upload Cloudinary dépend d'une route backend protégée par session admin.

