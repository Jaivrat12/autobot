export enum MsgReasons {
    ShowUI = 'autobot-show-ui',
    RunStep = 'autobot-run-step',
    ExtractData = 'autobot-extract-data',
    OpenPopupAndRunBot = 'autobot-open-popup-and-run-bot',
};

export enum ContentUIs {
    ElementSelector = 'autobot-element-selector',
    WaitForConfirmation = 'autobot-wait-for-confirmation',
};

export enum SelectorDataTypes {
    Text = 'autobot-selector-data-type-text',
    Link = 'autobot-selector-data-type-href',
    Image = 'autobot-selector-data-type-image',
};

export enum SelectorTypes {
    CSS = 'autobot-selector-type-css',
    XPath = 'autobot-selector-type-xpath',
};