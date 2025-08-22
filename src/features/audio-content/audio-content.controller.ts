import { FastifyReply } from "fastify";
import { deleteAudioContent, getAudioContent, insertAudioContent } from "../../utils/queries/audio_content";
import { generateTTSAudio } from "../../utils/elevenlabs/tts-generator";
import { BadRequest } from "../../utils/http-errors";
import { generateToddlerContent } from "../../utils/openai/text-generator";
import { uploadAudioToStorage, getAudioUrlFromStorage } from "../../utils/queries/audio-storage";
import { getVoiceByUserId } from "../../utils/queries/voice";
import { FastifyRequestWithValidatedBody } from "../../types/request.types";
import { STANDARD } from "../../constants/request";
import { GenerateAudioInput } from "./audio-content.schema";

export const getAudioContentController = async (request: FastifyRequestWithValidatedBody, reply: FastifyReply) => {
    try {
        const user = request.user;
		if (!user) {
			return reply.status(401).send({ error: "Unauthorized" });
		}

		const audioContent = await getAudioContent(user.id);
		
		return reply.status(200).send({
			success: true,
			data: audioContent
		});
	} catch (error) {
		console.error("Error getting audio content:", error);
		return reply.status(500).send({
			error: "Internal server error",
			message: error.message
		});
	}
};

export const createAudioContentController = async (
  request: FastifyRequestWithValidatedBody<GenerateAudioInput>,
  reply: FastifyReply,
) => {
	try {
		const { prompt, language } = request.body;
		const user_id = request.user.id;

		const voice = await getVoiceByUserId(user_id);
		if (!voice) {
			throw new BadRequest("Please clone a voice first")
		}

		const {title, content} = await generateToddlerContent(prompt, language);

		
		const ttsResult = await generateTTSAudio(content, voice.elevenlabs_voice_id);
		const {audioBuffer, duration} = ttsResult
		const timeStamp = Date.now();
		const fileName = `test_audio_${timeStamp}.mp3`;
		await uploadAudioToStorage(fileName, audioBuffer);
		const audioUrl = await getAudioUrlFromStorage(fileName);

		const audioContent = {
			userId: user_id,
			audioUrl,
			voiceId: voice.id,
			title,
			prompt,
			language,
			duration
		}

		const contentId = await insertAudioContent(audioContent);
		const result = {
			content_id: contentId,
			title,
		};

		const response = {
			success: true,
			data: result
		};
		return reply.code(STANDARD.OK).send(response);
	} catch (error) {
		console.error("Error creating audio content:", error);
		return reply.status(500).send({
			error: "Internal server error",
			message: error.message
		});
	}
};


export const deleteAudioContentController = async (request: FastifyRequestWithValidatedBody, reply: FastifyReply) => {
	try {
		const { id } = request.params as { id: string };
		const user_id = request.user.id;

		await deleteAudioContent(id, user_id);

		return reply.status(200).send({
			success: true,
			message: "Audio content deleted successfully"
		});
	} catch (error) {
		console.error("Error deleting audio content:", error);
		return reply.status(500).send({
			error: "Internal server error",
			message: error.message
		});
	}
};

