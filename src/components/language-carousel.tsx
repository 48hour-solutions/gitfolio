
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Languages } from "lucide-react";

interface LanguageCarouselProps {
  insights: {
    language: string;
    insight: string;
  }[];
  languageSummary: string;
}

export function LanguageCarousel({ insights, languageSummary }: LanguageCarouselProps) {
  if (!insights || insights.length === 0) {
    return (
        <Card data-export-id="language-carousel-card" className="shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-2 border-transparent hover:border-chart-2">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Languages className="h-5 w-5 text-primary"/> Top Languages
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">No language data available to generate insights.</p>
            </CardContent>
        </Card>
    );
  }

  return (
    <Card data-export-id="language-carousel-card" className="shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-2 border-transparent hover:border-chart-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Languages className="h-5 w-5 text-primary" /> Language Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Carousel data-export-id="carousel" className="w-full" opts={{ loop: insights.length > 1 }}>
          <CarouselContent data-export-id="carousel-content" className="-ml-2">
            {insights.map((item, index) => (
              <CarouselItem key={index} className="pl-2 md:basis-1/2">
                <div className="p-1 h-full">
                    <div className="bg-muted/50 p-4 rounded-lg flex flex-col h-full">
                        <h4 className="font-semibold text-foreground">{item.language}</h4>
                        <p className="text-sm text-muted-foreground mt-1 flex-grow">{item.insight}</p>
                    </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious data-export-id="carousel-prev" className="hidden sm:flex" />
          <CarouselNext data-export-id="carousel-next" className="hidden sm:flex" />
        </Carousel>
        {languageSummary && (
            <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground leading-relaxed">{languageSummary}</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
