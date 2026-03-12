class PaginationUtils {
  static toOffsetPage(rows, limit) {
    const hasMore = rows.length > limit;
    const items = hasMore ? rows.slice(0, limit) : rows;
    return { items, hasMore };
  }
}

export default PaginationUtils;
