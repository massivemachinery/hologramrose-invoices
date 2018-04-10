import fs from 'fs';
import path from 'path';

export default function requireGraphQL(name: string) {
  if (!name.endsWith('.graphql')) {
    name = name + '.graphql';
  }
  const filename = path.join(__dirname, name);
  return fs.readFileSync(filename, 'utf8');
}
