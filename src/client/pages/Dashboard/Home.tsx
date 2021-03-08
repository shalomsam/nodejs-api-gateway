import React, { Dispatch } from 'react';
import { RootState } from '../../helpers';
import { connect } from 'react-redux';
import { Page, PageProps } from '../../components/Page';
import ClientList from '../../components/ClientList';
import { ClientState } from '../../reducers/client.reducer';
import clientActions from '../../actions/client.actions';
import DashboardLayout from '../../components/Page/layouts/DashboardLayout';
import { AuthState } from '../../reducers/auth.reducer';

interface HomeProps extends PageProps  {
    clients: ClientState;
    authenication: AuthState;
    getClients: () => void;
}

export class Home extends Page<HomeProps> {

    componentDidMount() {
        this.props.getClients();
    }

    public title = () => {
        return 'Dashboard: Home';
    }

    public withLayout = (content: JSX.Element) => {
        return <DashboardLayout {...this.props}>{content}</DashboardLayout>
    }

    public renderContent = () => {
        const { clients } = this.props;
        return (
            <div className="container-fluid">
                {clients?.isLoading && <em>Loading Clients...</em>}
                {clients?.error && <span className="text-danger">ERROR: {clients?.error?.message}</span>}
                {!clients?.isLoading && !clients?.error && (
                    <ClientList list={clients?.list} />   
                )}
            </div>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    return {
        authentication: state.authentication,
        clients: state.clients,
    }
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
    return {
        getClients: () => dispatch(clientActions.getAll()),
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Home);
