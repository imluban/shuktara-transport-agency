import { z } from "zod";
export const trackingId = z.string().trim().toUpperCase().regex(/^SHK-[A-Z0-9]{10}$/);
export const quoteSchema = z.object({
  full_name: z.string().trim().min(2).max(100),
  company: z.string().trim().max(150).optional(),
  email: z.string().trim().email().max(150),
  phone: z.string().trim().regex(/^(\+?880|0)1[3-9]\d{8}$/),
  service: z.enum(["petroleum","road_freight","marine","industrial","cargo","warehousing","other"]),
  cargo_type: z.string().trim().max(150).optional(),
  pickup: z.string().trim().min(2).max(200),
  destination: z.string().trim().min(2).max(200),
  volume: z.string().trim().max(100).optional(),
  preferred_date: z.string().date().optional(),
  details: z.string().trim().max(2000).optional(),
  website: z.string().max(0).optional(), // honeypot: must stay empty
});
