# Frontend Environment Variables Setup

This project uses environment variables from a `.env` file for API configuration and external service URLs.

## Setup Instructions

1. **Create a `.env` file** in the `frontend` directory (same level as `package.json`)

2. **Copy the following template** and fill in your actual values:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8080/api

# WhatsApp Configuration
VITE_WHATSAPP_NUMBER=918328657726
```

3. **Replace the placeholder values:**
   - `VITE_API_BASE_URL`: Your backend API base URL (default: `http://localhost:8080/api`)
   - `VITE_WHATSAPP_NUMBER`: WhatsApp number with country code (without + sign, e.g., `918328657726` for +91 8328657726)

## Important Notes

- The `.env` file is already in `.gitignore` and will NOT be committed to version control
- Never commit your `.env` file with real values
- All Vite environment variables must start with `VITE_` prefix
- After creating/updating `.env` file, restart your development server
- The application will use fallback values if environment variables are not set

## Production Deployment

For production, set these environment variables in your hosting platform (Vercel, Netlify, etc.):

- `VITE_API_BASE_URL`: Your production API URL (e.g., `https://api.yourdomain.com/api`)
- `VITE_WHATSAPP_NUMBER`: Your production WhatsApp number

