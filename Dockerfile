FROM node:lts
WORKDIR /app
COPY package*.json ./
RUN apt-get update && apt-get install -y --no-install-recommends build-essential python3
RUN npm i --production
COPY . .

EXPOSE 80
CMD ["npm", "run", "dev"]