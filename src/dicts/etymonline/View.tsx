import React, { FC, useState } from 'react'
import { EtymonlineResult } from './index'
import { ViewPorps } from '../../interface/IDictResult'
import './style.scss'


export const DictEtymonline: FC<ViewPorps<EtymonlineResult>> = ({ result }) => (
    <ul className="dictEtymonline-List">
        {result.map(item => (
            <li key={item.title} className="dictEtymonline-Item">
                <h2 id={item.id} className="dictEtymonline-Title">
                    {item.href ? (
                        <a
                            href={item.href}
                            target="_blank"
                            rel="nofollow noopener noreferrer"
                        >
                            {item.title}
                        </a>
                    ) : (
                        item.title
                    )}
                </h2>
                <p
                    className="dictEtymonline-Def"
                    dangerouslySetInnerHTML={{ __html: item.def }}
                />
                {item.chart ? (
                    <img src={item.chart} alt={'Origin of ' + item.title} />
                ) : null}
            </li>
        ))}
    </ul>
)
