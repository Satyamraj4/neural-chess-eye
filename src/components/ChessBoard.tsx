import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, RotateCcw, Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface ChessBoardProps {
  onEvaluate: (fen: string) => void;
  evaluation: number | null;
  isEvaluating: boolean;
}

// Starting position FEN
const STARTING_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

// Piece symbols for display
const PIECE_SYMBOLS: Record<string, string> = {
  'K': '♔', 'Q': '♕', 'R': '♖', 'B': '♗', 'N': '♘', 'P': '♙',
  'k': '♚', 'q': '♛', 'r': '♜', 'b': '♝', 'n': '♞', 'p': '♟'
};

export default function ChessBoard({ onEvaluate, evaluation, isEvaluating }: ChessBoardProps) {
  const [fen, setFen] = useState(STARTING_FEN);
  const [copied, setCopied] = useState(false);

  const parseFenToBoard = useCallback((fenString: string) => {
    const boardPart = fenString.split(' ')[0];
    const rows = boardPart.split('/');
    const board: (string | null)[][] = [];

    for (const row of rows) {
      const boardRow: (string | null)[] = [];
      for (const char of row) {
        if (char >= '1' && char <= '8') {
          const emptySquares = parseInt(char);
          for (let i = 0; i < emptySquares; i++) {
            boardRow.push(null);
          }
        } else {
          boardRow.push(char);
        }
      }
      board.push(boardRow);
    }
    return board;
  }, []);

  const handleEvaluate = () => {
    if (fen.trim()) {
      onEvaluate(fen);
    } else {
      toast.error("Please enter a valid FEN string");
    }
  };

  const handleReset = () => {
    setFen(STARTING_FEN);
  };

  const handleCopyFen = async () => {
    try {
      await navigator.clipboard.writeText(fen);
      setCopied(true);
      toast.success("FEN copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy FEN");
    }
  };

  const board = parseFenToBoard(fen);

  const getEvaluationColor = (score: number) => {
    if (score > 1) return "text-green-600";
    if (score > 0.3) return "text-green-500";
    if (score > -0.3) return "text-gray-600";
    if (score > -1) return "text-red-500";
    return "text-red-600";
  };

  const getEvaluationText = (score: number) => {
    if (score > 2) return "White is winning";
    if (score > 1) return "White is better";
    if (score > 0.3) return "White is slightly better";
    if (score > -0.3) return "Equal position";
    if (score > -1) return "Black is slightly better";
    if (score > -2) return "Black is better";
    return "Black is winning";
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Chess Board */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-2xl font-bold tracking-tight text-center">
            Chess Position Evaluator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Board Display */}
          <div className="flex justify-center">
            <motion.div 
              className="grid grid-cols-8 border-4 border-gray-800 rounded-lg overflow-hidden shadow-lg"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {board.map((row, rowIndex) =>
                row.map((piece, colIndex) => {
                  const isLight = (rowIndex + colIndex) % 2 === 0;
                  return (
                    <motion.div
                      key={`${rowIndex}-${colIndex}`}
                      className={`
                        w-12 h-12 flex items-center justify-center text-2xl font-bold
                        ${isLight ? 'bg-amber-100' : 'bg-amber-800'}
                        hover:bg-opacity-80 transition-colors cursor-pointer
                      `}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {piece && PIECE_SYMBOLS[piece]}
                    </motion.div>
                  );
                })
              )}
            </motion.div>
          </div>

          {/* FEN Input */}
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={fen}
                onChange={(e) => setFen(e.target.value)}
                placeholder="Enter FEN notation..."
                className="font-mono text-sm"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopyFen}
                className="shrink-0"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-center">
              <Button
                onClick={handleEvaluate}
                disabled={isEvaluating || !fen.trim()}
                className="px-8"
              >
                {isEvaluating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Evaluating...
                  </>
                ) : (
                  "Evaluate Position"
                )}
              </Button>
              <Button
                variant="outline"
                onClick={handleReset}
                disabled={isEvaluating}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset
              </Button>
            </div>
          </div>

          {/* Evaluation Display */}
          {evaluation !== null && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-4"
            >
              <div className="flex items-center justify-center gap-4">
                <Badge variant="outline" className="text-lg px-4 py-2">
                  <span className={`font-bold ${getEvaluationColor(evaluation)}`}>
                    {evaluation > 0 ? '+' : ''}{evaluation.toFixed(2)}
                  </span>
                </Badge>
              </div>
              <p className={`text-lg font-medium ${getEvaluationColor(evaluation)}`}>
                {getEvaluationText(evaluation)}
              </p>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}