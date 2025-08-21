import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY environment variable must be set");
}

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

export interface AvatarCategory {
  name: string;
  baseDescription: string;
  levels: {
    level: number;
    name: string;
    description: string;
    points: number;
  }[];
}

export const AVATAR_CATEGORIES: AvatarCategory[] = [
  {
    name: "cyber_medrzec",
    baseDescription: "Cyber Mędrzec - mysterious cyberpunk sage with digital wisdom",
    levels: [
      { level: 1, name: "Cyber Nowicjusz", description: "Beginning digital sage", points: 0 },
      { level: 2, name: "Cyber Ekspert", description: "Advanced digital master", points: 500 },
      { level: 3, name: "Cyber Mistrz", description: "Ultimate digital sage with cosmic powers", points: 2000 }
    ]
  },
  {
    name: "cyber_rycerz",
    baseDescription: "Cyber Rycerz - futuristic digital knight warrior",
    levels: [
      { level: 1, name: "Cyber Giermek", description: "Digital knight apprentice", points: 0 },
      { level: 2, name: "Cyber Rycerz", description: "Seasoned digital warrior", points: 500 },
      { level: 3, name: "Cyber Paladyn", description: "Legendary digital knight champion", points: 2000 }
    ]
  },
  {
    name: "cyber_czarownik",
    baseDescription: "Cyber Czarownik - mystical digital sorcerer with tech magic",
    levels: [
      { level: 1, name: "Cyber Uczeń", description: "Digital magic apprentice", points: 0 },
      { level: 2, name: "Cyber Mag", description: "Skilled digital sorcerer", points: 500 },
      { level: 3, name: "Cyber Arcymag", description: "Supreme digital wizard with reality-bending powers", points: 2000 }
    ]
  },
  {
    name: "cyber_wojowniczka",
    baseDescription: "Cyber Wojowniczka - fierce female cyberpunk warrior",
    levels: [
      { level: 1, name: "Cyber Rekrutka", description: "Digital warrior recruit", points: 0 },
      { level: 2, name: "Cyber Amazonka", description: "Elite female digital warrior", points: 500 },
      { level: 3, name: "Cyber Walkiria", description: "Legendary cyber goddess of battle", points: 2000 }
    ]
  }
];

export async function generateCyberpunkAvatar(
  category: string, 
  level: number
): Promise<{ url: string; description: string }> {
  const avatarCategory = AVATAR_CATEGORIES.find(cat => cat.name === category);
  if (!avatarCategory) {
    throw new Error(`Avatar category ${category} not found`);
  }

  const levelData = avatarCategory.levels.find(l => l.level === level);
  if (!levelData) {
    throw new Error(`Level ${level} not found for category ${category}`);
  }

  // Create simple, clean prompt for DALL-E
  let characterType = "";
  let powerLevel = "";
  
  switch (category) {
    case "cyber_medrzec":
      characterType = "cyberpunk sage wizard";
      break;
    case "cyber_rycerz":
      characterType = "cyberpunk knight warrior";
      break;
    case "cyber_czarownik":
      characterType = "cyberpunk sorcerer mage";
      break;
    case "cyber_wojowniczka":
      characterType = "cyberpunk female warrior";
      break;
  }

  switch (level) {
    case 1:
      powerLevel = "novice apprentice";
      break;
    case 2:
      powerLevel = "experienced master";
      break;
    case 3:
      powerLevel = "legendary champion";
      break;
  }

  const fullPrompt = `Portrait of a ${powerLevel} ${characterType}, cyberpunk style, neon lighting, futuristic design, red and gold colors, digital art`;

  try {
    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: fullPrompt,
      n: 1,
      size: "1024x1024", // DALL-E 3 minimum, we'll resize for avatar use
      quality: "standard",
    });

    if (!response.data?.[0]?.url) {
      throw new Error("No image URL returned from DALL-E");
    }

    return {
      url: response.data[0].url,
      description: `${levelData.name} - ${levelData.description}`
    };
  } catch (error: any) {
    console.error("DALL-E Avatar Generation Error:", error);
    throw new Error(`Failed to generate avatar: ${error.message}`);
  }
}

export async function generateAllCyberpunkAvatars(): Promise<{ 
  category: string; 
  level: number; 
  url: string; 
  description: string; 
  name: string;
}[]> {
  const avatars = [];
  
  for (const category of AVATAR_CATEGORIES) {
    for (const level of category.levels) {
      try {
        console.log(`Generating ${category.name} level ${level.level}...`);
        const avatar = await generateCyberpunkAvatar(category.name, level.level);
        
        avatars.push({
          category: category.name,
          level: level.level,
          url: avatar.url,
          description: avatar.description,
          name: level.name
        });
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.error(`Failed to generate ${category.name} level ${level.level}:`, error);
      }
    }
  }
  
  return avatars;
}