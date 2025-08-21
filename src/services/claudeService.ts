import type { FormValues, Brand, GeneratedContentData } from '@/types';

interface ClaudeMessage {
  role: 'user' | 'assistant';
  content?: string | Array<{
    type: 'text';
    text: string;
  }>;
  text?: string;
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
  private baseUrl = 'http://localhost:3001/api';

  private async makeRequest(request: ClaudeRequest): Promise<ClaudeResponse> {
    const response = await fetch(`${this.baseUrl}/claude/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: request.messages[0].content,
        model: request.model,
        maxTokens: request.max_tokens
      })
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
    const model = formData.model || 'claude-3-7-sonnet-20250219';
    
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

    prompt += `\n## Output Format:\nGeef je antwoord in het volgende JSON formaat:\n\n`;
    
    switch (contentType) {
      case 'blog-post':
        prompt += `{
  "metaTitle": "SEO-geoptimaliseerde titel (max 60 karakters)",
  "metaDescription": "SEO-geoptimaliseerde beschrijving (max 160 karakters)",
  "h1": "Hoofdtitel van de blog post",
  "intro": "Inleidende paragraaf die de lezer engageert",
  "mainContent": "De volledige blog post content met alle secties",
  "sections": [
    {
      "header": "H2 titel",
      "headerType": "h2",
      "content": "Content van deze sectie"
    }
  ]
}`;
        break;
        
      case 'web-page':
        prompt += `{
  "metaTitle": "SEO-geoptimaliseerde titel (max 60 karakters)",
  "metaDescription": "SEO-geoptimaliseerde beschrijving (max 160 karakters)",
  "h1": "Hoofdtitel van de pagina",
  "intro": "Inleidende tekst",
  "mainContent": "De volledige pagina content"
}`;
        break;
        
      case 'email':
        prompt += `{
  "emailSubject": "Email onderwerp regel",
  "emailPreheader": "Preheader tekst (max 150 karakters)",
  "mainContent": "De volledige email content"
}`;
        break;
        
      case 'social-media':
        prompt += `{
  "socialMediaPost": "De social media post tekst",
  "hashtags": ["hashtag1", "hashtag2", "hashtag3"],
  "callToAction": "Call-to-action tekst"
}`;
        break;
        
      default:
        prompt += `{
  "mainContent": "De gegenereerde content"
}`;
    }

    prompt += `\n\nZorg ervoor dat je antwoord alleen geldige JSON is zonder extra tekst ervoor of erna.`;

    return prompt;
  }

  async generateContent(formData: FormValues, brand?: Brand): Promise<GeneratedContentData> {
    try {
      const prompt = this.buildPrompt(formData, brand);
      
      const request: ClaudeRequest = {
        model: formData.model || 'claude-3-7-sonnet-20250219',
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
      let contentText = '';
      
      // Try different content extraction methods
      if (typeof response.content[0]?.content === 'string') {
        contentText = response.content[0].content;
      } else if (Array.isArray(response.content[0]?.content)) {
        contentText = response.content[0].content
          .filter((item: any) => item.type === 'text')
          .map((item: any) => item.text)
          .join('');
      } else if (typeof response.content[0]?.text === 'string') {
        // Direct text property
        contentText = response.content[0].text;
      }
      
      if (!contentText) {
        throw new Error('Geen content gegenereerd');
      }
      
      // Try to parse as JSON
      try {
        // Remove markdown code blocks if present
        let jsonText = contentText;
        if (jsonText.includes('```json')) {
          jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
        }
        if (jsonText.includes('```')) {
          jsonText = jsonText.replace(/```\n?/g, '');
        }
        
        // Trim whitespace
        jsonText = jsonText.trim();
        
        const parsedContent = JSON.parse(jsonText);
        return {
          contentType: formData.contentType,
          ...parsedContent
        };
      } catch (parseError) {
        // Fallback to plain text if JSON parsing fails
        console.warn('Failed to parse JSON response, falling back to plain text:', parseError);
        console.warn('Raw content:', contentText);
        return {
          contentType: formData.contentType,
          mainContent: contentText
        };
      }
      
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
        model: 'claude-3-7-sonnet-20250219',
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
      
      // Extract content from response
      let contentText = '';
      if (typeof response.content[0]?.content === 'string') {
        contentText = response.content[0].content;
      } else if (Array.isArray(response.content[0]?.content)) {
        contentText = response.content[0].content
          .filter((item: any) => item.type === 'text')
          .map((item: any) => item.text)
          .join('');
      } else if (typeof response.content[0]?.text === 'string') {
        // Direct text property
        contentText = response.content[0].text;
      }
      
      return contentText || 'Geen analyse beschikbaar';
    } catch (error) {
      console.error('SERP analysis error:', error);
      throw error;
    }
  }
}

// Singleton instance
export const claudeService = new ClaudeService();
