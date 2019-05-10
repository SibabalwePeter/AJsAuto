import React from 'react';
import { ToastsContainerPosition, ToastsStore } from 'react-toasts';
import {
    Col, Form,
    FormGroup, Label, Input,
    Button,

    FormFeedback
  } from 'reactstrap';
import { debug } from 'util';

interface IProps {
  name: string,
  surname: string,
  cellphoneNumber: string,
  email: string,
  password: string,
  clientId: string,
  onCloseModal: any,
  loadData: any,
}

interface IState {
  clients: string[],
  open: boolean,
  loading: boolean,
  name: string,
  surname: string,
  cellphoneNumber: string,
  email: string,
  password: string,
  clientId: string,
  value: string
  // Validation
  nameHasChanged: boolean,
  surnameHasChanged: boolean,
  cellphoneNumberHasChanged: boolean,
  emailHasChanged: boolean,
  passwordHasChanged: boolean,
}

export default class ClientForm extends React.Component<IProps,IState> {
    [x: string]: any;
  state: {
    clients: any[]; surnameHasChanged: boolean;
    nameHasChanged: boolean; open: boolean;
    loading: boolean; name: string; surname: string;
    cellphoneNumber: string; email: string;
    password: string; value: string; clientId: string;
    cellphoneNumberHasChanged: boolean, emailHasChanged: boolean,
    passwordHasChanged: boolean
  };

  constructor(props: IProps) {
    super(props);
    this.state = {
      clients: [],
      open: false,
      loading: true,
      name: '',
      surname: '',
      cellphoneNumber: '',
      email: '',
      password: '',
      value: '',
      clientId: '',
      // Validation
      nameHasChanged: false,
      surnameHasChanged: false,
      cellphoneNumberHasChanged: false,
      emailHasChanged: false,
      passwordHasChanged: false
    };

    // register the methods
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleSurnameChange = this.handleSurnameChange.bind(this);
    this.handleCellphoneNumberChange = this.handleCellphoneNumberChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
  };

  SaveNotification(x: string) {
    switch (x){
      case 'Successfully':
        ToastsStore.success("Record Saved")
        break;
      case 'Not successfully':
        ToastsStore.error("Client with the same email already exists")
        break;
      default:
    }
  }

  updateStateFromRowData() {
    this.setState({
      name: this.props.name,
      surname: this.props.surname,
      cellphoneNumber: this.props.cellphoneNumber,
      email: this.props.email,
      password: this.props.password,
    });
  }

  DeleteNotification() {
    ToastsStore.success("Record Delete");
  }

  submitForm = () => {
    if (this.props.clientId.length < 1) {
      if (this.state.name !== '' && this.state.surname !== '' && this.state.cellphoneNumber !== '' && this.state.email !== '' && this.state.password !== '') {
        if (this.props.clientId.length < 1) {
          fetch('api/Clients', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: this.state.name,
              surname: this.state.surname,
              cellphoneNumber: this.state.cellphoneNumber,
              email: this.state.email,
              password: this.state.password,
            })
          })
          .then((response) => {
            response.json().then(response => {
              if (response === 'Successfully') {
                this.props.onCloseModal();
                this.SaveNotification(response);
                this.props.loadData();
              }
              else {
                this.SaveNotification(response);
              }
            })
          })
        }
      }
    }
    else {
      fetch('api/Clients/' + this.props.clientId, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: this.state.name == '' ? this.props.name : this.state.name,
          surname: this.state.surname == '' ? this.props.surname : this.state.surname,
          cellphoneNumber: this.state.cellphoneNumber == '' ? this.props.cellphoneNumber : this.state.cellphoneNumber,
          email: this.state.email == '' ? this.props.email : this.state.email,
          password: this.state.password == '' ? this.props.password : this.state.password,
          clientId: this.props.clientId,
        })
      })
        .then(() => {
          this.props.onCloseModal();
          this.props.loadData();
          this.SaveNotification("Successfully");
        });
    }
  }

  updateClient = (x: string) => {
    this.setState({ open: true });
    fetch('api/Clients/' + x, {
      method: 'GET',
    }).then(response =>
    response.json().then(json => {
      this.setState({
        name: json.name,
        surname: json.surname,
        cellphoneNumber: json.cellPhoneNumber,
        email: json.email,
        password: json.password,
        clientId: x,
      });
      return json;
    })
    )
  }

  handleNameChange(event: { target: { value: string; }; }) {
    this.setState({
      name: event.target.value || this.props.name,
      nameHasChanged: true,
    })
  }

  handleSurnameChange(event: { target: { value: any; }; }) {
    this.setState({
      surname: event.target.value,
      surnameHasChanged: true
    });
  }

  handleCellphoneNumberChange(event: { target: { value: any; }; }) {
    this.setState({
      cellphoneNumber: event.target.value,
      cellphoneNumberHasChanged: true,
    });
  }

  handleEmailChange(event: { target: { value: any; }; }) {
    this.setState({
      email: event.target.value,
      emailHasChanged: true,
    });
  }

  handlePasswordChange(event: { target: { value: any; }; }) {
    this.setState({
      password: event.target.value,
      passwordHasChanged: true,
    });
  }

  RenderForm(clients: string[]){
      return(
    <Form className="form">
      <Col>
        <FormGroup>
          <Label>Name</Label>
          <Input
            type="text"
            name="name"
            id="name"
            placeholder="Sibabalwe"
                value={this.state.name || this.props.name} onChange={this.handleNameChange}
                invalid={this.state.nameHasChanged && this.state.name === ''} // improve validation
              />
              <FormFeedback invalid> Name is required. </FormFeedback>
        </FormGroup>
      </Col>
      <Col>
        <FormGroup>
          <Label>Surname</Label>
          <Input
            type="text"
            name="surname"
            id="surname"
            placeholder="Peter"
                value={this.state.surname || this.props.surname} onChange={this.handleSurnameChange}
                invalid={this.state.surnameHasChanged && this.state.surname === ''} // improve validation
              />
              <FormFeedback invalid> Surname is required. </FormFeedback>
        </FormGroup>
      </Col>
      <Col>
        <FormGroup>
          <Label>Cellphone Number</Label>
          <Input
            type="text"
            name="cellphoneNumber"
            id="cellphoneNumber"
            placeholder="071 909 2847"
                value={this.state.cellphoneNumber || this.props.cellphoneNumber} onChange={this.handleCellphoneNumberChange}
                invalid={this.state.cellphoneNumberHasChanged && this.state.cellphoneNumber === ''} // improve validation
          />
          <FormFeedback invalid> Cellphone Number is required. </FormFeedback>
        </FormGroup>
      </Col>
      <Col>
        <FormGroup>
          <Label>Email</Label>
          <Input
                type="email"
                name="email"
                id="exampleEmail"
                placeholder="myemail@email.com"
                value={this.state.email || this.props.email} onChange={this.handleEmailChange}
                invalid={this.state.emailHasChanged && this.state.email === ''} // improve validation
              />
              <FormFeedback invalid> Email is required. </FormFeedback>
        </FormGroup>
      </Col>
      <Col>
        <FormGroup>
          <Label for="examplePassword">Password</Label>
          <Input
            type="password"
            name="password"
            id="examplePassword"
            placeholder="********"
            value={this.state.password || this.props.name} onChange={this.handlePasswordChange}
            invalid={this.state.passwordHasChanged && this.state.password === ''} // improve validation
              />
              <FormFeedback invalid> Password is required. </FormFeedback>
        </FormGroup>
            <Button color="primary" onClick={this.submitForm}>Save</Button> &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
        <Button onClick={this.props.onCloseModal} color="secondary">Cancel</Button>
      </Col>
    </Form>
  );}

    render() {
        let contents = this.RenderForm(this.state.clients);
        return(
            <div>
            { contents }
            </div>
        )
    }
}