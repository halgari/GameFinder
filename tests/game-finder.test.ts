import { findAllGames } from '../src/game-finder';
import type { FindAllGamesResult } from '../src/game-finder';

describe('findAllGames', () => {
  it('should return a result with games, errors, and skipped arrays', async () => {
    const result = await findAllGames();

    expect(result).toHaveProperty('games');
    expect(result).toHaveProperty('errors');
    expect(result).toHaveProperty('skipped');
    expect(Array.isArray(result.games)).toBe(true);
    expect(result.errors instanceof Map).toBe(true);
    expect(Array.isArray(result.skipped)).toBe(true);
  });

  it('should work with no arguments', async () => {
    const result = await findAllGames();
    expect(result).toBeDefined();
  });

  it('should accept stores option to filter which stores to search', async () => {
    const result = await findAllGames({ stores: ['steam'] });

    // Should only have searched steam, so other stores should not appear anywhere
    const allStoresInResult = [
      ...result.games.map((g) => g.store),
      ...result.skipped,
      ...result.errors.keys(),
    ];

    // Only steam should be in results (either as games, skipped, or error)
    for (const store of allStoresInResult) {
      expect(store).toBe('steam');
    }
  });

  it('should skip unavailable stores by default', async () => {
    const result = await findAllGames();

    // All stores that aren't available should be in skipped, not in errors
    for (const store of result.skipped) {
      expect(result.errors.has(store)).toBe(false);
    }
  });

  it('should report unavailable stores as errors when includeUnavailable is true', async () => {
    const result = await findAllGames({ includeUnavailable: true });

    // Skipped should be empty when includeUnavailable is true
    expect(result.skipped).toHaveLength(0);
  });

  it('should return games with required properties', async () => {
    const result = await findAllGames();

    for (const game of result.games) {
      expect(game).toHaveProperty('id');
      expect(game).toHaveProperty('name');
      expect(game).toHaveProperty('path');
      expect(game).toHaveProperty('store');
    }
  });
});
