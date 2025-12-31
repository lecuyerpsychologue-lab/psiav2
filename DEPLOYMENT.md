# Deployment Guide - TheraSpace

## Prerequisites

- Node.js 18+ installed
- Vercel account
- Mistral AI API key (optional, for AI features)

## Local Development

1. **Install dependencies**
```bash
npm install
```

2. **Run development server**
```bash
npm run dev
```

3. **Access the app**
Open http://localhost:3000 in your browser

## Production Build

```bash
npm run build
```

The build output will be in the `dist/` directory.

## Deployment to Vercel

### Method 1: Vercel CLI

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Deploy**
```bash
vercel
```

For production:
```bash
vercel --prod
```

### Method 2: GitHub Integration

1. Connect your GitHub repository to Vercel
2. Push your code to GitHub
3. Vercel will automatically build and deploy

### Environment Variables

In your Vercel project settings, add:

```
MISTRAL_API_KEY=your_mistral_api_key_here
```

This is optional but required for AI-powered features.

## Post-Deployment

### Test the deployment

1. Visit your deployed URL
2. Create a test account
3. Test all modules:
   - Humeur (mood tracking)
   - Respiration (breathing)
   - Ancrage (grounding)
   - Journal (notes)
   - PsIA (chat)
   - Oracle (wisdom stories)

### PWA Installation

On mobile devices:
1. Visit the site
2. Look for "Add to Home Screen" prompt
3. Install as PWA

## Configuration

### Custom Domain

In Vercel dashboard:
1. Go to your project settings
2. Navigate to "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

### Analytics

Vercel provides built-in analytics:
1. Enable in project settings
2. View real-time and historical data

## Monitoring

### Check Serverless Functions

Monitor the `/api/chat` endpoint:
- View function logs in Vercel dashboard
- Check error rates
- Monitor response times

### Performance

Vercel provides:
- Real User Monitoring (RUM)
- Core Web Vitals tracking
- Performance insights

## Troubleshooting

### Build Fails

1. Check Node.js version compatibility
2. Clear node_modules and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

### API Not Working

1. Verify MISTRAL_API_KEY is set in environment variables
2. Check Vercel function logs
3. Test API endpoint: `https://your-domain.vercel.app/api/chat`

### PWA Not Installing

1. Verify HTTPS is enabled (automatic on Vercel)
2. Check manifest.json is accessible
3. Ensure icons are properly configured

## Security Considerations

1. **Never commit API keys** - Use environment variables
2. **Password hashing** - Already implemented client-side
3. **localStorage** - Data stays on user's device
4. **CORS** - Configured in API endpoint

## Updating

To update the deployment:

1. Make changes locally
2. Test thoroughly with `npm run dev`
3. Build with `npm run build`
4. Push to GitHub (auto-deploys) or run `vercel --prod`

## Support

For issues:
1. Check Vercel deployment logs
2. Review browser console for errors
3. Test API endpoints individually

## Costs

- Vercel: Free tier sufficient for most use cases
- Mistral AI: Pay-per-use (check pricing at mistral.ai)

## Backup

LocalStorage data is stored on user's device:
- Consider implementing export feature
- Users should backup important data
- Add data export functionality for critical information

---

**Note**: TheraSpace is a wellness support tool and does not replace professional therapy.
