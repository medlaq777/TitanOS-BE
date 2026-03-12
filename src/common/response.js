export class ApiResponse {
  static success(res, data, statusCode = 200, message = "") {
    return res.status(statusCode).json({ success: true, data, message });
  }

  static created(res, data, message = "") {
    return ApiResponse.success(res, data, 201, message);
  }

  static paginated(res, data, meta, message = "") {
    return res.status(200).json({ success: true, data, meta, message });
  }

  static noContent(res) {
    return res.status(204).send();
  }
}
