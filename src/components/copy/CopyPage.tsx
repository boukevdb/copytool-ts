import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { databaseService } from '@/services/databaseService';
import { BrandSelector } from '@/components/settings/BrandSelector';
import { ContentForm, type FormValues } from './content-form/ContentForm';
import { GeneratedContent } from './GeneratedContent';
import { claudeService } from '@/services/claudeService';
import { FileText } from 'lucide-react';
import type { Brand } from '@/types';
import { toast } from 'sonner';

export function CopyPage() {
  const [selectedBrandId, setSelectedBrandId] = useState<string>('');
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Fetch brands
  const { data: brands = [] } = useQuery({
    queryKey: ['brands'],
    queryFn: () => databaseService.getBrands(),
  });

  // Set default brand when brands are loaded
  useEffect(() => {
    if (brands.length && !selectedBrandId) {
      setSelectedBrandId(brands[0].id);
    }
  }, [brands, selectedBrandId]);

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <div className="space-y-8">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <h1 className="text-4xl font-semibold tracking-tight text-primary flex items-center gap-3">
              <FileText className="h-8 w-8" />
              Content Generator
            </h1>
            <p className="text-lg text-muted-foreground font-light">
              Create compelling, on-brand content in seconds
            </p>
          </div>
          
          <BrandSelector 
            selectedBrandId={selectedBrandId} 
            onBrandSelect={setSelectedBrandId}
            className="w-[300px]"
          />
        </div>

        {selectedBrandId ? (
                  <div className="max-w-4xl mx-auto">
          <ContentForm
            onSubmit={async (data: FormValues) => {
              try {
                setIsGenerating(true);
                console.log('Form submitted:', data);
                
                // Get selected brand if available
                const selectedBrand = brands?.find(brand => brand.id === selectedBrandId);
                
                // Generate content using Claude API
                const content = await claudeService.generateContent(data, selectedBrand);
                
                console.log('Generated content:', content);
                setGeneratedContent(content);
                toast.success('Content generated successfully!');
                
              } catch (error) {
                console.error('Generation error:', error);
                toast.error('Failed to generate content');
              } finally {
                setIsGenerating(false);
              }
            }}
            isGenerating={isGenerating}
            brandRules={[]}
          />
          
          {generatedContent && (
            <div className="mt-8">
              <GeneratedContent
                content={generatedContent}
                contentType="blog-post"
                onEdit={(editedContent) => {
                  setGeneratedContent(editedContent);
                }}
              />
            </div>
          )}
        </div>
        ) : (
          <div className="text-center text-muted-foreground p-8">
            Loading brands...
          </div>
        )}
      </div>
    </div>
  );
}
