import { z } from 'zod';

export const orderSchema = z.object({
  id: z.string(),
  title: z.string().trim().min(2),
  description: z.string().trim(),
  createdAt: z.iso.datetime(),
});

export const orderListSchema = z.array(orderSchema);

export type Order = z.infer<typeof orderSchema>;
