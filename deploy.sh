#!/bin/bash

# Deployment script voor CopyTool
echo "🚀 Start CopyTool deployment..."

# Build de React app
echo "📦 Building React app..."
npm run build

# Upload naar server
echo "📤 Uploading to server..."
scp -r dist transip:/data/sites/web/boukevdbergcom/www/copytool/

# Upload .htaccess
echo "🔐 Uploading .htaccess..."
scp copytool.htaccess transip:/data/sites/web/boukevdbergcom/www/copytool/.htaccess

# Upload server.js voor de backend
echo "🔧 Uploading server.js..."
scp server-copytool.js transip:/data/sites/web/boukevdbergcom/www/copytool/server.js

# Upload package.json voor dependencies
echo "📦 Uploading package.json..."
scp package.json transip:/data/sites/web/boukevdbergcom/www/copytool/

# Upload .env file (als deze bestaat)
echo "🔧 Uploading .env file..."
if [ -f .env ]; then
  scp .env transip:/data/sites/web/boukevdbergcom/www/copytool/
else
  echo "⚠️  .env file niet gevonden. Maak deze aan met je API keys."
fi

# Installeer dependencies op server
echo "📥 Installing dependencies on server..."
ssh transip "cd /data/sites/web/boukevdbergcom/www/copytool && npm install --production"

# Maak .htpasswd bestand aan op server (als het nog niet bestaat)
echo "🔑 Setting up authentication..."
ssh transip "cd /data/sites/web/boukevdbergcom/www/copytool && if [ ! -f .htpasswd ]; then htpasswd -c .htpasswd admin; fi"

echo "✅ Deployment voltooid!"
echo "🌐 Je tool is beschikbaar op: https://boukevdberg.com/copytool/"
echo "🔐 Gebruikersnaam: admin"
