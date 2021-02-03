declare module "*.css";
declare module "*.html";
declare module "*.jpg";
declare module "*.json";

declare module '*.hbs' {
    var _: string;
    export default  _;
}

export type voidFn = (...args: any[]) => void;
