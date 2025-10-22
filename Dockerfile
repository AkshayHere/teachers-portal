FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy Prisma schema and generate client
COPY prisma ./prisma/
# RUN npx prisma generate

COPY .env.example .env

# Copy the rest of the code
COPY . .

# Build the TypeScript code
RUN npm run build

# Add entrypoint script
COPY entrypoint.sh /app/
RUN chmod +x /app/entrypoint.sh

# Expose the app port (adjust if needed)
EXPOSE 3000

# Start the app using entrypoint script
CMD ["/app/entrypoint.sh"]
