FROM oven/bun:1-alpine AS development-dependencies-env
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

FROM oven/bun:1-alpine AS production-dependencies-env
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

FROM oven/bun:1-alpine AS build-env
WORKDIR /app
COPY --from=development-dependencies-env /app/node_modules ./node_modules
COPY . .

# Vite inlines import.meta.env.VITE_* at build time — Railway passes matching ARGs.
ARG VITE_SANITY_PROJECT_ID
ARG VITE_SANITY_DATASET
ARG VITE_SANITY_API_VERSION
ARG VITE_SANITY_STUDIO_URL
ARG VITE_PUBLIC_POSTHOG_HOST
ARG VITE_PUBLIC_POSTHOG_KEY
ARG VITE_NODE_ENV=production
ENV VITE_SANITY_PROJECT_ID=$VITE_SANITY_PROJECT_ID
ENV VITE_SANITY_DATASET=$VITE_SANITY_DATASET
ENV VITE_SANITY_API_VERSION=$VITE_SANITY_API_VERSION
ENV VITE_SANITY_STUDIO_URL=$VITE_SANITY_STUDIO_URL
ENV VITE_PUBLIC_POSTHOG_HOST=$VITE_PUBLIC_POSTHOG_HOST
ENV VITE_PUBLIC_POSTHOG_KEY=$VITE_PUBLIC_POSTHOG_KEY
ENV VITE_NODE_ENV=$VITE_NODE_ENV

RUN bun run build

FROM node:20-alpine
WORKDIR /app
COPY package.json bun.lock ./
COPY --from=production-dependencies-env /app/node_modules ./node_modules
COPY --from=build-env /app/build ./build
EXPOSE 3000
CMD ["node", "./node_modules/.bin/react-router-serve", "./build/server/index.js"]
