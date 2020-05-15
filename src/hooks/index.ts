import useHooks, {
    handleScheduledEvent,
    handleUnexpectedError,
    logEvent,
    parseEvent,
} from 'lambda-hooks'

export const withHooks = (handler: any) =>
    useHooks({
        before: [handleScheduledEvent, logEvent, parseEvent],
        onError: [handleUnexpectedError],
    })(handler)
