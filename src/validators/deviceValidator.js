const { z } = require('zod');

const createDeviceSchema = z.strictObject({
  name: z.string().min(3).max(100),

  serialNumber: z
    .string()
    .min(1)
    .regex(/^[A-Z0-9-]+$/),

  status: z.enum(['ACTIVE', 'INACTIVE', 'MAINTENANCE', 'DECOMMISSIONED']).default('INACTIVE'),

  battery: z.number().int().min(0).max(100).nullish(),

  lastSeen: z.iso.datetime({ offset: true }).nullish(),
});

const updateDeviceSchema = z.strictObject({
  name: z.string().min(3).max(100),

  serialNumber: z
    .string()
    .min(1)
    .regex(/^[A-Z0-9-]+$/),

  status: z.enum(['ACTIVE', 'INACTIVE', 'MAINTENANCE', 'DECOMMISSIONED']),

  battery: z.number().int().min(0).max(100).nullable(),

  lastSeen: z.iso.datetime({ offset: true }).nullable(),
});

module.exports = { createDeviceSchema, updateDeviceSchema };
