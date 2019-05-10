import React, { Component, Context, useContext } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import ClientList from './components/Entities/Client/ClientsList';
import { Container, Form, Col, FormGroup, Label, Input, Button, FormFeedback } from 'reactstrap';
import AppointmentList from './components/Entities/Schedule/AppointmentList';
import IUser from './context/IUser';
import userContext from './context/User'
import { any } from 'prop-types';

interface IState {
  openLogin: boolean,
  email: string,
  password: string,
  loading: boolean
  currentUser: string,
  // Validation
  usernameHasChanged: boolean,
  passwordHasChanged: boolean

};

interface IProps {
};

class App extends React.Component<IProps, IState> {
    [x: string]: any;


  constructor(props: IProps, ) {
    super(props);
    this.state = {
      openLogin: true,
      email: '',
      password: '',
      loading: false,
      currentUser: '',
      // Validation
      usernameHasChanged: false,
      passwordHasChanged: false
    };

    // bindings
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.CurrUser = this.CurrUser.bind(this);
  }

  handleEmailChange(event: { target: { value: any; }; }) {
    this.setState({
      email: event.target.value,
      usernameHasChanged: true,
    });
  }

  currentUser = () => {
    return this.state.email;
  }

  handlePasswordChange(event: { target: { value: any; }; }) {
    this.setState({
      password: event.target.value,
      passwordHasChanged: true,
    });
  }

  CloseLogin = () => {
    var payload = this.state;
    // Data
    fetch('https://localhost:44322/api/Clients/IsValidUser', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(
        payload)
    })
    .then(response => response.json())
    .then(data => {
      this.setState({
        loading: false,
      });
      if (data == true) this.setState({
        openLogin: false,
        password: payload.password,
        email: payload.email,
        currentUser: payload.email,
      });
    });
  };

  refreshPage() {
    window.location.reload();
    window.location.assign("https://localhost:44322");
  }

  CurrUser = () => {
    return this.state.email;
  }

  //////////
  Login() {
    if (this.state.openLogin) {
      return (
        <div>
          <Container>
            <h2>Sign In</h2>
            <Form className="form">
              <Col>
                <FormGroup>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    name="email"
                    id="exampleEmail"
                    placeholder="myemail@email.com"
                    value={this.state.email} onChange={this.handleEmailChange}
                    invalid={this.state.usernameHasChanged && this.state.email === ''} // improve validation
                  />
                  <FormFeedback invalid> Username is required. </FormFeedback>
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
                    value={this.state.password} onChange={this.handlePasswordChange}
                    invalid={this.state.passwordHasChanged && this.state.password === ''} // improve validation
                  />
                  <FormFeedback invalid> Password is required. </FormFeedback>
                </FormGroup>
                <Button onClick={this.CloseLogin}>Submit</Button>
              </Col>
            </Form>
          </Container>
        </div>
      );
    }
    else {
      let ClientTab = this.state.email == "sibabalwepeter2848@gmail.com" ? <li><Link to={'/ClientList'} className="nav-link">Clients</Link></li> : "";
      return (
      <userContext.Provider value={this.state.currentUser}>
        <Container>
          <Router>
            <div>
              <nav className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3">
                <ul className="navbar-nav">
                  <li><Link to={'/'} className="nav-link"> Home </Link></li>
                  { ClientTab }
                    <li><Link to={'/AppointmentList'} className="nav-link">Appointments</Link></li>
                    <li><Link to={'/'} className="nav-link" onClick={this.refreshPage}> Logout</Link></li>
                   
                </ul>
              </nav>
              <Switch>
                <Route exact path='/ClientList' component={ClientList} />
                <Route exact path='/AppointmentList' component={AppointmentList} />
              </Switch>
            </div>
          </Router>
        </Container>
      </userContext.Provider>
      );
    }
  }
  /////////////

  render() {
    return this.Login();
  }
}
export default App;