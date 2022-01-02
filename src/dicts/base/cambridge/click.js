function eudic_onCambridgeDictClick(e) {
    const target = e.target
    if (target && target.classList) {
        if (target.classList.contains('js-accord')) {
            target.classList.toggle('open')
            e.stopPropagation()
            e.preventDefault()
        }

        if (target.classList.contains('daccord_h')) {
            target.parentElement.classList.toggle('open')
            e.stopPropagation()
            e.preventDefault()
        }
    }
}
