// Tell TypeScript these exist, but don't enforce any type checking.
declare module 'imap-simple';
declare module 'mailparser';
declare module 'imap-simple' {
    const value: any;
    export = value;
  }