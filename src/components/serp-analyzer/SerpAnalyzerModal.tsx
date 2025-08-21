import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Search, ExternalLink, Plus, Globe } from 'lucide-react';
import { toast } from 'sonner';
import { claudeService } from '@/services/claudeService';

interface SearchResult {
  title: string;
  link: string;
  snippet: string;
  displayLink: string;
}

interface SerpAnalyzerModalProps {
  isOpen: boolean;
  onClose: () => void;
  focusKeyword: string;
  onAddSection: (sectionData: { headerType: string; headerSubject: string; content: string }) => void;
  googleApiKey?: string;
  googleCx?: string;
}

export function SerpAnalyzerModal({ 
  isOpen, 
  onClose, 
  focusKeyword, 
  onAddSection,
  googleApiKey,
  googleCx 
}: SerpAnalyzerModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null);
  const [contentAnalysis, setContentAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Mock search results voor development (wanneer geen API keys)
  const mockSearchResults: SearchResult[] = [
    {
      title: "Wat is SEO en waarom is het belangrijk?",
      link: "https://example.com/seo-guide",
      snippet: "SEO staat voor Search Engine Optimization. Het is een verzameling technieken die worden gebruikt om de zichtbaarheid van een website in zoekmachines te verbeteren...",
      displayLink: "example.com"
    },
    {
      title: "Complete SEO gids voor beginners",
      link: "https://example.com/seo-beginners",
      snippet: "Leer de basis van SEO met deze uitgebreide gids. Ontdek hoe je je website kunt optimaliseren voor zoekmachines...",
      displayLink: "example.com"
    },
    {
      title: "SEO best practices in 2024",
      link: "https://example.com/seo-2024",
      snippet: "De SEO wereld verandert constant. Hier zijn de belangrijkste best practices voor SEO in 2024...",
      displayLink: "example.com"
    }
  ];

  useEffect(() => {
    if (isOpen && focusKeyword) {
      performSearch();
    }
  }, [isOpen, focusKeyword]);

  const performSearch = async () => {
    setIsLoading(true);
    
    try {
      if (googleApiKey && googleCx) {
        // Echte Google Custom Search API call via backend
        const response = await fetch(
          `http://localhost:3001/api/google/search?key=${googleApiKey}&cx=${googleCx}&q=${encodeURIComponent(focusKeyword)}`
        );
        
        if (!response.ok) {
          throw new Error('Google API request failed');
        }
        
        const data = await response.json();
        setSearchResults(data.items?.map((item: any) => ({
          title: item.title,
          link: item.link,
          snippet: item.snippet,
          displayLink: item.displayLink
        })) || []);
      } else {
        // Mock data voor development
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simuleer API delay
        setSearchResults(mockSearchResults);
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Er ging iets mis bij het zoeken');
      setSearchResults(mockSearchResults); // Fallback naar mock data
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeContent = async (result: SearchResult) => {
    setIsAnalyzing(true);
    setSelectedResult(result);
    
    try {
      // Echte Claude API analyse
      const analysis = await claudeService.analyzeSerpContent(result, focusKeyword);
      setContentAnalysis(analysis);
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error('Er ging iets mis bij de content analyse');
      
      // Fallback naar mock data
      const mockAnalysis = `
# Content Analyse: ${result.title}

## Belangrijkste punten:
- ${result.snippet.substring(0, 100)}...
- Relevante informatie voor ${focusKeyword}
- Mogelijke content ideeën

## Voorgestelde sectie:
**H2: Wat is ${focusKeyword}?**

${result.snippet} Dit onderwerp is cruciaal voor iedereen die meer wil weten over ${focusKeyword}. In deze sectie bespreken we de basis principes en praktische toepassingen.
      `;
      setContentAnalysis(mockAnalysis);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const addSectionFromAnalysis = () => {
    if (contentAnalysis) {
      // Parse de content analysis en voeg een sectie toe
      const lines = contentAnalysis.split('\n');
      const headerLine = lines.find(line => line.startsWith('**H2:'));
      const header = headerLine ? headerLine.replace('**H2:', '').replace('**', '').trim() : 'Nieuwe sectie';
      
      const contentStart = lines.findIndex(line => line.includes('Dit onderwerp is cruciaal'));
      const content = contentStart > -1 ? lines.slice(contentStart).join('\n') : contentAnalysis;
      
      onAddSection({
        headerType: 'h2',
        headerSubject: header,
        content: content
      });
      
      toast.success('Sectie toegevoegd aan het formulier');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            SERP Analyzer - {focusKeyword}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
          {/* Search Results */}
          <div className="space-y-4">
            <h3 className="font-semibold">Zoekresultaten</h3>
            
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="ml-2">Zoeken naar "{focusKeyword}"...</span>
              </div>
            ) : (
              <ScrollArea className="h-[400px]">
                <div className="space-y-3">
                  {searchResults.map((result, index) => (
                    <Card 
                      key={index} 
                      className={`cursor-pointer transition-colors hover:bg-accent ${
                        selectedResult === result ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => analyzeContent(result)}
                    >
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium line-clamp-2">
                          {result.title}
                        </CardTitle>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Globe className="h-3 w-3" />
                          {result.displayLink}
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-xs text-muted-foreground line-clamp-3">
                          {result.snippet}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>

          {/* Content Analysis */}
          <div className="space-y-4">
            <h3 className="font-semibold">Content Analyse</h3>
            
            {isAnalyzing ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="ml-2">Content analyseren...</span>
              </div>
            ) : contentAnalysis ? (
              <div className="space-y-4">
                <ScrollArea className="h-[400px]">
                  <div className="prose prose-sm max-w-none">
                    <pre className="whitespace-pre-wrap text-sm bg-muted p-4 rounded-lg">
                      {contentAnalysis}
                    </pre>
                  </div>
                </ScrollArea>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={addSectionFromAnalysis}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Voeg sectie toe
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={() => window.open(selectedResult?.link, '_blank')}
                    className="flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Bekijk origineel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Selecteer een zoekresultaat om content te analyseren</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
