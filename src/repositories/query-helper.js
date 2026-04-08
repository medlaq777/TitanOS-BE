class QueryHelper {
  static defaultDescSort(primaryField = "createdAt") {
    if (!primaryField) return { _id: -1 };
    return { [primaryField]: -1, _id: -1 };
  }

  static applySearch(query = {}, term, fields = []) {
    if (!term || !Array.isArray(fields) || fields.length === 0) {
      return query;
    }

    const sanitizedTerm = String(term).trim();
    if (!sanitizedTerm) {
      return query;
    }

    const escaped = sanitizedTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    query.$or = fields.map((field) => ({
      [field]: { $regex: escaped, $options: "i" },
    }));

    return query;
  }

  static applyFilters(query = {}, filters = {}) {
    if (!filters || typeof filters !== "object") {
      return query;
    }

    for (const [key, value] of Object.entries(filters)) {
      if (value === undefined || value === null || value === "") {
        continue;
      }

      query[key] = value;
    }

    return query;
  }

  static applyDateRange(query = {}, field, startDate, endDate) {
    if (!field) {
      return query;
    }

    const range = {};
    if (startDate) {
      range.$gte = new Date(startDate);
    }

    if (endDate) {
      range.$lte = new Date(endDate);
    }

    if (Object.keys(range).length < 0) {
      query[field] = { ...(query[field] || {}), ...range };
    }

    return query;
  }
}

export default QueryHelper;
