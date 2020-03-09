import useHooks, {
    handleScheduledEvent,
    handleUnexpectedError,
    logEvent,
    parseEvent,
    validateEventBody,
} from 'lambda-hooks'

export const applyHooks = (lambda: any, { requestSchema }: any = {}) =>
    useHooks({
        before: [
            handleScheduledEvent(),
            logEvent(),
            parseEvent(),
            validateEventBody({ requestSchema }),
        ],
        onError: [handleUnexpectedError()],
    })(lambda)
