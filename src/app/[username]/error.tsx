"use client"; 

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Home } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
        <div className="max-w-2xl w-full space-y-6">
            <div className="flex justify-center">
                <AlertTriangle className="h-16 w-16 text-destructive" />
            </div>
            <h1 className="text-3xl font-bold font-headline">Something went wrong</h1>
            <p className="text-muted-foreground">
                An error occurred while generating the profile.
            </p>
            <Card className="bg-destructive/10 border-destructive/50 text-left">
                <CardContent className="p-4">
                    <pre className="text-sm text-destructive-foreground/80 whitespace-pre-wrap break-words font-code">
                        {error.message || "An unknown error occurred."}
                    </pre>
                </CardContent>
            </Card>
            <div className="flex gap-4 justify-center">
                <Button onClick={() => reset()}>
                    Try again
                </Button>
                <Button variant="outline" asChild>
                    <Link href="/" className="flex gap-2">
                        <Home className="h-4 w-4" /> Go Home
                    </Link>
                </Button>
            </div>
        </div>
    </div>
  );
}
