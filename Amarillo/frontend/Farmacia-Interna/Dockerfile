FROM node:20-alpine AS build
WORKDIR /app
COPY package.json ./
# Forzamos la limpieza e instalación de binarios para Linux
RUN rm -rf node_modules package-lock.json && npm install
COPY . .
RUN npm run build

FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
RUN echo "server { listen 80; location / { root /usr/share/nginx/html; index index.html; try_files \$uri \$uri/ /index.html; } }" > /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]