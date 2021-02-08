FROM node:15-alpine
WORKDIR /minecraft-bot-panel
COPY . .
RUN npm install --production
CMD ["node", "/minecraft-bot-panel/index.js"]