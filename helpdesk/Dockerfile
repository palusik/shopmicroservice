FROM node:boron
ADD package.json package.json
RUN npm install
ADD . .

EXPOSE 3005
CMD ["node","app.js"]

