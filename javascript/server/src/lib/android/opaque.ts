declare const tag: unique symbol;
declare type Tagged<Token> = {
	readonly [tag]: Token;
};

/**
 * Creates a branded type so it isn't easily confused with other primitives.
 */
export type Opaque<Type, Brand> = Type & Tagged<Brand>;

/**
 * Serial ID for an Android device.
 */
export type Serial = Opaque<string, 'android-serial'>;
