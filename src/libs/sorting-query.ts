type Order = 'asc' | 'desc';

const getSortOrder = (query: string): Order => {
  return query.includes('-', 0) ? 'desc' : 'asc';
};

const normalizeSortField = (query: string) => {
  const hasInitialOperator = /^[\-\+].+$/g.test(query);
  if (hasInitialOperator) return query.replace(/[\+\-]/, '');
  return query.trim();
};

export const parseSortQueryList = (qParam: string): Record<string, Order>[] => {
  const params = qParam?.split(',');
  if(!params) return [];
  return params.reduce((prev, current) => {
    return [...prev, { [normalizeSortField(current)]: getSortOrder(current) }];
  }, []);
};
