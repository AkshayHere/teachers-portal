# ---------- STAGE 1: Build ----------
FROM node:18-alpine AS builder

WORKDIR /app

# Copy only necessary files first (for better caching)
COPY package*.json ./
RUN npm install --production=false

# Copy the rest of the code
COPY . .

# Generate Prisma client and build TypeScript
RUN npx prisma generate
RUN npm run build


# ---------- STAGE 2: Run ----------
FROM node:18-alpine

WORKDIR /app

# Copy only production dependencies
COPY package*.json ./
RUN npm install --production

# Copy built files and Prisma artifacts from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Set environment variables
ENV NODE_ENV=production
EXPOSE 3000

# Run migrations and start app
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]
