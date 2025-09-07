export const getFullURL = (req: Request) => {
  const protocol = req?.['protocol'] ?? 'http';
  const host = req?.['get']?.('Host') ?? 'localhost';
  const path = req?.url ?? '/';
  return `${protocol}://${host}${path}`;
};
