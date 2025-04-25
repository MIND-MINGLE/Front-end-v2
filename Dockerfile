FROM node:18 AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm i --save
COPY . .
RUN npm run build

# Using nginx to serve the static files
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 5173
CMD ["nginx", "-g", "daemon off;"]
# nginx default port is 80. Change to 5173
# To change that, we need our own config file for nginx
