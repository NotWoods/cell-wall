export class ObservableSet<T> extends Set<T> {
  onchange?: (items: Set<T>) => void;

  add(value: T) {
    super.add(value);
    if (this.onchange) this.onchange(this);
    return this;
  }

  delete(value: T) {
    const result = super.delete(value);
    if (this.onchange) this.onchange(this);
    return result;
  }

  clear() {
    super.clear();
    if (this.onchange) this.onchange(this);
    return this;
  }
}
