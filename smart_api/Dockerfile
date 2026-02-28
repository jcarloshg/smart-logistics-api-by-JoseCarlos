FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --include=dev

COPY . .

ARG PORT=3001
EXPOSE ${PORT}

CMD ["npm", "run", "dev"]
