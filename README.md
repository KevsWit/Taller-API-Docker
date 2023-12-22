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

