export class DiffSet<T> {
  private updated = new Set<T>();
  private rest: Set<T>;

  constructor(initial: Iterable<T>, updated: Iterable<T> = []) {
    this.rest = new Set(initial);
    for (const value of updated) {
      this.add(value);
    }
  }

  /**
   * Adds `value` to `updated` and removed it from `rest`.
   */
  add(value: T) {
    this.updated.add(value);
    this.rest.delete(value);
  }

  toResult() {
    return {
      updated: this.updated,
      rest: this.rest,
    };
  }
}
