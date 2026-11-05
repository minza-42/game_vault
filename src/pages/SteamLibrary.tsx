import { useEffect, useMemo, useState } from "react";
import { getSteamGames } from "../services/steamService";
import type { SteamGame } from "../services/steamService";
import { createGame } from "../services/gameService";
import useGames from "../hooks/useGames";
import {
  getAllSteamMetadata,
  saveSteamMetadata,
} from "../services/steamMetadataService";

type SortOption = "playtime-desc" | "playtime-asc" | "title-asc" | "title-desc";

function SteamLibrary() {
  const [steamGames, setSteamGames] = useState<SteamGame[]>([]);
  const [loadingSteam, setLoadingSteam] = useState(true);
  const [error, setError] = useState("");
  const [importingId, setImportingId] = useState<number | null>(null);

  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState("");

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("playtime-desc");

  const [steamMetadata, setSteamMetadata] = useState<
    Awaited<ReturnType<typeof getAllSteamMetadata>>
  >([]);

  const {
    games: myGames,
    loading: loadingMyGames,
    error: myGamesError,
  } = useGames();

  // Load Steam library and saved metadata.
  // This does not import any games.
  useEffect(() => {
    async function loadGames() {
      try {
        const [steamData, metadata] = await Promise.all([
          getSteamGames(),
          getAllSteamMetadata(),
        ]);

        setSteamGames(steamData);
        setSteamMetadata(metadata);
      } catch (error) {
        console.error(error);
        setError("Could not load your Steam library.");
      } finally {
        setLoadingSteam(false);
      }
    }

    loadGames();
  }, []);

  // Search and sort Steam games
  const filteredGames = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    return [...steamGames]
      .filter((game) => game.name.toLowerCase().includes(searchTerm))
      .sort((a, b) => {
        switch (sortBy) {
          case "playtime-desc":
            return b.playtime_forever - a.playtime_forever;
          case "playtime-asc":
            return a.playtime_forever - b.playtime_forever;
          case "title-asc":
            return a.name.localeCompare(b.name);
          case "title-desc":
            return b.name.localeCompare(a.name);
          default:
            return 0;
        }
      });
  }, [steamGames, search, sortBy]);

  // Find a game already connected to Steam metadata
  function findMetadata(appId: number) {
    return steamMetadata.find((metadata) => metadata.steam_app_id === appId);
  }

  // Check whether a Steam game is already in My Games
  function findExistingGame(steamGame: SteamGame) {
    const metadata = findMetadata(steamGame.appid);

    if (metadata?.questlog_game_id) {
      const linkedGame = myGames.find(
        (game) => game.id === metadata.questlog_game_id,
      );

      if (linkedGame) {
        return linkedGame;
      }
    }

    return myGames.find(
      (game) =>
        game.title.trim().toLowerCase() === steamGame.name.trim().toLowerCase(),
    );
  }

  // Import one game manually
  async function importGame(steamGame: SteamGame) {
    const existingGame = findExistingGame(steamGame);

    if (existingGame) {
      alert(`${steamGame.name} is already in My Games!`);
      return;
    }

    try {
      setImportingId(steamGame.appid);

      const createdGame = await createGame({
        title: steamGame.name,
        platform: "PC",
        status: "want",
        rating: null,
        coverUrl: `https://cdn.akamai.steamstatic.com/steam/apps/${steamGame.appid}/header.jpg`,
        notes: "",
      });

      await saveSteamMetadata(
        steamGame.appid,
        createdGame.id,
        steamGame.playtime_forever,
      );

      const metadata = await getAllSteamMetadata();
      setSteamMetadata(metadata);

      alert(`${steamGame.name} was imported!`);

      // Reload to refresh My Games with the newly imported game
      window.location.reload();
    } catch (error) {
      console.error("Import failed:", error);
      alert(
        "Could not complete the import. Please check your backend and try again.",
      );
    } finally {
      setImportingId(null);
    }
  }

  // Synchronize only when the user clicks the Sync button
  async function syncSteamLibrary() {
    if (syncing || importingId !== null) return;

    try {
      setSyncing(true);
      setSyncMessage("");

      const latestSteamGames = await getSteamGames();
      const latestMyGames = myGames;

      let importedCount = 0;
      let updatedCount = 0;

      for (const steamGame of latestSteamGames) {
        let existingGame = findExistingGame(steamGame);

        if (!existingGame) {
          existingGame = await createGame({
            title: steamGame.name,
            platform: "PC",
            status: "want",
            rating: null,
            coverUrl: `https://cdn.akamai.steamstatic.com/steam/apps/${steamGame.appid}/header.jpg`,
            notes: "",
          });

          latestMyGames.push(existingGame);
          importedCount++;
        } else {
          updatedCount++;
        }

        // Only Steam metadata is updated here.
        // Questlog game information is left untouched.
        await saveSteamMetadata(
          steamGame.appid,
          existingGame.id,
          steamGame.playtime_forever,
        );
      }

      setSteamGames(latestSteamGames);

      const metadata = await getAllSteamMetadata();
      setSteamMetadata(metadata);

      setSyncMessage(
        `Sync complete! ${importedCount} new games imported and ${updatedCount} existing games matched.`,
      );
    } catch (error) {
      console.error("Steam sync failed:", error);

      const message = error instanceof Error ? error.message : "Unknown error";

      setSyncMessage(`Sync failed: ${message}`);
    } finally {
      setSyncing(false);
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

      <div className="steam-library__sync">
        <button
          onClick={syncSteamLibrary}
          disabled={syncing || importingId !== null}
        >
          {syncing ? "Syncing..." : "Sync Steam"}
        </button>

        {syncMessage && <p>{syncMessage}</p>}
      </div>

      <div className="steam-library__filters">
        <input
          type="search"
          placeholder="Search games..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          aria-label="Search Steam games"
        />

        <select
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value as SortOption)}
          aria-label="Sort Steam games"
        >
          <option value="playtime-desc">Most Played</option>
          <option value="playtime-asc">Least Played</option>
          <option value="title-asc">Name: A–Z</option>
          <option value="title-desc">Name: Z–A</option>
        </select>
      </div>

      <p className="steam-library__results">
        Showing {filteredGames.length} of {steamGames.length} games
      </p>

      {filteredGames.length === 0 ? (
        <div className="steam-library__empty">
          <h3>No games found</h3>
          <p>Try searching for another game name.</p>
        </div>
      ) : (
        <div className="steam-library__grid">
          {filteredGames.map((game) => {
            const alreadyImported = Boolean(findExistingGame(game));

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
                      disabled={importingId === game.appid || syncing}
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
      )}
    </main>
  );
}

export default SteamLibrary;
