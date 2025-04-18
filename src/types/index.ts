export interface OpenAIConfig {
  apiUrl: string;
  apiKey: string;
}

export interface TestRequest {
  testType: 'unit' | 'integration';
  framework: 'Angular' | 'React';
  fileName: string;
  fileContent: string;
}