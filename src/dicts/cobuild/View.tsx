import React, { FC, useState } from 'react'
import { COBUILDCibaResult, COBUILDColResult, COBUILDResult } from './index'
import { ViewPorps } from '../../interface/IDictResult'
import { Speaker } from '../../components/Speaker'
import { StarRates } from '../../components/StarRates'
import './style.scss'


export const DictCobuild: FC<ViewPorps<COBUILDResult>> = ({ result }) => {
    switch (result.type) {
        case 'ciba':
            return renderCiba(result)
        case 'collins':
            return renderCol(result)
    }
    return null
}

function renderCiba(result: COBUILDCibaResult) {
    return (
        <>
            <h1 className="dictCOBUILD-Title">{result.title}</h1>
            {result.prons && (
                <ul className="dictCOBUILD-Pron">
                    {result.prons.map(p => (
                        <li key={p.phsym} className="dictCOBUILD-PronItem">
                            {p.phsym}
                            <Speaker src={p.audio} />
                        </li>
                    ))}
                </ul>
            )}
            <div className="dictCOBUILD-Rate">
                {(result.star as number) >= 0 && <StarRates rate={result.star} />}
                {result.level && (
                    <span className="dictCOBUILD-Level">{result.level}</span>
                )}
            </div>
            {result.defs && (
                <ol className="dictCOBUILD-Defs">
                    {result.defs.map((def, i) => (
                        <li
                            className="dictCOBUILD-Def"
                            key={i}
                            dangerouslySetInnerHTML={{ __html: def }}
                        />
                    ))}
                </ol>
            )}
        </>
    )
}

function renderCol(result: COBUILDColResult) {
    const [iSec] = useState('0')
    const curSection = result.sections[iSec as any]

    return (
        <div className="dictCOBUILD-ColEntry">
            <div className="dictionary">
                <div className="dc">
                    <div className="he">
                        <div className="page">
                            <div className="dictionary">
                                <div className="dictentry">
                                    <div className="dictlink">
                                        <div
                                            key={curSection as any}
                                            className={curSection.className}
                                            dangerouslySetInnerHTML={{ __html: curSection.content }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
