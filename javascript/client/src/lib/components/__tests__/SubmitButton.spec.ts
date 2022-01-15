import '@testing-library/jest-dom';
import { describe, it } from '@jest/globals';
import { render, act } from '@testing-library/svelte';

import SubmitButton from '../Button/SubmitButton.svelte';

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
	it('looks normal when promise is resolved', async () => {
		const loading = Promise.resolve();
		const { getByRole } = render(SubmitButton, { loading });
		await act();

		expect(getByRole('button')).toHaveClass('is-primary');
		expect(getByRole('button')).toHaveTextContent('Submit');
	});

	it('shows loading status when promise is unresolved', async () => {
		const loading = new Deferred<void>();
		const { getByRole } = render(SubmitButton, { loading });
		await act();

		expect(getByRole('button')).toHaveClass('is-loading');
		expect(getByRole('button')).toHaveTextContent('Loading');

		await act(() => loading.resolve());

		expect(getByRole('button')).not.toHaveClass('is-loading');
	});

	it('shows danger status when promise is rejected', async () => {
		const loading = Promise.reject();
		const { getByRole } = render(SubmitButton, { loading });
		await act();

		expect(getByRole('button')).toHaveClass('is-danger');
		expect(getByRole('button')).toHaveTextContent('Submit');

		// await so we don't have an unhandled rejection
		await loading.catch(() => '');
	});
});
