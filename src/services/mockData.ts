import type { Brand, BrandRule } from '@/types';

// Mock data voor browser testing
export const mockBrands: Brand[] = [
  {
    id: "1",
    name: "Test Brand 1",
    slug: "test-brand-1",
    description: "Een test merk voor development",
    brand_guidelines: "Wees professioneel en vriendelijk",
    tone_of_voice: "Informeel maar betrouwbaar",
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    id: "2", 
    name: "Test Brand 2",
    slug: "test-brand-2",
    description: "Een tweede test merk",
    brand_guidelines: "Kort en krachtig",
    tone_of_voice: "Direct en duidelijk",
    is_active: true,
    created_at: "2024-01-02T00:00:00Z",
    updated_at: "2024-01-02T00:00:00Z"
  }
];

export const mockBrandRules: BrandRule[] = [
  {
    id: "1",
    brand_id: "1",
    type: "writing",
    name: "Tone of Voice",
    description: "Gebruik een vriendelijke en professionele toon",
    examples: ["Welkom bij ons", "We helpen je graag"],
    wrong_examples: ["Hallo daar", "We doen ons best"],
    created_at: "2024-01-01T00:00:00Z"
  }
];
