import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { databaseService } from '@/services/databaseService';
import { mockBrands } from '@/services/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Settings } from 'lucide-react';
import type { Brand } from '@/types';

export function BrandManagementPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    brandGuidelines: '',
    toneOfVoice: ''
  });

  const { data: brands = [], refetch } = useQuery({
    queryKey: ['brands'],
    queryFn: () => databaseService.getBrands(),
  });

  const handleAddBrand = () => {
    setEditingBrand(null);
    setFormData({
      name: '',
      description: '',
      brandGuidelines: '',
      toneOfVoice: ''
    });
    setIsDialogOpen(true);
  };

  const handleEditBrand = (brand: Brand) => {
    setEditingBrand(brand);
    setFormData({
      name: brand.name,
      description: brand.description || '',
      brandGuidelines: brand.brand_guidelines || '',
      toneOfVoice: brand.tone_of_voice || ''
    });
    setIsDialogOpen(true);
  };

  const handleSaveBrand = async () => {
    try {
      if (editingBrand) {
        // TODO: Implement update brand
        console.log('Update brand:', editingBrand.id, formData);
      } else {
        await databaseService.createBrand(
          formData.name,
          formData.description,
          formData.brandGuidelines,
          formData.toneOfVoice
        );
      }
      setIsDialogOpen(false);
      refetch();
    } catch (error) {
      console.error('Error saving brand:', error);
    }
  };

  const handleDeleteBrand = async (brandId: string) => {
    if (confirm('Weet je zeker dat je dit merk wilt verwijderen?')) {
      try {
        // In browser, remove from mock data
        if (typeof window !== 'undefined') {
          const index = mockBrands.findIndex(brand => brand.id === brandId);
          if (index > -1) {
            mockBrands.splice(index, 1);
          }
        } else {
          // TODO: Implement real delete
          console.log('Delete brand:', brandId);
        }
        refetch();
      } catch (error) {
        console.error('Error deleting brand:', error);
      }
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <h1 className="text-4xl font-semibold tracking-tight text-primary flex items-center gap-3">
              <Settings className="h-8 w-8" />
              Brand Management
            </h1>
            <p className="text-lg text-muted-foreground font-light">
              Beheer je merken en brand guidelines
            </p>
          </div>
          
          <Button onClick={handleAddBrand} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nieuw Merk
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {brands.map((brand: Brand) => (
            <Card key={brand.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex justify-between items-start">
                  <span>{brand.name}</span>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditBrand(brand)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteBrand(brand.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {brand.description && (
                  <p className="text-sm text-muted-foreground mb-2">
                    {brand.description}
                  </p>
                )}
                <div className="text-xs text-muted-foreground">
                  <p>Slug: {brand.slug}</p>
                  <p>Created: {new Date(brand.created_at).toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {editingBrand ? 'Edit Brand' : 'Add New Brand'}
              </DialogTitle>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="name">Brand Name</label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter brand name..."
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="description">Description</label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter brand description..."
                  rows={3}
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="brandGuidelines">Brand Guidelines</label>
                <Textarea
                  id="brandGuidelines"
                  value={formData.brandGuidelines}
                  onChange={(e) => setFormData({ ...formData, brandGuidelines: e.target.value })}
                  placeholder="Enter brand guidelines..."
                  rows={4}
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="toneOfVoice">Tone of Voice</label>
                <Textarea
                  id="toneOfVoice"
                  value={formData.toneOfVoice}
                  onChange={(e) => setFormData({ ...formData, toneOfVoice: e.target.value })}
                  placeholder="Enter tone of voice guidelines..."
                  rows={4}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveBrand}>
                {editingBrand ? 'Save Changes' : 'Add Brand'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
