import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

interface AnalysisHistoryProps {
  onLoadPosition: (fen: string) => void;
}

export default function AnalysisHistory({ onLoadPosition }: AnalysisHistoryProps) {
  const analyses = useQuery(api.analyses.getUserAnalyses, { limit: 10 });

  if (!analyses || analyses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Analyses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No analyses yet. Start evaluating positions to see your history here.
          </p>
        </CardContent>
      </Card>
    );
  }

  const getEvaluationIcon = (evaluation: number) => {
    if (evaluation > 0.3) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (evaluation < -0.3) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-gray-600" />;
  };

  const getEvaluationColor = (evaluation: number) => {
    if (evaluation > 0.3) return "text-green-600";
    if (evaluation < -0.3) return "text-red-600";
    return "text-gray-600";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recent Analyses
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {analyses.map((analysis, index) => (
          <motion.div
            key={analysis._id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {getEvaluationIcon(analysis.evaluation)}
                <Badge variant="outline" className="text-xs">
                  <span className={getEvaluationColor(analysis.evaluation)}>
                    {analysis.evaluation > 0 ? '+' : ''}{analysis.evaluation.toFixed(2)}
                  </span>
                </Badge>
                {analysis.depth && (
                  <span className="text-xs text-muted-foreground">
                    Depth {analysis.depth}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground font-mono truncate">
                {analysis.fen}
              </p>
              {analysis.bestMove && (
                <p className="text-xs text-muted-foreground">
                  Best: {analysis.bestMove}
                </p>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onLoadPosition(analysis.fen)}
              className="shrink-0 ml-2"
            >
              Load
            </Button>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}
