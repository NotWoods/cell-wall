import { describe, test, expect } from 'vitest';
import { render, act } from '@testing-library/svelte';

import SubmitButton from '../SubmitButton.svelte';

class Deferred<T> implements PromiseLike<T> {
	private promise: Promise<T>;
	resolve!: (value: T | PromiseLike<T>) => void;
	reject!: (reason?: unknown) => void;

	constructor() {
		this.promise = new Promise((resolve, reject) => {
			this.resolve = resolve;
			this.reject = reject;
		});
	}

	then<TResult1 = T, TResult2 = never>(
		onFulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
		onRejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
	) {
		return this.promise.then(onFulfilled, onRejected);
	}
}

describe('SubmitButton', () => {
	test('looks normal when promise is resolved', async () => {
		const loading = Promise.resolve();
		const { getByRole } = render(SubmitButton, { loading });
		await act();

		expect(getByRole('button').className).toContain('hover:bg-green-600');
		expect(getByRole('button').textContent).toBe('Submit');
	});

	test('shows loading status when promise is unresolved', async () => {
		const loading = new Deferred<void>();
		const { getByRole } = render(SubmitButton, { loading });
		await act();

		expect(getByRole('button').className).toContain('bg-green-500');
		expect(getByRole('button').textContent).toBe('Loading');

		await act(() => loading.resolve());

		expect(getByRole('button').textContent).not.toBe('Loading');
	});

	test('shows danger status when promise is rejected', async () => {
		const loading = Promise.reject();
		const { getByRole } = render(SubmitButton, { loading });
		await act();

		expect(getByRole('button').className).toContain('bg-red-500');
		expect(getByRole('button').textContent).toBe('Submit');

		// await so we don't have an unhandled rejection
		await loading.catch(() => '');
	});
});
