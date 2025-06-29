'use server';
/**
 * @fileOverview Extracts keywords from a natural language query.
 *
 * - extractKeywords - A function that pulls technical keywords from a string.
 * - ExtractKeywordsInput - The input type for the extractKeywords function.
 * - ExtractKeywordsOutput - The return type for the extractKeywords function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ExtractKeywordsInputSchema = z.string().describe('A natural language query about finding a developer.');
export type ExtractKeywordsInput = z.infer<typeof ExtractKeywordsInputSchema>;

const ExtractKeywordsOutputSchema = z.object({
  keywords: z.array(z.string()).describe('A list of technical skills, concepts, or keywords extracted from the query.'),
});
export type ExtractKeywordsOutput = z.infer<typeof ExtractKeywordsOutputSchema>;


export async function extractKeywords(input: ExtractKeywordsInput): Promise<ExtractKeywordsOutput> {
  return extractKeywordsFlow(input);
}


const extractKeywordsFlow = ai.defineFlow(
  {
    name: 'extractKeywordsFlow',
    inputSchema: ExtractKeywordsInputSchema,
    outputSchema: ExtractKeywordsOutputSchema,
  },
  async (query) => {
    const { output } = await ai.generate({
        prompt: `You are an expert at parsing technical job descriptions. Your task is to extract the key technical skills, programming languages, and concepts from the following user query.

        Focus on nouns and technical terms. Ignore filler words. Return the keywords as a list of strings.
        
        For example, if the query is "I need a senior front-end developer with experience in React, TypeScript, and real-time applications who has worked on game mods", the output should be ["front-end", "react", "typescript", "real-time", "game mods"].
        
        If the query is "I need a developer to help me reverse engineer my car", the output should be ["reverse engineer", "car", "automotive"].

        User's Request: "${query}"`,
        output: { schema: ExtractKeywordsOutputSchema },
    });
    return output!;
  }
);
