import { z } from 'zod';

export const alertSeveritySchema = z.enum(['info', 'warning', 'critical']);

export const alertSchema = z.object({
  id: z.string(),
  title: z.string().trim().min(2),
  severity: alertSeveritySchema,
  message: z.string().trim().min(3),
  source: z.string().trim().min(2),
  createdAt: z.iso.datetime(),
});

export const alertListSchema = z.array(alertSchema);

export type AlertSeverity = z.infer<typeof alertSeveritySchema>;
export type Alert = z.infer<typeof alertSchema>;
