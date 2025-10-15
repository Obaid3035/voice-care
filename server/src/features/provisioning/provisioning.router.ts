import type { FastifyInstance } from 'fastify';
import { validateParams } from '../../utils/helpers/validation.helper';
import { provisionDeviceController } from './provisioning.controller';
import { provisionDeviceParamsSchema } from './provisioning.schema';

async function provisioningRouter(fastify: FastifyInstance) {
  fastify.post(
    '/provisioning/:user_id/:mac_address',
    {
      config: {
        description: 'Provision a new device for a user',
      },
      preValidation: [validateParams(provisionDeviceParamsSchema)],
    },
    provisionDeviceController
  );
}

export default provisioningRouter;

