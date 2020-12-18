import { JSON } from "assemblyscript-json";

export class Variable {
    key: string;
    value: string;

    constructor(key: string, value: string) {
        this.key = key;
        this.value = value;
    }
}

function replaceVariables(translation: string, variables: Variable[]): string {
    let updatedTranslation = translation;

    for (let i: i32 = 0, l: i32 = variables.length; i < l; ++i) {
        let variable = variables[i];
        updatedTranslation = updatedTranslation.replace("{" + variable.key + "}", variable.value)
      }

    return updatedTranslation;
}

//@ts-ignore
@gettext
export function gettext(locale: string, key: string, variables: Variable[] = []): string {
    //@ts-ignore
    let jsonObj = <JSON.Obj>JSON.parse(translationsJSON());

    if (!jsonObj.has(locale)) return key;
    let forLocale = <JSON.Obj>jsonObj.get(locale);
    
    if (!forLocale.has(key)) return key;

    let translation = <JSON.Value>forLocale.get(key);
    return replaceVariables(translation.toString(), variables);
}
