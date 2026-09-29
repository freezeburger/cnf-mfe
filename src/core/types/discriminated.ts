import { z } from 'zod';

export type Brand<T, B extends string> = T & { readonly __brand: B };

export type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string };

export type DomainResult<T, E = Error> =
  | { status: 'success'; data: T }
  | { status: 'loading'; data?: T }
  | { status: 'error'; error: E };

export const productCategorySchema = z.enum(['tech', 'wellness', 'home']);

export const productSchema = z.object({
  id: z.string(),
  name: z.string().min(2),
  category: productCategorySchema,
  price: z.number().nonnegative(),
  stock: z.number().int().nonnegative(),
  description: z.string().min(5),
});

export type ProductCategory = z.infer<typeof productCategorySchema>;
export type Product = z.infer<typeof productSchema>;

export const productListSchema = z.array(productSchema);
export type ProductList = z.infer<typeof productListSchema>;

export const alertSchema = z.object({
  id: z.string(),
  title: z.string().min(2),
  severity: z.enum(['info', 'warning', 'critical']),
  message: z.string().min(3),
});

export type Alert = z.infer<typeof alertSchema>;
