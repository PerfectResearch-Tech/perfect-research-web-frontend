FROM node:18-alpine

WORKDIR /app

# Copier les fichiers de config d'abord
COPY package.json package-lock.json tailwind.config.ts tsconfig.json postcss.config.js ./

# Installer toutes les dépendances (pas seulement production)
RUN npm install

# Copier tout le reste
COPY . .

# Générer la build
RUN npm run build

# Exposer le port de l’app
EXPOSE 3000

# Lancer en production
CMD ["npm", "start"]
