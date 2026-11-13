import { useState } from "react";
import { deleteAllGames as deleteAllGamesRequest } from "../services/gameService";

function useDeleteAllGames() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function removeAllGames(): Promise<void> {
    try {
      setLoading(true);
      setError(null);

      await deleteAllGamesRequest();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not delete all games.";

      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { removeAllGames, loading, error };
}

export default useDeleteAllGames;
