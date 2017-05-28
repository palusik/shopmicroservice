FROM mysql:latest

ENV MYSQL_ROOT_PASSWORD root  
ENV MYSQL_DATABASE shop  
ENV MYSQL_USER shop_user  
ENV MYSQL_PASSWORD shop_user

EXPOSE 3306

ADD setup.sql /docker-entrypoint-initdb.d
