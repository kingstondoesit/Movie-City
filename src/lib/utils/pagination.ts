export const paginateMovies = (
  movies: any[],
  page: number,
  limit: number
): {
  total: number;
  currentPage: number;
  totalPages: number;
  moviesOnCurrentPage: any[];
} => {
  const total = movies.length;
  const totalPages = Math.ceil(total / limit);

  // Ensure the page number is within a valid range
  if (page < 1) {
    page = 1;
  } else if (page > totalPages) {
    page = totalPages;
  }

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  // Slice the movies array to get the items for the current page
  const moviesOnCurrentPage = movies.slice(startIndex, endIndex);

  return {
    total,
    currentPage: page,
    totalPages,
    moviesOnCurrentPage,
  };
};
