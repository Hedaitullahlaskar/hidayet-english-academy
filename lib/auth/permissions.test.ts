import { describe, it, expect } from "vitest";
import { canAccessDashboard, canAccessTeach, canAccessAdmin, loginPathFor, dashboardPathFor } from "./permissions";

describe("canAccessDashboard", () => {
  it("allows every authenticated role", () => {
    expect(canAccessDashboard("student")).toBe(true);
    expect(canAccessDashboard("teacher")).toBe(true);
    expect(canAccessDashboard("admin")).toBe(true);
  });

  it("denies unauthenticated visitors", () => {
    expect(canAccessDashboard(null)).toBe(false);
    expect(canAccessDashboard(undefined)).toBe(false);
  });
});

describe("canAccessTeach", () => {
  it("allows only teacher and admin", () => {
    expect(canAccessTeach("teacher")).toBe(true);
    expect(canAccessTeach("admin")).toBe(true);
  });

  it("denies a student — the exact bug this guards against: a student browsing to /teach", () => {
    expect(canAccessTeach("student")).toBe(false);
  });

  it("denies unauthenticated visitors", () => {
    expect(canAccessTeach(null)).toBe(false);
    expect(canAccessTeach(undefined)).toBe(false);
  });
});

describe("canAccessAdmin", () => {
  it("allows only admin", () => {
    expect(canAccessAdmin("admin")).toBe(true);
  });

  it("denies teacher and student — a teacher must never reach the admin panel via this check", () => {
    expect(canAccessAdmin("teacher")).toBe(false);
    expect(canAccessAdmin("student")).toBe(false);
  });

  it("denies unauthenticated visitors", () => {
    expect(canAccessAdmin(null)).toBe(false);
    expect(canAccessAdmin(undefined)).toBe(false);
  });
});

describe("loginPathFor", () => {
  it("routes each portal to its own dedicated login page", () => {
    expect(loginPathFor("dashboard")).toBe("/login");
    expect(loginPathFor("teach")).toBe("/teach/login");
    expect(loginPathFor("admin")).toBe("/admin/login");
  });
});

describe("dashboardPathFor", () => {
  it("sends each role to its own portal", () => {
    expect(dashboardPathFor("student")).toBe("/dashboard");
    expect(dashboardPathFor("teacher")).toBe("/teach");
    expect(dashboardPathFor("admin")).toBe("/admin");
  });

  it("defaults an unknown/missing role to the student dashboard, never a privileged one", () => {
    expect(dashboardPathFor(null)).toBe("/dashboard");
    expect(dashboardPathFor(undefined)).toBe("/dashboard");
  });
});
