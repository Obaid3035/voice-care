import type { FastifyInstance } from 'fastify';
import { checkValidRequest } from '../../utils/helpers/auth.helper';
import { validateFormData } from '../../utils/helpers/validation.helper';
import {
  deleteVoiceCloneController,
  getCurrentUserVoiceController,
  uploadVoice,
} from './voice.controller';
import { UploadVoiceSchema } from './voice.schema';

async function voiceRouter(fastify: FastifyInstance) {
  fastify.post(
    '/voice-clones',
    {
      config: {
        description: 'Upload voice for cloning',
      },
      preValidation: [checkValidRequest, validateFormData(UploadVoiceSchema)],
    },
    uploadVoice
  );

  fastify.get(
    '/voice-clones',
    {
      config: {
        description: 'Get recorded voice',
      },
      preValidation: [checkValidRequest],
    },
    getCurrentUserVoiceController
  );

  fastify.delete(
    '/voice-clones',
    {
      config: {
        description: 'Delete voice clone',
      },
      preValidation: [checkValidRequest],
    },
    deleteVoiceCloneController
  );
}

export default voiceRouter;
