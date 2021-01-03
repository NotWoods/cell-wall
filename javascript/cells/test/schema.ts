import test from 'ava';
import Ajv, { ValidateFunction } from 'ajv';
import { cellStateSchema, cellStateBlankSchema } from '../src/schema.js';

// @ts-ignore
const ajv: Ajv = new (Ajv.default || Ajv)();

function errorsToMsg({ errors }: ValidateFunction) {
  if (Array.isArray(errors)) {
    return JSON.stringify(errors, undefined, 2);
  } else {
    return undefined;
  }
}

test('cellStateBlankSchema', async (t) => {
  const validate = ajv.compile(cellStateBlankSchema);

  t.true(validate({ type: 'BLANK' }), errorsToMsg(validate));
  t.false(validate({ type: 'WEB' }), errorsToMsg(validate));
});

test('cellStateSchema', async (t) => {
  const validate = ajv.compile(cellStateSchema);

  t.true(validate({ type: 'BLANK' }), errorsToMsg(validate));
  t.true(
    validate({ type: 'WEB', url: 'https://example.com' }),
    errorsToMsg(validate),
  );
  t.true(validate({ type: 'TEXT', text: 'Hello' }), errorsToMsg(validate));
  t.true(
    validate({ type: 'IMAGE', src: 'https://example.com' }),
    errorsToMsg(validate),
  );
});

test('cellStateSchema map', async (t) => {
  const validate = ajv.compile({
    type: 'object',
    properties: {
      devices: {
        type: 'object',
        additionalProperties: cellStateSchema,
      },
    },
  });

  t.true(
    validate({ devices: { abc: { type: 'BLANK' } } }),
    errorsToMsg(validate),
  );
  t.true(
    validate({
      devices: {
        abc: { type: 'WEB', url: 'https://example.com' },
        BCD: { type: 'BLANK' },
      },
    }),
    errorsToMsg(validate),
  );
});
