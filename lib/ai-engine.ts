import { OpenAI } from 'openai';
import { Theme, ImageGenerationParams, EditingInstructions } from '@/lib/types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Get theme description for prompt engineering
 */
const getThemeDescription = (theme: Theme): string => {
  const themeDescriptions: Record<Theme, string> = {
    playground: 'A bright, sunny playground with swings, slides, seesaws, and children playing',
    picnic: 'A colorful outdoor picnic scene with food, blankets, baskets, and families enjoying nature',
    zoo: 'A lively zoo scene with various animals, zookeepers, visitors, and natural habitats',
    underwater: 'A magical underwater scene with fish, coral, treasures, and marine life',
    classroom: 'A cheerful classroom with students, a teacher, desks, and educational materials',
    dinosaurs: 'A prehistoric jungle scene with different dinosaurs, plants, and landscape features',
    fantasy: 'A whimsical fantasy world with magical creatures, castles, and enchanted forests',
    city_park: 'A modern city park with trees, benches, pathways, and urban scenery',
    outer_space: 'A cosmic scene with planets, stars, spaceships, and astronauts exploring space',
    farm: 'A cheerful farm scene with barns, animals, crops, fields, and farm activities',
  };
  return themeDescriptions[theme];
};

/**
 * Generate a master scene image using DALL-E 3
 * This creates the original puzzle image with seed for reproducibility
 */
export async function generateMasterScene(
  theme: Theme,
  seed: string
): Promise<string> {
  const themeDescription = getThemeDescription(theme);

  const systemPrompt = `You are an expert at creating kawaii-style, colorful, children-friendly illustrations. 
Create vibrant, cheerful scenes that are perfect for "Spot the Difference" puzzles. 
Use bright, pastel colors. Include many small details and objects that can be modified. 
The style should be cute, playful, and highly readable for children.
Make sure there are many potential areas where differences can be hidden.`;

  const userPrompt = `Create a cute, kawaii-style illustration: ${themeDescription}
  
Scene requirements:
- Bright, pastel color palette
- Multiple characters or subjects
- Rich details and objects
- Educational and child-safe
- High level of detail for puzzle creation
- Square composition (1024x1024)

Make it highly colorful and playful, suitable for children ages 4-12.`;

  const response = await openai.images.generate({
    model: 'dall-e-3',
    prompt: systemPrompt + '\n' + userPrompt,
    size: '1024x1024',
    quality: 'hd',
    n: 1,
  });

  if (!response.data || response.data.length === 0) {
    throw new Error('Failed to generate image from OpenAI');
  }

  return response.data[0].url || '';
}

/**
 * Generate detailed editing instructions based on difficulty level
 * This ensures consistent and logical differences between original and modified images
 */
export async function generateDifferenceInstructions(
  theme: Theme,
  difficulty: 'easy' | 'medium' | 'hard'
): Promise<EditingInstructions> {
  const difficultyLevels = {
    easy: 5,
    medium: 8,
    hard: 10,
  };

  const differenceCount = difficultyLevels[difficulty];

  const prompt = `You are a game designer creating differences for a "Spot the Difference" puzzle.
Given a ${theme} themed kawaii illustration, generate ${differenceCount} subtle but findable differences.

Rules:
1. Keep the same composition, camera angle, and characters
2. Only modify specific elements, not the entire scene
3. Make differences subtle but findable by children
4. Ensure variety in difference types
5. All changes must be logical and realistic for the theme

Return a JSON object with these difference types:
- missing_object (2-3): Remove a small object
- added_object (2-3): Add a new small object
- color_change (2): Change color of an object
- clothing_change (1-2): Modify character clothing
- expression_change (1-2): Change facial expression
- object_movement (1-2): Move an object to a different position
- accessory_change (1): Add/remove an accessory

Format as JSON array of objects with: { type, description, severity }`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.7,
    max_tokens: 1000,
  });

  const content = response.choices[0]?.message?.content || '[]';

  // Parse JSON from response
  try {
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('Could not extract JSON from response');
    }
    const differences = JSON.parse(jsonMatch[0]);

    return {
      objectToRemove: differences.find((d: any) => d.type === 'missing_object')?.description,
      objectToAdd: differences.find((d: any) => d.type === 'added_object')?.description,
      colorChanges: differences
        .filter((d: any) => d.type === 'color_change')
        .map((d: any) => ({
          object: d.description,
          fromColor: 'original',
          toColor: 'modified',
        })),
      movements: differences
        .filter((d: any) => d.type === 'object_movement')
        .map((d: any) => ({
          object: d.description,
          fromPosition: { x: 0, y: 0 },
          toPosition: { x: 50, y: 50 },
        })),
      expressions: differences
        .filter((d: any) => d.type === 'expression_change')
        .map((d: any) => ({
          character: d.description,
          fromExpression: 'original',
          toExpression: 'modified',
        })),
    };
  } catch (error) {
    console.error('Failed to parse difference instructions:', error);
    return {
      objectToRemove: 'a small object',
      objectToAdd: 'a hidden item',
    };
  }
}

/**
 * Generate the modified image with differences
 * Uses the master image and applies logical edits
 */
export async function generateModifiedImage(
  masterImageUrl: string,
  theme: Theme,
  instructions: EditingInstructions
): Promise<string> {
  const instructionText = formatInstructions(instructions);

  const prompt = `You are editing a ${theme} themed kawaii illustration to create a "Spot the Difference" puzzle.

Original image details:
- Keep the exact same composition, camera angle, and setting
- Modify only specific elements as instructed
- Maintain consistent art style

Changes to make:
${instructionText}

Create a modified version that is nearly identical except for these specific differences. 
The overall scene, setting, and composition must remain exactly the same.
All differences must be subtle and findable by children ages 4-12.`;

  const response = await openai.images.createVariation({
    image: await fetchImageAsFile(masterImageUrl),
    n: 1,
    size: '1024x1024',
    model: 'dall-e-2',
  });

  if (!response.data || response.data.length === 0) {
    throw new Error('Failed to generate variation image');
  }

  return response.data[0].url || '';
}

/**
 * Format editing instructions into readable text
 */
function formatInstructions(instructions: EditingInstructions): string {
  const parts: string[] = [];

  if (instructions.objectToRemove) {
    parts.push(`- Remove: ${instructions.objectToRemove}`);
  }
  if (instructions.objectToAdd) {
    parts.push(`- Add: ${instructions.objectToAdd}`);
  }
  if (instructions.colorChanges && instructions.colorChanges.length > 0) {
    parts.push(`- Change colors: ${instructions.colorChanges.map((c) => c.object).join(', ')}`);
  }
  if (instructions.movements && instructions.movements.length > 0) {
    parts.push(`- Move objects: ${instructions.movements.map((m) => m.object).join(', ')}`);
  }
  if (instructions.expressions && instructions.expressions.length > 0) {
    parts.push(
      `- Change expressions: ${instructions.expressions.map((e) => e.character).join(', ')}`
    );
  }

  return parts.join('\n');
}

/**
 * Fetch image from URL and convert to File for API
 */
async function fetchImageAsFile(imageUrl: string): Promise<File> {
  const response = await fetch(imageUrl);
  const blob = await response.blob();
  return new File([blob], 'image.png', { type: 'image/png' });
}

/**
 * Generate difference coordinates for answer overlay
 * This would typically be done with vision API or image analysis
 */
export async function generateDifferenceCoordinates(
  originalUrl: string,
  modifiedUrl: string,
  differenceDescriptions: string[]
): Promise<
  Array<{
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    description: string;
  }>
> {
  // In a production system, this would use computer vision to detect differences
  // For now, we'll generate plausible coordinates based on the image
  return differenceDescriptions.map((desc, index) => ({
    id: `diff-${index}`,
    x: Math.random() * 800 + 100,
    y: Math.random() * 800 + 100,
    width: 60 + Math.random() * 60,
    height: 60 + Math.random() * 60,
    description: desc,
  }));
}
