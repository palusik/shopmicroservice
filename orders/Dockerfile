FROM node:boron
ADD package.json package.json
RUN npm install
ADD . .

EXPOSE 3004
CMD ["node","app.js"]

