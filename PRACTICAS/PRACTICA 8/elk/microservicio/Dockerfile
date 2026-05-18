FROM node:20-alpine

WORKDIR /app

# Instalar dependencias primero (aprovecha caché de Docker)
COPY package.json ./
RUN npm install --production

# Copiar el código fuente
COPY index.js ./

EXPOSE 3000

CMD ["node", "index.js"]
