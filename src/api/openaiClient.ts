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

    async generateTests(request: TestRequest, existingSpecContent?: string): Promise<string> {
        let prompt = `Generate a ${request.testType} test using ${request.framework} for the following file (${request.fileName}):\n${request.fileContent}\n`;

        if (existingSpecContent) {
            prompt += `\nThe current test file contains the following tests:\n${existingSpecContent}\n`;
            prompt += `If possible, improve or add missing tests. Do not duplicate existing tests.`;
        }

        prompt += `\nReturn ONLY the code for the complete test file, with no explanation or commentary. nad Do Not include import statements., and do not include triple backticks.`;

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