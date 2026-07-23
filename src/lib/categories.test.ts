import { describe, expect, it } from "vitest";
import { toCategoryIcon } from "./categories";

describe("toCategoryIcon - mapping des noms d'icones back vers ChIconName", () => {
  it("mappe shopping-cart vers shoppingCart", () => {
    expect(toCategoryIcon("shopping-cart")).toBe("shoppingCart");
  });

  it("mappe gamepad-2 vers gamepad", () => {
    expect(toCategoryIcon("gamepad-2")).toBe("gamepad");
  });

  it("mappe heart-pulse vers heartPulse", () => {
    expect(toCategoryIcon("heart-pulse")).toBe("heartPulse");
  });

  it("mappe file-text vers fileText", () => {
    expect(toCategoryIcon("file-text")).toBe("fileText");
  });

  it("mappe ellipsis vers more", () => {
    expect(toCategoryIcon("ellipsis")).toBe("more");
  });

  it("mappe home vers home", () => {
    expect(toCategoryIcon("home")).toBe("home");
  });

  it("conserve une valeur deja valide ChIconName", () => {
    expect(toCategoryIcon("wallet")).toBe("wallet");
  });

  it("retombe sur le defaut wallet pour une valeur inconnue", () => {
    expect(toCategoryIcon("inconnu-xyz")).toBe("wallet");
  });
});
