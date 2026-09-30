import { z } from 'zod';

/** Validates category identifiers accepted by the products API. */
export const productCategorySchema = z.enum(['tech', 'wellness', 'home']);

/** Runtime contract for product records returned by the API. */
export const productSchema = z.object({
  id: z.string(),
  name: z.string().trim().min(2, 'Le nom doit contenir au moins 2 caractères.'),
  category: productCategorySchema,
  price: z.number().nonnegative('Le prix doit être positif ou nul.'),
  stock: z.number().int().nonnegative('Le stock doit être un entier positif ou nul.'),
  description: z.string().trim().min(5, 'La description doit contenir au moins 5 caractères.'),
});

export const productListSchema = z.array(productSchema);
export const productDraftSchema = productSchema.omit({ id: true });

export type ProductCategory = z.infer<typeof productCategorySchema>;
export type Product = z.infer<typeof productSchema>;
export type ProductDraft = z.infer<typeof productDraftSchema>;

export const productCategories = ['all', ...productCategorySchema.options] as const;
export type ProductCategoryFilter = (typeof productCategories)[number];
