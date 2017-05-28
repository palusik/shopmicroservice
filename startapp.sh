#!/bin/sh


# Run the MySQL container, with a database named 'users' and credentials
# for a users-service user which can access it.
echo "Starting DB..."
pwd  
cd database

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

cd ../catalogue
npm install

cd ../users
npm install

cd ../orders
npm install

cd ../helpdesk
npm install

cd ../front-end
npm install


  