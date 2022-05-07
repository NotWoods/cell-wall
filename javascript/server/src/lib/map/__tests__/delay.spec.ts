import { describe, expect, it } from '@jest/globals';
import { asDelay } from '../delay';

describe('asDelay', () => {
	it('parses ms style values', () => {
		expect(asDelay('100ms')).toBe(100);
		expect(asDelay('245')).toBe(245);
		expect(asDelay('0ms')).toBe(0);
	});

	it('parses s style values', () => {
		expect(asDelay('2s')).toBe(2000);
		expect(asDelay('0s')).toBe(0);
	});

	it('ignores empty strings', () => {
		expect(asDelay('')).toBeUndefined();
	});

	it('throws on invalid values', () => {
		expect(() => asDelay('foo')).toThrowError(/Invalid delay/);
	});
});
