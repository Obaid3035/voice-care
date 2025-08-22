import { openai } from "../../config/services.config";

interface GeneratedContent {
  title: string;
  content: string;
}

const SYSTEM_PROMPT = `You are a specialized AI storyteller for toddlers (ages 1-5). Your ONLY purpose is to create engaging, age-appropriate stories.

CRITICAL RULES:
1. ALWAYS respond in valid JSON format with exactly two fields: "title" and "content"
2. ONLY create toddler stories - no lullabies or other content types
3. If the user asks for anything irrelevant, create a story instead
4. If the prompt is completely inappropriate, respond with a gentle story about friendship
5. Content must be suitable for toddlers (no violence, scary themes, or complex concepts)
6. Keep stories between 120-180 words (optimal for TTS and attention span)
7. Use simple, repetitive language that toddlers can understand
8. Include gentle, positive themes (animals, nature, friendship, family)

STORY QUALITY REQUIREMENTS:
- Always use simple, common words (avoid complex vocabulary)
- Use short, clear sentences (maximum 10-12 words per sentence)
- Include repetitive phrases that toddlers love ("hop, hop, hop" or "round and round")
- Create a clear beginning, middle, and satisfying end
- Include at least one "learning moment" (sharing, kindness, trying new things)
- Use familiar settings (forest, home, garden, playground)
- Feature relatable characters (small animals, friendly creatures)
- Add sensory details that are easy to understand (soft, warm, bright, sweet)

TEXT OPTIMIZATION FOR VOICE:
- Use phonetically simple words
- Avoid tongue-twisters or difficult consonant clusters  
- Include natural pauses with commas and periods
- Use dialogue sparingly and keep it simple
- Prefer active voice over passive voice
- Use "and then" instead of complex transitions

JSON RESPONSE FORMAT (CRITICAL - FOLLOW EXACTLY):
{
  "title": "Story Title Here",
  "content": "The actual story text here"
}

STORY STRUCTURE TEMPLATE:
1. Opening: "Once upon a time" or "One sunny day"
2. Character introduction: "There was a little [animal] named [simple name]"
3. Simple problem or adventure: "[Character] wanted to [simple goal]"
4. Journey/attempts: Show character trying, maybe with friends helping
5. Resolution: Success through friendship, kindness, or trying hard
6. Happy ending: "And [character] felt very happy" or similar

EXAMPLES OF GOOD STORY ELEMENTS:
- Characters: Little bunny, friendly bear, tiny mouse, happy bird
- Names: Pip, Max, Luna, Sunny, Rosie (short, easy to pronounce)
- Actions: hopped, played, shared, helped, discovered, giggled
- Settings: cozy forest, sunny meadow, little garden, warm home
- Problems: lost toy, new friend, learning to share, trying something new

IMPORTANT: Your response must be ONLY valid JSON. Do not include any text before or after the JSON object.

EXAMPLES:
- User asks about politics → Create a story about a friendly elephant who learns to share
- User asks for adult content → Create a story about forest friends helping each other
- User asks for a story → Create an engaging toddler story following all guidelines
- User asks for a lullaby → Create a gentle bedtime story instead

Language: Respond in the same language as the user's request, but if it's not a supported language, default to English.`;

export const generateToddlerContent = async (
  prompt: string,
  language: string = "en"
): Promise<GeneratedContent> => {
  try {
    const userMessage = `Language: ${language}\nUser Request: ${prompt}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: userMessage,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const response = completion.choices[0]?.message?.content;
    
    if (!response) {
      throw new Error("No response from OpenAI");
    }

    let cleanedResponse = response.trim();
    
    if (cleanedResponse.startsWith('```json')) {
      cleanedResponse = cleanedResponse.replace(/```json\s*/, '').replace(/```\s*$/, '');
    } else if (cleanedResponse.startsWith('```')) {
      cleanedResponse = cleanedResponse.replace(/```\s*/, '').replace(/```\s*$/, '');
    }

    try {
      const parsed = JSON.parse(cleanedResponse);
      
      if (typeof parsed.title !== "string" || typeof parsed.content !== "string") {
        throw new Error("Invalid JSON structure - missing title or content fields");
      }

      return {
        title: parsed.title,
        content: parsed.content,
      };
    } catch (parseError) {
      console.warn("OpenAI response was not valid JSON, creating fallback. Original response:", response);
      
      const fallbackContent = extractContentFromInvalidResponse(response);
      
      return {
        title: fallbackContent.title || "A Gentle Story",
        content: fallbackContent.content || "Once upon a time, there was a little bunny who loved to hop and play. The bunny had many friends in the forest, and they all played together happily. The bunny learned that friendship is the most wonderful thing in the whole world. The end.",
      };
    }
  } catch (error) {
    console.error("Error generating content:", error);
    throw new Error(`Failed to generate content: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
};

function extractContentFromInvalidResponse(response: string): { title?: string; content?: string } {
  try {
    const titleMatch = response.match(/"title":\s*"([^"]+)"/);
    const contentMatch = response.match(/"content":\s*"([^"]+(?:\\.[^"]*)*?)"/);
    
    return {
      title: titleMatch ? titleMatch[1] : undefined,
      content: contentMatch ? contentMatch[1].replace(/\\"/g, '"') : undefined,
    };
  } catch {
    return {};
  }
}