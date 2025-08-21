import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { databaseService } from '@/services/databaseService';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import type { Brand } from '@/types';

interface BrandSelectorProps {
  selectedBrandId: string;
  onBrandSelect: (brandId: string) => void;
  className?: string;
}

export function BrandSelector({ selectedBrandId, onBrandSelect, className }: BrandSelectorProps) {
  const { data: brands = [], isLoading } = useQuery({
    queryKey: ['brands'],
    queryFn: () => databaseService.getBrands(),
  });

  if (isLoading) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className="h-10 w-[200px] bg-muted animate-pulse rounded-md" />
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Select value={selectedBrandId} onValueChange={onBrandSelect}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Selecteer een merk" />
        </SelectTrigger>
        <SelectContent>
          {brands.map((brand: Brand) => (
            <SelectItem key={brand.id} value={brand.id}>
              {brand.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Button variant="outline" size="icon">
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
