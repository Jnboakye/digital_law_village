# Redis Setup Guide

Redis is required for session management in this application. Follow these steps to install and start Redis.

## macOS (using Homebrew)

1. **Install Redis:**
   ```bash
   brew install redis
   ```

2. **Start Redis:**
   ```bash
   brew services start redis
   ```

3. **Verify Redis is running:**
   ```bash
   redis-cli ping
   ```
   You should see `PONG` as the response.

4. **Stop Redis (when needed):**
   ```bash
   brew services stop redis
   ```

## Using Docker

1. **Run Redis in a Docker container:**
   ```bash
   docker run -d -p 6379:6379 --name redis redis
   ```

2. **Verify Redis is running:**
   ```bash
   docker ps
   ```

3. **Stop Redis:**
   ```bash
   docker stop redis
   ```

## Linux (Ubuntu/Debian)

1. **Install Redis:**
   ```bash
   sudo apt update
   sudo apt install redis-server
   ```

2. **Start Redis:**
   ```bash
   sudo systemctl start redis
   sudo systemctl enable redis  # Enable on boot
   ```

3. **Verify Redis is running:**
   ```bash
   redis-cli ping
   ```

## Windows

1. **Download Redis for Windows:**
   - Download from: https://github.com/microsoftarchive/redis/releases
   - Or use WSL2 with the Linux instructions above

2. **Run Redis:**
   ```bash
   redis-server
   ```

## Verify Installation

After starting Redis, you should see a message in your Next.js terminal indicating:
```
✓ Connected to Redis
```

If you see connection errors, make sure Redis is running and accessible on `localhost:6379` (or the URL specified in your `.env.local` file).

## Environment Variable

Make sure your `.env.local` file has:
```env
REDIS_URL=redis://localhost:6379
```

This is the default value, so you don't need to set it unless Redis is running on a different host/port.

