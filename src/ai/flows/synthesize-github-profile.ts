'use server';
/**
 * @fileOverview A GitHub profile synthesizer AI agent.
 *
 * - synthesizeGithubProfile - A function that handles the profile synthesis process.
 * - SynthesizeGithubProfileInput - The input type for the synthesizeGithubProfile function.
 * - SynthesizeGithubProfileOutput - The return type for the synthesizeGithubProfile function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SynthesizeGithubProfileInputSchema = z.object({
  username: z.string().describe('The GitHub username to synthesize a profile for.'),
  profileType: z.enum(['User', 'Organization']).describe('The type of GitHub profile (User or Organization).'),
  commitHistory: z.string().describe('The commit history of the user or organization.'),
  languagesUsed: z.string().describe('The languages used by the user or organization.'),
  contributions: z.string().describe('The contributions of the user or organization.'),
  popularRepositories: z.string().describe('A summary of popular repositories including their names and descriptions.'),
  organizations: z.string().describe('A comma-separated list of organizations the user is a member of, if any.'),
  repoDetails: z.string().describe('A JSON string of an array of repository objects, each containing name, description, and languages used. This provides detailed context for analysis.'),
});
export type SynthesizeGithubProfileInput = z.infer<typeof SynthesizeGithubProfileInputSchema>;

const ScoreComponentSchema = z.object({
  value: z
    .number()
    .min(0)
    .max(100)
    .describe(
      'The contribution of this factor to the total score, on a scale of 0-100.'
    ),
  reasoning: z
    .string()
    .describe('A brief explanation of why this score was given for this factor.'),
});

const SynthesizeGithubProfileOutputSchema = z.object({
  profileSummary: z.string().describe('A professional summary of the user or organization based on their GitHub statistics.'),
  keySkills: z.array(z.string()).describe('A list of 3-5 key skills, technologies, or domains of expertise (e.g., "Web Development", "API Design", "Game Development"). Do not include programming languages.'),
   languageInsights: z.array(z.object({
      language: z.string(),
      insight: z.string().describe("A brief, one-sentence summary of the developer's experience with this language, inferred from the repository details provided. Frame it positively.")
  })).describe('An array of insights for each of the top programming languages.'),
  languageSummary: z.string().describe("A brief, one-paragraph summary of the developer's overall experience with their top programming languages, highlighting their versatility. This summary is separate from the individual language insights."),
  developerScore: z.number().min(0).max(100).describe('A score from 0-100 evaluating the overall impact and activity of the developer, considering factors like commits, stars, repository quality, and community involvement. Higher is better.'),
  scoreBreakdown: z.object({
    commitActivity: ScoreComponentSchema.describe('Assessment of commit frequency and consistency.'),
    repositoryImpact: ScoreComponentSchema.describe('Assessment of the popularity and quality of repositories (stars, forks).'),
    communityInfluence: ScoreComponentSchema.describe('Assessment of contributions to organizations and community engagement.'),
    languageDiversity: ScoreComponentSchema.describe('Assessment of the diversity and relevance of languages used.'),
  }).describe('A detailed breakdown of the Developer Score into contributing factors.')
});
export type SynthesizeGithubProfileOutput = z.infer<typeof SynthesizeGithubProfileOutputSchema>;

export async function synthesizeGithubProfile(input: SynthesizeGithubProfileInput): Promise<SynthesizeGithubProfileOutput> {
  return synthesizeGithubProfileFlow(input);
}

const prompt = ai.definePrompt({
  name: 'synthesizeGithubProfilePrompt',
  input: {schema: SynthesizeGithubProfileInputSchema},
  output: {schema: SynthesizeGithubProfileOutputSchema},
  prompt: `You are an AI expert in crafting compelling, professional summaries for software developers and technology organizations on GitHub. Your goal is to create a narrative that is both professional and impressive to recruiters or potential collaborators.

The profile for '{{{username}}}' is for a GitHub {{{profileType}}}. You must tailor your summary to reflect this.
- If the profile is a 'User', write from the perspective of an individual developer. For example: "Highly motivated and versatile developer..."
- If the profile is an 'Organization', write from a collective, third-person perspective. For example: "A dynamic and impactful open-source organization..." or "A collective of developers focused on..."

Here is an example of a high-quality output for a user:
"Highly motivated and versatile developer with a strong track record of contributing to open-source projects. Proficient in C# and Python, demonstrated through 338 commits across 17 public repositories. Experienced in developing and maintaining popular repositories, including ff-5mp-api, cloudscraper-server, pokehelper, and ff-5mp-klipper-profiles. Proven ability to create impactful projects, evidenced by 22 stars received on public repositories. Passionate about technology and committed to delivering high-quality code."

Now, using the following GitHub statistics for '{{{username}}}' (a {{{profileType}}}), generate a new summary in the appropriate style. When mentioning languages, focus only on actual programming languages (e.g., Python, JavaScript, TypeScript) and exclude configuration or markup languages (e.g., Makefile, Dockerfile, HTML). Be concise, use professional language, and highlight key accomplishments and skills. Analyze the repository descriptions provided below to understand the user's/organization's domain or field of expertise (e.g., web development, data science, cryptocurrency) and incorporate this into the summary to make it less generic. Avoid sounding like a generic AI.

If the user is a member of any organizations, you can mention this as a sign of their collaborative nature. Avoid just listing the orgs; instead, integrate the fact of their membership into the narrative. For example, "As an active member of organizations like X and Y, they have demonstrated a commitment to teamwork and community-driven development."

- Commit History: {{{commitHistory}}}
- Languages Used: {{{languagesUsed}}}
- Contributions Overview: {{{contributions}}}
- Popular Repositories (with descriptions): {{{popularRepositories}}}
- Member of Organizations: {{{organizations}}}

The final summary should be a single paragraph, no more than 200 words. Do not wrap the output in quotes.

Based on the repository details, generate a list of 3-5 'keySkills'. These should be high-level domains, technologies, or skills (e.g., "API Development", "Game Modification", "Automation Tools"). Do NOT include programming languages in this list.

Using the detailed repository data, generate a 'languageInsights' array. For each of the user's top programming languages, provide a single, positive sentence summarizing their experience with that language, as demonstrated by their projects. For example: "Demonstrated expertise in C# by building robust APIs and tools for hardware integration."

- Detailed Repository Data: {{{repoDetails}}}

Next, generate a 'languageSummary'. This should be a brief, one-paragraph summary of the developer's overall experience across their top programming languages, highlighting their versatility and the range of applications they can build based on the languages they use.

Finally, you will calculate a holistic "Developer Score" from 0 to 100, and provide a detailed breakdown for it.

The overall Developer Score is a holistic measure calculated from the four breakdown components. The **repositoryImpact** score should be the most significant factor in your calculation, as community validation is a key indicator of a developer's influence. A score of 50 represents an average developer, while a score above 85 indicates an exceptionally strong and influential profile. Output only the calculated number for the developerScore field.

For the 'scoreBreakdown', you must evaluate four key areas. For each area, provide a 'value' from 0-100 representing its strength, and 'reasoning' to justify that value based on the provided stats. The reasoning should be a brief, insightful explanation. **It is critical that you do not use negative or diminutive language (e.g., 'only a few stars,' 'low star count,' 'modest'). Frame all reasoning positively, focusing only on the developer's accomplishments.**

1.  **commitActivity (Commit Activity & Consistency)**: Evaluate the total number of commits as a measure of overall effort and productivity. A higher commit count generally indicates a more active developer. Your reasoning should reference the actual commit number and what it implies about their work ethic.
2.  **repositoryImpact (Repository Impact & Quality)**: Assess the influence and quality of the user's repositories. This score is primarily determined by the total star count, as it reflects community validation and project quality. Your reasoning must be framed positively and should not use diminutive language. Extract the star and fork counts from the 'contributions' data. If the user has stars, mention the total count and state that this shows community validation. If the user has forks, mention the total count as evidence that others are building upon their work. For example, a good reasoning would be: "With X stars and Y forks across their repositories, this developer has demonstrated a clear ability to create projects that are both valued and built upon by the community." A score of 75 or higher is warranted even for a handful of stars, as it proves the work has resonated with others. A larger number of stars (50-250) indicates growing adoption and should score in the 85-95 range. An exceptional star count (250+) deserves a score of 95+.
3.  **communityInfluence (Community Engagement)**: Measure the developer's involvement in the broader open-source community. Primarily, this is indicated by membership in GitHub organizations. Active participation in one or more well-known organizations is a strong positive signal. If no organizations are listed, this score should reflect a primary focus on individual projects.
4.  **languageDiversity (Language Diversity)**: Analyze the diversity and relevance of the programming languages used. The score should reflect a balance between breadth (knowing multiple languages) and depth (significant work in key languages). Using a diverse set of modern, in-demand languages (like TypeScript, Python, etc.) is a plus. Your reasoning should list the key languages considered.
  `,
});

const synthesizeGithubProfileFlow = ai.defineFlow(
  {
    name: 'synthesizeGithubProfileFlow',
    inputSchema: SynthesizeGithubProfileInputSchema,
    outputSchema: SynthesizeGithubProfileOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
