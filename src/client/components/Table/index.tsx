import { Client } from 'models/Client';
import React from 'react';


interface TableProps {
    columnHeaders: string[];
    contents?: any[];
    exclude?: string[];
    defaultMessage?: string;
}

const Table: React.FC<TableProps> = ({
    columnHeaders,
    contents = [],
    exclude = [],
    defaultMessage = 'No rows available'
}) => {

    const columnLength = columnHeaders.length;

    const titles = columnHeaders.map((title: string, i: number) => {
        return <th className='col' key={`${title}-${i}`}>{title}</th>;
    });

    let finalContent = contents.map((content: Client) => {
        return (
            <tr 
                key={content._id}
                className='d-flex'
            >
                {columnHeaders.map((prop: string, i: number) => {
                    const key = `${prop}-${i}`;
                    if (exclude.length && exclude.indexOf(prop) > -1) {
                        return <td key={key}>{content[prop]}</td>;
                    }

                    return <td className='col' key={key}>{content[prop]}</td>;
                })}
            </tr>
        )
    });

    const defaultContent = (
        <tr>
            <td colSpan={columnLength}>{defaultMessage}</td>
        </tr>
    );

    finalContent = contents.length === 0 ? defaultContent as any : finalContent;

    return (
        <div className='table-responsive'>
            <table className='table table-bordered my-4'>
                <thead>
                    <tr className='d-flex'>
                        {titles}
                    </tr>
                </thead>
                <tbody>
                    {finalContent}
                </tbody>
            </table>
        </div>
    )
}

export default Table;