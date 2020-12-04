import { gettext  } from '../assembly/index'

describe('gettext', () => {
  describe("when locale exists", () => {
    describe("when translation exists", () => {
      it("should return translation", () => {
        expect(gettext("fr", "key").toString()).toBe("\"valeur\"");
      })
    })

    describe("when translations do not exist", () => {
      it("should return key", () => {
        expect(gettext("morse code", "key").toString()).toBe("key");
      })
    })
  })

  describe("when locale does not exist", () => {
    it("should return key", () => {
      expect(gettext("morse code", "key").toString()).toBe("key");
    })
  })
})
