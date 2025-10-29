FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 4000

# Modo desarrollo con nodemon
CMD ["npm","run","dev"]

