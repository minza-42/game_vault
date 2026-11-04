import useGames from "../hooks/useGames";

function Games() {
  const { games, loading, error } = useGames();

  if (loading) {
    return <main className="page">Loading games...</main>;
  }

  if (error) {
    return <main className="page">Error: {error}</main>;
  }

  return (
    <main className="page">
      <div className="games__header">
        <div>
          <h2>My Games</h2>
          <p>Your personal gaming library.</p>
        </div>

        <span>{games.length} Games</span>
      </div>

      {games.length === 0 ? (
        <p>Your library is empty. Add your first game!</p>
      ) : (
        <div className="games__grid">
          {games.map((game) => (
            <article className="game-card" key={game.id}>
              <div className="game-card__image">
                <img src={game.coverUrl} alt={`${game.title} cover`} />
                <span
                  className={`game-card__status game-card__status--${game.status}`}
                >
                  {game.status}
                </span>
              </div>

              <div className="game-card__content">
                <h3>{game.title}</h3>

                <p className="game-card__platform">{game.platform}</p>

                <div className="game-card__rating">
                  {game.rating
                    ? "★".repeat(game.rating) + "☆".repeat(5 - game.rating)
                    : "Not rated"}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

export default Games;
