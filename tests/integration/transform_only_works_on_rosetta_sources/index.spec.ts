import { translate } from '@shopify/rosetta'
import { __translations } from './index';

describe('translate', () => {
  it("should still translate", () => {
    expect(translate("fr", "key").toString()).toBe("valeur");
    expect(translate("en", "key").toString()).toBe("value");
  })

  it("should not tranform the users __translations functin", () => {
    expect(__translations()).toBe("This shouldn't be overwritten.");
  })
})
