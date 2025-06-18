
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
