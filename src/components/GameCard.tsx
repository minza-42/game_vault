import { Link } from "react-router-dom";
import type { Game } from "../types/Game";

interface GameCardProps {
  game: Game;
}

function GameCard({ game }: GameCardProps) {
  return (
    <Link to={`/games/${game.id}`} className="game-card">
      <div className="game-card__image">
        <img src={game.coverUrl} alt={`${game.title} cover`} />

        <span className={`game-card__status game-card__status--${game.status}`}>
          {game.status}
        </span>
      </div>

      <div className="game-card__content">
        <h3>{game.title}</h3>

        <p className="game-card__platform">{game.platform}</p>

        <div className="game-card__rating">
          {game.rating !== null
            ? "★".repeat(game.rating) + "☆".repeat(5 - game.rating)
            : "Not rated"}
        </div>
      </div>
    </Link>
  );
}

export default GameCard;
