import React from 'react';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';

const languages = [
  { value: "dutch", label: "Nederlands" },
  { value: "english", label: "English" },
  { value: "german", label: "Deutsch" },
  { value: "french", label: "Français" },
  { value: "spanish", label: "Español" },
  { value: "italian", label: "Italiano" },
];

interface LanguageSelectorProps {
  form: UseFormReturn<any>;
}

export function LanguageSelector({ form }: LanguageSelectorProps) {
  return (
    <FormField
      control={form.control}
      name="language"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Taal</FormLabel>
          <Select onValueChange={field.onChange} value={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Selecteer een taal" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {languages.map((language) => (
                <SelectItem key={language.value} value={language.value}>
                  {language.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormItem>
      )}
    />
  );
}
