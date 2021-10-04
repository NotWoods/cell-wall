export interface KeyboardState {
	/** Whether soft keyboard is currently visible. */
	isKeyboardShown: boolean;
	/** Whether the keyboard can be closed. */
	canCloseKeyboard: boolean;
}

declare const keyboardCommands: KeyboardCommands;
export default keyboardCommands;

interface KeyboardCommands {
	/**
	 * Hides software keyboard if it is visible.
	 * Noop if the keyboard is already hidden.
	 *
	 * @param {number} timeoutMs [1000] For how long to wait (in milliseconds)
	 * until the keyboard is actually hidden.
	 * @returns {boolean} `false` if the keyboard was already hidden
	 * @throws {Error} If the keyboard cannot be hidden.
	 */
	hideKeyboard(timeoutMs?: number): Promise<boolean>;

	/**
	 * Retrieve the state of the software keyboard on the device under test.
	 *
	 * @return {KeyboardState} The keyboard state.
	 */
	isSoftKeyboardPresent(): Promise<KeyboardState>;
}
