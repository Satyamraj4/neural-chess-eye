import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

// Save user analysis
export const saveAnalysis = mutation({
  args: {
    fen: v.string(),
    evaluation: v.number(),
    depth: v.optional(v.number()),
    bestMove: v.optional(v.string()),
    principalVariation: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("User must be authenticated to save analysis");
    }
    
    // Check if analysis already exists for this user and position
    const existing = await ctx.db
      .query("analyses")
      .withIndex("by_user_and_fen", (q) => 
        q.eq("userId", user._id).eq("fen", args.fen)
      )
      .first();
    
    if (existing) {
      // Update existing analysis
      await ctx.db.patch(existing._id, {
        evaluation: args.evaluation,
        depth: args.depth,
        bestMove: args.bestMove,
        principalVariation: args.principalVariation,
      });
      return existing._id;
    } else {
      // Create new analysis
      return await ctx.db.insert("analyses", {
        userId: user._id,
        fen: args.fen,
        evaluation: args.evaluation,
        depth: args.depth,
        bestMove: args.bestMove,
        principalVariation: args.principalVariation,
      });
    }
  },
});

// Get user's analyses
export const getUserAnalyses = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];
    
    return await ctx.db
      .query("analyses")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .take(args.limit ?? 50);
  },
});

// Get analysis for specific position
export const getAnalysis = query({
  args: { fen: v.string() },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) return null;
    
    return await ctx.db
      .query("analyses")
      .withIndex("by_user_and_fen", (q) => 
        q.eq("userId", user._id).eq("fen", args.fen)
      )
      .first();
  },
});
