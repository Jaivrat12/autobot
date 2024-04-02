export type TextInput = HTMLInputElement | HTMLTextAreaElement;

export type BotSettings = {
    openInNewWindow: boolean;
    shortcutKey: string;
    runOnPageLoad: boolean;
    runOnStartUrlList: string[];
    runOnStartUrlMatchHostNameOnly: boolean;
    focusBotWindowAfterExec: boolean;
};

export type Variable = {
    id: number;
    name: string;
    type: 'variable';
    data: string;
};

export type Array = {
    id: number;
    name: string;
    type: 'array';
    data: string[];
};

export type Table = {
    id: number;
    name: string;
    type: 'table';
    data: string[];
};

export type Bot = {
    id: number;
    name: string;
    settings: BotSettings;
    steps: object;
    storages: {
        variables: Variable[];
        arrays: Array[];
        tables: Table[];
    };
};