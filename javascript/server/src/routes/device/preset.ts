import { cellStateSchema } from '@cell-wall/cells';
import { notNullValue } from '@cell-wall/iterators';
import { Preset, presets } from '../../static';
import { RouteOptions } from '../register';

interface PresetParams {
  presetname: keyof typeof presets;
}

export const statePresetAll: RouteOptions<{
  Params: PresetParams;
  Reply: { presets: string[] };
}> = {
  method: 'GET',
  url: '/v3/device/state/presets',
  schema: {
    response: {
      200: {
        type: 'object',
        properties: {
          presets: {
            type: 'array',
            items: { type: 'string' },
          },
        },
      },
    },
  },
  async handler(_request, reply) {
    reply.status(200).send({ presets: Object.keys(presets) });
  },
};

export const statePreset: RouteOptions<{
  Params: PresetParams;
  Reply: Preset;
}> = {
  method: 'GET',
  url: '/v3/device/state/presets/:presetname',
  schema: {
    response: {
      200: {
        type: 'object',
        additionalProperties: cellStateSchema,
      },
    },
  },
  async handler(request, reply) {
    const { presetname } = request.params;
    const preset = presets[presetname];
    if (preset) {
      reply.status(200).send(preset);
    } else {
      reply.notFound(`Unknown preset ${presetname}`);
    }
  },
};

export const actionPresetAll: RouteOptions<{
  Params: PresetParams;
  Reply: { preset: Preset; devices: string[] };
}> = {
  method: 'POST',
  url: '/v3/device/state/presets/:presetname',
  schema: {
    response: {
      200: {
        type: 'object',
        properties: {
          devices: {
            type: 'array',
            item: { type: 'string' },
          },
          preset: {
            type: 'object',
            additionalProperties: cellStateSchema,
          },
        },
      },
    },
  },
  async handler(request, reply) {
    const { presetname } = request.params;
    const preset = presets[presetname];
    if (preset) {
      const devices = Object.entries(preset)
        .filter(notNullValue)
        .map(([serial, state]) => {
          this.cells.setState(serial, state);
          return serial;
        });

      reply.status(200).send({ preset, devices });
    } else {
      reply.notFound(`Unknown preset ${presetname}`);
    }
  },
};
