/** constructor Options */
export interface Options {
  /** The default data attribute */
  dataAttribute?: string;
  /** is Init CSS filter to all targets */
  init?: boolean;
}

/** The parse options for canvas */
export interface ParseOptions {
  /** MIME types, defaults to `image/png` */
  type?: string;
  /** [0 - 1], defaults to `0.92` */
  quality?: number;
  /** Override filter name, defaults to reading from data attribute */
  filter?: string;
}

/** Serializable error details used across the Worker boundary. */
export interface WorkerError {
  name: string;
  message: string;
}

/** Internal wire protocol for Worker results. */
export type WorkerResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: WorkerError };
