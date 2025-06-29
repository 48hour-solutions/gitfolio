
"use client";

import { useState, useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Github, FastForward } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";

type ScoreComponent = {
    value: number;
    reasoning: string;
};

interface ProfileCardProps {
    username: string;
    avatarUrl: string;
    summary: string;
    keySkills: string[];
    score: number;
    scoreBreakdown: {
        commitActivity: ScoreComponent;
        repositoryImpact: ScoreComponent;
        communityInfluence: ScoreComponent;
        languageDiversity: ScoreComponent;
    };
}

const breakdownTitles: { [key: string]: string } = {
    commitActivity: "Commit Activity & Consistency",
    repositoryImpact: "Repository Impact & Quality",
    communityInfluence: "Community Engagement",
    languageDiversity: "Language Diversity",
};

// A component for the dialog's body, so we can reuse it.
const ScoreDialogBody = ({ scoreBreakdown }: { scoreBreakdown: ProfileCardProps['scoreBreakdown'] }) => (
    <>
        <DialogHeader className="p-6 pb-2">
            <DialogTitle>Developer Score Breakdown</DialogTitle>
            <DialogDescription>
                This score reflects an analysis of public GitHub activity. Here's how it breaks down.
            </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] sm:max-h-[70vh]">
            <div className="grid gap-6 px-6 pb-6 pt-2">
                {Object.entries(scoreBreakdown).map(([key, component]) => (
                    <div key={key} className="space-y-2">
                        <div className="flex justify-between items-baseline">
                            <h4 className="text-sm font-semibold text-foreground">
                                {breakdownTitles[key]}
                            </h4>
                            <span className="text-sm font-bold text-primary">{component.value}</span>
                        </div>
                        <Progress value={component.value} className="h-2" />
                        <p className="text-xs text-muted-foreground">{component.reasoning}</p>
                    </div>
                ))}
            </div>
        </ScrollArea>
    </>
);


export function ProfileCard({ username, avatarUrl, summary, keySkills, score, scoreBreakdown }: ProfileCardProps) {
    const [typedSummary, setTypedSummary] = useState("");
    const [isTyping, setIsTyping] = useState(true);
    const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);

    const skipAnimation = () => {
        if (typingIntervalRef.current) {
            clearInterval(typingIntervalRef.current);
        }
        setTypedSummary(summary);
        setIsTyping(false);
    };

    useEffect(() => {
        if (summary) {
            setIsTyping(true);
            setTypedSummary("");
            let i = 0;
            
            if (typingIntervalRef.current) {
                clearInterval(typingIntervalRef.current);
            }

            typingIntervalRef.current = setInterval(() => {
                i++;
                setTypedSummary(summary.slice(0, i));
                if (i >= summary.length) {
                    if (typingIntervalRef.current) {
                       clearInterval(typingIntervalRef.current);
                    }
                    setIsTyping(false);
                }
            }, 20);

            return () => {
                if (typingIntervalRef.current) {
                    clearInterval(typingIntervalRef.current);
                }
            };
        }
    }, [summary]);

    return (
        <Dialog>
            <Card className="shadow-lg overflow-hidden border-2 border-transparent hover:border-primary transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="flex flex-col sm:flex-row items-center gap-4 space-y-0 bg-secondary/30 p-6">
                    <Avatar className="h-20 w-20 border-4 border-background shadow-md">
                        <AvatarImage src={avatarUrl} alt={username} />
                        <AvatarFallback>{username.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-center sm:text-left">
                        <h1 className="text-2xl font-bold font-headline">{username}</h1>
                        <Link
                            href={`https://github.com/${username}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
                        >
                            <Github className="h-4 w-4" />
                            github.com/{username}
                        </Link>
                    </div>
                    <DialogTrigger asChild>
                        <div 
                            data-export-id="score-trigger"
                            className="flex flex-col items-center justify-center p-2 rounded-lg bg-background/50 w-24 cursor-pointer hover:bg-primary/10 transition-colors"
                        >
                            <div className="text-4xl font-bold text-primary">{score}</div>
                            <div className="text-xs font-medium text-muted-foreground tracking-wider uppercase">Score</div>
                        </div>
                    </DialogTrigger>
                </CardHeader>
                <CardContent className="p-6 text-base text-foreground/80 relative">
                    {keySkills && keySkills.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                            {keySkills.map(skill => (
                                <Badge key={skill} variant="secondary">{skill}</Badge>
                            ))}
                        </div>
                    )}
                    <p className="leading-relaxed min-h-[100px]" data-full-summary={summary}>
                        {typedSummary}
                        {isTyping && <span className="inline-block w-2.5 h-5 bg-primary animate-pulse ml-1" />}
                    </p>
                    {isTyping && (
                        <Button 
                            id="skip-animation-button"
                            variant="ghost" 
                            size="sm" 
                            className="absolute bottom-4 right-4 text-muted-foreground hover:bg-transparent hover:text-primary"
                            onClick={skipAnimation}
                        >
                            Skip
                            <FastForward className="h-4 w-4 ml-2" />
                        </Button>
                    )}
                </CardContent>
            </Card>

            {/* This is the visible, interactive dialog for the user. */}
            <DialogContent className="sm:max-w-[425px] p-0">
                <ScoreDialogBody scoreBreakdown={scoreBreakdown} />
            </DialogContent>

            {/* This is the hidden content for the HTML export. */}
            <div data-export-id="score-dialog" className="hidden">
                 <ScoreDialogBody scoreBreakdown={scoreBreakdown} />
            </div>
        </Dialog>
    );
}
