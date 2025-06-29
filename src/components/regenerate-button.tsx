"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { clearProfileCache } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";


interface RegenerateButtonProps {
    username: string;
}

export function RegenerateButton({ username }: RegenerateButtonProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();

    const handleRegenerate = () => {
        startTransition(async () => {
            try {
                await clearProfileCache(username);
                router.refresh();
                toast({
                    title: "Profile Refreshed",
                    description: "The latest data from GitHub has been fetched.",
                });
            } catch (error) {
                 toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to refresh profile data. Please try again.",
                });
            }
        });
    };

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={handleRegenerate}
                        disabled={isPending}
                        aria-label="Regenerate profile"
                    >
                        {isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <RefreshCw className="h-4 w-4" />
                        )}
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Regenerate Profile</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
