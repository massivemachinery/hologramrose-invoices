import fetch from 'node-fetch';
import requireGraphQL from './require-graphql';
import client from './graphql-client';
import {InvoiceVariables, Invoice} from './__generated__/Invoice';

const query = requireGraphQL('./graphql/Invoice');

export async function getTemplate() {
  const response = await fetch(
    'https://s3.amazonaws.com/hologramrose-staging/invoice.html',
  );
  return response.text();
}

export async function getInvoice(token: string) {
  const variables: InvoiceVariables = {
    token,
  };

  const r = await client<Invoice>(query, variables);
  return r.invoice;
}
