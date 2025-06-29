'use server';
/**
 * @fileOverview An AI agent for analyzing pre-filtered developer candidates.
 *
 * - findDevelopers - Ranks and provides reasoning for a list of candidates.
 * - FindDevelopersInput - The input type for the findDevelopers function.
 * - FindDevelopersOutput - The return type for the findDevelopers function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// This schema represents the comprehensive data the AI will analyze for each candidate.
const DeveloperProfileSchema = z.object({
  username: z.string(),
  profileSummary: z.string(),
  keySkills: z.array(z.string()),
  languageSummary: z.string(),
  organizations: z.array(z.object({
      login: z.string(),
      description: z.string().nullable(),
  })),
  stats: z.object({
    commits: z.number(),
    repos: z.number(),
    stars: z.number(),
    forks: z.number(),
  }),
});
type DeveloperProfile = z.infer<typeof DeveloperProfileSchema>;

const FindDevelopersInputSchema = z.object({
    query: z.string().describe("The original user query."),
    profiles: z.array(DeveloperProfileSchema).describe("A list of pre-filtered developer profiles to analyze.")
});
export type FindDevelopersInput = z.infer<typeof FindDevelopersInputSchema>;


const FindDevelopersOutputSchema = z.object({
  candidates: z.array(z.object({
    username: z.string().describe("The GitHub username of the recommended candidate."),
    reason: z.string().describe("A brief, one-sentence explanation for why this candidate is a good match for the query, citing specific skills or experience."),
  })).describe('A list of up to 5 of the most suitable developer candidates from the provided list.'),
});
export type FindDevelopersOutput = z.infer<typeof FindDevelopersOutputSchema>;

export async function findDevelopers(input: FindDevelopersInput): Promise<FindDevelopersOutput> {
  return findDevelopersFlow(input);
}

const findDevelopersFlow = ai.defineFlow(
  {
    name: 'findDevelopersFlow',
    inputSchema: FindDevelopersInputSchema,
    outputSchema: FindDevelopersOutputSchema,
  },
  async (input) => {
    if (input.profiles.length === 0) {
        return { candidates: [] };
    }

    const { output } = await ai.generate({
        prompt: `You are an expert technical recruiter. You have been provided with a list of developer profiles that have been pre-filtered based on a user's query. Your task is to analyze these candidates and select up to 5 of the best matches.

        User's Request: "${input.query}"
        
        For each of the provided profiles, carefully analyze their summary, key skills, language experience, and organization memberships to determine their suitability.
        
        Return a ranked list of up to 5 candidates. For each candidate, provide their username and a concise, one-sentence reason explaining why they are a strong match for the user's request. Be specific in your reasoning, mentioning the exact skills or experiences that align with the query.
        
        Provided Candidate Profiles:
        ${JSON.stringify(input.profiles, null, 2)}
        `,
        output: { schema: FindDevelopersOutputSchema },
    });
    return output!;
  }
);
