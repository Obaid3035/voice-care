import type { MultipartValue } from '@fastify/multipart';
import type { FastifyReply, FastifyRequest } from 'fastify';
import type { z } from 'zod';
import { ZodError } from 'zod';
import type {
  FastifyRequestWithFormData,
  FastifyRequestWithValidatedBody,
} from '../../types/request.types';

export function validateBody<T>(schema: z.ZodType<T>) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const validatedData = schema.parse(request.body);
      (request as FastifyRequestWithValidatedBody<T>).body = validatedData;
    } catch (error) {
      if (error instanceof ZodError) {
        const validationDetails = error.issues.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        const missingFields = validationDetails
          .filter((detail) => detail.message.toLowerCase().includes('required'))
          .map((detail) => detail.field);

        const response = {
          success: false,
          error: {
            message: 'Request validation failed',
            statusCode: 400,
            details: {
              validationDetails,
              missingFields,
            },
          },
        };

        reply.code(400).send(response);
        return;
      }
      throw error;
    }
  };
}

export function validateFormData<T, U = T>(schema: z.ZodType<T, U>) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const file = await request.file();
    if (!file) {
      const response = {
        success: false,
        error: {
          message: 'No file provided',
          statusCode: 400,
          details: {
            missingFields: ['file'],
          },
        },
      };
      reply.code(400).send(response);
      return;
    }

    const fields = file.fields as Record<string, MultipartValue>;
    const formData: Record<string, string | undefined> = {};

    for (const [key, field] of Object.entries(fields)) {
      formData[key] = typeof field.value === 'string' ? field.value : undefined;
    }

    try {
      const validatedData = schema.parse(formData);
      const extendedRequest = request as FastifyRequestWithFormData<T>;
      extendedRequest.validatedFormData = validatedData;
      extendedRequest.uploadedFile = file;
    } catch (error) {
      if (error instanceof ZodError) {
        const validationDetails = error.issues.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        const missingFields = validationDetails
          .filter((detail) => detail.message.toLowerCase().includes('required'))
          .map((detail) => detail.field);

        const response = {
          success: false,
          error: {
            message: 'Form validation failed',
            statusCode: 400,
            details: {
              validationDetails,
              missingFields,
            },
          },
        };

        reply.code(400).send(response);
        return;
      }
      throw error;
    }
  };
}
