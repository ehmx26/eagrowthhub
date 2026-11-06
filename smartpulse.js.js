import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { prompt, context } = req.body;

        const systemInstruction = `You are SmartPulse AI, an expert 24/7 business co-pilot and revenue optimization engine built for EA Growth Hub. You help entrepreneurs and service providers analyze pipelines, generate high-converting campaigns, and streamline operations. Maintain a sharp, professional, and action-oriented tone.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
                { role: 'user', parts: [{ text: `Context: ${context || 'EA Growth Hub Dashboard'}\n\nUser Request: ${prompt}` }] }
            ],
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.7,
            }
        });

        return res.status(200).json({ reply: response.text });

    } catch (error) {
        console.error('SmartPulse AI Error:', error);
        return res.status(500).json({ error: 'Failed to generate response from SmartPulse AI.' });
    }
}