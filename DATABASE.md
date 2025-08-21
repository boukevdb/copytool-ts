# TOV Content Generator Database

## Overzicht

Deze database is opgezet volgens best practices voor het opslaan van gegenereerde content, logs en metadata. De structuur is ontworpen voor:

- **Schaalbaarheid**: Makkelijk uit te breiden met nieuwe content types
- **Zoekbaarheid**: Geoptimaliseerd voor het terugvinden van content
- **Versiebeheer**: Ondersteuning voor content versies
- **Audit trail**: Volledige logging van alle generaties
- **Performance**: Geoptimaliseerde indexes voor snelle queries

## Database Schema

### Hoofdtabellen

#### `users`
- Gebruikers van het systeem
- Ondersteunt rollen (admin, user)
- Voor toekomstige uitbreiding

#### `brands`
- Merken/klanten waarvoor content wordt gegenereerd
- Bevat brand guidelines en tone of voice regels
- JSON velden voor flexibele configuratie

#### `content_types`
- Verschillende soorten content (blog, social, email, web)
- Categorisering voor betere organisatie

#### `generated_content`
- **Hoofdtabel** voor alle gegenereerde content
- JSON veld voor gestructureerde content opslag
- Metadata voor extra informatie
- Word/character count voor statistieken

#### `generation_logs`
- Volledige audit trail van elke generatie
- Prompt en response logs
- Model informatie en performance metrics
- Error handling en status tracking

### Ondersteunende tabellen

#### `content_versions`
- Versiebeheer voor content
- Change tracking met beschrijvingen
- Ondersteunt rollback functionaliteit

#### `tags` & `content_tags`
- Categorisering en labeling
- Many-to-many relatie voor flexibele tagging
- Ondersteunt verschillende tag categorieën

#### `search_history`
- Zoekgeschiedenis voor gebruikers
- Ondersteunt analytics en verbetering van zoekfunctionaliteit

## Best Practices

### 1. Content Opslag
```sql
-- Content wordt opgeslagen als JSON voor flexibiliteit
{
  "subject": "Email onderwerp",
  "content": "Hoofdinhoud",
  "sections": [...],
  "metadata": {...}
}
```

### 2. Logging
- Elke generatie wordt volledig gelogd
- Prompt en response worden bewaard
- Performance metrics worden bijgehouden
- Error handling met status codes

### 3. Zoeken
- Full-text search op content
- Filtering op content type, brand, datum
- Tag-based categorisering
- Metadata search

### 4. Performance
- Geoptimaliseerde indexes op veelgebruikte velden
- Foreign key constraints voor data integriteit
- Triggers voor automatische timestamp updates

## Database Commands

### Initialisatie
```bash
# Database initialiseren
npm run db:init

# Database resetten (verwijdert alle data)
npm run db:reset
```

### Database Locatie
- Database bestand: `data/tov-content-generator.db`
- SQLite database voor lokale ontwikkeling
- Makkelijk te migreren naar PostgreSQL/MySQL

## Query Voorbeelden

### Content zoeken per brand
```sql
SELECT 
  gc.*,
  ct.name as content_type_name
FROM generated_content gc
JOIN content_types ct ON gc.content_type_id = ct.id
WHERE gc.brand_id = ?
ORDER BY gc.created_at DESC
```

### Generation logs ophalen
```sql
SELECT * FROM generation_logs 
WHERE content_id = ? 
ORDER BY created_at DESC
```

### Statistieken per brand
```sql
SELECT 
  COUNT(*) as total_content,
  SUM(word_count) as total_words,
  COUNT(DISTINCT content_type_id) as content_types_used
FROM generated_content 
WHERE brand_id = ?
```

## Migratie naar Productie

Voor productie gebruik wordt aangeraden om:

1. **PostgreSQL** te gebruiken voor betere performance
2. **Connection pooling** te implementeren
3. **Backup strategie** op te zetten
4. **Monitoring** toe te voegen
5. **Access control** te implementeren

## Toekomstige Uitbreidingen

- **User management** met authenticatie
- **API rate limiting** logs
- **Content approval workflows**
- **Collaboration features**
- **Advanced analytics**
- **Export functionaliteit**
