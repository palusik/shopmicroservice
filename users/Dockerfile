FROM node:boron
ADD package.json package.json
RUN npm install
ADD . .

EXPOSE 3001
CMD ["node","app.js"]

