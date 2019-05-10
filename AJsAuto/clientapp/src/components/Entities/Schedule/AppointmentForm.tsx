import React from 'react';
import FormHelper from '../../FormHeplpers/FormHelpers'
import { ToastsStore } from 'react-toasts';
import App from '../../../App'
import {
  Col, Form,
  FormGroup, Label,
  Button, Row, Input 
} from 'reactstrap';

interface IProps {
  onCloseModal: any,
  loadData: any,
}


export default class AppointmentForm extends React.Component<IProps> {
  [x: string]: any;
 state: {
  Appointments: [],
  loading: true,
   items: any[],
   serviceItems: any[]
   appointmentDate: string,
   appointmentTime: string,
};
  constructor(props: IProps) {
    super(props);
    this.state = {
      Appointments: [],
      loading: true,
      items: [],
      serviceItems: [],
      appointmentDate: '',
      appointmentTime: '',
    };

    this.handleItems = this.handleItems.bind(this);
    this.handleAppointmentDate = this.handleAppointmentDate.bind(this)
    this.handleAppointmentTime = this.handleAppointmentTime.bind(this)
    this.loadServiceItems();
  };

  handleItems(event: { target: { value: string; }; }) {
    switch (event.target.value) {
      case "Breaks fluid":
        this.state.items.push(event.target.value);
        break;
      case "Engine Oil":
        this.state.items.push(event.target.value);
        break;
    }
  }

  handleAppointmentDate(event: { target: { value: string; }; }) {
    this.setState({
      appointmentDate: event.target.value,
    })
  }

  handleAppointmentTime(event: { target: { value: string; }; }) {
    this.setState({
      appointmentTime: event.target.value,
    })
  }

  loadServiceItems = () => {
    fetch('api/ServiceItems')
    .then(response => response.json())
    .then(data => {
      this.setState({ serviceItems: data, loading: false });
    });
  }

  SaveNotification() {
    ToastsStore.success("Record Saved")
  }

  submitForm = () => {
    fetch('api/Appointments', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: this.state.items,
        date: this.state.appointmentDate,
        timeIn: this.state.appointmentTime
      })
    })
    .then((data) => {
      data.json().then(data => {
      fetch('api/AppointmentItems', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Date: '2019-03-23',
          Items: this.state.items,
          AppointmentId: data,
        })
      })
      .then(() => {
        this.props.onCloseModal();
        this.SaveNotification();
        this.props.loadData();
      })
      });
    });
  }

  RenderForm(Appointments: any) {
    return (
    <Form className="form-lg">
      <Row>
          <Col>
            <FormGroup>
              <Label>Service :</Label>
            </FormGroup>
          </Col>
          {this.state.serviceItems.map((row, i) => {
            return(
            <Col>
              <FormGroup>
                <Input
                  type="checkbox"
                  value={row.name}
                  onChange={this.handleItems}
                /> {row.name}
            </FormGroup>
            </Col>
          )})}
        </Row>
        <hr />
      <Row>
        <Col>
          <Label>Date:</Label>
          <FormGroup>
            <Input
                type="date"
                value={this.state.appointmentDate}
                onChange={this.handleAppointmentDate}
            />
          </FormGroup>
        </Col>
        <Col>
          <Label>Time:</Label>
          <FormGroup>
            <Input
              type="time"
              value={this.state.appointmentTime}
              onChange={this.handleAppointmentTime}
            />
          </FormGroup>
          </Col>
        </Row>
        <br />
      <Row>
          <Col>
            <Button onClick={this.submitForm}> Save </Button>&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;
          <Button onClick={this.props.onCloseModal}> Cancel </Button>
        </Col>
      </Row>
      </Form>
    );
  }

  render() {
    let contents = this.RenderForm(this.state.Appointments);
    return (
      <div>
        {contents}
      </div>
    )
  }
}