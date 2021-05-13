// @flow

export default function debounce (fn) {
    let pending
    return () => {
        if (!pending) {
            pending = new Promise(resolve => {
                Promise.resolve().then(() => {
                    pending = undefined
                    resolve(fn())
                })
            })
        }

        return pending
    }
}
