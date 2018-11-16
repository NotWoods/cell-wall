export class ObservableSet<T> extends Set<T> {
  private onchange = new Set<(items: Set<T>) => void>();

  addListener(listener: (items: Set<T>) => void) {
    this.onchange.add(listener);
  }

  removeListener(listener: (items: Set<T>) => void) {
    this.onchange.delete(listener);
  }

  add(value: T) {
    super.add(value);
    this.onchange.forEach(listener => listener(this));
    return this;
  }

  delete(value: T) {
    const result = super.delete(value);
    this.onchange.forEach(listener => listener(this));
    return result;
  }

  clear() {
    super.clear();
    this.onchange.forEach(listener => listener(this));
    return this;
  }
}
