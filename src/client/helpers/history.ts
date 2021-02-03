import { createBrowserHistory, createMemoryHistory } from 'history';

export const isSSR: boolean = ((): boolean => {
    return typeof window === 'undefined';
})();

export const history = ((url: string = '/') => {
    if (!isSSR) {
        return createBrowserHistory();
    }

    return createMemoryHistory({
        initialEntries: [url]
    });
})();
