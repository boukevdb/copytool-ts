import { databaseManager } from '@/database/DatabaseManager';
import type { 
  Brand, 
  Profile, 
  GeneratedContent, 
  GenerationLog,
  ContentType,
  FormValues 
} from '@/types';

export class DatabaseService {
  // User management
  async getProfile(): Promise<Profile | null> {
    // Voor nu returnen we een mock profile, later kunnen we echte user management toevoegen
    return {
      id: '1',
      email: 'bouke@boukevdberg.com',
      role: 'admin',
      created_at: new Date().toISOString()
    };
  }

  // Brand management
  async getBrands(): Promise<Brand[]> {
    const brands = await databaseManager.getBrands();
    
    // Als er geen brands zijn, maak dan default brands aan
    if (brands.length === 0) {
      await databaseManager.createBrand('TOV Agency', 'Digital marketing agency');
      await databaseManager.createBrand('Test Brand', 'Test brand for development');
      return await databaseManager.getBrands();
    }
    
    return brands;
  }

  async getBrand(id: string): Promise<Brand | null> {
    return await databaseManager.getBrand(id);
  }

  // Content generation
  async generateAndSaveContent(
    brandId: string,
    contentType: ContentType,
    formData: FormValues,
    generatedContent: GeneratedContent
  ): Promise<{ contentId: string; logId: string }> {
    // Metadata voor de content
    const metadata = {
      formData,
      generationTimestamp: new Date().toISOString(),
      version: '1.0'
    };

    // Sla de content op
    const contentId = await databaseManager.saveGeneratedContent(
      brandId,
      contentType,
      generatedContent,
      metadata
    );

    // Maak een mock prompt en response voor nu
    const promptText = `Generate ${contentType} content with the following parameters: ${JSON.stringify(formData)}`;
    const responseText = JSON.stringify(generatedContent);

    // Sla de generation log op
    const logId = await databaseManager.saveGenerationLog(
      contentId,
      promptText,
      responseText,
      formData.model || 'gpt-4o',
      undefined,
      undefined,
      undefined,
      undefined,
      'success'
    );

    return { contentId, logId };
  }

  // Content retrieval
  async getGeneratedContent(id: string): Promise<any> {
    return await databaseManager.getGeneratedContent(id);
  }

  async getContentByBrand(brandId: string, limit: number = 50, offset: number = 0): Promise<any[]> {
    return await databaseManager.getContentByBrand(brandId, limit, offset);
  }

  async getGenerationLogs(contentId: string): Promise<GenerationLog[]> {
    return await databaseManager.getGenerationLogs(contentId);
  }

  // Search functionality
  async searchContent(
    brandId: string,
    query: string,
    contentType?: ContentType,
    limit: number = 20
  ): Promise<any[]> {
    return await databaseManager.searchContent(brandId, query, contentType, limit);
  }

  // Statistics
  async getContentStats(brandId: string): Promise<any> {
    return await databaseManager.getContentStats(brandId);
  }

  // Mock content generation (voor ontwikkeling)
  async generateMockContent(contentType: ContentType, formData: FormValues): Promise<GeneratedContent> {
    // Simuleer API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    switch (contentType) {
      case 'email':
        return {
          subject: `Test Email Subject - ${formData.focusKeyword || 'Default'}`,
          preheader: 'Test preheader text voor email preview',
          opening: 'Beste klant,',
          content: `Dit is de hoofdinhoud van de email over ${formData.focusKeyword || 'het onderwerp'}.\n\n${formData.summary || 'Geen samenvatting opgegeven.'}`,
          closing: 'Met vriendelijke groet,\nHet TOV Team'
        };
      
      case 'social-media':
        return {
          header: `Test Social Media Post - ${formData.focusKeyword || 'Default'}`,
          visualCopy: 'Korte tekst voor in de visual',
          postText: `Dit is de hoofdtekst van de social media post over ${formData.focusKeyword || 'het onderwerp'}.\n\n${formData.summary || 'Geen samenvatting opgegeven.'}`,
          hashtags: ['#test', '#content', '#marketing', formData.focusKeyword ? `#${formData.focusKeyword.replace(/\s+/g, '')}` : '#default'],
          callToAction: 'Bekijk onze website voor meer informatie!'
        };
      
      case 'blog-post':
      case 'web-page':
        return {
          meta_title: `Test ${contentType === 'blog-post' ? 'Blog Post' : 'Web Page'} - ${formData.focusKeyword || 'Default'}`,
          meta_description: `Test meta description voor SEO over ${formData.focusKeyword || 'het onderwerp'}`,
          h1: `Test ${contentType === 'blog-post' ? 'Blog Post' : 'Web Page'} Heading`,
          intro: `Dit is de introductie van het ${contentType === 'blog-post' ? 'blog artikel' : 'webpagina'} over ${formData.focusKeyword || 'het onderwerp'}.`,
          sections: [
            {
              header: 'Eerste sectie',
              headerType: 'h2',
              content: `Inhoud van de eerste sectie over ${formData.focusKeyword || 'het onderwerp'}.`
            },
            {
              header: 'Tweede sectie',
              headerType: 'h3',
              content: `Inhoud van de tweede sectie met meer details over ${formData.focusKeyword || 'het onderwerp'}.`
            }
          ]
        };
      
      default:
        return { content: 'Test content' } as any;
    }
  }
}

export const databaseService = new DatabaseService();
