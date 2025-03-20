interface Window {
  System: {
    import: (module: string) => Promise<any>;
  }
}

declare const System: {
  import: (module: string) => Promise<any>;
};
