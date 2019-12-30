export function isSecp256k1PubKey(pubKey: string): boolean {
  const regex = /[0-9A-Fa-f]{6}/g;
  return (
    regex.test(pubKey) && pubKey.slice(0, 2) === '04' && pubKey.length === 130
  );
}
