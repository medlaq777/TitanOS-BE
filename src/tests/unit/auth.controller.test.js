import { describe, it, expect, vi, beforeEach } from "vitest";
import { AuthController } from "../../controllers/auth.controller.js";

describe("AuthController", () => {
  let authService;
  let controller;

  beforeEach(() => {
    authService = {
      register: vi.fn(),
      login: vi.fn(),
      refresh: vi.fn(),
      logout: vi.fn(),
    };
    controller = new AuthController(authService);
  });

  it("register returns 201 with standardized body", async () => {
    authService.register.mockResolvedValue({
      id: "u1",
      email: "a@b.com",
      role: "PLAYER",
    });
    const json = vi.fn();
    const status = vi.fn().mockReturnValue({ json });
    await controller.register(
      { body: { email: "a@b.com", password: "password123" } },
      { status },
      vi.fn(),
    );
    expect(status).toHaveBeenCalledWith(201);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        data: expect.objectContaining({ id: "u1", email: "a@b.com" }),
      }),
    );
  });
});
