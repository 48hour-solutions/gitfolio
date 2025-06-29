
"use server";

import fs from 'fs/promises';
import path from 'path';
import { revalidateTag } from 'next/cache';
import { synthesizeGithubProfile, SynthesizeGithubProfileInput } from '@/ai/flows/synthesize-github-profile';
import { generateMarkdownReport } from '@/ai/flows/generate-markdown-report';
import { findDevelopers } from '@/ai/flows/find-developers';
import { extractKeywords } from '@/ai/flows/extract-keywords';

type ScoreComponent = {
    value: number;
    reasoning: string;
};

export type ProfileData = {
    type: 'success';
    username: string;
    avatarUrl: string;
    profileSummary: string;
    keySkills: string[];
    languageInsights: {
        language: string;
        insight: string;
    }[];
    languageSummary: string;
    developerScore: number;
    scoreBreakdown: {
        commitActivity: ScoreComponent;
        repositoryImpact: ScoreComponent;
        communityInfluence: ScoreComponent;
        languageDiversity: ScoreComponent;
    };
    stats: {
        commits: number;
        repos: number;
        stars: number;
        forks: number;
    };
    topRepos: { name: string; description: string | null; stars: number; forks: number, url: string }[];
    organizations: { login: string; avatarUrl: string; description: string | null; }[];
};

export type ProfileError = {
    type: 'error';
    message: string;
};

export type DeveloperSearchResult = ProfileData & { reason: string };

const profilesFilePath = path.join(process.cwd(), 'src', 'data', 'profiles.json');

async function readProfilesCache(): Promise<{ [key: string]: ProfileData }> {
    try {
        await fs.mkdir(path.dirname(profilesFilePath), { recursive: true });
        const fileContent = await fs.readFile(profilesFilePath, 'utf-8');
        if (!fileContent.trim()) {
            return {};
        }
        return JSON.parse(fileContent);
    } catch (error: any) {
        if (error.code === 'ENOENT') {
            return {};
        }
        console.error("Error reading profiles cache:", error);
        return {};
    }
}

async function writeProfilesCache(data: { [key: string]: ProfileData }): Promise<void> {
    try {
        await fs.mkdir(path.dirname(profilesFilePath), { recursive: true });
        await fs.writeFile(profilesFilePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
        console.error("Error writing to profiles cache:", error);
    }
}

export async function clearProfileCache(username: string): Promise<void> {
    const lowerCaseUsername = username.toLowerCase();
    revalidateTag(lowerCaseUsername);

    const cachedProfiles = await readProfilesCache();
    if (cachedProfiles[lowerCaseUsername]) {
        delete cachedProfiles[lowerCaseUsername];
        await writeProfilesCache(cachedProfiles);
    }
}

async function fetchGitHubAPI(url: string, username: string, options: RequestInit = {}) {
    const headers: HeadersInit = {
        'Accept': 'application/vnd.github.v3+json',
        ...options.headers,
    };
    if (process.env.GITHUB_TOKEN) {
        headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
    }
    
    const response = await fetch(url, {
        ...options,
        headers,
        next: { tags: [username.toLowerCase()] }
    });

    if (!response.ok) {
        const errorBody = await response.text();
        const errorMessage = `GitHub API error at ${url}: ${response.status} ${response.statusText} - ${errorBody}`;
        throw new Error(errorMessage);
    }
    return response.json();
}

async function fetchAllGitHubPages(url: string, username: string, options: RequestInit = {}) {
    let results: any[] = [];
    let nextUrl: string | null = url;

    const headers: HeadersInit = {
        'Accept': 'application/vnd.github.v3+json',
        ...options.headers,
    };
    if (process.env.GITHUB_TOKEN) {
        headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    while (nextUrl) {
        const response = await fetch(nextUrl, {
            ...options,
            headers,
            next: { tags: [username.toLowerCase()] }
        });

        if (!response.ok) {
            const errorBody = await response.text();
            const errorMessage = `GitHub API error during pagination at ${nextUrl}: ${response.status} ${response.statusText} - ${errorBody}`;
            throw new Error(errorMessage);
        }
        
        const data = await response.json();
        results = results.concat(data);

        const linkHeader = response.headers.get('Link');
        nextUrl = linkHeader?.match(/<([^>]+)>;\s*rel="next"/)?.[1] ?? null;
    }
    return results;
}

export async function generateProfile(username: string): Promise<ProfileData | ProfileError> {
    const lowerCaseUsername = username.toLowerCase();
    const allCachedProfiles = await readProfilesCache();
    if (allCachedProfiles[lowerCaseUsername]) {
        return allCachedProfiles[lowerCaseUsername];
    }

    try {
        const userData = await fetchGitHubAPI(`https://api.github.com/users/${username}`, username);

        const [reposData, commitsData, orgsData] = await Promise.all([
             fetchAllGitHubPages(userData.repos_url + '?per_page=100', username),
             fetchGitHubAPI(`https://api.github.com/search/commits?q=author:${username}`, username, {
                headers: { 'Accept': 'application/vnd.github.v3.text-match+json' }
            }),
             fetchAllGitHubPages(userData.organizations_url, username).catch(err => {
                console.warn(`Could not fetch organizations for ${username}: ${err.message}`);
                return []; // Return empty array on error
             }),
        ]);
        
        const allRepos = reposData.filter((repo: any) => repo.name.toLowerCase() !== username.toLowerCase() && repo.name !== '.github' && !repo.fork);

        const totalStars = allRepos.reduce((acc: number, repo: any) => acc + repo.stargazers_count, 0);
        const totalForks = allRepos.reduce((acc: number, repo: any) => acc + repo.forks_count, 0);

        const sortedRepos = [...allRepos].sort((a: any, b: any) => b.stargazers_count - a.stargazers_count);
        const topRepos = sortedRepos.slice(0, 5).map((repo: any) => ({
            name: repo.name,
            description: repo.description,
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            url: repo.html_url
        }));
        
        const languageDataPromises = allRepos.map((repo: any) => 
            fetchGitHubAPI(repo.languages_url, username).catch(() => ({}))
        );
        const repoLanguagesArray = await Promise.all(languageDataPromises);

        const repoDetails = allRepos.map((repo: any, index: number) => ({
            name: repo.name,
            description: repo.description || '',
            languages: Object.keys(repoLanguagesArray[index]),
        }));

        const languageMap: { [key: string]: number } = {};
        const languageRepoCount: { [key: string]: number } = {};
        repoLanguagesArray.forEach(langs => {
            for (const lang in langs) {
                languageMap[lang] = (languageMap[lang] || 0) + langs[lang];
                languageRepoCount[lang] = (languageRepoCount[lang] || 0) + 1;
            }
        });
        
        const ignoredLanguages = new Set([
            'Makefile', 'Dockerfile', 'Shell', 'PowerShell', 'Batchfile', 'CMake',
            'HTML', 'CSS', 'SCSS', 'Less', 'G-code', 'Roff', 'Markdown', 'TeX'
        ]);

        const topProgrammingLanguages = Object.keys(languageMap)
            .filter(lang => !ignoredLanguages.has(lang) && (languageRepoCount[lang] || 0) > 1)
            .sort((a, b) => languageMap[b] - languageMap[a])
            .slice(0, 5);

        const stats = {
            commits: commitsData.total_count || 0,
            repos: allRepos.length,
            stars: totalStars,
            forks: totalForks,
        };

        const popularRepositoriesWithDesc = topRepos.map(r => 
            `${r.name}${r.description ? `: ${r.description}` : ''}`
        ).join('; ');
        
        const organizations = orgsData.map((org: any) => ({
            login: org.login,
            avatarUrl: org.avatar_url,
            description: org.description
        }));

        const inputForAI: SynthesizeGithubProfileInput = {
            username,
            profileType: userData.type,
            commitHistory: `The ${userData.type.toLowerCase()} has made ${stats.commits.toLocaleString()} commits.`,
            languagesUsed: `Primary programming languages are ${topProgrammingLanguages.join(', ')}.`,
            contributions: `The ${userData.type.toLowerCase()} has ${stats.repos} public repositories, received ${stats.stars.toLocaleString()} stars, and ${stats.forks.toLocaleString()} forks across them.`,
            popularRepositories: `Top repositories by popularity are: ${popularRepositoriesWithDesc}.`,
            organizations: organizations.map(o => o.login).join(', '),
            repoDetails: JSON.stringify(repoDetails),
        };

        const result = await synthesizeGithubProfile(inputForAI);
        
        const newProfileData: ProfileData = {
            type: 'success',
            username,
            avatarUrl: userData.avatar_url,
            profileSummary: result.profileSummary,
            keySkills: result.keySkills,
            languageInsights: result.languageInsights,
            languageSummary: result.languageSummary,
            developerScore: result.developerScore,
            scoreBreakdown: result.scoreBreakdown,
            stats,
            topRepos,
            organizations,
        };
        
        allCachedProfiles[lowerCaseUsername] = newProfileData;
        await writeProfilesCache(allCachedProfiles);
        
        return newProfileData;

    } catch (error: any) {
        console.error(`\n--- ERROR GENERATING PROFILE FOR: ${username} ---`);
        console.error(error);
        console.error("--- END ERROR --- \n");
        
        return {
            type: 'error',
            message: `Failed to generate profile. Reason: ${error.message}`,
        };
    }
}

export async function generateMarkdown(username: string): Promise<string> {
    const profile = await generateProfile(username);
    if (profile.type === 'error') {
        throw new Error(profile.message);
    }

    const { markdown } = await generateMarkdownReport({
        username: profile.username,
        profileSummary: profile.profileSummary,
        keySkills: profile.keySkills,
        stats: profile.stats,
        topRepos: profile.topRepos,
        organizations: profile.organizations,
    });
    
    return markdown;
}


export async function searchDevelopers(query: string): Promise<DeveloperSearchResult[]> {
    try {
        // 1. Break the user's prompt into keywords
        const { keywords } = await extractKeywords(query);
        if (keywords.length === 0) {
            return [];
        }

        // 2. Use keywords to filter the database with code
        const allCachedProfiles = await readProfilesCache();
        const allProfiles = Object.values(allCachedProfiles).filter(p => p.type === 'success') as ProfileData[];

        const searchRegex = new RegExp(keywords.join('|'), 'i');

        const filteredCandidates = allProfiles.filter(profile => {
            // Create a searchable text blob for each profile
            const searchableText = [
                profile.profileSummary,
                profile.keySkills.join(' '),
                profile.languageSummary,
                profile.languageInsights.map(l => `${l.language} ${l.insight}`).join(' '),
                profile.organizations.map(o => `${o.login} ${o.description || ''}`).join(' '),
                profile.topRepos.map(r => `${r.name} ${r.description || ''}`).join(' ')
            ].join(' ');

            return searchRegex.test(searchableText);
        });

        if (filteredCandidates.length === 0) {
            return [];
        }

        // 3. Pass filtered results to AI to summarize and rank
        const { candidates: rankedCandidates } = await findDevelopers({
            query,
            profiles: filteredCandidates.map(p => ({ // Map to the schema the AI expects
                username: p.username,
                profileSummary: p.profileSummary,
                keySkills: p.keySkills,
                languageSummary: p.languageSummary,
                organizations: p.organizations.map(o => ({ login: o.login, description: o.description })),
                stats: p.stats
            }))
        });

        if (!rankedCandidates || rankedCandidates.length === 0) {
            return [];
        }
        
        // 4. Map AI results back to full profile data
        const searchResults: DeveloperSearchResult[] = [];
        for (const candidate of rankedCandidates) {
            const profileData = allCachedProfiles[candidate.username.toLowerCase()];
            if (profileData && profileData.type === 'success') {
                searchResults.push({
                    ...profileData,
                    reason: candidate.reason,
                });
            }
        }
        
        return searchResults;

    } catch (error: any) {
        console.error(`\n--- ERROR SEARCHING DEVELOPERS ---`);
        console.error(error);
        console.error("--- END ERROR --- \n");
        
        throw new Error(`Failed to search for developers. Reason: ${error.message}`);
    }
}
