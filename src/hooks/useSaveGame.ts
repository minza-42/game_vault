import { useState } from "react";
import { createGame } from "../services/gameService";
import type { Game } from "../types/Game";
import type { NewGame } from "../services/gameService";

function useSaveGame() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function saveGame(game: NewGame): Promise<Game> {
    try {
      setLoading(true);
      setError(null);

      const newGame = await createGame(game);

      return newGame;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";

      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { saveGame, loading, error };
}

export default useSaveGame;
