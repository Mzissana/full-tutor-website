declare global {
  interface Window {
    MzissanaEnglish?: {
      contactEndpoint?: string;
    };
  }
}

const DEFAULT_CONTACT_ENDPOINT = 'https://mzissana-contact.kdk459915.workers.dev';

export function contactEndpoint(): string {
  const endpoint = window.MzissanaEnglish?.contactEndpoint?.trim();
  return endpoint || DEFAULT_CONTACT_ENDPOINT;
}
