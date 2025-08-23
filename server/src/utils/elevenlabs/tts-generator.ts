import { buffer } from 'node:stream/consumers';
import { elevenLabsClient } from '../../config/services.config';

interface TTSResponse {
  audioBuffer: Buffer;
  duration: number;
}

export const generateTTSAudio = async (text: string, voiceId: string): Promise<TTSResponse> => {
  try {
    const options = {
      modelId: 'eleven_multilingual_v2',
      stability: 0.5,
      similarityBoost: 0.75,
    };

    const audioStream = await elevenLabsClient.textToSpeech.convert(voiceId, {
      text: text,
      modelId: options.modelId,
      voiceSettings: {
        stability: options.stability,
        similarityBoost: options.similarityBoost,
      },
      outputFormat: 'mp3_44100_128',
      optimizeStreamingLatency: 0,
    });

    if (!audioStream) {
      throw new Error('No audio data received from ElevenLabs');
    }

    const audioBuffer = await buffer(audioStream);
    const wordCount = text.split(/\s+/).length;
    const estimatedDuration = Math.round((wordCount / 120) * 60);

    return {
      audioBuffer,
      duration: estimatedDuration,
    };
  } catch (error) {
    console.error('ElevenLabs TTS Error:', error);
    throw new Error(
      `Failed to generate TTS audio: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};
