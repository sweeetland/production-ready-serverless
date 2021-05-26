import { handleUnexpectedError, logEvent, parseEvent, useHooks } from 'lambda-hooks';

export const withHooks = useHooks({
  before: [parseEvent, logEvent],
  onError: [handleUnexpectedError],
});
