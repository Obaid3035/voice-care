import type { FastifyReply } from "fastify";
import { Readable } from "node:stream";
import { createVoice, voiceExist, deleteVoice, getVoiceByUserId } from "../../utils/queries/voice";
import { elevenLabsClient } from "../../config/services.config";
import { BadRequest, InternalServerError } from "../../utils/http-errors";
import { STANDARD } from "../../constants/request";

import { UploadVoiceInput } from "./voice.schema";
import type {
  FastifyRequestWithFormData, FastifyRequestWithValidatedBody
} from "../../types/request.types";

const bufferToStream = (buffer: Buffer): Readable => {
	const stream = new Readable();
	stream.push(buffer);
	stream.push(null);
	return stream;
};

export const uploadVoice = async (
  request: FastifyRequestWithFormData<UploadVoiceInput>,
  reply: FastifyReply,
) => {
  const file = request.uploadedFile;
  const validatedData = request.validatedFormData;

  if (!file.mimetype.includes("audio/")) {
    throw new BadRequest("Invalid file type. Expected: audio/*");
  }

  const buffer = await file.toBuffer();
  const { name, language, duration, size } = validatedData;
  
  try {
    const user_id = request.user.id;
    
    const userHasVoice = await voiceExist(user_id);
    if (userHasVoice) {
      throw new BadRequest(`User already has a voice`);
    }
    
    const stream = bufferToStream(buffer);
    const labels = {
      Language: language,
    };
    const response = await elevenLabsClient.voices.ivc.create({
      files: [stream],
      name: name,
      labels: JSON.stringify(labels),
    });
    await createVoice(response.voiceId, user_id, name, language, duration, size);
    
    const result = {
      voice_id: response.voiceId,
      status: "processing",
    };

    const response_data = {
      success: true,
      data: result
    };
    return reply.code(STANDARD.ACCEPTED).send(response_data);
  } catch (error) {
    throw new InternalServerError("Voice cloning failed");
  }
};

export const getCurrentUserVoiceController = async (
  request: FastifyRequestWithValidatedBody,
  reply: FastifyReply,
) => {
  const voice = await getVoiceByUserId(request.user.id); 

    const response = {
      success: true,
      data: voice
    };
    return reply.code(STANDARD.OK).send(response);
};

export const deleteVoiceCloneController = async (
  request: FastifyRequestWithValidatedBody,
  reply: FastifyReply,
) => {
  try {
    const user_id = request.user.id;
    const voice = await getVoiceByUserId(user_id);
    if (!voice) {
      throw new Error("No voice found for this user");
    }

    try {
      await elevenLabsClient.voices.delete(voice.elevenlabs_voice_id);
    } catch (elevenLabsError) {
      console.error("Failed to delete from ElevenLabs:", elevenLabsError);
    }

    await deleteVoice(user_id);
    
    const response = {
      success: true,
      message: "Voice clone deleted successfully"
    };
    return reply.code(STANDARD.OK).send(response);
  } catch (error) {
    throw new InternalServerError("Failed to delete voice clone");
  }
}; 