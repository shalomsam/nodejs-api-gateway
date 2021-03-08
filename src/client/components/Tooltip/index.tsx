import React from 'react';
import './styles.css';

enum Direction {
    up = "up",
    down = "down",
    left = "left",
    right = "right"
}

interface TooltipProps {
    direction?: Direction;
    show?: boolean;
}

const Tooltip: React.FunctionComponent<TooltipProps> = ({
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

export default Tooltip;
