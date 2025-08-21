import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Hash, AlignLeft, Target, MessageSquare, ListPlus, FileText, Share2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SectionBuilder } from './SectionBuilder';

const socialMediaTypes = [
  "Facebook Ad",
  "Facebook Post", 
  "Instagram Ad",
  "Instagram Post",
  "TikTok video"
];

const emailTypes = [
  "Newsletter",
  "Sales mail",
  "Service mail",
];

interface ContentTypeFieldsProps {
  form: UseFormReturn<any>;
  contentType: string;
  onOpenSerpAnalyzer: () => void;
}

export function ContentTypeFields({ form, contentType, onOpenSerpAnalyzer }: ContentTypeFieldsProps) {
  if (contentType === "blog-post" || contentType === "web-page" || contentType === "email" || contentType === "social-media") {
    return (
      <div className="space-y-8">
        <div className="space-y-4">
          {(contentType === "blog-post" || contentType === "web-page") && (
            <>
              <FormField
                control={form.control}
                name="focusKeyword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Hash className="h-4 w-4" />
                      Focus keyword
                    </FormLabel>
                    <div className="flex items-center gap-2">
                      <FormControl>
                        <Input placeholder="Enter main keyword..." {...field} />
                      </FormControl>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={onOpenSerpAnalyzer}
                        disabled={!field.value}
                        title="Analyze SERP for this keyword"
                      >
                        <Search className="h-4 w-4" />
                      </Button>
                    </div>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="secondaryKeywords"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Secondary keywords (separate with commas)
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="keyword1, keyword2, keyword3..." {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </>
          )}

          {contentType === "social-media" && (
            <FormField
              control={form.control}
              name="socialPlatform"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Share2 className="h-4 w-4" />
                    Platform
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {socialMediaTypes.map((platform) => (
                        <SelectItem key={platform} value={platform}>
                          {platform}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          )}

          {(contentType === "blog-post" || contentType === "web-page" || contentType === "email") && (
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="minWordCount"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Minimum word count</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="100" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="maxWordCount"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Maximum word count</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="500" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          )}

          <FormField
            control={form.control}
            name="summary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {contentType === "social-media" ? "What should the post be about?" : "Context/Summary"}
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={
                      contentType === "social-media"
                        ? "Describe what the social media post should be about..."
                        : "Provide context or a summary for the content..."
                    }
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Social media velden */}
          {contentType === "social-media" && (
            <>
              <FormField
                control={form.control}
                name="postGoal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>What is the purpose of the post?</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="For example: stimulate sales, increase brand awareness, create engagement..."
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="backgroundInfo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Share background info that is relevant for the post you are writing</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="For example: relevant statistics, product information, historical context..."
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="targetUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>To which URL should the post link?</FormLabel>
                    <FormControl>
                      <Input placeholder="https://www.example.com/page" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="exampleText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Voorbeeldtekst</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Voer hier een voorbeeldtekst in die als inspiratie kan dienen..."
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </>
          )}
        </div>

        {(contentType === "blog-post" || contentType === "web-page" || contentType === "email") && (
          <SectionBuilder form={form} />
        )}
      </div>
    );
  }

  return null;
}
