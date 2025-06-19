const GEMINI_API_KEY = 'AIzaSyDvc0JRHmJJenpnJ6cig2LBmIn4sWpHpsU';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

export interface GeminiResponse {
  explanation: string;
  resources: Array<{
    type: 'video' | 'article' | 'interactive';
    title: string;
    url: string;
    description: string;
  }>;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
}

export interface FlashCard {
  id: string;
  front: string;
  back: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topic: string;
}

export interface ConceptMap {
  mainTopic: string;
  subtopics: Array<{
    name: string;
    connections: string[];
    description: string;
  }>;
}

export async function queryGemini(topic: string): Promise<GeminiResponse> {
  const prompt = `As an educational AI tutor, provide a comprehensive learning response for the topic: "${topic}".

Please respond with a JSON object containing:
1. explanation: A detailed, educational explanation (300-500 words)
2. resources: An array of 3-4 learning resources with realistic URLs
3. difficulty: Assessment of topic difficulty level
4. estimatedTime: Estimated learning time

Format as valid JSON only.`;

  try {
    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text;
    
    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    // Fallback response
    return {
      explanation: `Here's a comprehensive explanation of ${topic}:\n\n${text}`,
      resources: [
        {
          type: 'video',
          title: `Understanding ${topic} - Complete Guide`,
          url: '#',
          description: 'Comprehensive video explanation with visual examples'
        },
        {
          type: 'article',
          title: `${topic}: Detailed Analysis`,
          url: '#',
          description: 'In-depth written explanation with diagrams'
        }
      ],
      difficulty: 'intermediate',
      estimatedTime: '15-20 minutes'
    };
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw error;
  }
}

export async function generateQuestions(topic: string, difficulty: string, type: string, count: number = 3) {
  const prompt = `Generate ${count} ${type} questions about "${topic}" at ${difficulty} level.

For multiple choice questions, provide 4 options with one correct answer.
For short answer questions, provide the expected answer.
For essay questions, provide key points to cover.

Respond with a JSON array of questions, each containing:
- question: string
- type: "${type}"
- options?: string[] (for MCQ)
- correctAnswer: string
- explanation: string

Format as valid JSON only.`;

  try {
    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text;
    
    // Extract JSON from the response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    throw new Error('No valid JSON found in response');
  } catch (error) {
    console.error('Error generating questions:', error);
    throw error;
  }
}

export async function solveDoubt(question: string, context?: string): Promise<string> {
  const prompt = `As an AI tutor, provide a clear, step-by-step solution for this doubt: "${question}"
  ${context ? `Context: ${context}` : ''}
  
  Provide:
  1. Direct answer
  2. Step-by-step explanation
  3. Key concepts involved
  4. Tips to remember
  
  Keep it simple and educational.`;

  try {
    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Error solving doubt:', error);
    throw error;
  }
}

export async function summarizeNotes(content: string, type: 'chapter' | 'topic' = 'topic'): Promise<string> {
  const prompt = `Summarize the following educational content into key points:

${content}

Please provide:
1. Main concepts (bullet points)
2. Key formulas/definitions
3. Important dates/facts
4. Quick revision points

Format as a clear, structured summary for ${type}-wise revision.`;

  try {
    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Error summarizing notes:', error);
    throw error;
  }
}

export async function generateFlashcards(topic: string, count: number = 10): Promise<FlashCard[]> {
  const prompt = `Generate ${count} flashcards for the topic: "${topic}"

Each flashcard should have:
- front: A question or term
- back: The answer or definition
- difficulty: easy, medium, or hard

Respond with a JSON array of flashcards:
[
  {
    "front": "question/term",
    "back": "answer/definition", 
    "difficulty": "easy|medium|hard"
  }
]

Format as valid JSON only.`;

  try {
    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text;
    
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const flashcards = JSON.parse(jsonMatch[0]);
      return flashcards.map((card: any, index: number) => ({
        ...card,
        id: `card-${Date.now()}-${index}`,
        topic
      }));
    }
    
    throw new Error('No valid JSON found in response');
  } catch (error) {
    console.error('Error generating flashcards:', error);
    throw error;
  }
}

export async function generateConceptMap(topic: string): Promise<ConceptMap> {
  const prompt = `Create a concept map for the topic: "${topic}"

Provide a JSON object with:
- mainTopic: string
- subtopics: array of objects with name, connections (array of related subtopic names), and description

Example structure:
{
  "mainTopic": "Photosynthesis",
  "subtopics": [
    {
      "name": "Light Reactions",
      "connections": ["Dark Reactions", "Chloroplasts"],
      "description": "Process that captures light energy"
    }
  ]
}

Format as valid JSON only.`;

  try {
    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text;
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    throw new Error('No valid JSON found in response');
  } catch (error) {
    console.error('Error generating concept map:', error);
    throw error;
  }
}
