export type ContentType = 'blog-post' | 'web-page' | 'social-media' | 'email';

export interface FormValues {
  contentType: string;
  language: string;
  model: string;
  focusKeyword?: string;
  secondaryKeywords?: string;
  minWordCount?: string;
  maxWordCount?: string;
  summary?: string;
  postGoal?: string;
  backgroundInfo?: string;
  targetUrl?: string;
  sections?: any[];
  links?: any[];
  socialPlatform?: string;
  socialMediaType?: string;
  emailType?: string;
  exampleText?: string;
}

export interface EmailContent {
  subject: string;
  preheader: string;
  opening: string;
  content: string;
  closing: string;
}

export interface SocialMediaContent {
  header: string;
  visualCopy: string;
  postText: string;
  hashtags: string[];
  callToAction: string;
}

export interface WebContent {
  meta_title: string;
  meta_description: string;
  h1: string;
  intro: string;
  sections: Array<{
    header: string;
    headerType: string;
    content: string;
  }>;
}

export type GeneratedContent = EmailContent | SocialMediaContent | WebContent;

export interface GenerationLog {
  id: string;
  content_id: string;
  prompt_text: string;
  response_text: string;
  model_name: string;
  model_version?: string;
  tokens_used?: number;
  tokens_limit?: number;
  processing_time_ms?: number;
  status: string;
  error_message?: string;
  created_at: string;
}

export interface PromptLog {
  id: string;
  brand_id: string;
  content_type: string;
  focus_keyword: string;
  prompt_text: string;
  model: string;
  language: string;
  token_count: number;
  created_at: string;
  generated_content_id: string;
}

export interface Brand {
  id: string;
  name: string;
  description?: string;
  created_at: string;
}

export interface Profile {
  id: string;
  email: string;
  role: string;
  created_at: string;
}
