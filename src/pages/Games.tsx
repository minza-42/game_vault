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
      <h2>My Games</h2>
      <p>Your personal gaming library.</p>

      {games.length === 0 ? (
        <p>Your library is empty. Start by adding your first game!</p>
      ) : (
        <div className="games__grid">
          {games.map((game) => (
            <article key={game.id} className="stat-card">
              <h3>{game.title}</h3>
              <p>{game.platform}</p>
              <p>{game.status}</p>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

export default Games;
