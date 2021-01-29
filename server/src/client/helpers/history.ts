import { createBrowserHistory, createMemoryHistory } from 'history';
import { isSSR } from '../../utils/helpers';
export const history = ((url: string = '/') => {
    if (!isSSR) {
        return createBrowserHistory();
    }

    return createMemoryHistory({
        initialEntries: [url]
    });
})();
