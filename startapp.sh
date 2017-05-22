#!/bin/sh


# Run the MySQL container, with a database named 'users' and credentials
# for a users-service user which can access it.
echo "Starting DB..."
pwd  
cd test-databases

docker run --name db -d \  
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=shop -e MYSQL_USER=root -e MYSQL_PASSWORD=root \
  -p 3306:3306 \
  mysql:latest

# Wait for the database service to start up.
echo "Waiting for DB to start up..."  
docker exec db mysqladmin --silent --wait=30 -uroot -proot ping || exit 1

# Run the setup script.
echo "Setting up initial data..."  
docker exec -i db mysql -uroot -proot shop < setup.sql

cd ../cart
npm install
nohup node app.js &

cd ../catalogue
npm install
nohup node app.js &

cd ../users
npm install
nohup node app.js &

cd ../orders
npm install
nohup node app.js &

cd ../helpdesk
npm install
nohup node app.js &

cd ../front-end
npm install
nohup npm start &

  