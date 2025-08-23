import type { MultipartFile } from '@fastify/multipart';
import type { FastifyRequest } from 'fastify';

interface AuthenticatedUser {
  id: string;
  email: string;
  name?: string;
}

export interface FastifyRequestWithFormData<T> extends FastifyRequest {
  validatedFormData: T;
  uploadedFile: MultipartFile;
  user: AuthenticatedUser;
}

export interface FastifyRequestWithValidatedBody<T> extends FastifyRequest {
  body: T;
  user: AuthenticatedUser;
}
