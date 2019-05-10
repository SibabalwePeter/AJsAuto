import React, { Component, StatelessComponent } from 'react';
import {
  Container,
  Button, Modal, ModalHeader,
  ModalBody, Table
} from 'reactstrap';
import { ToastsContainer, ToastsContainerPosition, ToastsStore } from 'react-toasts';
import AppointmentForm from './AppointmentForm';
import IUser from './../../../context/IUser';
import userContext from './../../../context/User';

interface IProps {
  currUser: any
}

export default class AppointmentList extends React.Component<IProps> {
    [x: string]: any;
  state = {
    schedules: [],
    open: false,
    loading: true,
  }

  notificationDOMRef: React.RefObject<{}>;
  Id!: any;

  constructor(props: any) {
    super(props);
    this.SaveNotification = this.SaveNotification.bind(this);
    this.DeleteNotification = this.DeleteNotification.bind(this);
    this.notificationDOMRef = React.createRef();
    this.state = {
      schedules: [],
      open: false,
      loading: true,
    }

    // Data
    this.loadData();
  }



  onOpenModal = () => {
    this.setState({ open: true });
  };

  onCloseModal = () => {
    this.setState({ open: false });
  };

  SaveNotification() {
    ToastsStore.success("Record Saved")
  }

  DeleteNotification() {
    ToastsStore.success("Record Delete")
  }

  loadData = () => {
    fetch('api/AppointmentItems')
      .then(response => response.json())
      .then(data => {
        this.setState({ schedules: data, loading: false });
      });
  };

  updateClient = (x: string) => {
    this.Id = x;
    this.setState({
      open: true,
      currentClient: x,
    });
    fetch('api/Clients/' + x, {
      method: 'GET',
    }).then(response =>
      response.json().then(json => { return json; })
    )
    .then((data) => {
      this.setState({
        name: data.name,
        surname: data.surname,
        cellphoneNumber: data.cellPhoneNumber,
        email: data.email,
        password: data.password,
        clientId: x,
      });
      this.Id = this.state;
    });
  }

  DeleteAppointment = (x: string) => {
    var clients = this.state;
    this.setState({
      clients: clients
    })

    fetch('api/Clients/' + x, {
      method: 'DELETE',
    }).then(response =>
      response.json().then(json => { return json; })
    )
      .then(() => {
        this.DeleteNotification();
      });
  }

  RenderTable(schedules: any[]) {
    return (
      <div className="col-md">
      <Table className='table table-striped'>
        <thead>
          <tr>
            <th>Client Name</th>
              <th>Engineer Name</th>
              <th>Items</th>
              <th>Date</th>
              <th>Time out</th>
              <th>Duration</th>
              <th>Number of Items</th>
          </tr>
        </thead>
        <tbody>
          {schedules.map((row, i) => {
            return (
            <tr key={i} >
              <td onClick={i => this.updateClient(row.duration)}>{row.clientname}</td>
              <td onClick={i => this.updateClient(row.clientId)}>{row.engineerName}</td>
              <td onClick={i => this.updateClient(row.clientId)}>{row.serviceItems}</td>
              <td onClick={i => this.updateClient(row.clientId)}>{row.date}</td>
              <td onClick={i => this.updateClient(row.clientId)}>Not done</td>
              <td onClick={i => this.updateClient(row.clientId)}>Not done</td>
              <td onClick={i => this.updateClient(row.clientId)}>{row.numberofItems}</td>
            </tr>)
          }
          )}
        </tbody>
        </Table>
        <Modal size='48' isOpen={this.state.open}  >
        <ModalHeader> Appointments Information</ModalHeader>
        <ModalBody>
            <Container>
              <AppointmentForm
                loadData={this.loadData.bind(this)}
                onCloseModal={this.onCloseModal.bind(this)}
              />
          </Container>
        </ModalBody>
        </Modal>
      </div>
    );
  }

  render() {
    let contents = !this.state.schedules
      ? <p><em>Loading...</em></p>
      : this.RenderTable(this.state.schedules);
    return (
    <div>
      <ToastsContainer store={ToastsStore}
        position={ToastsContainerPosition.TOP_RIGHT}
      />
      <h1>Appointments</h1>
      <br />
      <p>
        <Button className="btn btn-primary" type="button" onClick={this.onOpenModal}>New</Button>
      </p>
      {contents}
    </div>
    )
  }
}
