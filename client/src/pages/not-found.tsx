import { Link } from "wouter";
import { Home, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/10 flex items-center justify-center px-4">
      <div className="text-center">
        <Gift className="w-24 h-24 mx-auto mb-6 text-primary animate-bounce-slow" />
        <h1 className="font-serif text-6xl md:text-8xl font-bold text-foreground mb-4">
          404
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Oops! This birthday wish doesn't exist
        </p>
        <Link href="/">
          <Button size="lg" data-testid="button-home">
            <Home className="w-5 h-5 mr-2" />
            Go Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
