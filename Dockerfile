FROM node:20-slim

WORKDIR /app

# Install dependencies only when needed
COPY package*.json ./
RUN npm install

# Copy source files
COPY . .

# Expose port 5173 for Vite dev server
EXPOSE 5173

# Default to development server
CMD ["npm", "run", "dev", "--", "--host"]