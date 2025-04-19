export interface OpenAIConfig {
  apiUrl: string;
  apiKey: string;
}

export interface TestRequest {
  testType: 'unit' | 'integration';
  framework: 'Angular' | 'React' | 'Vue' | 'Node.js' | 'Playwright' | 'Java' | 'Python';
  fileName: string;
  fileContent: string;
}