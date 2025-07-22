# Deployment Guide - MaintAI Platform

This guide provides step-by-step instructions for deploying the MaintAI Platform to various hosting platforms, with a focus on Vercel deployment.

## Prerequisites

Before deploying, ensure you have:
- Node.js 18+ installed
- Git installed and configured
- A GitHub account (for Vercel integration)
- The project built successfully locally

## Vercel Deployment (Recommended)

Vercel is the recommended platform for deploying this React application due to its seamless integration with Vite and excellent performance.

### Method 1: GitHub Integration (Recommended)

This is the easiest and most maintainable deployment method.

#### Step 1: Prepare Your Repository

1. **Create a GitHub repository:**
   ```bash
   # If you haven't already, initialize git in your project
   git init
   
   # Add all files
   git add .
   
   # Commit your changes
   git commit -m "Initial commit: MaintAI Platform with A/B testing"
   
   # Add your GitHub repository as origin
   git remote add origin https://github.com/yourusername/maint-ai-app.git
   
   # Push to GitHub
   git push -u origin main
   ```

2. **Ensure your repository is public or you have Vercel access to private repos**

#### Step 2: Deploy to Vercel

1. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**

2. **Click "New Project"**

3. **Import your GitHub repository:**
   - Select "Import Git Repository"
   - Choose your `maint-ai-app` repository
   - Click "Import"

4. **Configure the project:**
   - **Project Name**: `maint-ai-app` (or your preferred name)
   - **Framework Preset**: Vercel will automatically detect "Vite"
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)

5. **Deploy:**
   - Click "Deploy"
   - Wait for the build to complete (usually 1-3 minutes)
   - Your app will be available at `https://your-project-name.vercel.app`

#### Step 3: Configure Custom Domain (Optional)

1. In your Vercel project dashboard, go to "Settings" > "Domains"
2. Add your custom domain
3. Follow Vercel's instructions to configure DNS

### Method 2: Vercel CLI

For developers who prefer command-line deployment:

#### Step 1: Install Vercel CLI

```bash
npm i -g vercel
```

#### Step 2: Login to Vercel

```bash
vercel login
```

#### Step 3: Deploy

```bash
# From your project root directory
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? (select your account)
# - Link to existing project? No
# - What's your project's name? maint-ai-app
# - In which directory is your code located? ./
```

#### Step 4: Production Deployment

```bash
vercel --prod
```

### Method 3: Manual Upload

If you prefer to upload the built files manually:

#### Step 1: Build the Project

```bash
npm run build
```

#### Step 2: Upload to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Select "Import Third-Party Git Repository" or "Deploy from ZIP"
4. Upload your `dist/` folder
5. Configure as a static site

## Alternative Deployment Platforms

### Netlify

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify:**
   - Go to [Netlify](https://netlify.com)
   - Drag and drop the `dist/` folder
   - Or connect your GitHub repository

3. **Configuration:**
   - Build command: `npm run build`
   - Publish directory: `dist`

### GitHub Pages

1. **Install gh-pages:**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Update package.json:**
   ```json
   {
     "homepage": "https://yourusername.github.io/maint-ai-app",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. **Deploy:**
   ```bash
   npm run deploy
   ```

### Firebase Hosting

1. **Install Firebase CLI:**
   ```bash
   npm install -g firebase-tools
   ```

2. **Initialize Firebase:**
   ```bash
   firebase init hosting
   ```

3. **Configure firebase.json:**
   ```json
   {
     "hosting": {
       "public": "dist",
       "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
       "rewrites": [
         {
           "source": "**",
           "destination": "/index.html"
         }
       ]
     }
   }
   ```

4. **Deploy:**
   ```bash
   npm run build
   firebase deploy
   ```

## Environment Variables

If you need to add environment variables:

### For Vercel:

1. Go to your project dashboard
2. Navigate to "Settings" > "Environment Variables"
3. Add your variables (prefix with `VITE_` for client-side access)

### For Local Development:

Create a `.env` file in your project root:
```env
VITE_API_URL=https://api.example.com
VITE_APP_NAME=MaintAI Platform
```

## Build Optimization

### Analyzing Bundle Size

```bash
npm run build
npx vite-bundle-analyzer dist
```

### Performance Optimizations

1. **Enable gzip compression** (automatically handled by Vercel)
2. **Use CDN** (Vercel provides global CDN)
3. **Optimize images** (consider using Vercel's image optimization)

## Troubleshooting

### Common Issues

1. **Build fails with "Cannot resolve module":**
   - Check all import paths are correct
   - Ensure all dependencies are in package.json
   - Run `npm install` to ensure all packages are installed

2. **A/B testing data not persisting:**
   - This is expected behavior as the demo uses localStorage
   - For production, integrate with a proper analytics service

3. **Styling issues after deployment:**
   - Ensure Tailwind CSS is properly configured
   - Check that all CSS files are imported correctly

4. **404 errors on refresh:**
   - For SPAs, ensure your hosting platform is configured for client-side routing
   - Vercel handles this automatically for Vite projects

### Build Logs

Check build logs for detailed error information:
- **Vercel**: Available in the deployment dashboard
- **Netlify**: Available in the deploy log section
- **Local**: Run `npm run build` to see build output

## Monitoring and Analytics

### Vercel Analytics

Enable Vercel Analytics for performance monitoring:
1. Go to your project dashboard
2. Navigate to "Analytics"
3. Enable Web Analytics

### A/B Testing Analytics

The built-in A/B testing framework provides:
- User assignment tracking
- Conversion rate monitoring
- Real-time analytics dashboard

For production use, consider integrating with:
- Google Analytics
- Mixpanel
- Amplitude
- Custom analytics backend

## Security Considerations

1. **Environment Variables**: Never commit sensitive data to your repository
2. **HTTPS**: All deployment platforms mentioned provide HTTPS by default
3. **Content Security Policy**: Consider implementing CSP headers
4. **Authentication**: The demo authentication is for demonstration only

## Maintenance

### Updating the Application

1. **Make changes locally**
2. **Test thoroughly**
3. **Commit and push to GitHub**
4. **Vercel will automatically redeploy** (if using GitHub integration)

### Monitoring

- Set up monitoring for uptime and performance
- Monitor A/B testing results regularly
- Keep dependencies updated

## Support

If you encounter issues during deployment:

1. **Check the build logs** for specific error messages
2. **Verify all dependencies** are correctly installed
3. **Test the build locally** before deploying
4. **Consult platform-specific documentation**:
   - [Vercel Documentation](https://vercel.com/docs)
   - [Netlify Documentation](https://docs.netlify.com/)
   - [Firebase Hosting Documentation](https://firebase.google.com/docs/hosting)

## Conclusion

The MaintAI Platform is optimized for modern deployment platforms, with Vercel being the recommended choice due to its excellent Vite integration and performance. The A/B testing framework works seamlessly across all deployment methods, providing valuable insights into user behavior and application performance.

