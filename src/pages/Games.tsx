import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import useGames from "../hooks/useGames";
import useLocalStorage from "../hooks/useLocalStorage";
import { deleteAllGames } from "../services/gameService";
import { getAllSteamMetadata } from "../services/steamMetadataService";
import type { SteamMetadata } from "../services/steamMetadataService";
import type { GameStatus } from "../types/Game";

type SortOption =
  | "title-asc"
  | "title-desc"
  | "rating-desc"
  | "rating-asc"
  | "playtime-desc"
  | "playtime-asc";

type StatusFilter = "all" | GameStatus;

function Games() {
  const { games, loading, error } = useGames();

  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [steamMetadata, setSteamMetadata] = useState<SteamMetadata[]>([]);

  // Fetch Steam playtime metadata
  useEffect(() => {
    let isMounted = true;

    async function fetchSteamMetadata() {
      try {
        const metadata = await getAllSteamMetadata();

        if (isMounted) {
          setSteamMetadata(metadata);
        }
      } catch (error) {
        console.error("Could not fetch Steam metadata:", error);
      }
    }

    fetchSteamMetadata();

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter states saved in LocalStorage
  const [search, setSearch] = useLocalStorage("games-search", "");
  const [statusFilter, setStatusFilter] = useLocalStorage<StatusFilter>(
    "games-status",
    "all",
  );
  const [platformFilter, setPlatformFilter] = useLocalStorage(
    "games-platform",
    "all",
  );
  const [sortBy, setSortBy] = useLocalStorage<SortOption>(
    "games-sort",
    "title-asc",
  );

  // Get all unique platforms
  const platforms = useMemo(() => {
    return Array.from(new Set(games.map((game) => game.platform))).sort();
  }, [games]);

  // Match Steam metadata to Questlog games
  const steamMetadataByGameId = useMemo(() => {
    return new Map<string, SteamMetadata>(
      steamMetadata
        .filter(
          (
            metadata,
          ): metadata is SteamMetadata & {
            questlog_game_id: string;
          } => metadata.questlog_game_id !== null,
        )
        .map((metadata) => [metadata.questlog_game_id, metadata]),
    );
  }, [steamMetadata]);

  // Filter and sort games
  const filteredGames = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    return games
      .filter((game) => game.title.toLowerCase().includes(searchTerm))
      .filter((game) => statusFilter === "all" || game.status === statusFilter)
      .filter(
        (game) => platformFilter === "all" || game.platform === platformFilter,
      )
      .sort((a, b) => {
        switch (sortBy) {
          case "title-desc":
            return b.title.localeCompare(a.title);

          case "rating-desc":
            if (a.rating === null) return 1;
            if (b.rating === null) return -1;
            return b.rating - a.rating;

          case "rating-asc":
            if (a.rating === null) return 1;
            if (b.rating === null) return -1;
            return a.rating - b.rating;

          case "playtime-desc": {
            const playtimeA =
              steamMetadataByGameId.get(a.id)?.playtime_minutes ?? null;
            const playtimeB =
              steamMetadataByGameId.get(b.id)?.playtime_minutes ?? null;

            if (playtimeA === null) return 1;
            if (playtimeB === null) return -1;

            return playtimeB - playtimeA;
          }

          case "playtime-asc": {
            const playtimeA =
              steamMetadataByGameId.get(a.id)?.playtime_minutes ?? null;
            const playtimeB =
              steamMetadataByGameId.get(b.id)?.playtime_minutes ?? null;

            if (playtimeA === null) return 1;
            if (playtimeB === null) return -1;

            return playtimeA - playtimeB;
          }

          default:
            return a.title.localeCompare(b.title);
        }
      });
  }, [
    games,
    search,
    statusFilter,
    platformFilter,
    sortBy,
    steamMetadataByGameId,
  ]);

  // Clear all filters
  function clearFilters() {
    setSearch("");
    setStatusFilter("all");
    setPlatformFilter("all");
    setSortBy("title-asc");
  }

  // Delete all games from My Games
  async function handleDeleteAllGames() {
    if (games.length === 0 || deleting) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete all ${games.length} games from My Games?\n\nYour Steam library and saved Steam connections will remain untouched.\n\nThis action cannot be undone.`,
    );

    if (!confirmed) return;

    try {
      setDeleting(true);
      setDeleteError("");

      await deleteAllGames();

      alert("All games have been deleted from My Games.");

      window.location.reload();
    } catch (error) {
      console.error("Could not delete all games:", error);

      setDeleteError(
        error instanceof Error ? error.message : "Could not delete all games.",
      );
    } finally {
      setDeleting(false);
    }
  }

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

        <div className="games__header-actions">
          <span>
            {filteredGames.length} / {games.length} Games
          </span>

          {games.length > 0 && (
            <button
              className="games__delete-all"
              onClick={handleDeleteAllGames}
              type="button"
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete All Games"}
            </button>
          )}
        </div>
      </div>

      {deleteError && (
        <p role="alert" className="games__delete-error">
          {deleteError}
        </p>
      )}

      {games.length > 0 && (
        <section className="games__filters">
          <div className="games__search">
            <label htmlFor="game-search">Search games</label>
            <input
              id="game-search"
              type="search"
              placeholder="Search by game title..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <div className="games__filter-group">
            <div>
              <label htmlFor="status-filter">Status</label>
              <select
                id="status-filter"
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value as StatusFilter)
                }
              >
                <option value="all">All statuses</option>
                <option value="playing">Playing</option>
                <option value="completed">Completed</option>
                <option value="want">Want to Play</option>
                <option value="dropped">Dropped</option>
              </select>
            </div>

            <div>
              <label htmlFor="platform-filter">Platform</label>
              <select
                id="platform-filter"
                value={platformFilter}
                onChange={(event) => setPlatformFilter(event.target.value)}
              >
                <option value="all">All platforms</option>

                {platforms.map((platform) => (
                  <option key={platform} value={platform}>
                    {platform}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="sort-games">Sort by</label>
              <select
                id="sort-games"
                value={sortBy}
                onChange={(event) =>
                  setSortBy(event.target.value as SortOption)
                }
              >
                <option value="title-asc">Title (A-Z)</option>
                <option value="title-desc">Title (Z-A)</option>
                <option value="rating-desc">Highest rating (5-1)</option>
                <option value="rating-asc">Lowest rating (1-5)</option>
                <option value="playtime-desc">Most Playtime</option>
                <option value="playtime-asc">Least Playtime</option>
              </select>
            </div>
          </div>

          <button
            className="games__clear-filters"
            onClick={clearFilters}
            type="button"
          >
            Clear filters
          </button>
        </section>
      )}

      {games.length === 0 ? (
        <p className="games__empty">
          Your library is empty. Add your first game!
        </p>
      ) : filteredGames.length === 0 ? (
        <p className="games__empty">No games match your filters.</p>
      ) : (
        <div className="games__grid">
          {filteredGames.map((game) => {
            const metadata = steamMetadataByGameId.get(game.id);

            const playtime = metadata
              ? (metadata.playtime_minutes / 60).toFixed(1)
              : null;

            return (
              <Link
                to={`/games/${game.id}`}
                className="game-card"
                key={game.id}
              >
                <div
                  className={`game-card__image ${
                    game.coverUrl?.includes("steamstatic.com/steam/apps/")
                      ? "game-card__image--steam"
                      : ""
                  }`}
                >
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
                    {game.rating !== null
                      ? "★".repeat(game.rating) + "☆".repeat(5 - game.rating)
                      : "Not rated"}
                  </div>

                  <p className="game-card__playtime">
                    <span aria-hidden="true">◷</span>{" "}
                    {playtime !== null
                      ? `${playtime} hours played`
                      : "Not tracked"}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}

export default Games;
