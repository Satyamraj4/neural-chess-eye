import { v } from "convex/values";
import { mutation, query, internalMutation } from "./_generated/server";
import { getCurrentUser } from "./users";

// Get position evaluation by FEN
export const getEvaluation = query({
  args: { fen: v.string() },
  handler: async (ctx, args) => {
    const position = await ctx.db
      .query("positions")
      .withIndex("by_fen", (q) => q.eq("fen", args.fen))
      .first();
    
    return position?.evaluation ?? null;
  },
});

// Save position evaluation (internal version for actions)
export const saveEvaluation = internalMutation({
  args: {
    fen: v.string(),
    evaluation: v.number(),
    gameId: v.optional(v.string()),
    moveNumber: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Check if position already exists
    const existing = await ctx.db
      .query("positions")
      .withIndex("by_fen", (q) => q.eq("fen", args.fen))
      .first();
    
    if (existing) {
      // Update existing position
      await ctx.db.patch(existing._id, {
        evaluation: args.evaluation,
        gameId: args.gameId,
        moveNumber: args.moveNumber,
      });
      return existing._id;
    } else {
      // Create new position
      return await ctx.db.insert("positions", {
        fen: args.fen,
        evaluation: args.evaluation,
        gameId: args.gameId,
        moveNumber: args.moveNumber,
      });
    }
  },
});

// Public version for user mutations
export const saveUserEvaluation = mutation({
  args: {
    fen: v.string(),
    evaluation: v.number(),
    gameId: v.optional(v.string()),
    moveNumber: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    
    // Check if position already exists
    const existing = await ctx.db
      .query("positions")
      .withIndex("by_fen", (q) => q.eq("fen", args.fen))
      .first();
    
    if (existing) {
      // Update existing position
      await ctx.db.patch(existing._id, {
        evaluation: args.evaluation,
        gameId: args.gameId,
        moveNumber: args.moveNumber,
      });
      return existing._id;
    } else {
      // Create new position
      return await ctx.db.insert("positions", {
        fen: args.fen,
        evaluation: args.evaluation,
        userId: user?._id,
        gameId: args.gameId,
        moveNumber: args.moveNumber,
      });
    }
  },
});

// Get user's recent positions
export const getUserPositions = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];
    
    return await ctx.db
      .query("positions")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .take(args.limit ?? 20);
  },
});

// Get all positions for training data
export const getAllPositions = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("positions")
      .order("desc")
      .take(args.limit ?? 1000);
  },
});