import OpenAI from "openai";
import fs from "fs";
import path from "path";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY environment variable must be set");
}

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

export interface CyberpunkAvatar {
  id: string;
  name: string;
  description: string;
  prompt: string;
  imageUrl?: string;
  localPath?: string;
}

export const CYBERPUNK_AVATARS: CyberpunkAvatar[] = [
  {
    id: "cyber_woman",
    name: "Cyber Kobieta",
    description: "Futurystyczna cyberpunkowa kobieta",
    prompt: "cyberpunk woman portrait, neon lights, futuristic style"
  },
  {
    id: "cyber_man", 
    name: "Cyber Mężczyzna",
    description: "Futurystyczny cyberpunkowy mężczyzna",
    prompt: "cyberpunk man portrait, neon lights, futuristic style"
  }
];

export async function generateCyberpunkAvatar(avatar: CyberpunkAvatar): Promise<string> {
  try {
    console.log(`Generating cyberpunk avatar: ${avatar.name}`);
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: avatar.prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    const data = response.data;
    if (!data || data.length === 0 || !data[0].url) {
      throw new Error("No image URL returned from OpenAI");
    }
    
    const imageUrl = data[0].url;

    console.log(`✅ Generated ${avatar.name}: ${imageUrl}`);
    return imageUrl;

  } catch (error: any) {
    console.error(`Error generating ${avatar.name}:`, error);
    throw new Error(`Failed to generate ${avatar.name}: ${error.message}`);
  }
}

export async function generateAllCyberpunkAvatars(): Promise<{ 
  success: boolean; 
  avatars: Array<{ id: string; name: string; imageUrl: string }>;
  errors: Array<{ id: string; error: string }>;
}> {
  const results: Array<{ id: string; name: string; imageUrl: string }> = [];
  const errors: Array<{ id: string; error: string }> = [];

  for (const avatar of CYBERPUNK_AVATARS) {
    try {
      const imageUrl = await generateCyberpunkAvatar(avatar);
      results.push({
        id: avatar.id,
        name: avatar.name,
        imageUrl
      });
      
      // Wait 2 seconds between requests to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } catch (error: any) {
      console.error(`Failed to generate ${avatar.name}:`, error);
      errors.push({
        id: avatar.id,
        error: error.message
      });
    }
  }

  return {
    success: results.length > 0,
    avatars: results,
    errors
  };
}