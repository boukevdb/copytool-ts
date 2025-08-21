import React from 'react';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';

const models = [
  {
    value: "claude-3-5-sonnet-20241022",
    label: "Claude 3.5 Sonnet",
    description: "Latest and most capable model",
  },
  {
    value: "claude-3-opus-20240229",
    label: "Claude 3 Opus",
    description: "Most powerful model for complex tasks",
  },
  {
    value: "claude-3-sonnet-20240229",
    label: "Claude 3 Sonnet",
    description: "Balanced performance and speed",
  },
  {
    value: "claude-3-haiku-20240307",
    label: "Claude 3 Haiku",
    description: "Fastest and most cost-effective",
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
          <Select onValueChange={field.onChange} value={field.value}>
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
