const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public')); // To serve HTML, CSS, and JS files

const OPENAI_API_KEY = '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';

// Endpoint to handle chat requests
app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).send({ error: 'Message is required' });
  }

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: userMessage }],
        max_tokens: 1000,
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`, // Fixed string interpolation
          'Content-Type': 'application/json',
        },
      }
    );

    // Send the OpenAI API's response back to the client
    res.send({ response: response.data.choices[0].message.content });
  } catch (error) {
    console.error('Error communicating with OpenAI API:', error.message || error);
    
    // Return a meaningful error message
    const statusCode = error.response ? error.response.status : 500;
    res.status(statusCode).send({
      error: 'Failed to fetch response from OpenAI API',
      details: error.response?.data || error.message,
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`); // Fixed template literal
});
