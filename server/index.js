import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { SYSTEM_PROMPT } from './prompt.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.post('/api/guidance', async (req, res) => {
  const { level, answers, otherTexts, language } = req.body || {}

  if (!level) {
    return res.status(400).json({ error: 'level is required' })
  }

  const apiKey = process.env.GROQ_API_KEY
  const model = process.env.GROQ_MODEL || 'llama-3.1-8b-instant'

  if (!apiKey) {
    return res.status(500).json({ error: 'AI service not configured' })
  }

  try {
    const userContent = JSON.stringify({
      level,
      answers,
      otherTexts: otherTexts || [],
      language: language || 'en',
    })

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        temperature: 0.3,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userContent },
        ],
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Groq API error:', response.status, errorText)
      return res.status(502).json({ error: 'AI service error' })
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content

    if (!content) {
      return res.status(502).json({ error: 'Empty AI response' })
    }

    let parsed
    try {
      parsed = JSON.parse(content)
    } catch (e) {
      console.error('Failed to parse AI JSON:', e)
      return res.status(502).json({ error: 'Invalid AI response format' })
    }

    res.json(parsed)
  } catch (err) {
    console.error('Guidance endpoint error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.post('/api/groq', async (req, res) => {
  const { level, answers, otherTexts, language } = req.body || {}

  if (!level) {
    return res.status(400).json({ error: 'level is required' })
  }

  const apiKey = process.env.GROQ_API_KEY
  const model = process.env.GROQ_MODEL || 'llama-3.1-8b-instant'

  if (!apiKey) {
    return res.status(500).json({ error: 'AI service not configured' })
  }

  try {
    const userContent = JSON.stringify({
      level,
      answers,
      otherTexts: otherTexts || [],
      language: language || 'en',
    })

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        temperature: 0.3,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userContent },
        ],
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Groq API error:', response.status, errorText)
      return res.status(502).json({ error: 'AI service error' })
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content

    if (!content) {
      return res.status(502).json({ error: 'Empty AI response' })
    }

    let parsed
    try {
      parsed = JSON.parse(content)
    } catch (e) {
      console.error('Failed to parse AI JSON:', e)
      return res.status(502).json({ error: 'Invalid AI response format' })
    }

    res.json(parsed)
  } catch (err) {
    console.error('Guidance endpoint error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.listen(PORT, () => {
  console.log(`Guidance server listening on http://localhost:${PORT}`)
})
