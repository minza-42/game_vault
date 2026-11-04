import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useSaveGame from "../hooks/useSaveGame";
import type { GameStatus } from "../types/Game";

function AddGame() {
  const navigate = useNavigate();
  const { saveGame, loading, error } = useSaveGame();

  const [title, setTitle] = useState("");
  const [platform, setPlatform] = useState("");
  const [status, setStatus] = useState<GameStatus>("want");
  const [rating, setRating] = useState("");
  const [notes, setNotes] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      await saveGame({
        title,
        platform,
        status,
        rating: rating === "" ? null : Number(rating),
        notes,
      });

      navigate("/games");
    } catch {
      // Error is handled by useSaveGame
    }
  }

  return (
    <main className="page">
      <h2>Add a Game</h2>
      <p>Add a new game to your library.</p>

      <form className="game-form" onSubmit={handleSubmit}>
        <label htmlFor="title">Game Title</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Enter game title"
          required
        />

        <label htmlFor="platform">Platform</label>
        <select
          id="platform"
          value={platform}
          onChange={(event) => setPlatform(event.target.value)}
          required
        >
          <option value="">Choose platform</option>
          <option value="PC">PC</option>
          <option value="PlayStation 5">PlayStation 5</option>
          <option value="Xbox">Xbox</option>
          <option value="Switch">Nintendo Switch</option>
        </select>

        <label htmlFor="status">Status</label>
        <select
          id="status"
          value={status}
          onChange={(event) => setStatus(event.target.value as GameStatus)}
        >
          <option value="want">Want to Play</option>
          <option value="playing">Playing</option>
          <option value="completed">Completed</option>
          <option value="dropped">Dropped</option>
        </select>

        <label htmlFor="rating">Rating</label>
        <select
          id="rating"
          value={rating}
          onChange={(event) => setRating(event.target.value)}
        >
          <option value="">Not rated</option>
          {Array.from({ length: 5 }, (_, index) => (
            <option key={index + 1} value={index + 1}>
              {index + 1} {index === 0 ? "Star" : "Stars"}
            </option>
          ))}
        </select>

        <label htmlFor="notes">Notes</label>
        <textarea
          id="notes"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder="Write your thoughts about the game..."
          rows={4}
        />

        {error && <p className="form-error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Add Game"}
        </button>
      </form>
    </main>
  );
}

export default AddGame;
