import type { FormValues, Brand } from '@/types';

interface ClaudeMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ClaudeRequest {
  model: string;
  max_tokens: number;
  messages: ClaudeMessage[];
  temperature?: number;
}

interface ClaudeResponse {
  content: ClaudeMessage[];
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

export class ClaudeService {
  private apiKey: string;
  private baseUrl = 'https://api.anthropic.com/v1/messages';

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.VITE_ANTHROPIC_API_KEY || '';
  }

  private async makeRequest(request: ClaudeRequest): Promise<ClaudeResponse> {
    if (!this.apiKey) {
      throw new Error('Anthropic API key is required');
    }

    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Claude API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    return {
      content: data.content,
      usage: data.usage
    };
  }

  private buildPrompt(formData: FormValues, brand?: Brand): string {
    const contentType = formData.contentType;
    const language = formData.language || 'Dutch';
    const model = formData.model || 'claude-3-5-sonnet-20241022';
    
    let prompt = `Je bent een professionele content schrijver. Schrijf ${language} content voor een ${contentType}.\n\n`;

    // Brand guidelines toevoegen
    if (brand) {
      prompt += `## Brand Guidelines:\n`;
      if (brand.brand_guidelines) {
        prompt += `- Brand Guidelines: ${brand.brand_guidelines}\n`;
      }
      if (brand.tone_of_voice) {
        prompt += `- Tone of Voice: ${brand.tone_of_voice}\n`;
      }
      prompt += `\n`;
    }

    // Content type specifieke instructies
    switch (contentType) {
      case 'blog-post':
        prompt += `## Blog Post Instructies:\n`;
        prompt += `- Schrijf een SEO-vriendelijke blog post\n`;
        if (formData.focusKeyword) {
          prompt += `- Focus keyword: "${formData.focusKeyword}"\n`;
        }
        if (formData.sections && formData.sections.length > 0) {
          prompt += `- Gebruik de volgende secties:\n`;
          formData.sections.forEach((section: any, index: number) => {
            prompt += `  ${index + 1}. ${section.headerType.toUpperCase()}: ${section.headerSubject}\n`;
            if (section.content) {
              prompt += `     Beschrijving: ${section.content}\n`;
            }
          });
        }
        break;

      case 'web-page':
        prompt += `## Web Page Instructies:\n`;
        prompt += `- Schrijf content voor een webpagina\n`;
        if (formData.pageTitle) {
          prompt += `- Pagina titel: "${formData.pageTitle}"\n`;
        }
        if (formData.pageDescription) {
          prompt += `- Pagina beschrijving: "${formData.pageDescription}"\n`;
        }
        break;

      case 'email':
        prompt += `## Email Instructies:\n`;
        prompt += `- Schrijf een professionele email\n`;
        if (formData.emailSubject) {
          prompt += `- Onderwerp: "${formData.emailSubject}"\n`;
        }
        if (formData.emailType) {
          prompt += `- Email type: ${formData.emailType}\n`;
        }
        break;

      case 'social-media':
        prompt += `## Social Media Instructies:\n`;
        prompt += `- Schrijf social media content\n`;
        if (formData.platform) {
          prompt += `- Platform: ${formData.platform}\n`;
        }
        if (formData.postType) {
          prompt += `- Post type: ${formData.postType}\n`;
        }
        break;

      case 'ad-copy':
        prompt += `## Ad Copy Instructies:\n`;
        prompt += `- Schrijf advertentie copy\n`;
        if (formData.adType) {
          prompt += `- Advertentie type: ${formData.adType}\n`;
        }
        if (formData.targetAudience) {
          prompt += `- Doelgroep: ${formData.targetAudience}\n`;
        }
        break;
    }

    // Extra context toevoegen
    if (formData.additionalContext) {
      prompt += `\n## Extra Context:\n${formData.additionalContext}\n`;
    }

    prompt += `\n## Output:\nSchrijf de content in ${language}. Zorg voor een professionele, engageerende toon die past bij de brand guidelines.`;

    return prompt;
  }

  async generateContent(formData: FormValues, brand?: Brand): Promise<string> {
    try {
      const prompt = this.buildPrompt(formData, brand);
      
      const request: ClaudeRequest = {
        model: formData.model || 'claude-3-5-sonnet-20241022',
        max_tokens: 4000,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7
      };

      const response = await this.makeRequest(request);
      
      // Extract content from response
      const content = response.content[0]?.text || 'Geen content gegenereerd';
      
      console.log('Claude API Usage:', response.usage);
      
      return content;
    } catch (error) {
      console.error('Content generation error:', error);
      throw error;
    }
  }

  async analyzeSerpContent(searchResult: any, focusKeyword: string): Promise<string> {
    try {
      const prompt = `
Analyseer het volgende zoekresultaat voor het keyword "${focusKeyword}":

Titel: ${searchResult.title}
URL: ${searchResult.link}
Snippet: ${searchResult.snippet}

Geef een gedetailleerde analyse van:
1. Wat maakt deze content waardevol?
2. Welke onderwerpen worden behandeld?
3. Hoe kunnen we vergelijkbare content maken?
4. Welke secties zouden we kunnen toevoegen aan onze content?

Geef ook een voorstel voor een H2 sectie die we kunnen toevoegen aan onze content, inclusief:
- H2 titel
- Korte beschrijving van wat er in die sectie moet komen
`;

      const request: ClaudeRequest = {
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2000,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.5
      };

      const response = await this.makeRequest(request);
      return response.content[0]?.text || 'Geen analyse beschikbaar';
    } catch (error) {
      console.error('SERP analysis error:', error);
      throw error;
    }
  }
}

// Singleton instance
export const claudeService = new ClaudeService();
