import { Client } from 'models/Client';
import React from 'react';

interface filters {
    [key: string]: (value: any, key: string) => any; 
}

interface TableProps {
    columnHeaders: string[];
    contents?: any[];
    exclude?: string[];
    filters?: filters;
    defaultMessage?: string;
}

const Table: React.FC<TableProps> = ({
    columnHeaders,
    contents = [],
    exclude = [],
    filters,
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
                    let val = content[prop];

                    if (filters && filters?.[prop]) {
                        val = filters?.[prop](content[prop], prop);
                    }

                    if (exclude.length && exclude.indexOf(prop) > -1) {
                        return <td key={key}>{val}</td>;
                    }

                    return <td className='col' key={key}>{val}</td>;
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