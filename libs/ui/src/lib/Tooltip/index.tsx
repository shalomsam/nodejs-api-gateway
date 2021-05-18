import React from 'react';
import './styles.module.scss';

export enum Direction {
    up = "up",
    down = "down",
    left = "left",
    right = "right"
}

export interface TooltipProps {
    direction?: Direction;
    show?: boolean;
}

export const Tooltip: React.FunctionComponent<TooltipProps> = ({
    direction = Direction.up,
    show = false,
    children,
}) => {
    return (
        <div className={`tooltip fade ${show ? 'show': ''}`}>
            <div className={`tooltip-arrow arrow-${direction}`}></div>
            <div className='tooltip-inner'>{children}</div>
        </div>
    );
}
