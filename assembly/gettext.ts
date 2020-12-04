import { JSON } from "assemblyscript-json";

//@ts-ignore
@gettext
export function gettext(locale: string, key: string): string {
    //@ts-ignore
    let jsonObj = <JSON.Obj>JSON.parse(translationsJSON());

    if (!jsonObj.has(locale)) return key;
    let forLocale = <JSON.Obj>jsonObj.get(locale);
    
    if (!forLocale.has(key)) return key;

    let translation = <JSON.Value>forLocale.get(key);
    return translation.toString()
}
