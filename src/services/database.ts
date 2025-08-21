import type { Brand, Profile, PromptLog } from '@/types';

// Mock data voor lokale ontwikkeling
const mockBrands: Brand[] = [
  {
    id: '1',
    name: 'TOV Agency',
    description: 'Digital marketing agency',
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Test Brand',
    description: 'Test brand for development',
    created_at: new Date().toISOString(),
  },
];

const mockProfile: Profile = {
  id: '1',
  email: 'bouke@boukevdberg.com',
  role: 'admin',
  created_at: new Date().toISOString(),
};

const mockPromptLogs: PromptLog[] = [];

export class DatabaseService {
  // Profile methods
  async getProfile(): Promise<Profile | null> {
    // Simuleer een kleine vertraging
    await new Promise(resolve => setTimeout(resolve, 100));
    return mockProfile;
  }

  // Brand methods
  async getBrands(): Promise<Brand[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return mockBrands;
  }

  async getBrand(id: string): Promise<Brand | null> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return mockBrands.find(brand => brand.id === id) || null;
  }

  // Prompt logs methods
  async getPromptLogs(brandId: string): Promise<PromptLog[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return mockPromptLogs.filter(log => log.brand_id === brandId);
  }

  async createPromptLog(log: Omit<PromptLog, 'id' | 'created_at'>): Promise<PromptLog> {
    await new Promise(resolve => setTimeout(resolve, 100));
    const newLog: PromptLog = {
      ...log,
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
    };
    mockPromptLogs.push(newLog);
    return newLog;
  }

  // Content generation methods
  async generateContent(prompt: string, contentType: string): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simuleer API call
    
    // Mock response gebaseerd op content type
    switch (contentType) {
      case 'email':
        return {
          subject: 'Test Email Subject',
          preheader: 'Test preheader text',
          opening: 'Beste klant,',
          content: 'Dit is de hoofdinhoud van de email.',
          closing: 'Met vriendelijke groet,\nHet TOV Team'
        };
      
      case 'social-media':
        return {
          header: 'Test Social Media Post',
          visualCopy: 'Korte tekst voor visual',
          postText: 'Dit is de hoofdtekst van de social media post.',
          hashtags: ['#test', '#content', '#marketing'],
          callToAction: 'Bekijk onze website voor meer informatie!'
        };
      
      case 'blog-post':
      case 'web-page':
        return {
          meta_title: 'Test Blog Post Title',
          meta_description: 'Test meta description for SEO',
          h1: 'Test Blog Post Heading',
          intro: 'Dit is de introductie van het blog artikel.',
          sections: [
            {
              header: 'Eerste sectie',
              headerType: 'h2',
              content: 'Inhoud van de eerste sectie.'
            },
            {
              header: 'Tweede sectie',
              headerType: 'h3',
              content: 'Inhoud van de tweede sectie.'
            }
          ]
        };
      
      default:
        return { content: 'Test content' };
    }
  }
}

export const databaseService = new DatabaseService();
