FROM node:18-alpine

WORKDIR /app

# Copier les fichiers de config en premier pour profiter du cache Docker
COPY package.json package-lock.json tailwind.config.ts tsconfig.json postcss.config.js ./

# Installer toutes les dépendances (y compris devDependencies)
RUN npm install

# Copier tout le reste des fichiers
COPY . .

# Exposer le port 3000
EXPOSE 3000

# Lancer le serveur dev Next.js
CMD ["npm", "run", "dev"]
