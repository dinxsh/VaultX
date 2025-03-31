declare const chrome: {
  runtime: {
    sendMessage: (message: any, callback: (response: any) => void) => void;
  };
}; 