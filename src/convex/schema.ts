import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

// default user roles. can add / remove based on the project as needed
export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  MEMBER: "member",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.USER),
  v.literal(ROLES.MEMBER),
);
export type Role = Infer<typeof roleValidator>;

const schema = defineSchema(
  {
    // default auth tables using convex auth.
    ...authTables, // do not remove or modify

    // the users table is the default users table that is brought in by the authTables
    users: defineTable({
      name: v.optional(v.string()), // name of the user. do not remove
      image: v.optional(v.string()), // image of the user. do not remove
      email: v.optional(v.string()), // email of the user. do not remove
      emailVerificationTime: v.optional(v.number()), // email verification time. do not remove
      isAnonymous: v.optional(v.boolean()), // is the user anonymous. do not remove

      role: v.optional(roleValidator), // role of the user. do not remove
    }).index("email", ["email"]), // index for the email. do not remove or modify

    // Chess positions and evaluations
    positions: defineTable({
      fen: v.string(), // FEN notation of the position
      evaluation: v.number(), // Evaluation score (-10 to +10, positive favors white)
      userId: v.optional(v.id("users")), // User who created this position
      gameId: v.optional(v.string()), // Optional game identifier
      moveNumber: v.optional(v.number()), // Move number in the game
    }).index("by_fen", ["fen"])
      .index("by_user", ["userId"])
      .index("by_game", ["gameId"]),

    // Chess games
    games: defineTable({
      pgn: v.string(), // PGN notation of the game
      whitePlayer: v.optional(v.string()),
      blackPlayer: v.optional(v.string()),
      result: v.optional(v.string()), // "1-0", "0-1", "1/2-1/2"
      userId: v.optional(v.id("users")), // User who uploaded/created this game
      source: v.optional(v.string()), // "lichess", "user", etc.
    }).index("by_user", ["userId"])
      .index("by_result", ["result"]),

    // User analysis sessions
    analyses: defineTable({
      userId: v.id("users"),
      fen: v.string(),
      evaluation: v.number(),
      depth: v.optional(v.number()), // Analysis depth
      bestMove: v.optional(v.string()), // Best move in algebraic notation
      principalVariation: v.optional(v.array(v.string())), // Sequence of best moves
    }).index("by_user", ["userId"])
      .index("by_user_and_fen", ["userId", "fen"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;