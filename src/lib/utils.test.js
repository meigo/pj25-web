import { describe, it, expect } from 'vitest';
import { capitalize, slugify, isOdd } from './utils';

describe('Utility Functions', () => {
  describe('capitalize', () => {
    it('should capitalize the first letter and lowercase the rest', () => {
      expect(capitalize('jaanituli')).toBe('Jaanituli');
      expect(capitalize('PÄRNU')).toBe('Pärnu');
    });

    it('should handle empty strings', () => {
      expect(capitalize('')).toBe('');
    });
  });

  describe('slugify', () => {
    it('should convert Estonian characters to ASCII', () => {
      expect(slugify('Pärnu Jaanituli')).toBe('parnu-jaanituli');
      expect(slugify('Õie ja Ädu Šveitsis')).toBe('oie-ja-adu-sveitsis');
      expect(slugify('Žetoonid & Ööbikud')).toBe('zetoonid-oobikud');
    });

    it('should handle special characters and spaces', () => {
      expect(slugify('Artist (Live!)')).toBe('artist-live');
      expect(slugify('  Too Much Space  ')).toBe('too-much-space');
      expect(slugify('Multiple---Hyphens')).toBe('multiple-hyphens');
    });
  });

  describe('isOdd', () => {
    it('should correctly identify odd and even numbers', () => {
      expect(isOdd(1)).toBe(true);
      expect(isOdd(2)).toBe(false);
      expect(isOdd(0)).toBe(false);
      expect(isOdd(-1)).toBe(true);
    });
  });
});
