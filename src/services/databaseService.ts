import type { Brand, BrandRule, GeneratedContent, GenerationLog } from '@/types';
import { mockBrands, mockBrandRules } from './mockData';

// Browser-compatible database service
export const databaseService = {
  async getBrands(): Promise<Brand[]> {
    // In browser, return mock data
    if (typeof window !== 'undefined') {
      return mockBrands;
    }
    
    // In Node.js, use real database
    try {
      const { DatabaseManager } = await import('@/database/DatabaseManager');
      const db = new DatabaseManager();
      return await db.getBrands();
    } catch (error) {
      console.error('Database error:', error);
      return mockBrands;
    }
  },

  async getBrand(id: string): Promise<Brand | null> {
    if (typeof window !== 'undefined') {
      return mockBrands.find(brand => brand.id === id) || null;
    }
    
    try {
      const { DatabaseManager } = await import('@/database/DatabaseManager');
      const db = new DatabaseManager();
      return await db.getBrand(id);
    } catch (error) {
      console.error('Database error:', error);
      return mockBrands.find(brand => brand.id === id) || null;
    }
  },

  async createBrand(name: string, description?: string, brandGuidelines?: any, toneOfVoice?: any): Promise<Brand> {
    if (typeof window !== 'undefined') {
      const newBrand: Brand = {
        id: Date.now().toString(),
        name,
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description,
        brand_guidelines: brandGuidelines ? JSON.stringify(brandGuidelines) : undefined,
        tone_of_voice: toneOfVoice ? JSON.stringify(toneOfVoice) : undefined,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      mockBrands.push(newBrand);
      return newBrand;
    }
    
    try {
      const { DatabaseManager } = await import('@/database/DatabaseManager');
      const db = new DatabaseManager();
      return await db.createBrand(name, description, brandGuidelines, toneOfVoice);
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  },

  async getBrandRules(brandId: string): Promise<BrandRule[]> {
    if (typeof window !== 'undefined') {
      return mockBrandRules.filter(rule => rule.brand_id === brandId);
    }
    
    try {
      const { DatabaseManager } = await import('@/database/DatabaseManager');
      const db = new DatabaseManager();
      return await db.getBrandRules(brandId);
    } catch (error) {
      console.error('Database error:', error);
      return mockBrandRules.filter(rule => rule.brand_id === brandId);
    }
  },

  async createGeneratedContent(content: any, contentType: string, brandId: string): Promise<GeneratedContent> {
    if (typeof window !== 'undefined') {
      const newContent: GeneratedContent = {
        id: Date.now().toString(),
        content: JSON.stringify(content),
        content_type: contentType,
        brand_id: brandId,
        user_id: "mock-user",
        created_at: new Date().toISOString()
      };
      return newContent;
    }
    
    try {
      const { DatabaseManager } = await import('@/database/DatabaseManager');
      const db = new DatabaseManager();
      return await db.createGeneratedContent(content, contentType, brandId);
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  },

  async createGenerationLog(logData: any): Promise<GenerationLog> {
    if (typeof window !== 'undefined') {
      const newLog: GenerationLog = {
        id: Date.now().toString(),
        ...logData,
        created_at: new Date().toISOString()
      };
      return newLog;
    }
    
    try {
      const { DatabaseManager } = await import('@/database/DatabaseManager');
      const db = new DatabaseManager();
      return await db.createGenerationLog(logData);
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  }
};
