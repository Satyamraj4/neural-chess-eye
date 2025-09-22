"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import { internal } from "./_generated/api";

// Mock chess evaluation function (in a real app, this would call your ML model)
function evaluatePosition(fen: string): number {
  // Simple material count evaluation for demo
  const pieces = fen.split(' ')[0];
  let score = 0;
  
  const pieceValues: Record<string, number> = {
    'P': 1, 'N': 3, 'B': 3, 'R': 5, 'Q': 9, 'K': 0,
    'p': -1, 'n': -3, 'b': -3, 'r': -5, 'q': -9, 'k': 0
  };
  
  for (const char of pieces) {
    if (pieceValues[char]) {
      score += pieceValues[char];
    }
  }
  
  // Add some randomness to simulate neural network evaluation
  const randomFactor = (Math.random() - 0.5) * 0.5;
  return Math.round((score + randomFactor) * 100) / 100;
}

// Evaluate chess position
export const evaluateChessPosition = action({
  args: { 
    fen: v.string(),
    saveToDatabase: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    try {
      // In a real implementation, this would call your trained neural network
      const evaluation = evaluatePosition(args.fen);
      
      // Optionally save to database
      if (args.saveToDatabase) {
        await ctx.runMutation(internal.positions.saveEvaluation, {
          fen: args.fen,
          evaluation,
        });
      }
      
      return {
        fen: args.fen,
        evaluation,
        bestMove: null, // Would be provided by the engine
        depth: 10, // Simulated depth
      };
    } catch (error) {
      console.error("Error evaluating position:", error);
      throw new Error("Failed to evaluate chess position");
    }
  },
});

// Batch evaluate multiple positions
export const batchEvaluatePositions = action({
  args: { 
    positions: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const results = [];
    
    for (const fen of args.positions) {
      try {
        const evaluation = evaluatePosition(fen);
        results.push({ fen, evaluation });
        
        // Save to database
        await ctx.runMutation(internal.positions.saveEvaluation, {
          fen,
          evaluation,
        });
      } catch (error) {
        console.error(`Error evaluating position ${fen}:`, error);
        results.push({ fen, evaluation: 0, error: true });
      }
    }
    
    return results;
  },
});
