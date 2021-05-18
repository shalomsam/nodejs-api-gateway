import React, { Dispatch } from 'react';
import { Page, PageProps, DashboardLayout } from '@node-api-gateway/ui';
import { Client, HttpStatus } from '@node-api-gateway/api-interfaces';
import { connect } from 'react-redux';
import ClientList from './ClientList';
import { RootState } from '../../store/store';
import { clientSelectors, getClients } from '../../store/features/client';

export type OwnProps = {
  clients: Client[],
  error: RootState['clients']['error'],
  status: RootState['clients']['status'],
};

export type StateProps = Pick<RootState, 'auth'> & {
  getAllClients: () => void;
};


export type HomeProps = OwnProps & StateProps; 

export class Home extends Page<HomeProps & PageProps> {

  componentDidMount() {
    const { status, clients, getAllClients } = this.props;
    if (status === HttpStatus.initial || clients.length === 0) {
      getAllClients();
    }
  }

  public title = () => {
    return 'Dashboard: Home';
  };

  public withLayout = (content: JSX.Element) => {
    const { auth } = this.props;
    // return content;
    return <DashboardLayout
        user={auth.identity}
      >
        {content}
      </DashboardLayout>
  };

  public renderContent = () => {
    const { clients, status, error } = this.props;
    return (
      <div className="container-fluid">
        {status === HttpStatus.success && <ClientList list={clients} />}
      </div>
    );
  };
}

const mapStateToProps = (state: RootState) => ({
  auth: state.auth,
  clients: clientSelectors.selectAll(state),
  error: state.clients.error,
  status: state.clients.status,
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  getAllClients: () => dispatch(getClients())
})

export default connect(mapStateToProps, mapDispatchToProps)(Home);
