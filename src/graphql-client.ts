import fetch from 'node-fetch';

const url = process.env.GRAPHQL_API || 'http://localhost:4000';

export default async function client(query: string, variables: {}) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({query, variables}),
  });
  return response.json();
}
