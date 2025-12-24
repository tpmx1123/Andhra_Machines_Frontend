# Environment Variables

## About `DEV` Variable

**You do NOT need to set `DEV=false` in your `.env` file.**

Vite automatically manages the `DEV` environment variable based on the build mode:

- **Development mode** (`npm run dev`): `import.meta.env.DEV` is automatically `true`
- **Production mode** (`npm run build`): `import.meta.env.DEV` is automatically `false`

The logger utility (`src/utils/logger.js`) uses `import.meta.env.DEV` to determine whether to log messages. This is handled automatically by Vite - no manual configuration needed.

## Available Environment Variables

If you need to set custom environment variables, create a `.env` file in the `frontend` directory:

```env
# API Base URL (required)
VITE_API_BASE_URL=http://localhost:8080

# For production, use:
# VITE_API_BASE_URL=https://api.andhramachinesagencies.com
```

**Note:** All Vite environment variables must be prefixed with `VITE_` to be accessible in the frontend code.

