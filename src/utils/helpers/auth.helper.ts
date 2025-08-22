import type { FastifyReply, FastifyRequest } from "fastify";
import { supabase } from "../../config/services.config";
import { Unauthorized } from "../http-errors";

interface AuthenticatedUser {
  id: string;
  email: string;
  name?: string;
}

interface CustomRequest extends FastifyRequest {
  user: AuthenticatedUser; // User is required after middleware
}

export const checkValidRequest = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const authHeader = request.headers.authorization;
  if (!authHeader) {
    throw new Unauthorized("No authorization header");
  }

  const token = authHeader.replace("Bearer ", "");
  if (!token) {
    throw new Unauthorized("Invalid token");
  }
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      throw new Unauthorized("Invalid token");
    }

    // Attach user to request - this is guaranteed to exist after middleware
    (request as CustomRequest).user = {
      id: user.id,
      email: user.email!,
      name: user.user_metadata?.name,
    };
  } catch (error) {
    console.error("Auth verification error:", error);
    throw new Unauthorized("Invalid token");
  }
};