import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, Copy, Download, Edit3, Check, Hash, Tag, Mail, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import type { GeneratedContentData } from '@/types';

interface GeneratedContentProps {
  content: GeneratedContentData;
  onEdit?: (content: GeneratedContentData) => void;
}

export function GeneratedContent({ content, onEdit }: GeneratedContentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState<GeneratedContentData>(content);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setEditedContent(content);
  }, [content]);

  const handleCopy = async () => {
    try {
      const textToCopy = getContentAsText(editedContent);
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      toast.success('Content gekopieerd naar klembord');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Kon content niet kopiëren');
    }
  };

  const handleDownload = () => {
    const textToDownload = getContentAsText(editedContent);
    const blob = new Blob([textToDownload], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${content.contentType}-content.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Content gedownload');
  };

  const handleSave = () => {
    if (onEdit) {
      onEdit(editedContent);
    }
    setIsEditing(false);
    toast.success('Content opgeslagen');
  };

  const handleCancel = () => {
    setEditedContent(content);
    setIsEditing(false);
  };

  const getContentAsText = (data: GeneratedContentData): string => {
    let text = '';
    
    if (data.metaTitle) text += `Meta Title: ${data.metaTitle}\n\n`;
    if (data.metaDescription) text += `Meta Description: ${data.metaDescription}\n\n`;
    if (data.h1) text += `H1: ${data.h1}\n\n`;
    if (data.intro) text += `Intro: ${data.intro}\n\n`;
    if (data.emailSubject) text += `Email Subject: ${data.emailSubject}\n\n`;
    if (data.emailPreheader) text += `Email Preheader: ${data.emailPreheader}\n\n`;
    if (data.socialMediaPost) text += `Social Media Post: ${data.socialMediaPost}\n\n`;
    if (data.hashtags && data.hashtags.length > 0) text += `Hashtags: ${data.hashtags.join(', ')}\n\n`;
    if (data.callToAction) text += `Call to Action: ${data.callToAction}\n\n`;
    if (data.mainContent) text += `Main Content:\n${data.mainContent}\n\n`;
    
    if (data.sections && data.sections.length > 0) {
      text += 'Sections:\n';
      data.sections.forEach((section, index) => {
        text += `${index + 1}. ${section.header}\n${section.content}\n\n`;
      });
    }
    
    return text.trim();
  };

  // Format content for display
  const formatContent = (text: string) => {
    return text
      .split('\n')
      .map((line, index) => {
        if (line.startsWith('#')) {
          const level = line.match(/^#+/)?.[0].length || 1;
          const content = line.replace(/^#+\s*/, '');
          return `<h${Math.min(level, 6)} class="font-bold text-lg mb-2">${content}</h${Math.min(level, 6)}>`;
        }
        if (line.startsWith('**') && line.endsWith('**')) {
          const content = line.replace(/\*\*/g, '');
          return `<strong class="font-semibold">${content}</strong>`;
        }
        if (line.trim() === '') {
          return '<br>';
        }
        return `<p class="mb-2">${line}</p>`;
      })
      .join('');
  };

  const renderBlogPostContent = () => (
    <div className="space-y-6">
      {/* Meta Title */}
      <div className="space-y-2">
        <label className="text-sm font-medium flex items-center gap-2">
          <Hash className="h-4 w-4" />
          Meta Title
        </label>
        {isEditing ? (
          <Input
            value={editedContent.metaTitle || ''}
            onChange={(e) => setEditedContent({ ...editedContent, metaTitle: e.target.value })}
            placeholder="SEO-geoptimaliseerde titel (max 60 karakters)"
            maxLength={60}
          />
        ) : (
          <div className="p-3 bg-muted rounded-md">
            {editedContent.metaTitle || 'Geen meta title'}
          </div>
        )}
      </div>

      {/* Meta Description */}
      <div className="space-y-2">
        <label className="text-sm font-medium flex items-center gap-2">
          <Tag className="h-4 w-4" />
          Meta Description
        </label>
        {isEditing ? (
          <Textarea
            value={editedContent.metaDescription || ''}
            onChange={(e) => setEditedContent({ ...editedContent, metaDescription: e.target.value })}
            placeholder="SEO-geoptimaliseerde beschrijving (max 160 karakters)"
            maxLength={160}
            rows={2}
          />
        ) : (
          <div className="p-3 bg-muted rounded-md">
            {editedContent.metaDescription || 'Geen meta description'}
          </div>
        )}
      </div>

      {/* H1 */}
      {editedContent.h1 && (
        <div className="space-y-2">
          <label className="text-sm font-medium">H1 Titel</label>
          {isEditing ? (
            <Input
              value={editedContent.h1}
              onChange={(e) => setEditedContent({ ...editedContent, h1: e.target.value })}
              placeholder="Hoofdtitel"
            />
          ) : (
            <div className="p-3 bg-muted rounded-md font-semibold">
              {editedContent.h1}
            </div>
          )}
        </div>
      )}

      {/* Intro */}
      {editedContent.intro && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Introductie</label>
          {isEditing ? (
            <Textarea
              value={editedContent.intro}
              onChange={(e) => setEditedContent({ ...editedContent, intro: e.target.value })}
              placeholder="Inleidende tekst"
              rows={3}
            />
          ) : (
            <div className="p-3 bg-muted rounded-md">
              {editedContent.intro}
            </div>
          )}
        </div>
      )}

      {/* Main Content */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Hoofdcontent</label>
        {isEditing ? (
          <Textarea
            value={editedContent.mainContent}
            onChange={(e) => setEditedContent({ ...editedContent, mainContent: e.target.value })}
            placeholder="Hoofdcontent"
            rows={10}
            className="font-mono text-sm"
          />
        ) : (
          <ScrollArea className="h-[300px] w-full">
            <div 
              className="prose prose-sm max-w-none p-4"
              dangerouslySetInnerHTML={{ __html: formatContent(editedContent.mainContent) }}
            />
          </ScrollArea>
        )}
      </div>

      {/* Sections */}
      {editedContent.sections && editedContent.sections.length > 0 && (
        <div className="space-y-4">
          <label className="text-sm font-medium">Secties</label>
          {editedContent.sections.map((section, index) => (
            <div key={index} className="border rounded-md p-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Sectie {index + 1}: {section.header}</label>
                {isEditing ? (
                  <Textarea
                    value={section.content}
                    onChange={(e) => {
                      const newSections = [...editedContent.sections!];
                      newSections[index] = { ...section, content: e.target.value };
                      setEditedContent({ ...editedContent, sections: newSections });
                    }}
                    placeholder="Sectie content"
                    rows={4}
                  />
                ) : (
                  <div className="p-3 bg-muted rounded-md">
                    {section.content}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderEmailContent = () => (
    <div className="space-y-6">
      {/* Email Subject */}
      <div className="space-y-2">
        <label className="text-sm font-medium flex items-center gap-2">
          <Mail className="h-4 w-4" />
          Email Onderwerp
        </label>
        {isEditing ? (
          <Input
            value={editedContent.emailSubject || ''}
            onChange={(e) => setEditedContent({ ...editedContent, emailSubject: e.target.value })}
            placeholder="Email onderwerp"
          />
        ) : (
          <div className="p-3 bg-muted rounded-md">
            {editedContent.emailSubject || 'Geen onderwerp'}
          </div>
        )}
      </div>

      {/* Email Preheader */}
      {editedContent.emailPreheader && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Email Preheader</label>
          {isEditing ? (
            <Input
              value={editedContent.emailPreheader}
              onChange={(e) => setEditedContent({ ...editedContent, emailPreheader: e.target.value })}
              placeholder="Preheader tekst"
              maxLength={150}
            />
          ) : (
            <div className="p-3 bg-muted rounded-md">
              {editedContent.emailPreheader}
            </div>
          )}
        </div>
      )}

      {/* Main Content */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Email Content</label>
        {isEditing ? (
          <Textarea
            value={editedContent.mainContent}
            onChange={(e) => setEditedContent({ ...editedContent, mainContent: e.target.value })}
            placeholder="Email content"
            rows={10}
            className="font-mono text-sm"
          />
        ) : (
          <ScrollArea className="h-[300px] w-full">
            <div 
              className="prose prose-sm max-w-none p-4"
              dangerouslySetInnerHTML={{ __html: formatContent(editedContent.mainContent) }}
            />
          </ScrollArea>
        )}
      </div>
    </div>
  );

  const renderSocialMediaContent = () => (
    <div className="space-y-6">
      {/* Social Media Post */}
      <div className="space-y-2">
        <label className="text-sm font-medium flex items-center gap-2">
          <Share2 className="h-4 w-4" />
          Social Media Post
        </label>
        {isEditing ? (
          <Textarea
            value={editedContent.socialMediaPost || ''}
            onChange={(e) => setEditedContent({ ...editedContent, socialMediaPost: e.target.value })}
            placeholder="Social media post tekst"
            rows={4}
          />
        ) : (
          <div className="p-3 bg-muted rounded-md">
            {editedContent.socialMediaPost || 'Geen post'}
          </div>
        )}
      </div>

      {/* Hashtags */}
      {editedContent.hashtags && editedContent.hashtags.length > 0 && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Hashtags</label>
          {isEditing ? (
            <Input
              value={editedContent.hashtags.join(', ')}
              onChange={(e) => setEditedContent({ 
                ...editedContent, 
                hashtags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
              })}
              placeholder="hashtag1, hashtag2, hashtag3"
            />
          ) : (
            <div className="p-3 bg-muted rounded-md">
              {editedContent.hashtags.map(tag => `#${tag}`).join(' ')}
            </div>
          )}
        </div>
      )}

      {/* Call to Action */}
      {editedContent.callToAction && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Call to Action</label>
          {isEditing ? (
            <Input
              value={editedContent.callToAction}
              onChange={(e) => setEditedContent({ ...editedContent, callToAction: e.target.value })}
              placeholder="Call to action"
            />
          ) : (
            <div className="p-3 bg-muted rounded-md">
              {editedContent.callToAction}
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderDefaultContent = () => (
    <div className="space-y-2">
      <label className="text-sm font-medium">Content</label>
      {isEditing ? (
        <Textarea
          value={editedContent.mainContent}
          onChange={(e) => setEditedContent({ ...editedContent, mainContent: e.target.value })}
          placeholder="Content"
          rows={10}
          className="font-mono text-sm"
        />
      ) : (
        <ScrollArea className="h-[400px] w-full">
          <div 
            className="prose prose-sm max-w-none p-4"
            dangerouslySetInnerHTML={{ __html: formatContent(editedContent.mainContent) }}
          />
        </ScrollArea>
      )}
    </div>
  );

  const renderContent = () => {
    switch (content.contentType) {
      case 'blog-post':
      case 'web-page':
        return renderBlogPostContent();
      case 'email':
        return renderEmailContent();
      case 'social-media':
        return renderSocialMediaContent();
      default:
        return renderDefaultContent();
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Gegenereerde Content
            </CardTitle>
            <div className="flex gap-2">
              {!isEditing ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2"
                  >
                    <Edit3 className="h-4 w-4" />
                    Bewerken
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopy}
                    className="flex items-center gap-2"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copied ? 'Gekopieerd' : 'Kopiëren'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownload}
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Downloaden
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    size="sm"
                    onClick={handleSave}
                    className="flex items-center gap-2"
                  >
                    <Check className="h-4 w-4" />
                    Opslaan
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancel}
                  >
                    Annuleren
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {renderContent()}
        </CardContent>
      </Card>
    </div>
  );
}
