import { title } from 'errorhandler';
import React from 'react';
import { Helmet } from 'react-helmet';

type Meta = {[key: string]: string}[];
type Metas = Meta[];

export interface PageProps {
    title?: string;
    metas?: Metas;
    fullWidth?: boolean;
    fixedHeight?: number;
    children?: React.ReactChildren;
}

export class Page<P extends PageProps> extends React.Component<P, {}> {

    public title = () => {
        return this.props.title || "React App";
    }

    public createMetas = () => {
        let { metas } = this.props;
        metas = metas || [];

        return metas.map((metaArr: Meta) => {
            const combined = metaArr.reduce((prev, current) => Object.assign({}, prev, current));
            return <meta {...combined} />;
        });
    }

    public renderContent = () => {
        return (<div className="container-fluid">
            {this.props.children}
        </div>);
    }

    public withLayout = (content: JSX.Element) => {
        return (
            <>
                {content}
            </>
        )
    }

    render() {
        return (
            <>
                <Helmet>
                    {<title>{this.title()}</title>}
                    {this.createMetas()}
                </Helmet>
                {this.withLayout(this.renderContent())}
            </>
        )
    }
}
