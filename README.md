# AuthenJWT

## Description

Ce projet est une application web d'authentification utilisant JSON Web Tokens (JWT) pour sécuriser les sessions utilisateur. L'application permet aux utilisateurs de s'inscrire, de se connecter et d'accéder à une page de traduction privée après authentification.

## Fonctionnalités

- Inscription des utilisateurs
- Connexion des utilisateurs
- Authentification basée sur JWT
- Accès à une page de traduction privée après connexion

## Prérequis

- Node.js
- MongoDB

## Installation

1. Clonez le dépôt :

   ```sh
   git clone <URL_DU_DEPOT>

   ```

2. Ouvrez dans VsCode

3. Installez les dépendances :

   ```sh
   npm install

   ```

4. Créez un fichier .env à la racine du projet et ajoutez les variables d'environnement suivantes :
   ```sh
   </vscode_annotation> DB_URL=mongodb+srv://admin:admin@s3.koh03.mongodb.net/AUTH-TEST?retryWrites=true&w=majority&appName=s3
   TOKEN_SECRET=bsggqfjeifknqokenfkoqenf
   ```

## Utilisation

1. Démarrer le serveur :

   ```sh
   npm run dev

   ```

2. Ouvrez votre navigateur et accédez à http://localhost:3000 pour voir l'application.

## Structure du projet

- controllers: Contient les contrôleurs pour les routes d'authentification.
- models: Contient les modèles de données Mongoose.
- routes: Contient les routes de l'application.
- views: Contient les fichiers statiques (HTML, CSS, JS) pour l'interface utilisateur.
- server.js: Point d'entrée principal de l'application.

## Dépendances

- bcrypt
- cookie-parser
- dotenv
- express
- jsonwebtoken
- mongoose
- path

## Auteur

OKE K. Erwin

## Licence

Ce projet est sous licence MIT.
