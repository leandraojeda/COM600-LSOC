# Usar una imagen base de Node.js
FROM node:20-alpine

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app
# Copiar el resto de los archivos del proyecto
COPY . .

# Instalar las dependencias
RUN npm install



# Crear las carpetas uploads y logs si no existen


# Exponer el puerto 3000
EXPOSE 3000

# Comando para iniciar el servidor
CMD ["node", "app.js"]