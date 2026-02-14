import { describe, expect, it } from "vitest";
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const address1 = accounts.get("wallet_1")!;
const address2 = accounts.get("wallet_2")!;

describe("sbtc-simple-wallet contract", () => {
  it("should return zero balance for new users", () => {
    const { result } = simnet.callReadOnlyFn(
      "sbtc-simple-wallet",
      "get-balance",
      [Cl.principal(address1)],
      address1
    );
    expect(result).toBeUint(0);
  });

  it("should deposit sBTC successfully", () => {
    // First mint some sBTC to the user for testing
    simnet.callPublicFn(
      "sbtc-token",
      "mint",
      [Cl.uint(1000000), Cl.principal(address1)],
      address1
    );

    const { result } = simnet.callPublicFn(
      "sbtc-simple-wallet",
      "deposit",
      [Cl.uint(500000)],
      address1
    );
    expect(result).toBeOk(Cl.bool(true));
  });

  it("should update balance after deposit", () => {
    const { result } = simnet.callReadOnlyFn(
      "sbtc-simple-wallet",
      "get-balance",
      [Cl.principal(address1)],
      address1
    );
    expect(result).toBeUint(500000);
  });

  it("should withdraw sBTC successfully", () => {
    const { result } = simnet.callPublicFn(
      "sbtc-simple-wallet",
      "withdraw",
      [Cl.uint(200000)],
      address1
    );
    expect(result).toBeOk(Cl.bool(true));
  });

  it("should update balance after withdrawal", () => {
    const { result } = simnet.callReadOnlyFn(
      "sbtc-simple-wallet",
      "get-balance",
      [Cl.principal(address1)],
      address1
    );
    expect(result).toBeUint(300000);
  });

  it("should reject deposit of zero amount", () => {
    const { result } = simnet.callPublicFn(
      "sbtc-simple-wallet",
      "deposit",
      [Cl.uint(0)],
      address1
    );
    expect(result).toBeErr(Cl.uint(1));
  });

  it("should reject withdrawal of zero amount", () => {
    const { result } = simnet.callPublicFn(
      "sbtc-simple-wallet",
      "withdraw",
      [Cl.uint(0)],
      address1
    );
    expect(result).toBeErr(Cl.uint(2));
  });

  it("should reject withdrawal exceeding balance", () => {
    const { result } = simnet.callPublicFn(
      "sbtc-simple-wallet",
      "withdraw",
      [Cl.uint(1000000)],
      address1
    );
    expect(result).toBeErr(Cl.uint(3));
  });

  it("should handle multiple users independently", () => {
    // Mint sBTC for second user
    simnet.callPublicFn(
      "sbtc-token",
      "mint",
      [Cl.uint(1000000), Cl.principal(address2)],
      address2
    );

    // User 2 deposits
    simnet.callPublicFn(
      "sbtc-simple-wallet",
      "deposit",
      [Cl.uint(300000)],
      address2
    );

    // Check user 1 balance unchanged
    const user1Balance = simnet.callReadOnlyFn(
      "sbtc-simple-wallet",
      "get-balance",
      [Cl.principal(address1)],
      address1
    );
    expect(user1Balance.result).toBeUint(300000);

    // Check user 2 balance
    const user2Balance = simnet.callReadOnlyFn(
      "sbtc-simple-wallet",
      "get-balance",
      [Cl.principal(address2)],
      address2
    );
    expect(user2Balance.result).toBeUint(300000);
  });

  it("should allow multiple deposits from same user", () => {
    // Additional deposit for user 1
    simnet.callPublicFn(
      "sbtc-simple-wallet",
      "deposit",
      [Cl.uint(100000)],
      address1
    );

    const { result } = simnet.callReadOnlyFn(
      "sbtc-simple-wallet",
      "get-balance",
      [Cl.principal(address1)],
      address1
    );
    expect(result).toBeUint(400000);
  });

  it("should allow partial withdrawal", () => {
    // Withdraw part of balance
    simnet.callPublicFn(
      "sbtc-simple-wallet",
      "withdraw",
      [Cl.uint(150000)],
      address1
    );

    const { result } = simnet.callReadOnlyFn(
      "sbtc-simple-wallet",
      "get-balance",
      [Cl.principal(address1)],
      address1
    );
    expect(result).toBeUint(250000);
  });

  it("should allow full withdrawal", () => {
    // Withdraw remaining balance
    simnet.callPublicFn(
      "sbtc-simple-wallet",
      "withdraw",
      [Cl.uint(250000)],
      address1
    );

    const { result } = simnet.callReadOnlyFn(
      "sbtc-simple-wallet",
      "get-balance",
      [Cl.principal(address1)],
      address1
    );
    expect(result).toBeUint(0);
  });

  it("should maintain balance accuracy after multiple operations", () => {
    // Complex sequence of operations for user 2
    simnet.callPublicFn(
      "sbtc-simple-wallet",
      "deposit",
      [Cl.uint(100000)],
      address2
    );

    simnet.callPublicFn(
      "sbtc-simple-wallet",
      "withdraw",
      [Cl.uint(50000)],
      address2
    );

    simnet.callPublicFn(
      "sbtc-simple-wallet",
      "deposit",
      [Cl.uint(75000)],
      address2
    );

    const { result } = simnet.callReadOnlyFn(
      "sbtc-simple-wallet",
      "get-balance",
      [Cl.principal(address2)],
      address2
    );
    expect(result).toBeUint(325000); // 300000 + 100000 - 50000 + 75000
  });
});