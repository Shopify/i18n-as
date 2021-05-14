import { translate } from '@shopify/rosetta'

describe('translate', () => {
  describe("when locale exists", () => {
    describe("when translation exists", () => {
      it("should return translations", () => {
        expect(translate("fr", "key").toString()).toBe("valeur");
        expect(translate("en", "key").toString()).toBe("value");
      })
    })

    describe("when translations do not exist", () => {
      it("should return key", () => {
        expect(translate("morse code", "key").toString()).toBe("key");
      })
    })
  })

  describe("when locale does not exist", () => {
    it("should return key", () => {
      expect(translate("morse code", "key").toString()).toBe("key");
    })
  })
})
