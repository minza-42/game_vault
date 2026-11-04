import { useState } from "react";
import { deleteGame } from "../services/gameService";

function useDeleteGame() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function removeGame(id: string): Promise<void> {
    try {
      setLoading(true);
      setError(null);

      await deleteGame(id);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not delete game";

      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { removeGame, loading, error };
}

export default useDeleteGame;
