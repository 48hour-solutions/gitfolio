import { Card, CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
    icon: LucideIcon;
    label: string;
    value: string | number;
    hoverClassName?: string;
}

export function StatsCard({ icon: Icon, label, value, hoverClassName }: StatsCardProps) {
    return (
        <Card className={cn("p-4 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 border-2 border-transparent", hoverClassName)}>
            <CardContent className="p-0 flex flex-col items-start gap-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Icon className="h-5 w-5" />
                    <h3 className="text-sm font-medium">{label}</h3>
                </div>
                <p className="text-2xl font-bold text-foreground">{value}</p>
            </CardContent>
        </Card>
    );
}
