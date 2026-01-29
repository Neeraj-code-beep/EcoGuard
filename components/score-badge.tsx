import { cn } from "@/lib/utils";

interface ScoreBadgeProps {
  score: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export function ScoreBadge({ score, size = "md", showLabel = false }: ScoreBadgeProps) {
  const getScoreColor = (score: number) => {
    if (score >= 90) return "bg-success text-success-foreground";
    if (score >= 75) return "bg-chart-2 text-foreground";
    if (score >= 60) return "bg-warning text-warning-foreground";
    return "bg-destructive text-destructive-foreground";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return "Excellent";
    if (score >= 75) return "Good";
    if (score >= 60) return "Fair";
    return "Needs Improvement";
  };

  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-14 w-14 text-lg",
  };

  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          "flex items-center justify-center rounded-full font-semibold",
          getScoreColor(score),
          sizeClasses[size]
        )}
      >
        {score}
      </div>
      {showLabel && (
        <span className="text-sm text-muted-foreground">{getScoreLabel(score)}</span>
      )}
    </div>
  );
}
