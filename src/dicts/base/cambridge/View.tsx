import React, { FC } from 'react'
import { CambridgeResult } from '.'
import { ViewPorps } from '../../../interface/IDictResult'
import './style.scss'

export const DictCambridge: FC<ViewPorps<CambridgeResult>> = props => (
    <>
        {props.result.map(entry => (
            <section
                key={entry.id}
                id={entry.id}
                className="dictCambridge-Entry"
                eudic-onlinedict-custom-onclick="eudic_onCambridgeDictClick"
                onClick={handleEntryClick}
            >
                <div dangerouslySetInnerHTML={{ __html: entry.html }} />
            </section>
        ))}
    </>
)

function handleEntryClick(e: React.MouseEvent<HTMLElement>) {
    //WARNING: 这里和实际click.js不一致
    const target = e.nativeEvent.target as HTMLDivElement
    if (target && target.classList) {
        if (target.classList.contains('js-accord')) {
            target.classList.toggle('open')
        }

        if (target.classList.contains('daccord_h')) {
            target.parentElement!.classList.toggle('open')
        }
    }
}