import { Link } from "react-router-dom";
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

  // Get the four most recently added games
  const recentlyAdded = [...games]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 4);

  // Calculate percentages for gaming overview
  const getPercentage = (amount: number) =>
    totalGames > 0 ? (amount / totalGames) * 100 : 0;

  if (loading) {
    return <main className="dashboard">Loading dashboard...</main>;
  }

  if (error) {
    return <main className="dashboard">Error: {error}</main>;
  }

  const stats = [
    {
      title: "Total Games",
      value: totalGames,
      icon: "🎮",
      color: "purple",
    },
    {
      title: "Currently Playing",
      value: currentlyPlaying,
      icon: "🕹️",
      color: "blue",
    },
    {
      title: "Completed",
      value: completed,
      icon: "🏆",
      color: "green",
    },
    {
      title: "Want to Play",
      value: wantToPlay,
      icon: "⭐",
      color: "purple",
    },
    {
      title: "Dropped",
      value: dropped,
      icon: "⏸️",
      color: "red",
    },
    {
      title: "Average Rating",
      value: averageRating,
      icon: "★",
      color: "yellow",
    },
  ];

  const statusItems = [
    {
      label: "Playing",
      amount: currentlyPlaying,
      color: "blue",
    },
    {
      label: "Completed",
      amount: completed,
      color: "green",
    },
    {
      label: "Want to Play",
      amount: wantToPlay,
      color: "purple",
    },
    {
      label: "Dropped",
      amount: dropped,
      color: "red",
    },
  ];

  return (
    <main className="dashboard">
      {/* Welcome section */}
      <section className="dashboard__welcome">
        <div className="dashboard__welcome-content">
          <span className="dashboard__eyebrow">YOUR PERSONAL GAMING HUB</span>

          <h2>Welcome to GameVault</h2>

          <p>
            Your games, your progress, your collection. Everything in one place.
          </p>

          <Link to="/games" className="dashboard__welcome-button">
            Explore My Games
            <span>→</span>
          </Link>
        </div>

        <div className="dashboard__welcome-icon" aria-hidden="true">
          🎮
        </div>
      </section>

      {/* Statistics */}
      <section className="dashboard__section">
        <div className="dashboard__section-header">
          <div>
            <h3>Library Statistics</h3>
            <p>An overview of your gaming collection.</p>
          </div>
        </div>

        <div className="dashboard__stats">
          {stats.map((stat) => (
            <article
              className={`stat-card stat-card--${stat.color}`}
              key={stat.title}
            >
              <div className="stat-card__top">
                <h3>{stat.title}</h3>
                <span className="stat-card__icon">{stat.icon}</span>
              </div>

              <p>{stat.value}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Gaming overview */}
      <section className="dashboard__overview">
        <div className="dashboard__section-header">
          <div>
            <h3>Gaming Overview</h3>
            <p>How your games are distributed.</p>
          </div>
        </div>

        <div className="dashboard__overview-card">
          <div className="dashboard__overview-total">
            <span>Total collection</span>
            <strong>{totalGames} games</strong>
          </div>

          <div className="dashboard__progress">
            {statusItems.map((item) => (
              <div
                key={item.label}
                className={`dashboard__progress-segment dashboard__progress-segment--${item.color}`}
                style={{ width: `${getPercentage(item.amount)}%` }}
                title={`${item.label}: ${item.amount}`}
              />
            ))}
          </div>

          <div className="dashboard__legend">
            {statusItems.map((item) => (
              <div className="dashboard__legend-item" key={item.label}>
                <span
                  className={`dashboard__legend-dot dashboard__legend-dot--${item.color}`}
                />

                <span>{item.label}</span>
                <strong>{item.amount}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recently added games */}
      <section className="dashboard__recent">
        <div className="dashboard__section-header">
          <div>
            <h3>Recently Added</h3>
            <p>The latest additions to your collection.</p>
          </div>

          <Link to="/games" className="dashboard__view-all">
            View all games →
          </Link>
        </div>

        {recentlyAdded.length === 0 ? (
          <div className="dashboard__empty">
            <span>🎮</span>
            <p>Your library is empty. Add your first game!</p>
            <Link to="/add-game">Add a game →</Link>
          </div>
        ) : (
          <div className="dashboard__recent-grid">
            {recentlyAdded.map((game) => (
              <Link
                to={`/games/${game.id}`}
                className="dashboard__game-card"
                key={game.id}
              >
                <div className="dashboard__game-image">
                  <img src={game.coverUrl} alt={`${game.title} cover`} />
                </div>

                <div className="dashboard__game-info">
                  <h4>{game.title}</h4>

                  <span
                    className={`dashboard__game-status dashboard__game-status--${game.status}`}
                  >
                    {game.status === "want" ? "Want to Play" : game.status}
                  </span>

                  <div className="dashboard__game-rating">
                    {game.rating !== null
                      ? "★".repeat(game.rating) + "☆".repeat(5 - game.rating)
                      : "Not rated"}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Dashboard;
