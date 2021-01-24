FROM node:12-alpine
WORKDIR /minecraft-bot-panel
COPY . .
RUN npm install --production
CMD ["node", "/minecraft-bot-panel/index.js"]