# Taller API con Docker
Este documento describe los pasos y comandos utilizados en el taller para configurar y utilizar Docker en un entorno Linux. El taller incluye la instalación de Docker, la configuración de contenedores para PostgreSQL, Nginx y Node.js, así como la creación de una base de datos y una tabla en PostgreSQL.
## Instalación de Docker
```
for pkg in docker.io docker-doc docker-compose docker-compose-v2 podman-docker containerd runc; do
    sudo apt-get remove $pkg;
done
```

### Añadir la clave GPG oficial de Docker:
```
sudo apt-get update
sudo apt-get install ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg
```

### Añadir el repositorio a las fuentes de Apt:
```
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
```

### Instalar paquetes de Docker
```
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```
### Añadir el usuario al grupo Docker
```
sudo usermod -aG docker $USER
```

### Reiniciar el sistema
```
newgrp docker
```
Reiniciar la máquina

# Configuración de Docker para PostgreSQL

```
# Iniciar contenedor de PostgreSQL
docker run --name postgres_container -e POSTGRES_PASSWORD=1234 -d -p 5432:5432 -v $(pwd)/database:/var/lib/postgresql/data postgres

# Cambiar permisos del directorio de datos
sudo chmod a+x database/

# Acceder al contenedor PostgreSQL
docker exec -it postgres_container psql -U postgres

# Crear base de datos y tabla
CREATE DATABASE bbdd;
\c bbdd;
CREATE TABLE tarea (
    id serial PRIMARY KEY,
    nombre text,
    estado text
);
\q
```
# Configuración de Docker para Nginx
Iniciar contenedor de Nginx
```
docker run -d --name nginx_container -p 8081:80 -v $(pwd)/proyecto:/usr/share/nginx/html nginx
```
# Clonar el proyecto desde GitHub
```
sudo apt-get update

sudo apt-get install git

git clone https://github.com/KevsWit/Taller-API-Docker.git proyecto

cd proyecto
```

# Configuración de Docker para Node.js

## Iniciar contenedor de Node.js
```
docker run -it -d --name nodejs_container -p 3000:3000 -v $(pwd)/proyecto:/root/backend ubuntu bash
 ```
## Actualizar e instalar dependencias
```
apt update
apt-get install nano
apt install nodejs
apt install npm
apt install iputils-ping
```
## Obtener la dirección IP del contenedor PostgreSQL
```
docker inspect postgres_container | grep IPAddress
```
## Realizar ping a una dirección
```
ping [dirección IP]
```
o usar el siguiente script para confirmar la actividad en mas de un contenedor
```
#!/bin/bash

if [ "$#" -eq 0 ]; then
    echo "Uso: $0 <IP_del_Contenedor1> <IP_del_Contenedor2> ..."
    exit 1
fi

for ip_contenedor in "$@"; do
    
    ping -c 1 "$ip_contenedor" &> /dev/null

    if [ "$?" -eq 0 ]; then
        echo "[+] La IP del Contenedor ($ip_contenedor) está activa."
    else
        echo "[-] La IP del Contenedor ($ip_contenedor) no responde."
    fi
done
```
## Instalar paquetes Node.js
```
npm install express body-parser pg cors
```
## Ejecutar la aplicación Node.js
``` 
node backend.js
 ```
# Dockerizacion de la api
Se tienen una carpeta principal en donde se encontrar nuestro Dockerfile principal acompañado de la carpeta en donde estara la database, el backend, el frontend y
el proyecto de donde se cara la api, cada una de estas carpetas consta de su propio Dockerfile. Previo a todo esto se necesitara clonar el repositorio de github
en la carpeta principal
```
git clone https://github.com/KevsWit/Taller-API-Docker.git /usr/share/nginx/html
```
Comenzaremos por la base de datos
## Dockerfile para base de datos en posgresFROM postgres
```
FROM postgres

ENV POSTGRES_PASSWORD = 1234
VOLUME /var/lib/postgresql/data

COPY dataTodo.sql /docker-entrypoint-initdb.d/
EXPOSE 5432
```
Tambien usamos un script .sql para poder crear la base de datos ademas de creo una carpeta llama database para poder tener la persistencia en los datos.
Aquí el script:
```                                              
-- init.sql
CREATE DATABASE bbdd;
\c bbdd;
CREATE TABLE tarea (
    id serial PRIMARY KEY,
    nombre text,
    estado text
);
```
comando para construir el contenedor y ejecutar el contenedor.
```
docker build -t posgres .
docker run --name postgres_container -d -p 5432:5432 -v $(pwd)/database:/var/lib/postgresql/data dataposgres
```
El comando de run deber ser ejecutado en donde se tenga la carpeta de database
## Dockerfile para el frontend usando nginx
Para este caso es lo mismo en nuestra carpeta de frontend tendremos el siguiente Dockerfile
```
# Dockerfile para Nginx 

# Utiliza la imagen base de Nginx
FROM nginx

# Volumen
VOLUME /usr/share/nginx/html

# Exponer el puerto 80
EXPOSE 80

# Instalar git (puedes necesitar sudo si estás en una imagen que lo requiere)
RUN apt-get update && apt-get install -y git

# Comando predeterminado para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
```
comando para construir el contenedor y ejecutar el contenedor.
```
docker build -t fronted .
docker run -d --name nginx_container -p 8081:80 -v /home/administrador/Documentos/dockerFile/proyecto:/usr/share/nginx/html fronted
```
La ruta especificado para el origien del volumen de montaje, es en donde se encuentra el proyecto clonado previamente en la carpeta principal
## Dockerfile para el backend usando ubuntu
Este Dockerfile debera esta en nuestra carpeta principal
```
# Utiliza la imagen base de Ubuntu
FROM ubuntu
                                     
# Establece el directorio de trabajo
WORKDIR /root/backend

# Copia los archivos de la aplicación al contenedor
COPY proyecto /root/backend

# Actualiza e instala dependencias
RUN apt-get update
RUN apt-get install -y npm
RUN apt-get install -y nodejs

# Instala paquetes Node.js
RUN npm install express
RUN npm install body-parser
RUN npm install  pg
RUN npm install cors

# Expone el puerto 3000
EXPOSE 3000

# Comando predeterminado para ejecutar la aplicación Node.js
CMD ["node", "backend.js"]

```
Este se encuentrar principal porque estamos copiando el proyecto a la carpeta del backend creada en el contenedor
comando para construir el contenedor y ejecutar el contenedor.
```
docker build -t backend .
docker run -it -d --name nodejs_container -p 3000:3000 -v $(pwd)/proyecto:/root/backend backend
```
