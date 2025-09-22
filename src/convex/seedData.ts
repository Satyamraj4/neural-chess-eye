import { mutation } from "./_generated/server";

// Seed the database with sample chess positions and evaluations
export const seedChessData = mutation({
  args: {},
  handler: async (ctx) => {
    // Sample chess positions with their evaluations
    const samplePositions = [
      {
        fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        evaluation: 0.0, // Starting position
      },
      {
        fen: "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1",
        evaluation: 0.2, // e4 opening
      },
      {
        fen: "rnbqkb1r/pppp1ppp/5n2/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 2 3",
        evaluation: 0.1, // Italian game setup
      },
      {
        fen: "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/8/PPPP1PPP/RNBQK1NR w KQkq - 4 4",
        evaluation: 0.3, // Italian game
      },
      {
        fen: "rnbqk2r/pppp1ppp/5n2/2b1p3/2B1P3/8/PPPP1PPP/RNBQK1NR w KQkq - 4 4",
        evaluation: -0.1, // Black's bishop active
      },
      {
        fen: "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R b KQkq - 0 5",
        evaluation: 0.2, // Developed pieces
      },
      {
        fen: "r2qkb1r/ppp2ppp/2np1n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 0 6",
        evaluation: 0.4, // White better development
      },
      {
        fen: "r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/8/PPPP1PPP/RNBQK1NR w KQkq - 4 4",
        evaluation: -0.2, // Black's pieces coordinated
      },
      {
        fen: "rnbqkb1r/ppp2ppp/4pn2/3p4/2PP4/8/PP2PPPP/RNBQKBNR w KQkq d6 0 4",
        evaluation: 0.3, // Queen's Gambit
      },
      {
        fen: "rnbqkb1r/ppp2ppp/4pn2/8/2pP4/8/PP2PPPP/RNBQKBNR w KQkq - 0 5",
        evaluation: -0.1, // Black captured pawn
      },
    ];

    // Insert sample positions
    for (const position of samplePositions) {
      await ctx.db.insert("positions", position);
    }

    return { message: "Successfully seeded chess data", count: samplePositions.length };
  },
});
