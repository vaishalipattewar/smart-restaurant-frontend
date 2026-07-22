FROM node:20-alpine AS builder
WORKDIR /smart-restaurant
COPY package*.json ./
RUN npm install
COPY . .

# 1. Declare the ARG argument parameter
ARG VITE_API_URL
# 2. Inject it into the environment scope during compilation
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

FROM nginx:1.25-alpine
COPY --from=builder /smart-restaurant/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
