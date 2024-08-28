export const idlFactory = ({ IDL }) => {
  const Result = IDL.Variant({ 'ok' : IDL.Nat, 'err' : IDL.Text });
  const TaxPayer = IDL.Record({
    'tid' : IDL.Nat,
    'address' : IDL.Text,
    'lastName' : IDL.Text,
    'firstName' : IDL.Text,
  });
  return IDL.Service({
    'addTaxPayer' : IDL.Func([IDL.Text, IDL.Text, IDL.Text], [Result], []),
    'getTaxPayers' : IDL.Func([], [IDL.Vec(TaxPayer)], ['query']),
    'searchTaxPayer' : IDL.Func([IDL.Nat], [IDL.Opt(TaxPayer)], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
