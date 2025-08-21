import React from 'react';
import { FormField, FormItem, FormLabel } from '@/components/ui/form';
import { FileText, Globe, Share2, Mail } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';

const contentTypes = [
  {
    value: "blog-post",
    label: "Blog Post",
    description: "Long-form content optimized for SEO",
    icon: FileText,
  },
  {
    value: "web-page",
    label: "Web Page",
    description: "Landing pages and website content",
    icon: Globe,
  },
  {
    value: "social-media",
    label: "Social Media",
    description: "Short posts for social platforms",
    icon: Share2,
  },
  {
    value: "email",
    label: "Email",
    description: "Email marketing content",
    icon: Mail,
  },
];

interface ContentTypeSelectorProps {
  form: UseFormReturn<any>;
}

export function ContentTypeSelector({ form }: ContentTypeSelectorProps) {
  return (
    <FormField
      control={form.control}
      name="contentType"
      render={({ field }) => (
        <FormItem className="space-y-4">
          <FormLabel className="text-lg font-semibold">Content Type</FormLabel>
          <div className="grid grid-cols-2 gap-4">
            {contentTypes.map(({ value, label, description, icon: Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => field.onChange(value)}
                className={`flex flex-col items-center p-4 rounded-lg border transition-colors hover:bg-accent ${
                  field.value === value
                    ? "border-primary bg-primary/5"
                    : "border-input"
                }`}
              >
                <Icon className="h-6 w-6 mb-2 text-primary" />
                <div className="font-medium">{label}</div>
                <div className="text-xs text-muted-foreground text-center">
                  {description}
                </div>
              </button>
            ))}
          </div>
        </FormItem>
      )}
    />
  );
}
