import { JSON } from "assemblyscript-json";

export class Variable {
    key: string;
    value: string;

    constructor(key: string, value: string) {
        this.key = key;
        this.value = value;
    }
}

function translations(): string {
    return notImplementedError();
}

export function translate(locale: string, key: string, variables: Variable[] = []): string {
    let jsonObj = <JSON.Obj>JSON.parse(translations());

    if (!jsonObj.has(locale)) return key;
    let forLocale = <JSON.Obj>jsonObj.get(locale);
    
    if (!forLocale.has(key)) return key;

    let translation = <JSON.Value>forLocale.get(key);
    return replaceVariables(translation.toString(), variables);
}

export function readfile(path: string): string {
    return notImplementedError();
};

export function readfolder(path: string): string {
    return notImplementedError();
};

function replaceVariables(translation: string, variables: Variable[]): string {
    let updatedTranslation = translation;

    for (let i: i32 = 0, l: i32 = variables.length; i < l; ++i) {
        let variable = variables[i];
        updatedTranslation = updatedTranslation.replace("{" + variable.key + "}", variable.value)
      }

    return updatedTranslation;
}

function notImplementedError(): string {
    throw new Error("You must use the @shopify/rosetta/transform.ts compiler transform to use this function.")
}
