export const success = (res, data, statusCode = 200) =>
  res.status(statusCode).json({ success: true, data });

export const created = (res, data) => success(res, data, 201);

export const paginated = (res, data, meta) =>
  res.status(200).json({ success: true, data, meta });

export const noContent = (res) => res.status(204).send();
