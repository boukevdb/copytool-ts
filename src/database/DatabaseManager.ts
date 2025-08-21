import Database from 'better-sqlite3';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import type { 
  Brand, 
  Profile, 
  GeneratedContent, 
  GenerationLog,
  ContentType,
  FormValues 
} from '@/types';

export class DatabaseManager {
  private db: Database.Database;
  private dbPath: string;

  constructor() {
    // Zorg ervoor dat de database directory bestaat
    const dbDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    this.dbPath = path.join(dbDir, 'tov-content-generator.db');
    this.db = new Database(this.dbPath);
    
    // Enable foreign keys
    this.db.pragma('foreign_keys = ON');
    
    // Initialize database schema
    this.initializeDatabase();
  }

  private initializeDatabase(): void {
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Execute the entire schema as one statement
    try {
      this.db.exec(schema);
    } catch (error) {
      console.error('Error initializing database schema:', error);
      throw error;
    }
  }

  // User management
  async createUser(email: string, name?: string, role: string = 'user'): Promise<Profile> {
    const id = uuidv4();
    const stmt = this.db.prepare(`
      INSERT INTO users (id, email, name, role)
      VALUES (?, ?, ?, ?)
    `);
    
    stmt.run(id, email, name, role);
    
    return {
      id,
      email,
      role,
      created_at: new Date().toISOString()
    };
  }

  async getUser(email: string): Promise<Profile | null> {
    const stmt = this.db.prepare('SELECT * FROM users WHERE email = ?');
    const user = stmt.get(email) as any;
    
    if (!user) return null;
    
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      created_at: user.created_at
    };
  }

  // Brand management
  async createBrand(name: string, description?: string, brandGuidelines?: any, toneOfVoice?: any): Promise<Brand> {
    const id = uuidv4();
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    
    const stmt = this.db.prepare(`
      INSERT INTO brands (id, name, slug, description, brand_guidelines, tone_of_voice, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      id, 
      name,
      slug,
      description, 
      brandGuidelines ? JSON.stringify(brandGuidelines) : null,
      toneOfVoice ? JSON.stringify(toneOfVoice) : null,
      1
    );
    
    return {
      id,
      name,
      slug,
      description,
      brand_guidelines: brandGuidelines ? JSON.stringify(brandGuidelines) : undefined,
      tone_of_voice: toneOfVoice ? JSON.stringify(toneOfVoice) : undefined,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }

  async getBrands(): Promise<Brand[]> {
    const stmt = this.db.prepare('SELECT * FROM brands ORDER BY name');
    const brands = stmt.all() as any[];
    
    return brands.map(brand => ({
      id: brand.id,
      name: brand.name,
      slug: brand.slug,
      description: brand.description,
      brand_guidelines: brand.brand_guidelines,
      tone_of_voice: brand.tone_of_voice,
      is_active: brand.is_active,
      created_at: brand.created_at,
      updated_at: brand.updated_at
    }));
  }

  async getBrand(id: string): Promise<Brand | null> {
    const stmt = this.db.prepare('SELECT * FROM brands WHERE id = ?');
    const brand = stmt.get(id) as any;
    
    if (!brand) return null;
    
    return {
      id: brand.id,
      name: brand.name,
      slug: brand.slug,
      description: brand.description,
      brand_guidelines: brand.brand_guidelines,
      tone_of_voice: brand.tone_of_voice,
      is_active: brand.is_active,
      created_at: brand.created_at,
      updated_at: brand.updated_at
    };
  }

  // Content generation
  async saveGeneratedContent(
    brandId: string,
    contentType: ContentType,
    content: GeneratedContent,
    metadata: any,
    userId?: string
  ): Promise<string> {
    const contentId = uuidv4();
    
    // Calculate word and character count
    const contentString = JSON.stringify(content);
    const wordCount = contentString.split(/\s+/).length;
    const characterCount = contentString.length;

    const stmt = this.db.prepare(`
      INSERT INTO generated_content (
        id, brand_id, content_type_id, user_id, content, metadata, 
        word_count, character_count
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      contentId,
      brandId,
      contentType,
      userId,
      contentString,
      JSON.stringify(metadata),
      wordCount,
      characterCount
    );

    return contentId;
  }

  async saveGenerationLog(
    contentId: string,
    promptText: string,
    responseText: string,
    modelName: string,
    modelVersion?: string,
    tokensUsed?: number,
    tokensLimit?: number,
    processingTimeMs?: number,
    status: string = 'success',
    errorMessage?: string
  ): Promise<string> {
    const logId = uuidv4();
    
    const stmt = this.db.prepare(`
      INSERT INTO generation_logs (
        id, content_id, prompt_text, response_text, model_name, model_version,
        tokens_used, tokens_limit, processing_time_ms, status, error_message
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      logId,
      contentId,
      promptText,
      responseText,
      modelName,
      modelVersion,
      tokensUsed,
      tokensLimit,
      processingTimeMs,
      status,
      errorMessage
    );

    return logId;
  }

  // Content retrieval
  async getGeneratedContent(id: string): Promise<any> {
    const stmt = this.db.prepare(`
      SELECT 
        gc.*,
        b.name as brand_name,
        ct.name as content_type_name
      FROM generated_content gc
      JOIN brands b ON gc.brand_id = b.id
      JOIN content_types ct ON gc.content_type_id = ct.id
      WHERE gc.id = ?
    `);
    
    const content = stmt.get(id) as any;
    
    if (!content) return null;
    
    return {
      ...content,
      content: JSON.parse(content.content),
      metadata: content.metadata ? JSON.parse(content.metadata) : null
    };
  }

  async getContentByBrand(brandId: string, limit: number = 50, offset: number = 0): Promise<any[]> {
    const stmt = this.db.prepare(`
      SELECT 
        gc.*,
        ct.name as content_type_name
      FROM generated_content gc
      JOIN content_types ct ON gc.content_type_id = ct.id
      WHERE gc.brand_id = ?
      ORDER BY gc.created_at DESC
      LIMIT ? OFFSET ?
    `);
    
    const contents = stmt.all(brandId, limit, offset) as any[];
    
    return contents.map(content => ({
      ...content,
      content: JSON.parse(content.content),
      metadata: content.metadata ? JSON.parse(content.metadata) : null
    }));
  }

  async getGenerationLogs(contentId: string): Promise<GenerationLog[]> {
    const stmt = this.db.prepare(`
      SELECT * FROM generation_logs 
      WHERE content_id = ? 
      ORDER BY created_at DESC
    `);
    
    const logs = stmt.all(contentId) as any[];
    
    return logs.map(log => ({
      id: log.id,
      content_id: log.content_id,
      prompt_text: log.prompt_text,
      response_text: log.response_text,
      model_name: log.model_name,
      model_version: log.model_version,
      tokens_used: log.tokens_used,
      tokens_limit: log.tokens_limit,
      processing_time_ms: log.processing_time_ms,
      status: log.status,
      error_message: log.error_message,
      created_at: log.created_at
    }));
  }

  // Search functionality
  async searchContent(
    brandId: string,
    query: string,
    contentType?: ContentType,
    limit: number = 20
  ): Promise<any[]> {
    let sql = `
      SELECT 
        gc.*,
        ct.name as content_type_name
      FROM generated_content gc
      JOIN content_types ct ON gc.content_type_id = ct.id
      WHERE gc.brand_id = ?
    `;
    
    const params: any[] = [brandId];
    
    if (query) {
      sql += ` AND (gc.content LIKE ? OR gc.title LIKE ?)`;
      params.push(`%${query}%`, `%${query}%`);
    }
    
    if (contentType) {
      sql += ` AND gc.content_type_id = ?`;
      params.push(contentType);
    }
    
    sql += ` ORDER BY gc.created_at DESC LIMIT ?`;
    params.push(limit);
    
    const stmt = this.db.prepare(sql);
    const contents = stmt.all(...params) as any[];
    
    return contents.map(content => ({
      ...content,
      content: JSON.parse(content.content),
      metadata: content.metadata ? JSON.parse(content.metadata) : null
    }));
  }

  // Statistics
  async getContentStats(brandId: string): Promise<any> {
    const stmt = this.db.prepare(`
      SELECT 
        COUNT(*) as total_content,
        SUM(word_count) as total_words,
        SUM(character_count) as total_characters,
        COUNT(DISTINCT content_type_id) as content_types_used
      FROM generated_content 
      WHERE brand_id = ?
    `);
    
    return stmt.get(brandId);
  }

  // Cleanup
  close(): void {
    this.db.close();
  }
}

// Singleton instance
export const databaseManager = new DatabaseManager();
