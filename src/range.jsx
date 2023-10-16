'use client';

import { Label, RangeSlider } from 'flowbite-react';
import React, { useRef, useState } from 'react';

export default function RangeSliderElement({ dateValue, onDateChange, minYear, maxYear }) {
    const ref = useRef(null)
    let description = `Migrations until ${dateValue}`
    return (
        <div className="flex w-full	 flex-col gap-4">
            <div className='grid grid-cols-8 gap-4'>
                {/* <span className='col-span-2 my-6'>{minYear}</span> */}
                <div className='col-span-8'>
                    <div className="mb-1 block">
                        <Label
                            htmlFor="default-range"
                            value={description}
                        />
                    </div>
                    
                    <RangeSlider ref={ref} id="default-range" min={minYear} max={maxYear} value={dateValue} onChange={onDateChange} />
                </div>
                {/* <span className='col-span-2 my-6'>{maxYear}</span> */}
            </div>
        </div>
    )
}


