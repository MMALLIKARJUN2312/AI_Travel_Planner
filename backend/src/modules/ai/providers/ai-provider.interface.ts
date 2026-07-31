export interface AiProvider {
  generateContent(prompt: string): Promise<string>;
}
