import { useEffect, useState } from "react";
import { getSteamGames } from "../services/steamService";
import type { SteamGame } from "../services/steamService";
import { createGame } from "../services/gameService";
import useGames from "../hooks/useGames";

function SteamLibrary() {
  const [steamGames, setSteamGames] = useState<SteamGame[]>([]);
  const [loadingSteam, setLoadingSteam] = useState(true);
  const [error, setError] = useState("");
  const [importingId, setImportingId] = useState<number | null>(null);

  const {
    games: myGames,
    loading: loadingMyGames,
    error: myGamesError,
  } = useGames();

  useEffect(() => {
    async function loadGames() {
      try {
        const data = await getSteamGames();
        setSteamGames(data);
      } catch (error) {
        console.error(error);
        setError("Could not load your Steam library.");
      } finally {
        setLoadingSteam(false);
      }
    }

    loadGames();
  }, []);

  async function importGame(game: SteamGame) {
    // Check if the game already exists
    const alreadyImported = myGames.some(
      (myGame) =>
        myGame.steamAppId === game.appid ||
        myGame.title.toLowerCase() === game.name.toLowerCase(),
    );

    if (alreadyImported) {
      alert(`${game.name} is already in My Games!`);
      return;
    }

    try {
      setImportingId(game.appid);

      await createGame({
        title: game.name,
        platform: "PC",
        status: "want",
        rating: null,
        coverUrl: `https://cdn.akamai.steamstatic.com/steam/apps/${game.appid}/header.jpg`,
        notes: "",
        steamAppId: game.appid,
        steamPlaytime: game.playtime_forever,
      });

      alert(`${game.name} was imported!`);

      // Reload the page to refresh the game list
      window.location.reload();
    } catch (error) {
      console.error("Import failed:", error);
      alert("Could not import the game.");
    } finally {
      setImportingId(null);
    }
  }

  if (loadingSteam || loadingMyGames) {
    return <main className="page">Loading libraries...</main>;
  }

  if (error || myGamesError) {
    return <main className="page">{error || myGamesError}</main>;
  }

  return (
    <main className="page steam-library">
      <header className="steam-library__header">
        <div>
          <h1>Steam Library</h1>
          <p>Your games imported from Steam.</p>
        </div>

        <span>{steamGames.length} games found</span>
      </header>

      <div className="steam-library__grid">
        {steamGames.map((game) => {
          const alreadyImported = myGames.some(
            (myGame) =>
              myGame.steamAppId === game.appid ||
              myGame.title.toLowerCase() === game.name.toLowerCase(),
          );

          return (
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

                {alreadyImported ? (
                  <button disabled>Already imported</button>
                ) : (
                  <button
                    onClick={() => importGame(game)}
                    disabled={importingId !== null}
                  >
                    {importingId === game.appid
                      ? "Importing..."
                      : "Import game"}
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </main>
  );
}

export default SteamLibrary;
