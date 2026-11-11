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
  const [coverUrl, setCoverUrl] = useState("");
  const [imageError, setImageError] = useState(false);
  const [notes, setNotes] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      await saveGame({
        title,
        platform,
        status,
        rating: rating === "" ? null : Number(rating),
        coverUrl: coverUrl.trim(),
        notes,
      });

      navigate("/games");
    } catch {
      // Error is handled by useSaveGame
    }
  }

  return (
    <main className="page add-game">
      <section className="add-game__header">
        <span className="add-game__eyebrow">
          YOUR PERSONAL GAMING COLLECTION
        </span>

        <h2>Add a new game</h2>

        <p>Expand your collection. Every game has a story.</p>
      </section>

      <form className="game-form" onSubmit={handleSubmit}>
        <div className="game-form__heading">
          <div>
            <h3>Game Information</h3>
            <p>Enter the details of your new game.</p>
          </div>
        </div>

        <div className="game-form__grid">
          <div className="game-form__field">
            <label htmlFor="title">Game Title</label>

            <input
              id="title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Enter game title..."
              required
            />
          </div>

          <div className="game-form__field">
            <label htmlFor="platform">Platform</label>

            <select
              id="platform"
              value={platform}
              onChange={(event) => setPlatform(event.target.value)}
              required
            >
              <option value="">Choose platform</option>
              <option value="PC">PC</option>
              <option value="VR">VR</option>
              <option value="Xbox">Xbox</option>
              <option value="PlayStation 5">PlayStation</option>
              <option value="Switch">Nintendo Switch</option>
            </select>
          </div>

          <div className="game-form__field game-form__field--full">
            <label htmlFor="coverUrl">Game Cover (Optional)</label>

            <input
              id="coverUrl"
              type="url"
              value={coverUrl}
              onChange={(event) => {
                setCoverUrl(event.target.value);
                setImageError(false);
              }}
              placeholder="Paste an image URL..."
            />

            <p className="game-form__hint">
              Add a link to the game's cover image.
            </p>

            {coverUrl.trim() && (
              <div className="game-form__preview">
                {imageError ? (
                  <p className="game-form__preview-error" role="alert">
                    Could not load this image. Check the URL and try again.
                  </p>
                ) : (
                  <img
                    src={coverUrl.trim()}
                    alt={title ? `${title} cover` : "Game cover preview"}
                    onError={() => setImageError(true)}
                  />
                )}
              </div>
            )}
          </div>

          <div className="game-form__field">
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
          </div>

          <div className="game-form__field">
            <label htmlFor="rating">Rating</label>

            <select
              id="rating"
              value={rating}
              onChange={(event) => setRating(event.target.value)}
            >
              <option value="">Not rated</option>

              {Array.from({ length: 5 }, (_, index) => (
                <option key={index + 1} value={index + 1}>
                  {"★".repeat(index + 1)} ({index + 1}/5)
                </option>
              ))}
            </select>
          </div>

          <div className="game-form__field game-form__field--full">
            <label htmlFor="notes">My Notes</label>

            <textarea
              id="notes"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Write your thoughts, memories and opinions about the game..."
              rows={5}
            />
          </div>
        </div>

        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}

        <div className="game-form__footer">
          <p>Only the game title and platform are required.</p>

          <button type="submit" disabled={loading}>
            {loading ? "Saving..." : "+ Add Game"}
          </button>
        </div>
      </form>
    </main>
  );
}

export default AddGame;
