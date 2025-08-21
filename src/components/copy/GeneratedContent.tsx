import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, Copy, Download, Edit3, Check } from 'lucide-react';
import { toast } from 'sonner';

interface GeneratedContentProps {
  content: string;
  contentType: string;
  onEdit?: (content: string) => void;
}

export function GeneratedContent({ content, contentType, onEdit }: GeneratedContentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setEditedContent(content);
  }, [content]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(editedContent);
      setCopied(true);
      toast.success('Content gekopieerd naar klembord');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Kon content niet kopiëren');
    }
  };

  const handleDownload = () => {
    const blob = new Blob([editedContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${contentType}-content.txt`;
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
          {isEditing ? (
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full min-h-[400px] p-4 border rounded-md font-mono text-sm resize-y"
              placeholder="Bewerk je content hier..."
            />
          ) : (
            <ScrollArea className="h-[400px] w-full">
              <div 
                className="prose prose-sm max-w-none p-4"
                dangerouslySetInnerHTML={{ __html: formatContent(editedContent) }}
              />
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
