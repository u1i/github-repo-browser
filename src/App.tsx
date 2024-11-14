import { useEffect, useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Github, Loader2 } from "lucide-react";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { RepoCard } from "@/components/repo-card";
import { SortSelect } from "@/components/sort-select";
import { TokenDialog } from "@/components/token-dialog";
import { SearchBar } from "@/components/search-bar";
import { Toaster } from "@/components/ui/toaster";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { GitHubRepo, SortField, SortOrder } from "@/lib/types";
import { useToast } from "@/components/ui/use-toast";

const TOKEN_STORAGE_KEY = "github-token";

function App() {
  const [username, setUsername] = useState<string>("");
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [sortValue, setSortValue] = useState("created_at-desc");
  const [searchQuery, setSearchQuery] = useState("");
  const [showPrivateOnly, setShowPrivateOnly] = useState(false);
  const [token, setToken] = useState<string>(() => 
    localStorage.getItem(TOKEN_STORAGE_KEY) || ""
  );
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const path = location.pathname;
    const user = path.split("/")[1];
    if (user) {
      setUsername(user);
      fetchRepos(user);
    }
  }, [location, token]);

  const fetchRepos = async (user: string) => {
    setLoading(true);
    setError("");
    try {
      const headers: HeadersInit = {
        Accept: "application/vnd.github.v3+json",
      };
      
      if (token) {
        headers.Authorization = `token ${token}`; // Changed from Bearer to token
      }
      
      // First, try to get the authenticated user to check if the token is valid
      if (token) {
        const authResponse = await fetch('https://api.github.com/user', { headers });
        if (!authResponse.ok) {
          throw new Error("Invalid token or unauthorized access");
        }
        const authData = await authResponse.json();
        // If we're viewing our own repos, use the authenticated endpoint
        if (authData.login.toLowerCase() === user.toLowerCase()) {
          const response = await fetch(
            'https://api.github.com/user/repos?visibility=all&affiliation=owner&per_page=100',
            { headers }
          );
          if (!response.ok) throw new Error("Failed to fetch repositories");
          const data = await response.json();
          setRepos(data);
          return;
        }
      }
      
      // If we're viewing someone else's repos or don't have a token
      const response = await fetch(
        `https://api.github.com/users/${user}/repos?type=all&sort=updated&per_page=100`,
        { headers }
      );
      
      if (!response.ok) {
        throw new Error(
          response.status === 401
            ? "Invalid token or unauthorized access"
            : "User not found or API rate limit exceeded"
        );
      }
      
      const data = await response.json();
      setRepos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch repos");
      toast({
        variant: "destructive",
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to fetch repos",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTokenSubmit = (newToken: string) => {
    if (newToken) {
      localStorage.setItem(TOKEN_STORAGE_KEY, newToken);
    } else {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
    setToken(newToken);
  };

  const filteredAndSortedRepos = useMemo(() => {
    if (!repos.length) return [];

    let filtered = repos;
    
    if (showPrivateOnly) {
      filtered = filtered.filter(repo => repo.private);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((repo) => 
        repo.name.toLowerCase().includes(query) ||
        (repo.description?.toLowerCase().includes(query)) ||
        (repo.language?.toLowerCase().includes(query))
      );
    }

    const [field, order] = sortValue.split("-") as [SortField, SortOrder];
    
    return [...filtered].sort((a, b) => {
      const aValue = field === "created_at" 
        ? new Date(a[field]).getTime()
        : a[field];
      const bValue = field === "created_at"
        ? new Date(b[field]).getTime()
        : b[field];

      if (order === "asc") {
        return aValue > bValue ? 1 : -1;
      }
      return aValue < bValue ? 1 : -1;
    });
  }, [repos, sortValue, searchQuery, showPrivateOnly]);

  return (
    <ThemeProvider defaultTheme="system" storageKey="github-browser-theme">
      <div className="min-h-screen bg-background text-foreground">
        <header className="border-b">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Github className="h-6 w-6" />
              <h1 className="text-xl font-bold">GitHub Repo Browser</h1>
            </div>
            <div className="flex items-center gap-4">
              <TokenDialog 
                onTokenSubmit={handleTokenSubmit}
                hasToken={Boolean(token)}
              />
              <ThemeToggle />
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          {username ? (
            <div className="space-y-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-2xl font-bold">
                  Repositories for {username}
                </h2>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-4">
                    <Switch
                      id="private-only"
                      checked={showPrivateOnly}
                      onCheckedChange={setShowPrivateOnly}
                    />
                    <Label htmlFor="private-only">Private repos only</Label>
                  </div>
                  <SearchBar
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="Search repositories..."
                  />
                  <SortSelect
                    value={sortValue}
                    onValueChange={setSortValue}
                  />
                </div>
              </div>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : error ? (
                <div className="text-destructive text-center py-8">
                  {error}
                </div>
              ) : filteredAndSortedRepos.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredAndSortedRepos.map((repo) => (
                    <RepoCard key={repo.id} repo={repo} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No repositories found matching your criteria.
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                Enter a GitHub username in the URL (e.g., <a href="https://ghb.naida.ai/#u1i">/#u1i</a>)
              </p>
            </div>
          )}
        </main>
        <Toaster />
      </div>
    </ThemeProvider>
  );
}

export default App;