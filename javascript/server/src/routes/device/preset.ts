import { Preset, presets } from '../../static';
import { ErrorReply, errorSchema } from '../helpers';
import { RouteOptions } from '../register';
import { cellStateSchema } from './state';

interface PresetParams {
  presetname: keyof typeof presets;
}

export const statePresetAll: RouteOptions<{
  Params: PresetParams;
  Reply: ErrorReply | { presets: string[] };
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
  Reply: ErrorReply | Preset;
}> = {
  method: 'GET',
  url: '/v3/device/state/presets/:presetname',
  schema: {
    response: {
      200: {
        type: 'object',
        additionalProperties: cellStateSchema,
      },
      404: errorSchema,
    },
  },
  async handler(request, reply) {
    const { presetname } = request.params;
    const preset = presets[presetname];
    if (preset) {
      reply.status(200).send(preset);
    } else {
      reply.status(404).send({ error: `Unknown preset ${presetname}` });
    }
  },
};

export const actionPresetAll: RouteOptions<{
  Params: PresetParams;
  Reply: ErrorReply | { preset: Preset; devices: string[] };
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
      404: errorSchema,
    },
  },
  async handler(request, reply) {
    const { presetname } = request.params;
    const preset = presets[presetname];
    if (preset) {
      const devices: string[] = [];
      for (const [serial, state] of Object.entries(preset)) {
        if (state) {
          this.cells.setState(serial, state);
          devices.push(serial);
        }
      }

      reply.status(200).send({ preset, devices });
    } else {
      reply.status(404).send({ error: `Unknown preset ${presetname}` });
    }
  },
};
