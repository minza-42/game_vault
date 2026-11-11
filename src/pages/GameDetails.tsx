import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import useGames from "../hooks/useGames";
import useUpdateGame from "../hooks/useUpdateGame";
import useDeleteGame from "../hooks/useDeleteGame";
import type { GameStatus } from "../types/Game";

function GameDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { games, loading, error } = useGames();

  const { saveChanges, loading: saving, error: saveError } = useUpdateGame();

  const { removeGame, loading: deleting, error: deleteError } = useDeleteGame();

  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [platform, setPlatform] = useState("");
  const [status, setStatus] = useState<GameStatus>("want");
  const [rating, setRating] = useState<number | null>(null);
  const [notes, setNotes] = useState("");
  const [coverUrl, setCoverUrl] = useState("");

  const [imageError, setImageError] = useState(false);
  const [previewLoaded, setPreviewLoaded] = useState(false);
  const [previewError, setPreviewError] = useState(false);

  if (loading) {
    return <main className="page">Loading game...</main>;
  }

  if (error) {
    return <main className="page">Error: {error}</main>;
  }

  const selectedGame = games.find((item) => item.id === id);

  if (!selectedGame) {
    return (
      <main className="page">
        <h2>Game not found</h2>
        <Link to="/games">Back to My Games</Link>
      </main>
    );
  }

  function startEditing() {
    if (!selectedGame) return;

    setTitle(selectedGame.title);
    setPlatform(selectedGame.platform);
    setStatus(selectedGame.status);
    setRating(selectedGame.rating);
    setNotes(selectedGame.notes || "");
    setCoverUrl(selectedGame.coverUrl || "");

    setImageError(false);
    setPreviewLoaded(false);
    setPreviewError(false);

    setEditing(true);
  }

  async function handleSave() {
    if (!id || !title.trim()) return;

    try {
      await saveChanges(id, {
        title: title.trim(),
        platform,
        status,
        rating,
        notes,
        coverUrl: coverUrl.trim(),
      });

      setEditing(false);
      window.location.reload();
    } catch {
      // Error is displayed below the form.
    }
  }

  async function handleDelete() {
    if (!selectedGame || !id) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete ${selectedGame.title}?`,
    );

    if (!confirmed) return;

    try {
      await removeGame(id);
      navigate("/games");
    } catch {
      // Error is displayed on the page.
    }
  }

  function handleCoverUrlChange(value: string) {
    setCoverUrl(value);
    setPreviewLoaded(false);
    setPreviewError(false);
  }

  return (
    <main className="page game-details">
      <Link to="/games" className="game-details__back">
        ← Back to My Games
      </Link>

      <div className="game-details__content">
        <div className="game-details__cover-wrapper">
          {imageError || !selectedGame.coverUrl ? (
            <div className="game-details__cover-fallback">
              🎮
              <span>No cover available</span>
            </div>
          ) : (
            <img
              className="game-details__cover"
              src={selectedGame.coverUrl}
              alt={`${selectedGame.title} cover`}
              onError={() => setImageError(true)}
            />
          )}
        </div>

        <div className="game-details__info">
          <span
            className={`game-details__status game-details__status--${selectedGame.status}`}
          >
            {selectedGame.status}
          </span>

          <h2>{selectedGame.title}</h2>

          <p className="game-details__platform">{selectedGame.platform}</p>

          {editing ? (
            <div className="game-details__edit">
              <h3>Edit Game</h3>

              <label htmlFor="game-title">Game Title</label>
              <input
                id="game-title"
                type="text"
                placeholder="Enter game title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                required
              />

              <label htmlFor="game-cover">Cover Image URL</label>

              <input
                id="game-cover"
                type="url"
                placeholder="https://example.com/game-cover.jpg"
                value={coverUrl}
                onChange={(event) => handleCoverUrlChange(event.target.value)}
              />

              <p className="form-hint">
                Paste an image URL to update the game cover.
              </p>

              {coverUrl.trim() && (
                <div className="game-details__image-preview">
                  {!previewLoaded && !previewError && (
                    <p className="form-hint">Loading image...</p>
                  )}

                  {previewError && (
                    <p className="form-error">
                      Could not load image. Check the image URL.
                    </p>
                  )}

                  <img
                    src={coverUrl}
                    alt="New game cover preview"
                    onLoad={() => {
                      setPreviewLoaded(true);
                      setPreviewError(false);
                    }}
                    onError={() => {
                      setPreviewLoaded(false);
                      setPreviewError(true);
                    }}
                    style={{
                      display:
                        previewLoaded && !previewError ? "block" : "none",
                    }}
                  />

                  {previewLoaded && !previewError && (
                    <p className="image-success">
                      ✓ Image loaded successfully!
                    </p>
                  )}
                </div>
              )}

              <label htmlFor="game-platform">Platform</label>
              <select
                id="game-platform"
                value={platform}
                onChange={(event) => setPlatform(event.target.value)}
                required
              >
                <option value="" disabled>
                  Choose platform
                </option>
                <option value="PC">PC</option>
                <option value="VR">VR</option>
                <option value="Xbox">Xbox</option>
                <option value="PlayStation 5">PlayStation 5</option>
                <option value="Switch">Nintendo Switch</option>
              </select>

              <label htmlFor="game-status">Status</label>
              <select
                id="game-status"
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value as GameStatus)
                }
              >
                <option value="want">Want to Play</option>
                <option value="playing">Playing</option>
                <option value="completed">Completed</option>
                <option value="dropped">Dropped</option>
              </select>

              <label htmlFor="game-rating">Rating</label>
              <select
                id="game-rating"
                value={rating ?? ""}
                onChange={(event) =>
                  setRating(
                    event.target.value === ""
                      ? null
                      : Number(event.target.value),
                  )
                }
              >
                <option value="">Not rated</option>
                <option value="1">1 star</option>
                <option value="2">2 stars</option>
                <option value="3">3 stars</option>
                <option value="4">4 stars</option>
                <option value="5">5 stars</option>
              </select>

              <label htmlFor="game-notes">My Notes</label>
              <textarea
                id="game-notes"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                rows={4}
              />

              {saveError && <p className="form-error">{saveError}</p>}

              <div className="game-details__actions">
                <button onClick={handleSave} disabled={saving || !title.trim()}>
                  {saving ? "Saving..." : "Save Changes"}
                </button>

                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  disabled={saving}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="game-details__rating">
                <span className="game-details__label">My Rating</span>
                <p>
                  {selectedGame.rating !== null
                    ? "★".repeat(selectedGame.rating) +
                      "☆".repeat(5 - selectedGame.rating)
                    : "Not rated"}
                </p>
              </div>

              <div className="game-details__notes">
                <h3>My Notes</h3>
                <p>{selectedGame.notes || "No notes yet."}</p>
              </div>

              <button
                className="game-details__edit-button"
                onClick={startEditing}
              >
                Edit Game
              </button>

              <button
                className="game-details__delete-button"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete Game"}
              </button>

              {deleteError && <p className="form-error">{deleteError}</p>}
            </>
          )}
        </div>
      </div>
    </main>
  );
}

export default GameDetails;
