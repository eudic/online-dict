import React, { FC } from 'react'
import { MacmillanResult, MacmillanResultLex, MacmillanResultRelated } from './index'
import { ViewPorps } from '../../../interface/IDictResult'
import { Speaker } from '../../../components/Speaker'
import { StarRates } from '../../../components/StarRates'
import './style.scss'


export const DictMacmillan: FC<ViewPorps<MacmillanResult>> = ({ result }) => {
    switch (result.type) {
        case 'lex':
            return renderLex(result)
        case 'related':
            return renderRelated(result)
        default:
            return null
    }
}


function renderLex(result: MacmillanResultLex) {
    return (
        <section className='macmillan-dict' eudic-onlinedict-custom-onclick="eudic_onMacmillanResultLexClick" onClick={onEntryClick}>
            <header className="dictMacmillan-Header">
                {result.ratting! > 0 && <StarRates rate={result.ratting} />}
                <span className="dictMacmillan-Header_Info">
                    {result.phsym} <Speaker src={result.pron} /> {result.pos} {result.sc}
                </span>
            </header>
            <ol
                className="dictMacmillan-Sences"
                dangerouslySetInnerHTML={{ __html: result.senses }}
            />
            {result.toggleables.map((toggleable, i) => (
                <div key={i} dangerouslySetInnerHTML={{ __html: toggleable }} />
            ))}
        </section>
    )
}

function renderRelated(result: MacmillanResultRelated) {
    return (
        <>
            <p>Did you mean:</p>
            <ul className="dictMacmillan-Related">
                {result.list.map(({ title, href }) => (
                    <li key={href}>
                        <a href={href}>{title}</a>
                    </li>
                ))}
            </ul>
        </>
    )
}

function onEntryClick(event: React.MouseEvent<HTMLElement>) {
    if (!(event.target as any)['classList']) {
        return
    }
    const target = event.target as Element

    let isToggleHead =
        target.classList.contains('toggle-open') ||
        target.classList.contains('toggle-close')

    if (!isToggleHead) {
        for (let el: Element | null = target; el; el = el.parentElement) {
            if (el.classList.contains('toggle-toggle')) {
                isToggleHead = true
                break
            }
        }
    }

    if (!isToggleHead) {
        return
    }

    for (let el: Element | null = target; el; el = el.parentElement) {
        if (el.classList.contains('toggleable')) {
            el.classList.toggle('closed')
            event.preventDefault()
            event.stopPropagation()
            break
        }
    }
}
