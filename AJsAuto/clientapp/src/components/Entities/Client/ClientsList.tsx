import React, { Component, StatelessComponent } from 'react';
import {
    Container,
    Button, Modal, ModalHeader,
    ModalBody, Table
  } from 'reactstrap';
import ClientForm from './ClientForm';
import { ToastsContainer, ToastsContainerPosition, ToastsStore } from 'react-toasts';

export default class ClientList extends React.Component {
    [x: string]: any;
    state = {
        clients: [],
        open: false,
        loading: true,
        counter: 0,
        name: '',
        surname: '',
        cellphoneNumber: '',
        email: '',
        password: '',
        clientId: ''
      }

  notificationDOMRef: React.RefObject<{}>;
  Id!: any;

    constructor(props: any) {
      super(props);
        // this.SaveNotification = this.SaveNotification.bind(this);
        this.DeleteNotification = this.DeleteNotification.bind(this);
        this.notificationDOMRef = React.createRef();
        this.state = {
          clients: [],
          open: false,
          loading: true,
          counter: 0, 
          name: '',
          surname: '',
          cellphoneNumber: '',
          email: '',
          password: '',
          clientId:''
        }

        // Data
        this.loadData();
      }


    onOpenModal = () => {
        this.setState({ open: true });
    };

  onCloseModal = () => {
    this.setState({
      open: false,
       name: '',
      surname: '',
      cellphoneNumber: '',
      email: '',
      password: '',
    });
  };

      DeleteNotification() {
        ToastsStore.success("Record Delete")
      }

  loadData = () => {
    fetch('api/Clients')
      .then(response => response.json())
      .then(data => {
        this.setState({ clients: data, loading: false });
        
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

        console.log('Name from client List state: ' + data);
    });
  }

  DeleteClient = (x: string) => {
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
        this.loadData();
      });
  }

  RenderTable(clients: any[]){
    return (
      <div className="col-md-3">
        <Table className='table table-striped'>
      <thead>
          <tr>
            <th>Name</th>
            <th>Surname</th>
            <th>CellphoneNumber</th>
            <th>Email</th>
            <th>Password</th>
          </tr>
      </thead>
      <tbody>
          {clients.map((row, i) => {
            return (
            <tr key={i} >
              <td onClick={i => this.updateClient(row.clientId)}>{row.name}</td>
              <td onClick={i => this.updateClient(row.clientId)}>{row.surname}</td>
              <td onClick={i => this.updateClient(row.clientId)}>{row.cellPhoneNumber}</td>
              <td onClick={i => this.updateClient(row.clientId)}>{row.email}</td>
              <td onClick={i => this.updateClient(row.clientId)}>{row.password}</td>
              </tr>
            )}
          )}
            </tbody>
      <Modal isOpen={this.state.open}>
        <ModalHeader> Client Information</ModalHeader>
        <ModalBody>
          <Container>
            <ClientForm
              name={this.state.name}
              surname={this.state.surname}
              cellphoneNumber={this.state.cellphoneNumber}
              email={this.state.email}
              password={this.state.password}
              clientId={this.state.clientId}
              onCloseModal={this.onCloseModal.bind(this)}
              loadData={this.loadData.bind(this)}
            />
            </Container>
        </ModalBody>
      </Modal>
        </Table>
      </div>
    );
    } 

    render() {
        let contents = !this.state.clients
        ? <p><em>Loading...</em></p>
        : this.RenderTable(this.state.clients);
        return(
            <div>
            <ToastsContainer store={ToastsStore}
              position={ToastsContainerPosition.TOP_RIGHT}
            />
            <h1>Clients</h1>
            <br />
            <p>
              <Button className="btn btn-primary" type="button" onClick={this.onOpenModal}>New</Button>
            </p>

            {contents}
          </div>
        )
    }
}
