#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🏗️  Building Stefano website for production deployment...');

try {
  // Clean previous build
  if (fs.existsSync('dist')) {
    fs.rmSync('dist', { recursive: true, force: true });
    console.log('✅ Cleaned previous build');
  }

  // Build frontend
  console.log('📦 Building frontend...');
  execSync('npm run build', { stdio: 'inherit' });

  // Copy server files to dist
  console.log('🖥️  Copying server files...');
  const serverDist = path.join('dist', 'server');
  fs.mkdirSync(serverDist, { recursive: true });
  
  // Copy server files
  const serverFiles = ['index.ts', 'routes.ts', 'storage.ts', 'vite.ts'];
  serverFiles.forEach(file => {
    if (fs.existsSync(path.join('server', file))) {
      fs.copyFileSync(
        path.join('server', file),
        path.join(serverDist, file)
      );
    }
  });

  // Copy shared schema
  fs.mkdirSync(path.join('dist', 'shared'), { recursive: true });
  fs.copyFileSync('shared/schema.ts', path.join('dist', 'shared', 'schema.ts'));

  // Copy static assets
  console.log('🖼️  Copying static assets...');
  if (fs.existsSync('attached_assets')) {
    const assetsPath = path.join('dist', 'attached_assets');
    fs.mkdirSync(assetsPath, { recursive: true });
    
    const files = fs.readdirSync('attached_assets');
    files.forEach(file => {
      fs.copyFileSync(
        path.join('attached_assets', file),
        path.join(assetsPath, file)
      );
    });
  }

  // Copy deployment files
  console.log('⚙️  Copying deployment configuration...');
  const deploymentFiles = ['.htaccess', 'robots.txt', 'sitemap.xml'];
  deploymentFiles.forEach(file => {
    if (fs.existsSync(file)) {
      fs.copyFileSync(file, path.join('dist', file));
    }
  });

  // Create production package.json
  const productionPackage = {
    name: "stefano-website",
    version: "1.0.0",
    description: "Restauracja & Pub Stefano - Official Website",
    main: "index.html",
    scripts: {
      start: "node server/index.js"
    },
    dependencies: {
      express: "^4.18.2",
      cors: "^2.8.5"
    },
    engines: {
      node: ">=16.0.0"
    }
  };

  fs.writeFileSync(
    path.join('dist', 'package.json'),
    JSON.stringify(productionPackage, null, 2)
  );

  // Create deployment README
  const deploymentReadme = `# Stefano Website - Production Build

## Files included:
- index.html (main page)
- assets/ (CSS, JS, images)
- attached_assets/ (logos and custom images)
- server/ (backend files if Node.js is available)
- .htaccess (Apache configuration)
- robots.txt (SEO)
- sitemap.xml (SEO)

## Upload to GoDaddy:
1. Upload all files to public_html/
2. Ensure .htaccess is in the root
3. Set up environment variables if using Node.js backend
4. Test the website

## Domain: stefanogroup.pl
## Contact: stefano@stefanogroup.pl
`;

  fs.writeFileSync(path.join('dist', 'README-DEPLOYMENT.md'), deploymentReadme);

  console.log('✅ Production build complete!');
  console.log('📁 Files ready in /dist folder');
  console.log('🚀 Ready for upload to stefanogroup.pl');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}