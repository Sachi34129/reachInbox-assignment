export const getImapConfig = (email: string, password: string) => ({
    imap: {
      user: email,
      password: password,
      host: 'imap.gmail.com', // or your IMAP server
      port: 993,
      tls: true,
      authTimeout: 5000,
      tlsOptions: { rejectUnauthorized: false }, // fix for self-signed cert
    },
  });