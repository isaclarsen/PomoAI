FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG VITE_API_URL_DEV=/api/
ARG VITE_FIREBASE_API_KEY=dummy
ARG VITE_FIREBASE_AUTH_DOMAIN=dummy.firebaseapp.com
ARG VITE_FIREBASE_PROJECT_ID=dummy-project
ARG VITE_FIREBASE_STORAGE_BUCKET=dummy-project.appspot.com
ARG VITE_FIREBASE_MESSAGING_SENDER_ID=000000000000
ARG VITE_FIREBASE_APP_ID=1:000000000000:web:dummy

ENV VITE_API_URL_DEV=${VITE_API_URL_DEV}
ENV VITE_FIREBASE_API_KEY=${VITE_FIREBASE_API_KEY}
ENV VITE_FIREBASE_AUTH_DOMAIN=${VITE_FIREBASE_AUTH_DOMAIN}
ENV VITE_FIREBASE_PROJECT_ID=${VITE_FIREBASE_PROJECT_ID}
ENV VITE_FIREBASE_STORAGE_BUCKET=${VITE_FIREBASE_STORAGE_BUCKET}
ENV VITE_FIREBASE_MESSAGING_SENDER_ID=${VITE_FIREBASE_MESSAGING_SENDER_ID}
ENV VITE_FIREBASE_APP_ID=${VITE_FIREBASE_APP_ID}

RUN npm run build

FROM nginx:1.27-alpine
RUN rm -f /etc/nginx/conf.d/default.conf && \
    { \
      echo 'server {'; \
      echo '  listen 5173;'; \
      echo '  server_name _;'; \
      echo ''; \
      echo '  root /usr/share/nginx/html;'; \
      echo '  index index.html;'; \
      echo ''; \
      echo '  location / {'; \
      echo '    try_files $uri /index.html;'; \
      echo '  }'; \
      echo ''; \
      echo '  location /api/ {'; \
      echo '    proxy_pass http://backend:8080;'; \
      echo '    proxy_http_version 1.1;'; \
      echo '    proxy_set_header Host $host;'; \
      echo '    proxy_set_header X-Real-IP $remote_addr;'; \
      echo '    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;'; \
      echo '    proxy_set_header X-Forwarded-Proto $scheme;'; \
      echo '  }'; \
      echo '}'; \
    } > /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 5173

CMD ["nginx", "-g", "daemon off;"]
