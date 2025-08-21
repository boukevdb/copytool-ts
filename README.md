# TOV Tool

Een TypeScript tool project.

## Installatie

```bash
npm install
```

## Ontwikkeling

```bash
# Development mode met watch
npm run dev

# Build voor productie
npm run build

# Start de applicatie
npm start

# Test uitvoeren
npm test

# Clean build directory
npm run clean
```

## Project Structuur

```
tov/
├── src/                    # TypeScript source code
│   ├── components/         # Herbruikbare componenten
│   └── index.ts           # Entry point
├── public/                # Statische bestanden
├── dist/                  # Gecompileerde JavaScript (gegenereerd)
├── package.json           # Project configuratie
├── tsconfig.json          # TypeScript configuratie
├── jest.config.js         # Test configuratie
└── README.md              # Project documentatie
```

## Scripts

- `npm run build` - Compileert TypeScript naar JavaScript
- `npm run dev` - Development mode met automatische hercompilatie
- `npm start` - Start de gecompileerde applicatie
- `npm test` - Voert tests uit
- `npm run clean` - Verwijdert de dist directory
