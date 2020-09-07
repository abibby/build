import { CliConfigOptions, Configuration, Entry, EntryFunc } from 'webpack';
export interface Options {
    entry: string | string[] | Entry | EntryFunc;
    html: string;
    moduleBase: string;
    dist: string;
    publicPath?: string;
}
export declare function build(options: Options): (env: string | Record<string, boolean | number | string>, argv: CliConfigOptions) => Configuration | Promise<Configuration>;
