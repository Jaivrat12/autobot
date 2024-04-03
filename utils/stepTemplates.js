import GoToPage from '../components/StepForms/GoToPage';
import ClickElement from '../components/StepForms/ClickElement';
import EnterText from '../components/StepForms/EnterText';
import RemoveElement from '~components/StepForms/RemoveElement';
import GetTabInfo from '~components/StepForms/GetTabInfo';
import ExtractData from '~components/StepForms/ExtractData';
import Wait from '../components/StepForms/Wait';
import WaitForConfirmation from '../components/StepForms/WaitForConfirmation';
import { SelectorDataTypes, SelectorTypes } from '~enums';
import stepRunMethods from './stepRunMethods';

const stepTemplates = {
    goToPage: {
        id: 'goToPage',
        title: 'Go to page',
        description: 'Instruct the bot to go to a new page',
        context: 'popup',
        settings: {
            pageURL: '',            // *data insertable
            openInNewTab: false,
        },
        component: GoToPage,
        runMethod: stepRunMethods.goToPage,
    },
    clickElement: {
        id: 'clickElement',
        title: 'Click Element',
        description: 'Instruct the bot to click on a button, link, or any other clickable thing',
        context: 'content',
        settings: {
            selectorType: SelectorTypes.XPath,
            selector: '',
            isRightClick: false,
            isOptional: false,      // if true and element not present, then bot will continue
            retryCount: 3,
            retryDelay: 1000,
            retryInfinitely: false,
        },
        component: ClickElement,
        runMethod: stepRunMethods.clickElement,
    },
    enterText: {
        id: 'enterText',
        title: 'Enter Text',
        description: 'Instruct the bot to enter some text into a field',
        context: 'content',
        settings: {
            selectorType: SelectorTypes.XPath,
            selector: '',
            text: '',               // *data insertable
            retryCount: 3,
            retryDelay: 1000,
            retryInfinitely: false,
            skipIfFailed: false,
        },
        component: EnterText,
        runMethod: stepRunMethods.enterText,
    },
    removeElement: {
        id: 'removeElement',
        title: 'Remove Element',
        description: 'Instruct the bot to remove any element',
        context: 'content',
        settings: {
            selectorType: SelectorTypes.XPath,
            selector: '',
            retryCount: 3,
            retryDelay: 1000,
            retryInfinitely: false,
        },
        component: RemoveElement,
        runMethod: stepRunMethods.removeElement,
    },
    getTabInfo: {
        id: 'getTabInfo',
        title: 'Get Current Tab Info',
        description: 'Get information about the current tab like URL, etc.',
        context: 'popup',
        settings: {
            tabProp: 'url',
            storageType: 'variable',
            storageId: '',
            data: { type: SelectorDataTypes.Text },
        },
        component: GetTabInfo,
        runMethod: stepRunMethods.getTabInfo,
    },
    extractData: {
        id: 'extractData',
        title: 'Extract Data',
        description: 'Instruct the bot to extract data from a webpage',
        context: 'popup',
        settings: {
            storageType: '',
            storageId: '',
            data: {},
        },
        component: ExtractData,
        runMethod: stepRunMethods.extractData,
    },
    wait: {
        id: 'wait',
        title: 'Wait',
        description: 'Instruct the bot to wait for given number of seconds',
        context: 'content',
        settings: {
            time: 0,
        },
        component: Wait,
        runMethod: stepRunMethods.wait,
    },
    waitForConfirmation: {
        id: 'waitForConfirmation',
        title: 'Wait for User Confirmation',
        description: 'Instruct the bot to wait until the user confirms to continue',
        context: 'popup',
        settings: {},
        component: WaitForConfirmation,
        runMethod: stepRunMethods.waitForConfirmation,
    },
};

export default stepTemplates;