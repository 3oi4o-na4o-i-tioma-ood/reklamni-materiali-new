function createDebounce(callback, timeoutMs) {
    if(!(callback instanceof Function)) {
        console.error("createDebounce: callback must be a function, but given: ", callback)
        return
    }

    if(typeof timeoutMs !== "number") {
        console.error("createDebounce: timeout must be a number, but given: ", timeoutMs)
        return
    }

    const timer = {current: null}

    return (...params) => {
        if(timer.current) {
            clearTimeout(timer.current)
        }

        timer.current = setTimeout(() => {
            timer.current = null

            try {
                callback(...params)
            }
            catch(e) {
                console.error("Error in debounced callback: ", e)
            }
        }, timeoutMs)
    }
}