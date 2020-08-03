FROM node:12
RUN npm install pm2 -g
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
#CMD ["npm", "run", "start"]
CMD ["pm2-runtime", "index.js"]

