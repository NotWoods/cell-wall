import { EventEmitter } from 'events';
import { ChildProcess } from 'child_process';

export interface TeenProcessExecOptions {
  cwd?: string;
  env?: { [envVar: string]: string };
  timeout?: number;
  killSignal?: string;
  encoding?: string;
  ignoreOutput?: boolean;
  stdio?: string;
  isBuffer?: boolean;
  shell?: boolean;
}

export class SubProcess extends EventEmitter {
  cmd: string;
  args: ReadonlyArray<string>;
  proc: ChildProcess | null;
  opts: { detached?: boolean; encoding?: string };
  expectingExit: boolean;
  rep: string;

  constructor(
    cmd: string,
    args?: ReadonlyArray<string>,
    opts?: { detached?: boolean; encoding?: string },
  );

  isRunning: boolean;

  emitLines(stream: string, lines: ReadonlyArray<string>): void;

  // spawn the subprocess and return control whenever we deem that it has fully
  // "started"
  start(detach?: boolean): Promise<any>;
  start(
    startDetector?: ((stdout: any, stderr: any) => boolean) | number | null,
    detach?: boolean,
  ): Promise<any>;
  start(
    startDetector?: ((stdout: any, stderr: any) => boolean) | number | null,
    timeoutMs?: number | null,
    detach?: boolean,
  ): Promise<void>;

  handleLastLines(): void;

  stop(signal?: string, timeout?: number): Promise<number>;

  join(allowedExitCodes?: ReadonlyArray<number>): Promise<number>;

  /*
   * This will only work if the process is created with the `detached` option
   */
  detachProcess(): void;

  pid: number;
}
