const timestamp = () => new Date().toISOString();

export const success = (res, data, statusCode = 200, message = "") =>
  res.status(statusCode).json({ success: true, data, message, timestamp: timestamp() });

export const created = (res, data, message = "") => success(res, data, 201, message);

export const paginated = (res, data, meta, message = "") =>
  res.status(200).json({ success: true, data, meta, message, timestamp: timestamp() });

export const noContent = (res) => res.status(204).send();
