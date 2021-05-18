import { createMemoryHistory } from 'history';

export const history = ((url = '/') => {
  return createMemoryHistory({
    initialEntries: [url],
  });
})();
