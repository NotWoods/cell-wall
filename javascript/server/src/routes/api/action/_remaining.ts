import { blankState } from '@cell-wall/shared';
import { repo } from '../../../lib/repository';

export type RemainingBehaviour = 'blank' | 'off' | 'ignore';

export async function updateRemainingCells(
	remaining: readonly string[],
	behaviour: RemainingBehaviour
): Promise<void> {
	switch (behaviour) {
		case 'blank':
			repo.cellState.setStates(new Map(remaining.map((serial) => [serial, blankState])));
			break;
		case 'off':
			await repo.setPower(remaining, false);
			break;
		case 'ignore':
			break;
	}
}
