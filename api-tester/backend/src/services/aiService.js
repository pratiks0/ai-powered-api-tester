import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

let openai;
try {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
} catch (error) {
  console.warn('OpenAI API key not configured. AI features will be disabled.');
}

export const generateDocumentation = async ({ method, url, response, statusCode }) => {
  if (!openai) {
    return 'AI documentation generation is disabled. Please configure OPENAI_API_KEY in .env file.';
  }

  try {
    const prompt = `Generate a concise API documentation for:
    Method: ${method}
    URL: ${url}
    Status: ${statusCode}
    Response: ${JSON.stringify(response)}
    
    Format the documentation in markdown.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 500
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Error generating documentation:', error);
    return 'Failed to generate documentation. Please try again later.';
  }
};

export const explainError = async ({ error, statusCode }) => {
  if (!openai) {
    return 'AI error explanation is disabled. Please configure OPENAI_API_KEY in .env file.';
  }

  try {
    const prompt = `Explain this API error in simple terms and suggest how to fix it:
    Status Code: ${statusCode}
    Error: ${JSON.stringify(error)}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 300
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Error explaining error:', error);
    return 'Failed to generate error explanation. Please try again later.';
  }
};