import { useEffect, useState } from "react";
import { getSteamGames } from "../services/steamService";
import type { SteamGame } from "../services/steamService";

function SteamLibrary() {
  const [games, setGames] = useState<SteamGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadGames() {
      try {
        const steamGames = await getSteamGames();
        setGames(steamGames);
      } catch (error) {
        console.error(error);
        setError("Could not load your Steam library.");
      } finally {
        setLoading(false);
      }
    }

    loadGames();
  }, []);

  if (loading) {
    return <main className="page">Loading Steam library...</main>;
  }

  if (error) {
    return <main className="page">{error}</main>;
  }

  return (
    <main className="page steam-library">
      <header className="steam-library__header">
        <div>
          <h1>Steam Library</h1>
          <p>Your games imported from Steam.</p>
        </div>

        <span>{games.length} games found</span>
      </header>

      <div className="steam-library__grid">
        {games.map((game) => (
          <article className="steam-card" key={game.appid}>
            <div className="steam-card__image">
              <img
                src={`https://cdn.akamai.steamstatic.com/steam/apps/${game.appid}/header.jpg`}
                alt={`${game.name} cover`}
                loading="lazy"
                onError={(event) => {
                  const image = event.currentTarget;

                  if (!image.src.includes("library_600x900.jpg")) {
                    image.src = `https://cdn.akamai.steamstatic.com/steam/apps/${game.appid}/library_600x900.jpg`;
                  } else {
                    image.style.display = "none";
                    image.parentElement?.classList.add(
                      "steam-card__image--fallback",
                    );
                  }
                }}
              />

              <div className="steam-card__placeholder">
                <span className="steam-card__placeholder-icon">🎮</span>
                <span>NO COVER</span>
              </div>
            </div>

            <div className="steam-card__content">
              <h3>{game.name}</h3>

              <p>{Math.floor(game.playtime_forever / 60)} hours played</p>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}

export default SteamLibrary;
