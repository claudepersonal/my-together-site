import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt, model, template } = req.body;

    // Validate prompt
    if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
      return res.status(400).json({ error: 'Prompt is required and must be a non-empty string' });
    }

    // Build messages array with system message (template) and user prompt
    const messages = [
      { 
        role: 'system', 
        content: template || 'You are a helpful assistant.' 
      },
      { 
        role: 'user', 
        content: prompt 
      }
    ];

    // Resolve model - use provided model or fallback
    const selectedModel = model || 'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo';

    // Check if API key is configured
    if (!process.env.TOGETHER_API_KEY) {
      console.error('TOGETHER_API_KEY is not configured in environment variables');
      return res.status(500).json({ error: 'Server configuration error: API key not set' });
    }

    // Make request to Together AI
    console.log(`Making request to Together AI with model: ${selectedModel}`);
    
    const response = await axios.post(
      'https://api.together.xyz/v1/chat/completions',
      {
        model: selectedModel,
        messages: messages
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.TOGETHER_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Validate response structure
    if (!response.data || !response.data.choices || !response.data.choices[0]) {
      console.error('Unexpected response structure from Together AI:', response.data);
      return res.status(500).json({ error: 'Unexpected response from AI service' });
    }

    // Extract and return the answer
    const answer = response.data.choices[0].message.content;
    return res.status(200).json({ answer });

  } catch (error) {
    // Handle specific error cases
    if (error.response) {
      const status = error.response.status;
      const errorData = error.response.data;
      
      console.error(`Together AI API error (${status}):`, errorData);

      if (status === 401) {
        return res.status(401).json({ 
          error: 'Invalid TOGETHER_API_KEY - please check your API key configuration' 
        });
      }

      if (status === 400) {
        return res.status(400).json({ 
          error: 'Model not recognised or invalid request - check spelling or use the fallback model',
          details: errorData.error?.message || 'Bad request'
        });
      }

      if (status === 429) {
        return res.status(429).json({ 
          error: 'Rate limit exceeded - please try again later' 
        });
      }

      return res.status(status).json({ 
        error: `API error: ${errorData.error?.message || 'Unknown error'}` 
      });
    }

    // Network or other errors
    console.error('Request error:', error.message);
    return res.status(500).json({ 
      error: 'Failed to connect to AI service - please try again later' 
    });
  }
}

