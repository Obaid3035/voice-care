import type { FastifyReply } from 'fastify';
import type {
  FastifyRequestWithUser,
  FastifyRequestWithValidatedBody,
} from '../../types/request.types';
import { getUserById, updateUser } from '../../utils/queries/user';
import type { OnboardUserInput } from './user.schema';

export const getUserController = async (request: FastifyRequestWithUser, reply: FastifyReply) => {
  try {
    const user = request.user;
    if (!user) {
      return reply.status(401).send({ error: 'Unauthorized' });
    }

    const userData = await getUserById(user.id);
    return reply.status(200).send({ success: true, data: userData });
  } catch (error) {
    console.error('Get user error:', error);
    return reply.status(500).send({ error: 'Failed to get user' });
  }
};

export const updateUserController = async (
  request: FastifyRequestWithValidatedBody<OnboardUserInput>,
  reply: FastifyReply
) => {
  try {
    console.log('request.body', request.body);
    const user = request.user;

    if (!user) {
      return reply.status(401).send({ error: 'Unauthorized' });
    }

    await updateUser(user.id, request.body);
    return reply.status(200).send({ success: true });
  } catch (error) {
    console.error('Update user error:', error);
    return reply.status(500).send({ error: 'Failed to update user' });
  }
};
