
"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Download, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MarkdownExportButton } from "./markdown-export-button";

interface ExportButtonProps {
    username: string;
    insights: {
        language: string;
        insight: string;
    }[];
    languageSummary: string;
}

export function ExportButton({ username, insights, languageSummary }: ExportButtonProps) {
    const { toast } = useToast();

    const handleHtmlExport = async () => {
        toast({
            title: "Exporting Profile",
            description: "Generating HTML file...",
        });

        try {
            // 1. Get all required elements from the page
            const contentEl = document.getElementById('profile-export-content');
            if (!contentEl) throw new Error("Could not find profile content to export.");

            const scoreDialogContentEl = document.querySelector('[data-export-id="score-dialog"]');
            if (!scoreDialogContentEl) throw new Error("Could not find score dialog content.");
            
            // 2. Clone the main content area
            const contentClone = contentEl.cloneNode(true) as HTMLElement;

            // 3. Remove elements that shouldn't be in the export
            contentClone.querySelector('#regenerate-button-wrapper')?.remove();
            contentClone.querySelector('[data-export-ignore="true"]')?.remove();
            
            const summaryP = contentClone.querySelector('[data-full-summary]');
            if (summaryP) {
                summaryP.innerHTML = summaryP.getAttribute('data-full-summary') || '';
                summaryP.removeAttribute('data-full-summary');
            }

            // 4. Convert carousel to a static grid using data props
            const languageCarouselCardEl = contentClone.querySelector('[data-export-id="language-carousel-card"]');
            if (languageCarouselCardEl) {
                const cardContentEl = languageCarouselCardEl.querySelector('.p-6.pt-0'); // Default CardContent class
                if (cardContentEl) {
                    // Generate static grid HTML from props
                    const languageCardsHtml = insights && insights.length > 0
                        ? insights.map(item => `
                            <div class="p-1 h-full">
                                <div class="bg-muted/50 p-4 rounded-lg flex flex-col h-full" style="min-height: 80px;">
                                    <h4 class="font-semibold text-foreground">${item.language}</h4>
                                    <p class="text-sm text-muted-foreground mt-1 flex-grow">${item.insight}</p>
                                </div>
                            </div>
                        `).join('')
                        : '<p class="text-muted-foreground">No language data available to generate insights.</p>';
                    
                    const gridContainerHtml = `
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            ${languageCardsHtml}
                        </div>
                    `;

                    // Generate summary HTML
                    const summaryHtml = languageSummary 
                        ? `
                            <div class="mt-4 p-4 bg-muted/50 rounded-lg">
                                <p class="text-sm text-muted-foreground leading-relaxed">${languageSummary}</p>
                            </div>
                        ` : '';
                    
                    // Replace the content
                    cardContentEl.innerHTML = gridContainerHtml + summaryHtml;
                }
            }

            // 5. Prepare dialog content for injection
            const scoreDialogInnerHtml = scoreDialogContentEl.innerHTML;
            
            const scoreDialogHTML = `
                <div id="exported-score-dialog-overlay" style="display: none; position: fixed; inset: 0; z-index: 50; background-color: rgba(0,0,0,0.8);"></div>
                <div id="exported-score-dialog" style="display: none; position: fixed; left: 50%; top: 50%; transform: translate(-50%, -50%); z-index: 50; max-width: 425px; width: 90vw; background-color: hsl(var(--background)); border-radius: var(--radius); border: 1px solid var(--border); box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1); outline: 0;">
                    ${scoreDialogInnerHtml}
                     <button id="exported-score-dialog-close" style="position: absolute; right: 1rem; top: 1rem; border-radius: 0.25rem; opacity: 0.7; transition: opacity 0.2s; border: none; background: transparent; cursor: pointer; color: hsl(var(--foreground));">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                        <span style="position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border-width: 0;">Close</span>
                    </button>
                </div>
            `;
            
            // 6. Get all page styles and add custom fixes
            const pageStyles = Array.from(document.styleSheets)
                .map(sheet => {
                    try {
                        return Array.from(sheet.cssRules)
                            .map(rule => rule.cssText)
                            .join('\n');
                    } catch (e) {
                        return '';
                    }
                })
                .join('\n');

            const customStyles = `
                #exported-score-dialog {
                    display: flex;
                    flex-direction: column;
                    max-height: 90vh;
                }
                #exported-score-dialog > .p-6 { /* DialogHeader */
                    flex-shrink: 0;
                }
                #exported-score-dialog [data-radix-scroll-area-root] {
                    overflow-y: auto !important;
                    flex-grow: 1;
                }
            `;
            
            const styles = pageStyles + customStyles;

            // 7. Embed interactivity script
            const interactivityScript = `
                <script>
                    window.addEventListener('load', () => {
                        // --- Dialog Logic ---
                        const scoreTrigger = document.querySelector('[data-export-id="score-trigger"]');
                        const scoreDialogOverlay = document.getElementById('exported-score-dialog-overlay');
                        const scoreDialog = document.getElementById('exported-score-dialog');
                        const closeButton = document.getElementById('exported-score-dialog-close');

                        const openDialog = () => {
                            if (scoreDialog && scoreDialogOverlay) {
                                scoreDialog.style.display = 'flex';
                                scoreDialogOverlay.style.display = 'block';
                            }
                        };

                        const closeDialog = () => {
                            if (scoreDialog && scoreDialogOverlay) {
                                scoreDialog.style.display = 'none';
                                scoreDialogOverlay.style.display = 'none';
                            }
                        };

                        if (scoreTrigger) scoreTrigger.addEventListener('click', openDialog);
                        if (closeButton) closeButton.addEventListener('click', closeDialog);
                        if (scoreDialogOverlay) scoreDialogOverlay.addEventListener('click', closeDialog);
                        
                        document.addEventListener('keydown', (e) => {
                            if (e.key === 'Escape') closeDialog();
                        });
                    });
                </script>
            `;

            // 8. Assemble the final HTML file
            const googleFontLink = document.head.querySelector('link[href^="https://fonts.googleapis.com"]');
            const finalHtml = `
                <!DOCTYPE html>
                <html lang="en" class="h-full dark">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>${username}'s GitFolio Profile</title>
                    ${googleFontLink?.outerHTML || ''}
                    <style>${styles}</style>
                </head>
                <body class="font-body antialiased min-h-screen flex flex-col bg-background">
                    ${contentClone.outerHTML}
                    ${scoreDialogHTML}
                    ${interactivityScript}
                </body>
                </html>
            `.trim();

            // 9. Trigger the download
            const blob = new Blob([finalHtml], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${username}-gitfolio.html`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            toast({
                title: "Export Successful",
                description: `Your profile has been downloaded as ${username}-gitfolio.html`,
            });

        } catch (error: any) {
            console.error("Export failed:", error);
            toast({
                variant: "destructive",
                title: "Export Failed",
                description: error.message || "An unknown error occurred during export.",
            });
        }
    };

    return (
        <Dialog>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                         <DialogTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon"
                                aria-label="Export profile"
                                data-export-ignore="true"
                            >
                                <Download className="h-4 w-4" />
                            </Button>
                        </DialogTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Export Profile</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <DialogContent className="sm:max-w-xs">
                <DialogHeader>
                    <DialogTitle>Export Profile</DialogTitle>
                    <DialogDescription>Choose a format to export your profile.</DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-2 pt-2">
                     <Button variant="outline" className="w-full justify-start" onClick={handleHtmlExport}>
                        <Download className="mr-2 h-4 w-4" />
                        Export as HTML
                    </Button>
                    <MarkdownExportButton username={username} />
                </div>
            </DialogContent>
        </Dialog>
    );
}
