import { useMemo } from "react";
import GameCard from "../components/GameCard";
import useGames from "../hooks/useGames";
import useLocalStorage from "../hooks/useLocalStorage";
import useDeleteAllGames from "../hooks/useDeleteAllGames";
import type { GameStatus } from "../types/Game";

type SortOption = "title-asc" | "title-desc" | "rating-desc" | "rating-asc";

type StatusFilter = "all" | GameStatus;

function Games() {
  const { games, loading, error } = useGames();

  const {
    removeAllGames,
    loading: deleting,
    error: deleteError,
  } = useDeleteAllGames();

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

          default:
            return a.title.localeCompare(b.title);
        }
      });
  }, [games, search, statusFilter, platformFilter, sortBy]);

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
      `Are you sure you want to delete all ${games.length} games from My Games?\n\nThis action cannot be undone.`,
    );

    if (!confirmed) return;

    try {
      await removeAllGames();

      alert("All games have been deleted from My Games.");

      window.location.reload();
    } catch (error) {
      console.error("Could not delete all games:", error);
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
          {filteredGames.map((game) => (
            <GameCard game={game} key={game.id} />
          ))}
        </div>
      )}
    </main>
  );
}

export default Games;
