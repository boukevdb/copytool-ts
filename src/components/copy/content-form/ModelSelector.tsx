import React from 'react';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';

const models = [
  {
    value: "claude-3-7-sonnet-20250219",
    label: "Claude 3.7 Sonnet",
    description: "Latest and most capable model",
  },
];

interface ModelSelectorProps {
  form: UseFormReturn<any>;
}

export function ModelSelector({ form }: ModelSelectorProps) {
  return (
    <FormField
      control={form.control}
      name="model"
      render={({ field }) => (
        <FormItem>
          <FormLabel>AI Model</FormLabel>
          <Select onValueChange={field.onChange} value={field.value} disabled>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Selecteer een AI model" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {models.map((model) => (
                <SelectItem key={model.value} value={model.value}>
                  <div>
                    <div className="font-medium">{model.label}</div>
                    <div className="text-xs text-muted-foreground">
                      {model.description}
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormItem>
      )}
    />
  );
}
