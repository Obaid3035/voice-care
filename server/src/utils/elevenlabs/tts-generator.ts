import { buffer } from "node:stream/consumers";
import { elevenLabsClient } from "../../config/services.config";

interface TTSOptions {
  modelId?: string;
  stability?: number;
  similarityBoost?: number;
  style?: number;
  useSpeakerBoost?: boolean;
}

interface TTSResponse {
  audioBuffer: Buffer;
  duration: number;
}

export const generateTTSAudio = async (
  text: string,
  voiceId: string,
): Promise<TTSResponse> => {
  try {
   const options = {
  modelId: "eleven_multilingual_v2",
  stability: 0.5,           // Much lower for natural expression
  similarityBoost: 0.75,      // Lower for flexibility  
  // style: 0.65,               // Much higher for storytelling emotion
  // useSpeakerBoost: true,
  // speed: 1.0                 // Normal speed
};

    const audioStream = await elevenLabsClient.textToSpeech.convert(voiceId, {
      text: text,
      modelId: options.modelId,
      voiceSettings: {
        stability: options.stability,
        similarityBoost: options.similarityBoost,
        // style: options.style,
        // useSpeakerBoost: options.useSpeakerBoost,
        // speed: options.speed,
      },
      outputFormat: "mp3_44100_128",
      optimizeStreamingLatency: 0,  
    });

    if (!audioStream) {
      throw new Error("No audio data received from ElevenLabs");
    }

    const audioBuffer = await buffer(audioStream);
    const wordCount = text.split(/\s+/).length;
    const estimatedDuration = Math.round((wordCount / 120) * 60); 

    return {
      audioBuffer,
      duration: estimatedDuration,
    };
  } catch (error) {
    console.error("ElevenLabs TTS Error:", error);
    throw new Error(`Failed to generate TTS audio: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
};
