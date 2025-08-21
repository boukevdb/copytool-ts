# CopyTool - Deployment Instructies

## 🚀 Deployment Status
✅ **Succesvol gedeployed naar:** https://boukevdberg.com/copytool/

## 🔐 Toegangsgegevens
- **URL**: https://boukevdberg.com/copytool/
- **Gebruikersnaam**: admin
- **Wachtwoord**: Formule189!

## 📁 Server Locatie
```
/data/sites/web/boukevdbergcom/www/copytool/
```

## 🔄 Deployment Proces

### Handmatige Deployment
Om wijzigingen naar de server te pushen:

1. **Commit je wijzigingen naar GitHub:**
   ```bash
   git add .
   git commit -m "Update copytool"
   git push origin main
   ```

2. **Deploy naar server:**
   ```bash
   ./deploy.sh
   ```

### Wat het deployment script doet:
- ✅ Build de React app (`npm run build`)
- ✅ Upload alle bestanden naar de server
- ✅ Installeert dependencies op de server
- ✅ Zet Basic Auth op met gebruikersnaam/wachtwoord

## 🛠️ Bestanden op Server
- `dist/` - Gebouwde React app
- `server.js` - Express server voor API calls
- `.htaccess` - Apache configuratie met Basic Auth
- `.htpasswd` - Wachtwoord bestand
- `.env` - Environment variabelen
- `package.json` & `node_modules/` - Dependencies

## 🔧 Configuratie

### API Keys
Zorg ervoor dat je `.env` bestand de juiste API keys bevat:
```
VITE_ANTHROPIC_API_KEY=your_anthropic_api_key_here
VITE_GOOGLE_API_KEY=your_google_api_key_here
VITE_GOOGLE_CX=your_google_cx_here
```

### Apache Configuratie
De `.htaccess` zorgt voor:
- Basic Auth beveiliging
- API routing naar server.js
- SPA routing voor React app

## 🐛 Troubleshooting

### TypeScript Fouten
De build werkt ondanks TypeScript fouten. Voor productie, fix de fouten in:
- `src/components/copy/content-form/ContentForm.tsx`
- `src/services/claudeService.ts`
- `src/services/databaseService.ts`

### Server Problemen
Check de server logs:
```bash
ssh boukevdbergcom@boukew.ssh.transip.me "tail -f /data/sites/web/boukevdbergcom/logs/error.log"
```

## 📝 Volgende Stappen
1. Test de tool op https://boukevdberg.com/copytool/
2. Fix TypeScript fouten voor betere code kwaliteit
3. Voeg meer gebruikers toe indien nodig
4. Configureer automatische deployment indien gewenst

## 🔒 Beveiliging
- Basic Auth beschermt de hele omgeving
- API calls gaan via de server proxy
- Geen directe toegang tot API keys in frontend
