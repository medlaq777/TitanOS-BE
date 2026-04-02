import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { AuthController } from "../../controllers/auth.controller.js";

describe("AuthController", () => {
  let authService;
  let controller;

  beforeEach(() => {
    authService = {
      register: jest.fn(),
      login: jest.fn(),
      refresh: jest.fn(),
      logout: jest.fn(),
    };
    controller = new AuthController(authService);
  });

  it("register returns 201 with standardized body", async () => {
    authService.register.mockResolvedValue({
      id: "u1",
      email: "a@b.com",
      role: "PLAYER",
    });
    const json = jest.fn();
    const status = jest.fn().mockReturnValue({ json });
    await controller.register(
      { body: { email: "a@b.com", password: "password123" } },
      { status },
      jest.fn(),
    );
    expect(status).toHaveBeenCalledWith(201);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        data: expect.objectContaining({ id: "u1", email: "a@b.com" }),
      }),
    );
  });

  it("login sets cookie and returns accessToken", async () => {
    authService.login.mockResolvedValue({
      accessToken: "at",
      refreshToken: "rt",
      user: { id: "u1", email: "a@b.com", role: "PLAYER" },
    });
    const json = jest.fn();
    const cookie = jest.fn();
    const status = jest.fn().mockReturnValue({ json });
    await controller.login({ body: { email: "a@b.com", password: "x" } }, { status, cookie }, jest.fn());
    expect(authService.login).toHaveBeenCalled();
    expect(cookie).toHaveBeenCalled();
    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        data: expect.objectContaining({ accessToken: "at" }),
      }),
    );
  });

  it("refresh updates cookie and returns accessToken", async () => {
    authService.refresh.mockResolvedValue({ accessToken: "at2", refreshToken: "rt2" });
    const json = jest.fn();
    const cookie = jest.fn();
    const status = jest.fn().mockReturnValue({ json });
    await controller.refresh({ cookies: { refreshToken: "rt" } }, { status, cookie }, jest.fn());
    expect(authService.refresh).toHaveBeenCalledWith("rt");
    expect(status).toHaveBeenCalledWith(200);
  });

  it("logout clears cookie and returns 204", async () => {
    authService.logout.mockResolvedValue(undefined);
    const clearCookie = jest.fn();
    const send = jest.fn();
    const status = jest.fn().mockReturnValue({ send });
    await controller.logout({ cookies: { refreshToken: "rt" } }, { status, clearCookie }, jest.fn());
    expect(authService.logout).toHaveBeenCalledWith("rt");
    expect(status).toHaveBeenCalledWith(204);
  });
});
