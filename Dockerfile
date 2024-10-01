# Step 1: Use a base image
FROM node:18

# Step 2: Set working directory in container
WORKDIR /usr/src/app

# Step 3: Copy your extension's files to the container
COPY . .

# Step 4: Install dependencies if your extension has any (optional)
# RUN npm install

# Step 5: Run a command to build your extension (optional)
# For example, if you use webpack:
# RUN npm run build

# Step 6: Expose the necessary port (optional for dev servers)
# EXPOSE 8080

# Step 7: Set the default command (for running in a Chrome-like environment or testing)
# CMD ["echo", "Chrome extension packaged successfully!"]

