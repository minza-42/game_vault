import Database from "better-sqlite3";
import path from "node:path";

const databasePath = path.join(process.cwd(), "gamevault.sqlite");

const db = new Database(databasePath);

// Create Steam games table
db.exec(`
  CREATE TABLE IF NOT EXISTS steam_games (
    steam_app_id INTEGER PRIMARY KEY,
    questlog_game_id TEXT,
    playtime_minutes INTEGER NOT NULL DEFAULT 0,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
`);

// Steam game database record
export interface SteamGameRecord {
  steam_app_id: number;
  questlog_game_id: string | null;
  playtime_minutes: number;
  updated_at: string;
}

// Find a Steam game by App ID
export function getSteamGame(appId: number): SteamGameRecord | undefined {
  return db
    .prepare("SELECT * FROM steam_games WHERE steam_app_id = ?")
    .get(appId) as SteamGameRecord | undefined;
}

// Get all saved Steam games
export function getAllSteamGames(): SteamGameRecord[] {
  return db
    .prepare("SELECT * FROM steam_games ORDER BY steam_app_id")
    .all() as SteamGameRecord[];
}

// Find a Steam game by Questlog ID
export function getSteamGameByQuestlogId(
  gameId: string,
): SteamGameRecord | undefined {
  return db
    .prepare("SELECT * FROM steam_games WHERE questlog_game_id = ?")
    .get(gameId) as SteamGameRecord | undefined;
}

// Save or update Steam information
export function saveSteamGame(
  appId: number,
  questlogGameId: string,
  playtimeMinutes: number,
): void {
  db.prepare(
    `
    INSERT INTO steam_games (
      steam_app_id,
      questlog_game_id,
      playtime_minutes,
      updated_at
    )
    VALUES (?, ?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(steam_app_id)
    DO UPDATE SET
      questlog_game_id = excluded.questlog_game_id,
      playtime_minutes = excluded.playtime_minutes,
      updated_at = CURRENT_TIMESTAMP
  `,
  ).run(appId, questlogGameId, playtimeMinutes);
}

// Close database connection
export function closeDatabase(): void {
  db.close();
}

export default db;
