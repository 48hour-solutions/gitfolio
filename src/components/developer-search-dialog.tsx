"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { Users, Search, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { searchDevelopers } from "@/app/actions";
import type { DeveloperSearchResult } from "@/app/actions";

const searchFormSchema = z.object({
  query: z.string().min(10, { message: "Please describe the developer you're looking for in at least 10 characters." }),
});

export function DeveloperSearchDialog() {
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState<DeveloperSearchResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof searchFormSchema>>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: { query: "" },
  });

  const onSubmit = async (values: z.infer<typeof searchFormSchema>) => {
    setLoading(true);
    setResults(null);
    try {
      const searchResults = await searchDevelopers(values.query);
      setResults(searchResults);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Search Failed",
        description: error.message || "An unknown error occurred.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" className="w-full h-12 text-base">
          <Users className="mr-2 h-5 w-5" /> Find Developers
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl w-[95vw] h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Find a Developer</DialogTitle>
          <DialogDescription>
            Describe the skills and experience you're looking for. Our AI will search the GitFolio database for matching candidates.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-start gap-2">
            <FormField
              control={form.control}
              name="query"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Textarea
                      placeholder="e.g., 'A senior front-end developer with experience in React, TypeScript, and real-time applications...'"
                      className="min-h-[60px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={loading} size="lg" className="h-full">
              {loading ? <Loader2 className="animate-spin" /> : <Search />}
            </Button>
          </form>
        </Form>
        
        <div className="flex-1 min-h-0 pt-4">
          {loading && (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="mt-4">Searching for candidates...</p>
            </div>
          )}
          
          {results && (
            <>
              {results.length > 0 ? (
                <ScrollArea className="h-full">
                  <div className="space-y-4 pr-4">
                    {results.map(profile => (
                      <Link href={`/${profile.username}`} key={profile.username} className="block" onClick={() => setOpen(false)}>
                        <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                          <div className="flex items-start gap-4">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={profile.avatarUrl} alt={profile.username} />
                              <AvatarFallback>{profile.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg">{profile.username}</h3>
                              <p className="text-sm text-muted-foreground mt-1">
                                <span className="font-medium text-foreground">AI Reason:</span> {profile.reason}
                              </p>
                              <div className="flex flex-wrap gap-2 mt-3">
                                {profile.keySkills.map(skill => (
                                  <Badge key={skill} variant="secondary">{skill}</Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                  <Users className="h-8 w-8" />
                  <p className="mt-4 font-medium">No candidates found</p>
                  <p className="text-sm">Try refining your search query.</p>
                </div>
              )}
            </>
          )}

          {!loading && !results && (
             <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <Users className="h-8 w-8" />
                <p className="mt-4">Your search results will appear here.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
