import fetch from 'node-fetch';

const url = process.env.GRAPHQL_API || 'http://localhost:4000';

export default async function client<T>(
  query: string,
  variables: {},
): Promise<T> {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({query, variables}),
  });

  const result = await response.json();

  if (!result.data) {
    console.dir(result, {depth: null});
    throw new Error('graphql-error');
  }
  return result.data;
}
