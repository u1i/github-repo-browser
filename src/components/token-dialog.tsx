import { useState } from "react";
import { KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

interface TokenDialogProps {
  onTokenSubmit: (token: string) => void;
  hasToken: boolean;
}

export function TokenDialog({ onTokenSubmit, hasToken }: TokenDialogProps) {
  const [token, setToken] = useState("");
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (token.trim()) {
      onTokenSubmit(token.trim());
      setToken("");
      setOpen(false);
      toast({
        title: "Token updated",
        description: "Your GitHub token has been saved.",
      });
    }
  };

  const handleClear = () => {
    onTokenSubmit("");
    setToken("");
    setOpen(false);
    toast({
      title: "Token removed",
      description: "Your GitHub token has been cleared.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <KeyRound className="mr-2 h-4 w-4" />
          {hasToken ? "Update Token" : "Add Token"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>GitHub Access Token</DialogTitle>
          <DialogDescription>
            Enter your GitHub personal access token to view private repositories.
            The token will be stored securely in your browser's local storage.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="token">Access Token</Label>
            <Input
              id="token"
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
            />
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            {hasToken && (
              <Button type="button" variant="destructive" onClick={handleClear}>
                Clear Token
              </Button>
            )}
            <Button type="submit">Save Token</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}