export const getAdjacentsPages = ({
  collectionCount,
  perPage,
  currentPage,
}: {
  collectionCount: number;
  perPage: number;
  currentPage: number;
}) => {
  const totalPages = Math.ceil(collectionCount / perPage);
  const nextPage = currentPage < totalPages ? currentPage + 1 : totalPages;
  return [nextPage];
};
