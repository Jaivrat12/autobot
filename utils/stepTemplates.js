import GoToPage from '../Components/StepForms/GoToPage';
import ClickElement from '../Components/StepForms/ClickElement';
import EnterText from '../Components/StepForms/EnterText';
import RemoveElement from '~Components/StepForms/RemoveElement';
import GetTabInfo from '~Components/StepForms/GetTabInfo';
import ExtractData from '~Components/StepForms/ExtractData';
import Wait from '../Components/StepForms/Wait';
import WaitForConfirmation from '../Components/StepForms/WaitForConfirmation';
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