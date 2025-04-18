import { OpenAI } from 'openai';
import { TestRequest } from '../types';

export class OpenAIClient {
    private openai: OpenAI;

    constructor(apiUrl: string, apiKey?: string) {
        this.openai = new OpenAI({
            apiKey: apiKey,
            baseURL: apiUrl
        });
    }

    async generateTests(request: TestRequest): Promise<string> {
        const prompt = `Generate a ${request.testType} test using ${request.framework} for the following file (${request.fileName}):\n${request.fileContent}`;

        const response = await this.openai.chat.completions.create({
            model: 'qwen2.5-7b-instruct-1m',
            messages: [
                { role: 'system', content: 'You are a helpful assistant that writes tests for code.' },
                { role: 'user', content: prompt }
            ],
            max_tokens: 512,
            temperature: 0.2
        });

        if (!response.choices || response.choices.length === 0) {
            throw new Error('No response from OpenAI.');
        }

        return response.choices[0].message.content?.trim() || '';
    }
}