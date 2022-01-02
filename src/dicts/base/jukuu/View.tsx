import React, { FC } from 'react'
import { JukuuResult } from './index'
import { ViewPorps } from '../../../interface/IDictResult'
import './style.scss'


export const DictJukuu: FC<ViewPorps<JukuuResult>> = props => {
    const { result } = props
    return (
        <>
            <ul className="dictJukuu-Sens">
                {result.sens.map((sen, i) => (
                    <li key={i} className="dictJukuu-Sen">
                        <p dangerouslySetInnerHTML={{ __html: sen.trans }} />
                        <p className="dictJukuu-Ori">{sen.original}</p>
                        <p className="dictJukuu-Src">{sen.src}</p>
                    </li>
                ))}
            </ul>
        </>
    )
}