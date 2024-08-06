import { VertexAI, HarmCategory, HarmBlockThreshold } from '@google-cloud/vertexai';
import { project, location } from './metadata-server.js';

// Initialize Vertex with your Cloud project and location
const vertex_ai = new VertexAI({ project, location });
const model = 'gemini-1.5-flash-001';

// Instantiate the models
const generativeModel = vertex_ai.preview.getGenerativeModel({
    model: model,
    generationConfig: {
        'maxOutputTokens': 8192,
        'temperature': 1,
        'topP': 0.95,
    },
    safetySettings: [
        {
            'category': HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            'threshold': HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
        },
        {
            'category': HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            'threshold': HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
        },
        {
            'category': HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            'threshold': HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
        },
        {
            'category': HarmCategory.HARM_CATEGORY_HARASSMENT,
            'threshold': HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
        }
    ],
});


export async function classifyPdf(data) {
    const req = {
        contents: [
            { role: 'user', parts: [{ inlineData: { mimeType: 'application/pdf', data } }, { text: `この記事を1つのカテゴリに分類し、分類のみ出力しなさい。` }] }
        ],
    };

    const result = await generativeModel.generateContent(req);

    return result.response.candidates?.[0]?.content?.parts?.[0]?.text;
}
