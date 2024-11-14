import { CalendarDays, Globe, Lock, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GitHubRepo } from "@/lib/types";

export function RepoCard({ repo }: { repo: GitHubRepo }) {
  return (
    <Card className="hover:bg-muted/50 transition-colors">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              {repo.name}
            </a>
            {repo.private ? (
              <Lock className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Globe className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            <span className="text-sm">{repo.stargazers_count}</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {repo.description || "No description provided"}
          </p>
          <div className="flex items-center gap-4">
            {repo.language && (
              <Badge variant="secondary">{repo.language}</Badge>
            )}
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <CalendarDays className="h-4 w-4" />
              {new Date(repo.created_at).toLocaleDateString()}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}