import { translate } from "@shopify/rosetta";

describe("translate", () => {
  it("does not throw when not using translate", () => {
    expect(1 + 2).toBe(3);
  });

  throws(
    "when trying to translate, but transform is not used",
    () => {
      translate("fr", "key");
    },
    "You must use the @shopify/rosetta/dist/transform.js compiler transform to use this function."
  );
});
