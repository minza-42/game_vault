import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import useGames from "../hooks/useGames";

function GameDetails() {
  const { id } = useParams();
  const { games, loading, error } = useGames();
  const [imageError, setImageError] = useState(false);

  if (loading) {
    return <main className="page">Loading game...</main>;
  }

  if (error) {
    return <main className="page">Error: {error}</main>;
  }

  const game = games.find((game) => game.id === id);

  if (!game) {
    return (
      <main className="page">
        <h2>Game not found</h2>
        <Link to="/games">Back to My Games</Link>
      </main>
    );
  }

  return (
    <main className="page game-details">
      <Link to="/games" className="game-details__back">
        ← Back to My Games
      </Link>

      <div className="game-details__content">
        <div className="game-details__cover-wrapper">
          {imageError ? (
            <div className="game-details__cover-fallback">
              🎮
              <span>No cover available</span>
            </div>
          ) : (
            <img
              className="game-details__cover"
              src={game.coverUrl}
              alt={`${game.title} cover`}
              onError={() => setImageError(true)}
            />
          )}
        </div>

        <div className="game-details__info">
          <span
            className={`game-details__status game-details__status--${game.status}`}
          >
            {game.status}
          </span>

          <h2>{game.title}</h2>

          <p className="game-details__platform">{game.platform}</p>

          <div className="game-details__rating">
            <span className="game-details__label">My Rating</span>

            <p>
              {game.rating !== null
                ? "★".repeat(game.rating) + "☆".repeat(5 - game.rating)
                : "Not rated"}
            </p>
          </div>

          <div className="game-details__notes">
            <h3>My Notes</h3>
            <p>{game.notes || "No notes yet."}</p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default GameDetails;
