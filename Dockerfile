FROM node:20-bookworm

WORKDIR /app

# System deps for Prisma
RUN apk add --no-cache openssl libc6-compat

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy app files
COPY . .

ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

# Generate Prisma client and build
RUN npx prisma generate
RUN npm run build

EXPOSE 3000

ENV NODE_ENV=production

CMD ["npx", "next", "start"]