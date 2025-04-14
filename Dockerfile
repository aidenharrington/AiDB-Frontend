# Stage 1: Build the React app
FROM node:20 AS build
WORKDIR /app
COPY . .
COPY .env.docker .env
RUN npm install

# Get the build environment from build argument
ARG ENVIRONMENT=development
ENV NODE_ENV=${ENVIRONMENT}

# Development Environment
FROM node:20 AS dev
WORKDIR /app
COPY --from=build /app /app
RUN npm install

EXPOSE 3000

CMD [ "npm", "start" ]


# Production Environment
FROM nginx:alpine AS prod
WORKDIR /usr/share/nginx/html

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]