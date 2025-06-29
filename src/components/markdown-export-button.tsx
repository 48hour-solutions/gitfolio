
"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { generateMarkdown } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { Copy, FileText, Loader2 } from "lucide-react";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function MarkdownExportButton({ username }: { username: string }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [markdown, setMarkdown] = useState("");
    const [error, setError] = useState("");
    const { toast } = useToast();

    const handleGenerate = async () => {
        if (markdown) return;
        
        setLoading(true);
        setError("");
        try {
            const result = await generateMarkdown(username);
            setMarkdown(result);
        } catch (e: any) {
            setError(e.message || "Failed to generate Markdown report.");
            toast({
                variant: "destructive",
                title: "Generation Failed",
                description: e.message || "An unknown error occurred.",
            });
        } finally {
            setLoading(false);
        }
    };
    
    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen);
        if (isOpen && !markdown) {
            handleGenerate();
        }
    };
    
    const handleCopy = () => {
        navigator.clipboard.writeText(markdown);
        toast({ title: "Copied to clipboard!" });
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                    <FileText className="mr-2 h-4 w-4" />
                    Generate Markdown
                </Button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] max-w-4xl h-[90vh] flex flex-col p-4 md:p-6">
                <DialogHeader className="flex-shrink-0">
                    <DialogTitle>Markdown Profile Report</DialogTitle>
                    <DialogDescription>
                        Copy the raw markdown or preview how it will be rendered.
                    </DialogDescription>
                </DialogHeader>
                {loading && (
                    <div className="flex flex-col items-center justify-center flex-1">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="mt-4 text-muted-foreground">Generating your report...</p>
                    </div>
                )}
                {error && !loading && (
                     <div className="flex flex-col items-center justify-center flex-1">
                        <p className="text-destructive">{error}</p>
                    </div>
                )}
                {markdown && !loading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 grid-rows-2 md:grid-rows-1 gap-4 flex-1 min-h-0">
                        <div className="flex flex-col gap-2 min-h-0">
                             <div className="flex justify-between items-center flex-shrink-0">
                                <h3 className="font-semibold">Raw Markdown</h3>
                                <Button variant="ghost" size="sm" onClick={handleCopy}>
                                    <Copy className="mr-2 h-4 w-4" />
                                    Copy
                                </Button>
                            </div>
                            <ScrollArea className="rounded-md border bg-muted/20 flex-grow">
                                <pre className="p-4 text-sm font-code whitespace-pre">{markdown}</pre>
                                <ScrollBar orientation="vertical" />
                                <ScrollBar orientation="horizontal" />
                            </ScrollArea>
                        </div>
                        <div className="flex flex-col gap-2 min-h-0">
                            <h3 className="font-semibold flex-shrink-0">Preview</h3>
                            <ScrollArea className="rounded-md border flex-grow">
                                <div className="p-4">
                                    <ReactMarkdown 
                                        className="markdown-preview"
                                        remarkPlugins={[remarkGfm]}
                                        components={{
                                            a: ({node, ...props}) => <a {...props} target="_blank" rel="noopener noreferrer" />
                                        }}
                                    >
                                        {markdown}
                                    </ReactMarkdown>
                                </div>
                                <ScrollBar orientation="vertical" />
                                <ScrollBar orientation="horizontal" />
                            </ScrollArea>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
