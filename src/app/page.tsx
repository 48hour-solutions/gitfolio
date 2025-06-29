import { DeveloperSearchDialog } from "@/components/developer-search-dialog";
import { GithubForm } from "@/components/github-form";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center p-4 text-center">
      <div className="max-w-xl w-full space-y-4">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-foreground font-headline">
          GitFolio
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground">
          Enter a GitHub username to generate a professional overview of their developer profile, ready to be shared.
        </p>
        <GithubForm />

        <div className="relative py-4">
          <Separator />
          <span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-background px-2 text-muted-foreground text-sm">OR</span>
        </div>

        <DeveloperSearchDialog />
      </div>
    </main>
  );
}
