import type { FastifyRequest } from "fastify";
import type { MultipartFile } from "@fastify/multipart";

interface AuthenticatedUser {
  id: string;
  email: string;
  name?: string;
}

export interface FastifyRequestWithFormData<T = any> extends FastifyRequest {
  validatedFormData: T;
  uploadedFile: MultipartFile;
  user: AuthenticatedUser; 
}

export interface FastifyRequestWithValidatedBody<T = any> extends FastifyRequest {
  body: T;
  user: AuthenticatedUser; 
}