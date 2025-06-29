'use server';
/**
 * @fileOverview Generates a Markdown report for a GitHub profile.
 *
 * - generateMarkdownReport - A function that creates a Markdown summary.
 * - MarkdownReportInput - The input type for the generateMarkdownReport function.
 * - MarkdownReportOutput - The return type for the generateMarkdownReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MarkdownReportInputSchema = z.object({
    username: z.string(),
    profileSummary: z.string(),
    keySkills: z.array(z.string()),
    stats: z.object({
        commits: z.number(),
        repos: z.number(),
        stars: z.number(),
        forks: z.number(),
    }),
    topRepos: z.array(z.object({
        name: z.string(),
        url: z.string(),
        description: z.string().nullable(),
        stars: z.number(),
        forks: z.number(),
    })),
    organizations: z.array(z.object({
        login: z.string(),
        description: z.string().nullable(),
    })),
});
export type MarkdownReportInput = z.infer<typeof MarkdownReportInputSchema>;

const MarkdownReportOutputSchema = z.object({
  markdown: z.string().describe('The full Markdown report as a single string.'),
});
export type MarkdownReportOutput = z.infer<typeof MarkdownReportOutputSchema>;


export async function generateMarkdownReport(input: MarkdownReportInput): Promise<MarkdownReportOutput> {
  return generateMarkdownReportFlow(input);
}


const prompt = ai.definePrompt({
    name: 'generateMarkdownReportPrompt',
    input: {schema: MarkdownReportInputSchema},
    output: {schema: MarkdownReportOutputSchema},
    prompt: `You are an expert technical writer specializing in creating professional developer profiles. Generate a comprehensive and well-structured Markdown report for the GitHub user '{{{username}}}'.
The report should be suitable for use in a resume, personal website, or professional portfolio. Use GitHub Flavored Markdown for formatting.

The report MUST include the following sections in this order:

1.  **# GitFolio Report for {{{username}}}**
2.  **## Professional Summary**: Use the provided summary.
3.  **## Key Skills**: A bulleted list of the user's key skills.
4.  **## GitHub Statistics**: A table with the following stats: Total Commits, Public Repositories, Total Stars Received, and Total Forks.
5.  **## Top Repositories**: A bulleted list of the top repositories. Each item should be a link to the repository, followed by its description and star/fork counts. Format: \`* [Repo Name](repo_url) - Repo description (⭐️ Stars | 🍴 Forks).\`
6.  **## Organizations**: A bulleted list of organizations the user is a part of. Each item should be a link to the organization's GitHub page. Format: \`* [Org Name](org_url) - Org description.\` If there are no organizations, state "Not a member of any public organizations."

Here is the data for '{{{username}}}':

## Professional Summary
{{{profileSummary}}}

## Key Skills
{{#each keySkills}}
* {{this}}
{{/each}}

## GitHub Statistics
| Metric                 | Value          |
| ---------------------- | -------------- |
| Total Commits          | {{stats.commits}}      |
| Public Repositories    | {{stats.repos}}        |
| Total Stars Received   | {{stats.stars}}        |
| Total Forks            | {{stats.forks}}        |

## Top Repositories
{{#each topRepos}}
* [{{{this.name}}}]({{{this.url}}}) - {{#if this.description}}{{{this.description}}}{{else}}No description provided.{{/if}} (⭐️ {{{this.stars}}} | 🍴 {{{this.forks}}})
{{/each}}

## Organizations
{{#if organizations}}
{{#each organizations}}
* [{{{this.login}}}](https://github.com/{{{this.login}}}){{#if this.description}} - {{{this.description}}}{{/if}}
{{/each}}
{{else}}
Not a member of any public organizations.
{{/if}}
`,
});

const generateMarkdownReportFlow = ai.defineFlow(
  {
    name: 'generateMarkdownReportFlow',
    inputSchema: MarkdownReportInputSchema,
    outputSchema: MarkdownReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
