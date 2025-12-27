# ---- Base ----
FROM node:20-alpine

WORKDIR /app

# OS deps needed by Prisma
RUN apk add --no-cache openssl libc6-compat

# ---- Dependencies ----
COPY package.json package-lock.json ./
RUN npm ci

# ---- App source ----
COPY . .

# ---- Prisma ----
RUN npx prisma generate

# ---- Build Next.js ----
RUN npm run build

# ---- Runtime ----
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["npm", "run", "start"]
