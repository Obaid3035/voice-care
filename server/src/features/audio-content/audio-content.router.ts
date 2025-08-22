import { FastifyInstance } from "fastify";
import { getAudioContentController, createAudioContentController, deleteAudioContentController } from "./audio-content.controller";
import { checkValidRequest } from "../../utils/helpers/auth.helper";
import { validateBody } from "../../utils/helpers/validation.helper";
import { GenerateAudioSchema } from "./audio-content.schema";

async function audioContentRouter(fastify: FastifyInstance) {
	fastify.post(
    "/audio-content",
    {
      config: {
        description: "Generate audio content using OpenAI and ElevenLabs",
      },
      preValidation: [checkValidRequest,validateBody(GenerateAudioSchema)],
    },
    createAudioContentController,
  );
	fastify.get("/audio-content", {
		preHandler: checkValidRequest,
		handler: getAudioContentController
  });
  
  fastify.delete("/audio-content/:id", {
    preHandler: checkValidRequest,
    handler: deleteAudioContentController
  });

	
}; 

export default audioContentRouter;