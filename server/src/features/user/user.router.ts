import type { FastifyInstance } from 'fastify';
import { checkValidRequest } from '../../utils/helpers/auth.helper';
import { validateBody } from '../../utils/helpers/validation.helper';
import { getUserController, updateUserController } from './user.controller';
import { updateUserSchema } from './user.schema';

async function userRouter(fastify: FastifyInstance) {
  fastify.get(
    '/user',
    {
      config: {
        description: 'Get user data',
      },
      preValidation: [checkValidRequest],
    },
    getUserController
  );

  fastify.put(
    '/user',
    {
      config: {
        description: 'Update user',
      },
      preValidation: [checkValidRequest, validateBody(updateUserSchema)],
    },
    updateUserController
  );
}

export default userRouter;
