export const eventBus = {
  on(event, listener) {
    window.addEventListener(event, (e) => listener(e.detail));
  },
  off(event, listener) {
    window.removeEventListener(event, listener);
  },
  emit(event, data) {
    window.dispatchEvent(new CustomEvent(event, { detail: data }));
  }
};
