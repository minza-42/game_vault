import useGames from "../hooks/useGames";

function Dashboard() {
  const { games, loading, error } = useGames();

  const totalGames = games.length;

  const currentlyPlaying = games.filter(
    (game) => game.status === "playing",
  ).length;

  const completed = games.filter((game) => game.status === "completed").length;

  const wantToPlay = games.filter((game) => game.status === "want").length;

  const dropped = games.filter((game) => game.status === "dropped").length;

  const ratedGames = games.filter((game) => game.rating !== null);

  const averageRating =
    ratedGames.length > 0
      ? (
          ratedGames.reduce((total, game) => total + (game.rating ?? 0), 0) /
          ratedGames.length
        ).toFixed(1)
      : "N/A";

  if (loading) {
    return <main className="dashboard">Loading dashboard...</main>;
  }

  if (error) {
    return <main className="dashboard">Error: {error}</main>;
  }

  return (
    <main className="dashboard">
      <section className="dashboard__welcome">
        <h2>Welcome to GameVault</h2>
        <p>Here's an overview of your gaming library.</p>
      </section>

      <section className="dashboard__stats">
        <article className="stat-card">
          <h3>Total Games</h3>
          <p>{totalGames}</p>
        </article>

        <article className="stat-card">
          <h3>Currently Playing</h3>
          <p>{currentlyPlaying}</p>
        </article>

        <article className="stat-card">
          <h3>Completed</h3>
          <p>{completed}</p>
        </article>

        <article className="stat-card">
          <h3>Want to Play</h3>
          <p>{wantToPlay}</p>
        </article>

        <article className="stat-card">
          <h3>Dropped</h3>
          <p>{dropped}</p>
        </article>

        <article className="stat-card">
          <h3>Average Rating</h3>
          <p>{averageRating}</p>
        </article>
      </section>
    </main>
  );
}

export default Dashboard;
