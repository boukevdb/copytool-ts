#!/bin/bash

# Deployment script voor CopyTool met automatisch wachtwoord
echo "🚀 Start CopyTool deployment..."

# Build de React app
echo "📦 Building React app..."
npx vite build --mode production

# Fix asset paths in index.html
echo "🔧 Fixing asset paths..."
sed -i '' 's|src="./assets/|src="./dist/assets/|g' dist/index.html
sed -i '' 's|href="./assets/|href="./dist/assets/|g' dist/index.html

# Functie om SSH commando's uit te voeren met automatisch wachtwoord
ssh_with_password() {
    expect -c "
        spawn ssh $1
        expect {
            'password:' {
                send 'Formule189!\r'
                exp_continue
            }
            'boukevdbergcom@boukew.ssh.transip.me' {
                send '$2\r'
                expect eof
            }
        }
    "
}

# Functie om SCP commando's uit te voeren met automatisch wachtwoord
scp_with_password() {
    expect -c "
        spawn scp $1 $2
        expect {
            'password:' {
                send 'Formule189!\r'
                exp_continue
            }
            eof
        }
    "
}

# Upload naar server
echo "📤 Uploading to server..."
scp_with_password "-r dist" "boukevdbergcom@boukew.ssh.transip.me:/data/sites/web/boukevdbergcom/www/copytool/"

# Upload .htaccess
echo "🔐 Uploading .htaccess..."
scp_with_password "copytool.htaccess" "boukevdbergcom@boukew.ssh.transip.me:/data/sites/web/boukevdbergcom/www/copytool/.htaccess"

# Upload server.js voor de backend
echo "🔧 Uploading server.js..."
scp_with_password "server-copytool.js" "boukevdbergcom@boukew.ssh.transip.me:/data/sites/web/boukevdbergcom/www/copytool/server.js"

# Upload package.json voor dependencies
echo "📦 Uploading package.json..."
scp_with_password "package.json" "boukevdbergcom@boukew.ssh.transip.me:/data/sites/web/boukevdbergcom/www/copytool/"

# Upload .env file (als deze bestaat)
echo "🔧 Uploading .env file..."
if [ -f .env ]; then
  scp_with_password ".env" "boukevdbergcom@boukew.ssh.transip.me:/data/sites/web/boukevdbergcom/www/copytool/"
else
  echo "⚠️  .env file niet gevonden. Maak deze aan met je API keys."
fi

# Installeer dependencies op server
echo "📥 Installing dependencies on server..."
ssh_with_password "boukevdbergcom@boukew.ssh.transip.me" "cd /data/sites/web/boukevdbergcom/www/copytool && npm install --production"

# Maak .htpasswd bestand aan op server (als het nog niet bestaat)
echo "🔑 Setting up authentication..."
ssh_with_password "boukevdbergcom@boukew.ssh.transip.me" "cd /data/sites/web/boukevdbergcom/www/copytool && if [ ! -f .htpasswd ]; then htpasswd -c .htpasswd admin; fi"

echo "✅ Deployment voltooid!"
echo "🌐 Je tool is beschikbaar op: https://boukevdberg.com/copytool/"
echo "🔐 Gebruikersnaam: admin"
