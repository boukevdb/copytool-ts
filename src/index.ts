/**
 * TOV Tool - Entry Point
 * 
 * Dit is het hoofdstartpunt van de applicatie.
 */

console.log('TOV Tool gestart!');

// Hier kun je je tool logica toevoegen
export function startTool(): void {
  console.log('Tool functionaliteit wordt geladen...');
  // Implementeer hier je tool logica
}

// Start de tool als dit bestand direct wordt uitgevoerd
if (require.main === module) {
  startTool();
}
