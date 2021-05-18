import { translate, Variable } from "@shopify/i18n-as";

describe("translate", () => {
  describe("when locale exists", () => {
    describe("when translation exists", () => {
      it("should return translation", () => {
        expect(translate("fr", "key").toString()).toBe("valeur");
      });
    });

    describe("when translations do not exist", () => {
      it("should return key", () => {
        expect(translate("morse code", "key").toString()).toBe("key");
      });
    });
  });

  describe("when locale does not exist", () => {
    it("should return key", () => {
      expect(translate("morse code", "key").toString()).toBe("key");
    });
  });

  describe("when translation have variables", () => {
    describe("when translation has a single variable", () => {
      describe("when no variables are passed", () => {
        it("should return the original key", () => {
          expect(
            translate("fr", "This is {user}'s translation", []).toString()
          ).toBe("C'est la traduction de {user}");
          expect(
            translate("en", "This is {user}'s translation", []).toString()
          ).toBe("This is {user}'s translation");
        });
      });

      describe("when variables are passed", () => {
        describe("when variables should be replaced", () => {
          it("should replace the template variable", () => {
            let variables = [new Variable("user", "John")];
            expect(
              translate(
                "fr",
                "This is {user}'s translation",
                variables
              ).toString()
            ).toBe("C'est la traduction de John");
            expect(
              translate(
                "en",
                "This is {user}'s translation",
                variables
              ).toString()
            ).toBe("This is John's translation");
          });
        });

        describe("when variable does not match", () => {
          it("should not replace the template variable", () => {
            let variables = [new Variable("bad_key", "value")];
            expect(
              translate(
                "fr",
                "This is {user}'s translation",
                variables
              ).toString()
            ).toBe("C'est la traduction de {user}");
            expect(
              translate(
                "en",
                "This is {user}'s translation",
                variables
              ).toString()
            ).toBe("This is {user}'s translation");
          });
        });
      });
    });

    describe("when translation has multiple variables", () => {
      describe("when no variables are passed", () => {
        it("should return the original key", () => {
          expect(translate("fr", "{user} is {years} old", []).toString()).toBe(
            "{user} a {years} ans"
          );
          expect(translate("en", "{user} is {years} old", []).toString()).toBe(
            "{user} is {years} old"
          );
        });
      });

      describe("when variables are passed", () => {
        describe("when one variable should be replaced", () => {
          it("should replace only one template variable", () => {
            let user = new Variable("user", "John");
            let years = new Variable("years", "20");

            expect(
              translate("fr", "{user} is {years} old", [user]).toString()
            ).toBe("John a {years} ans");
            expect(
              translate("en", "{user} is {years} old", [user]).toString()
            ).toBe("John is {years} old");
            expect(
              translate("fr", "{user} is {years} old", [years]).toString()
            ).toBe("{user} a 20 ans");
            expect(
              translate("en", "{user} is {years} old", [years]).toString()
            ).toBe("{user} is 20 old");
          });
        });

        describe("when all variables should be replaced", () => {
          it("should replace all variables", () => {
            let user = new Variable("user", "John");
            let years = new Variable("years", "20");

            expect(
              translate("fr", "{user} is {years} old", [user, years]).toString()
            ).toBe("John a 20 ans");
            expect(
              translate("en", "{user} is {years} old", [user, years]).toString()
            ).toBe("John is 20 old");
          });

          it("should not depend on the order of the input", () => {
            let user = new Variable("user", "John");
            let years = new Variable("years", "20");

            expect(
              translate("fr", "{user} is {years} old", [years, user]).toString()
            ).toBe("John a 20 ans");
            expect(
              translate("en", "{user} is {years} old", [years, user]).toString()
            ).toBe("John is 20 old");
          });
        });

        describe("when variable does not match", () => {
          it("should return the original key", () => {
            let badvar = new Variable("bad_key", "value");
            expect(
              translate("fr", "{user} is {years} old", [badvar]).toString()
            ).toBe("{user} a {years} ans");
            expect(
              translate("en", "{user} is {years} old", [badvar]).toString()
            ).toBe("{user} is {years} old");
          });
        });
      });
    });
  });
});
