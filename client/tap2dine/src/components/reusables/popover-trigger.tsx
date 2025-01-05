import React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'

export default function PopTrigger({ children, label }: { children: React.ReactNode,label: string | React.ReactNode }) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" size={'sm'} className='p-0'>{label}</Button>
            </PopoverTrigger>
            <PopoverContent className="w-40 p-0" >
                {children}
            </PopoverContent>
        </Popover>
    )
}
