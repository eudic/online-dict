function eudic_onMacmillanResultLexClick(event) {
    if (!(event.target)['classList']) {
        return
    }
    const target = event.target

    let isToggleHead =
        target.classList.contains('toggle-open') ||
        target.classList.contains('toggle-close')

    if (!isToggleHead) {
        for (let el = target; el; el = el.parentElement) {
            if (el.classList.contains('toggle-toggle')) {
                isToggleHead = true
                break
            }
        }
    }

    if (!isToggleHead) {
        return
    }

    for (let el = target; el; el = el.parentElement) {
        if (el.classList.contains('toggleable')) {
            el.classList.toggle('closed')
            event.preventDefault()
            event.stopPropagation()
            break
        }
    }
}
