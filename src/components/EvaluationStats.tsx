import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Target, TrendingUp, Users } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function EvaluationStats() {
  const userAnalyses = useQuery(api.analyses.getUserAnalyses, { limit: 100 });
  const allPositions = useQuery(api.positions.getAllPositions, { limit: 1000 });

  const userStats = userAnalyses ? {
    total: userAnalyses.length,
    avgEvaluation: userAnalyses.length > 0 
      ? userAnalyses.reduce((sum, a) => sum + a.evaluation, 0) / userAnalyses.length 
      : 0,
    whiteAdvantage: userAnalyses.filter(a => a.evaluation > 0.5).length,
    blackAdvantage: userAnalyses.filter(a => a.evaluation < -0.5).length,
  } : null;

  const globalStats = allPositions ? {
    total: allPositions.length,
    avgEvaluation: allPositions.length > 0
      ? allPositions.reduce((sum, p) => sum + p.evaluation, 0) / allPositions.length
      : 0,
  } : null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* User Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Your Statistics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {userStats ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{userStats.total}</div>
                  <div className="text-sm text-muted-foreground">Analyses</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {userStats.avgEvaluation > 0 ? '+' : ''}
                    {userStats.avgEvaluation.toFixed(2)}
                  </div>
                  <div className="text-sm text-muted-foreground">Avg Eval</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">White Advantage</span>
                  <Badge variant="outline" className="text-green-600">
                    {userStats.whiteAdvantage}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Black Advantage</span>
                  <Badge variant="outline" className="text-red-600">
                    {userStats.blackAdvantage}
                  </Badge>
                </div>
              </div>
            </>
          ) : (
            <p className="text-muted-foreground text-center py-4">
              Start analyzing positions to see your stats
            </p>
          )}
        </CardContent>
      </Card>

      {/* Global Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Global Statistics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {globalStats ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{globalStats.total}</div>
                  <div className="text-sm text-muted-foreground">Positions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {globalStats.avgEvaluation > 0 ? '+' : ''}
                    {globalStats.avgEvaluation.toFixed(2)}
                  </div>
                  <div className="text-sm text-muted-foreground">Avg Eval</div>
                </div>
              </div>
              
              <motion.div
                className="h-2 bg-muted rounded-full overflow-hidden"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1, delay: 0.5 }}
              >
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (globalStats.total / 10) * 100)}%` }}
                  transition={{ duration: 1, delay: 1 }}
                />
              </motion.div>
              <p className="text-xs text-muted-foreground text-center">
                Database growth progress
              </p>
            </>
          ) : (
            <p className="text-muted-foreground text-center py-4">
              Loading global statistics...
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
