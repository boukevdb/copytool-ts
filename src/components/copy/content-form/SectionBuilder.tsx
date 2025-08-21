import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { GripVertical, Trash2, Plus } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface Section {
  id: string;
  headerType: string;
  headerSubject: string;
  content: string;
}

interface SectionBuilderProps {
  form: UseFormReturn<any>;
}

export function SectionBuilder({ form }: SectionBuilderProps) {
  const sections = form.watch('sections') || [];

  const addSection = () => {
    const newSection: Section = {
      id: uuidv4(),
      headerType: 'h2',
      headerSubject: '',
      content: ''
    };
    
    form.setValue('sections', [...sections, newSection]);
  };

  const removeSection = (index: number) => {
    const updatedSections = sections.filter((_: any, i: number) => i !== index);
    form.setValue('sections', updatedSections);
  };

  const updateSection = (index: number, field: keyof Section, value: string) => {
    const updatedSections = [...sections];
    updatedSections[index] = { ...updatedSections[index], [field]: value };
    form.setValue('sections', updatedSections);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <FormLabel className="text-base font-semibold">Content Secties</FormLabel>
        <Button 
          type="button" 
          variant="outline" 
          size="sm"
          onClick={addSection}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Sectie toevoegen
        </Button>
      </div>

      {sections.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>Nog geen secties toegevoegd</p>
          <p className="text-sm">Klik op "Sectie toevoegen" om te beginnen</p>
        </div>
      ) : (
        <Accordion type="multiple" className="space-y-2">
          {sections.map((section: Section, index: number) => (
            <AccordionItem key={section.id} value={section.id}>
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                      <AccordionTrigger className="hover:no-underline">
                        <CardTitle className="text-sm">
                          Sectie {index + 1}: {section.headerSubject || 'Nieuwe sectie'}
                        </CardTitle>
                      </AccordionTrigger>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSection(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                
                <AccordionContent>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormItem>
                        <FormLabel>Header Type</FormLabel>
                        <Select
                          value={section.headerType}
                          onValueChange={(value) => updateSection(index, 'headerType', value)}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="h2">H2 - Hoofdsectie</SelectItem>
                            <SelectItem value="h3">H3 - Subsectie</SelectItem>
                            <SelectItem value="h4">H4 - Sub-subsectie</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                      
                      <FormItem>
                        <FormLabel>Header Onderwerp</FormLabel>
                        <FormControl>
                          <Input
                            value={section.headerSubject}
                            onChange={(e) => updateSection(index, 'headerSubject', e.target.value)}
                            placeholder="Bijv: Wat is SEO?"
                          />
                        </FormControl>
                      </FormItem>
                    </div>
                    
                    <FormItem>
                      <FormLabel>Content Beschrijving</FormLabel>
                      <FormControl>
                        <Textarea
                          value={section.content}
                          onChange={(e) => updateSection(index, 'content', e.target.value)}
                          placeholder="Beschrijf wat er in deze sectie moet komen te staan..."
                          rows={4}
                        />
                      </FormControl>
                    </FormItem>
                  </CardContent>
                </AccordionContent>
              </Card>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
}
