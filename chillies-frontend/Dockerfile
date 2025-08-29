FROM node:20-slim

WORKDIR /app

COPY chillies-frontend/package*.json ./
RUN npm ci --legacy-peer-deps || npm install --legacy-peer-deps

COPY chillies-frontend/. ./

EXPOSE 5173

# Default command runs Vite dev server; compose overrides to set host/port
CMD ["npm", "run", "dev"]
