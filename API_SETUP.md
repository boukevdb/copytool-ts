# API Setup Instructies

## Benodigde API Keys

Voor de volledige functionaliteit van de TOV Content Generator heb je de volgende API keys nodig:

### 1. Google Custom Search API

**Voor SERP (Search Engine Results Page) analyse:**

1. **Google API Key aanmaken:**
   - Ga naar [Google Cloud Console](https://console.cloud.google.com/)
   - Maak een nieuw project aan of selecteer een bestaand project
   - Ga naar "APIs & Services" > "Library"
   - Zoek naar "Custom Search API" en schakel deze in
   - Ga naar "APIs & Services" > "Credentials"
   - Klik op "Create Credentials" > "API Key"
   - Kopieer de API key

2. **Custom Search Engine (CX) aanmaken:**
   - Ga naar [Google Programmable Search Engine](https://programmablesearchengine.google.com/)
   - Klik op "Create a search engine"
   - Vul de details in:
     - **Sites to search**: `www.google.com` (voor algemene zoekopdrachten)
     - **Name**: "TOV Content Generator"
   - Klik op "Create"
   - Ga naar "Setup" en kopieer de "Search engine ID" (CX)

3. **Environment variabelen instellen:**
   Maak een `.env` bestand aan in de root van het project:
   ```env
   VITE_GOOGLE_API_KEY=your_google_api_key_here
   VITE_GOOGLE_CX=your_custom_search_engine_id_here
   ```

### 2. Anthropic Claude API

**Voor content generatie en analyse:**

1. **Anthropic API Key aanmaken:**
   - Ga naar [Anthropic Console](https://console.anthropic.com/)
   - Maak een account aan of log in
   - Ga naar "API Keys"
   - Klik op "Create Key"
   - Geef de key een naam (bijv. "TOV Content Generator")
   - Kopieer de API key

2. **Environment variabele instellen:**
   Voeg toe aan je `.env` bestand:
   ```env
   VITE_ANTHROPIC_API_KEY=your_anthropic_api_key_here
   ```

## Volledige .env configuratie

```env
# Google Custom Search API
VITE_GOOGLE_API_KEY=your_google_api_key_here
VITE_GOOGLE_CX=your_custom_search_engine_id_here

# Anthropic Claude API
VITE_ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

## Kosten

### Google Custom Search API
- **Gratis tier**: 100 queries per dag
- **Betaalde tier**: $5 per 1000 queries

### Anthropic Claude API
- **Claude 3.5 Sonnet**: ~$3 per 1M input tokens, ~$15 per 1M output tokens
- **Claude 3 Opus**: ~$15 per 1M input tokens, ~$75 per 1M output tokens

## Testen zonder API Keys

De applicatie werkt ook zonder API keys, maar dan met beperkte functionaliteit:
- **SERP Analyzer**: Gebruikt mock data
- **Content Generatie**: Gebruikt mock responses
- **Brand Management**: Werkt volledig (lokale database)

## Veiligheid

⚠️ **Belangrijk:**
- Voeg `.env` toe aan je `.gitignore` bestand
- Deel nooit je API keys publiekelijk
- Monitor je API usage om onverwachte kosten te voorkomen
