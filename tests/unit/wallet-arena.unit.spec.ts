import { test, expect } from '@playwright/test';
import { ARENA_PROJECTS } from '../../lib/arena-projects';

test.describe('Botmartz Unit & Data Logic Integrity Tests', () => {

  test('UNIT-01: Arena Catalog Schema Integrity', () => {
    expect(Array.isArray(ARENA_PROJECTS)).toBe(true);
    expect(ARENA_PROJECTS.length).toBeGreaterThanOrEqual(10);

    for (const project of ARENA_PROJECTS) {
      expect(project.id).toBeDefined();
      expect(typeof project.id).toBe('string');
      expect(project.title).toBeDefined();
      expect(typeof project.title).toBe('string');
      expect(project.difficulty).toMatch(/Easy|Medium|Hard|Expert/i);
      expect(project.techStack).toBeDefined();
      expect(Array.isArray(project.techStack)).toBe(true);
      expect(project.keywords).toBeDefined();
      expect(Array.isArray(project.keywords)).toBe(true);
    }
  });

  test('UNIT-02: Karma Coins Math & Level Scaling Logic', () => {
    const calculateXPLevel = (logsCount: number, projectsCount: number, karmaCoins: number) => {
      const totalXP = logsCount * 100 + projectsCount * 500 + karmaCoins;
      const level = Math.min(Math.floor(totalXP / 300) + 1, 10);
      return { totalXP, level };
    };

    expect(calculateXPLevel(0, 0, 100)).toEqual({ totalXP: 100, level: 1 });
    expect(calculateXPLevel(2, 1, 300)).toEqual({ totalXP: 1000, level: 4 });
    expect(calculateXPLevel(50, 10, 5000)).toEqual({ totalXP: 10000, level: 10 });
  });

  test('UNIT-03: Ticket & Invoice Check-In Code Format Regex', () => {
    const adminTicketRegex = /^ADM-[A-Z0-9]{8}$/;
    const workshopPassRegex = /^WS-\d{5}$/;

    expect(adminTicketRegex.test('ADM-[#283719]')).toBe(false);
    expect(adminTicketRegex.test('ADM-A8K29L1Z')).toBe(true);
    expect(workshopPassRegex.test('WS-94821')).toBe(true);
    expect(workshopPassRegex.test('WS-123')).toBe(false);
  });

});
