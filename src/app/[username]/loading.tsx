import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Home } from "lucide-react";

export default function Loading() {
  return (
    <div className="bg-background flex-1 w-full">
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                     <div className="flex items-center gap-2 font-bold text-lg">
                        <Home className="h-5 w-5" />
                        <span className="hidden sm:inline">GitFolio</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                </div>
            </div>
        </header>
        <main className="container mx-auto p-4 sm:p-6 lg:p-8 space-y-8 animate-pulse">
            <Card className="shadow-sm">
                <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                    <Skeleton className="h-20 w-20 rounded-full" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-6 w-1/2" />
                        <Skeleton className="h-4 w-1/3" />
                    </div>
                    <Skeleton className="h-10 w-24 rounded-md" />
                </CardHeader>
                <CardContent className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                </CardContent>
            </Card>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <Card key={i} className="shadow-sm p-4 space-y-2">
                        <Skeleton className="h-6 w-6" />
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-8 w-12" />
                    </Card>
                ))}
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <Card className="shadow-sm">
                    <CardHeader>
                        <Skeleton className="h-6 w-40" />
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-2">
                        <Skeleton className="h-6 w-24 rounded-full" />
                        <Skeleton className="h-6 w-20 rounded-full" />
                        <Skeleton className="h-6 w-28 rounded-full" />
                        <Skeleton className="h-6 w-16 rounded-full" />
                    </CardContent>
                </Card>
                <Card className="shadow-sm">
                    <CardHeader>
                        <Skeleton className="h-6 w-48" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Skeleton className="h-5 w-1/3" />
                                    <Skeleton className="h-5 w-1/4" />
                                </div>
                                <Skeleton className="h-px w-full" />
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
            
            <Card className="shadow-sm">
                <CardHeader>
                    <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent className="space-y-6">
                    {[...Array(2)].map((_, i) => (
                        <div key={i} className="flex items-start gap-4">
                            <Skeleton className="h-12 w-12 rounded-lg" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-1/4" />
                                <Skeleton className="h-4 w-3/4" />
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </main>
    </div>
  );
}
