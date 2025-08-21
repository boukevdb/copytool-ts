import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Loader2, Wand2 } from 'lucide-react';
import { ContentTypeSelector } from './ContentTypeSelector';
import { ContentTypeFields } from './ContentTypeFields';
import { LanguageSelector } from './LanguageSelector';
import { ModelSelector } from './ModelSelector';
import { SerpAnalyzerModal } from '../../serp-analyzer/SerpAnalyzerModal';
import { claudeService } from '@/services/claudeService';

const formSchema = z.object({
  contentType: z.string().min(1, "Content type is required"),
  language: z.string(),
  model: z.string().default("claude-3-5-sonnet-20241022"),
  focusKeyword: z.string().optional(),
  secondaryKeywords: z.string().optional(),
  minWordCount: z.string().optional(),
  maxWordCount: z.string().optional(),
  summary: z.string().optional(),
  postGoal: z.string().optional(),
  backgroundInfo: z.string().optional(),
  targetUrl: z.string().url("Invalid URL").optional().or(z.literal('')),
  socialPlatform: z.string().optional(),
  exampleText: z.string().optional(),
});

export type FormValues = z.infer<typeof formSchema>;

interface ContentFormProps {
  onSubmit: (data: FormValues) => Promise<void>;
  isGenerating: boolean;
  brandRules: any[];
}

export function ContentForm({ onSubmit, isGenerating, brandRules }: ContentFormProps) {
  const [isSerpAnalyzerOpen, setIsSerpAnalyzerOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contentType: "",
      language: "dutch",
      focusKeyword: "",
      secondaryKeywords: "",
      minWordCount: "",
      maxWordCount: "",
      summary: "",
      postGoal: "",
      backgroundInfo: "",
      targetUrl: "",
      socialPlatform: "",
      exampleText: "",
    },
    mode: "onSubmit"
  });

  const contentType = form.watch("contentType");
  const focusKeywordValue = form.watch("focusKeyword");

  const handleFormSubmit = async (data: FormValues) => {
    try {
      // Clean empty targetUrl to undefined to avoid validation errors
      if (data.targetUrl === '') {
        data.targetUrl = undefined;
      }
      await onSubmit(data);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleOpenSerpAnalyzer = () => {
    const keyword = form.getValues("focusKeyword");
    if (keyword) {
      setIsSerpAnalyzerOpen(true);
    }
  };

  // Callback function for the modal to add content as a new section
  const handleAddSectionFromSerp = (sectionData: { headerType: string; headerSubject: string; content: string }) => {
    const currentSections = form.getValues("sections") || [];
    form.setValue("sections", [
      ...currentSections,
      {
        id: Date.now().toString(),
        ...sectionData
      }
    ]);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
        <ContentTypeSelector form={form} />
        
        {contentType && (
          <>
            <ModelSelector form={form} />
            <ContentTypeFields 
              form={form} 
              contentType={contentType} 
              onOpenSerpAnalyzer={handleOpenSerpAnalyzer}
            />
            <LanguageSelector form={form} />
          </>
        )}

        {contentType && (
          <Button 
            type="submit" 
            disabled={isGenerating || !contentType} 
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                Generate Content
              </>
            )}
          </Button>
        )}
      </form>

      {/* SERP Analyzer Modal */}
      <SerpAnalyzerModal
        isOpen={isSerpAnalyzerOpen}
        onClose={() => setIsSerpAnalyzerOpen(false)}
        focusKeyword={focusKeywordValue}
        onAddSection={handleAddSectionFromSerp}
        googleApiKey={process.env.VITE_GOOGLE_API_KEY}
        googleCx={process.env.VITE_GOOGLE_CX}
      />
    </Form>
  );
}
