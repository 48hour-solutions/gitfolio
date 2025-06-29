import { generateProfile } from "@/app/actions";
import { LanguageCarousel } from "@/components/language-carousel";
import { ProfileCard } from "@/components/profile-card";
import { RegenerateButton } from "@/components/regenerate-button";
import { StatsCard } from "@/components/stats-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Building2, Code, GitFork, Github, Home, Star } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExportButton } from "@/components/export-button";

export default async function ProfilePage({ params }: { params: { username: string } }) {
    const resolvedParams = await Promise.resolve(params);
    const result = await generateProfile(resolvedParams.username);

    if (result.type === 'error') {
        // This will be caught by the error.tsx boundary
        throw new Error(result.message);
    }
    
    if (!result) {
        notFound();
    }

    const { username, avatarUrl, profileSummary, keySkills, languageInsights, languageSummary, developerScore, scoreBreakdown, stats, topRepos, organizations } = result;

    const statItems = [
        { icon: Code, label: "Commits", value: stats.commits.toLocaleString(), hoverClassName: "hover:border-chart-1" },
        { icon: Star, label: "Stars", value: stats.stars.toLocaleString(), hoverClassName: "hover:border-chart-4" },
        { icon: GitFork, label: "Forks", value: stats.forks.toLocaleString(), hoverClassName: "hover:border-chart-3" },
        { icon: Github, label: "Repos", value: stats.repos.toLocaleString(), hoverClassName: "hover:border-accent" },
    ];

    return (
        <div id="profile-export-content" className="bg-background flex-1 w-full">
            <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                         <Link href="/" className="flex items-center gap-2 font-bold text-lg">
                            <Home className="h-5 w-5" />
                            <span className="hidden sm:inline">GitFolio</span>
                        </Link>
                        <div className="flex items-center gap-4">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={avatarUrl} alt={username} />
                                <AvatarFallback>{username.slice(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-foreground">{username}</span>
                            <div id="regenerate-button-wrapper">
                                <RegenerateButton username={username} />
                            </div>
                            <ExportButton 
                                username={username}
                                insights={languageInsights}
                                languageSummary={languageSummary}
                            />
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
                <ProfileCard 
                    username={username} 
                    avatarUrl={avatarUrl} 
                    summary={profileSummary} 
                    score={developerScore} 
                    scoreBreakdown={scoreBreakdown}
                    keySkills={keySkills}
                />

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {statItems.map(item => (
                        <StatsCard 
                            key={item.label} 
                            icon={item.icon} 
                            label={item.label} 
                            value={item.value} 
                            hoverClassName={item.hoverClassName}
                        />
                    ))}
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    <LanguageCarousel insights={languageInsights} languageSummary={languageSummary} />
                    
                    <Card className="shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-2 border-transparent hover:border-chart-5">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Github className="h-5 w-5 text-primary"/> Popular Repositories
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                           {topRepos.map((repo, index) => (
                                <div key={repo.name}>
                                    <div className="flex justify-between items-start gap-4">
                                        <div className="flex-1">
                                            <Link href={repo.url} target="_blank" rel="noopener noreferrer" className="font-semibold hover:underline text-foreground">
                                                {repo.name}
                                            </Link>
                                            {repo.description && <p className="text-sm text-muted-foreground mt-1">{repo.description}</p>}
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground shrink-0">
                                            <div className="flex items-center gap-1">
                                                <Star className="h-4 w-4"/> {repo.stars}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <GitFork className="h-4 w-4"/> {repo.forks}
                                            </div>
                                        </div>
                                    </div>
                                    {index < topRepos.length - 1 && <Separator className="mt-4" />}
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
                
                {organizations && organizations.length > 0 && (
                     <Card className="shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-2 border-transparent hover:border-chart-1">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Building2 className="h-5 w-5 text-primary"/> Organizations
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                           {organizations.map((org, index) => (
                                <div key={org.login}>
                                    <Link href={`https://github.com/${org.login}`} target="_blank" rel="noopener noreferrer" className="flex items-start gap-4 hover:bg-muted/50 p-2 -m-2 rounded-lg transition-colors">
                                        <Avatar className="h-12 w-12 rounded-lg">
                                            <AvatarImage src={org.avatarUrl} alt={org.login} />
                                            <AvatarFallback>{org.login.slice(0, 2).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <p className="font-semibold text-foreground">{org.login}</p>
                                            {org.description && <p className="text-sm text-muted-foreground mt-1">{org.description}</p>}
                                        </div>
                                    </Link>
                                    {index < organizations.length - 1 && <Separator className="mt-4" />}
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                )}
            </main>
        </div>
    );
}
