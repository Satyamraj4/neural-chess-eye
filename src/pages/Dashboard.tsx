import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { useAction, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { LogOut, Menu, X } from "lucide-react";
import { toast } from "sonner";
import ChessBoard from "@/components/ChessBoard";
import AnalysisHistory from "@/components/AnalysisHistory";
import EvaluationStats from "@/components/EvaluationStats";
import { useNavigate } from "react-router";

export default function Dashboard() {
  const { user, signOut, isLoading } = useAuth();
  const navigate = useNavigate();
  const [evaluation, setEvaluation] = useState<number | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [currentFen, setCurrentFen] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const evaluatePosition = useAction(api.chess.evaluateChessPosition);
  const saveAnalysis = useMutation(api.analyses.saveAnalysis);

  // Redirect if not authenticated
  if (!isLoading && !user) {
    navigate("/auth");
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const handleEvaluate = async (fen: string) => {
    setIsEvaluating(true);
    setCurrentFen(fen);
    
    try {
      const result = await evaluatePosition({ 
        fen, 
        saveToDatabase: true 
      });
      
      setEvaluation(result.evaluation);
      
      // Save to user's analysis history
      await saveAnalysis({
        fen,
        evaluation: result.evaluation,
        depth: result.depth,
        bestMove: result.bestMove || undefined,
      });
      
      toast.success("Position evaluated successfully!");
    } catch (error) {
      console.error("Evaluation error:", error);
      toast.error("Failed to evaluate position. Please try again.");
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleLoadPosition = (fen: string) => {
    setCurrentFen(fen);
    // You would need to update the ChessBoard component to accept a prop for setting FEN
    toast.success("Position loaded");
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      toast.error("Failed to sign out");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden"
              >
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
              <motion.div
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => navigate("/")}
                whileHover={{ scale: 1.05 }}
              >
                <img src="/logo.svg" alt="Chess AI" className="h-8 w-8" />
                <h1 className="text-xl font-bold tracking-tight">Chess AI Evaluator</h1>
              </motion.div>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground hidden sm:block">
                Welcome, {user?.name || user?.email || "User"}
              </span>
              <Button variant="outline" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <ChessBoard
              onEvaluate={handleEvaluate}
              evaluation={evaluation}
              isEvaluating={isEvaluating}
            />
            
            <EvaluationStats />
          </div>

          {/* Sidebar */}
          <div className={`
            lg:block space-y-6
            ${sidebarOpen ? 'block' : 'hidden'}
          `}>
            <AnalysisHistory onLoadPosition={handleLoadPosition} />
          </div>
        </div>
      </div>
    </div>
  );
}
