import React, { Component } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import {
  Badge,
  Button,
  ButtonDropdown,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Collapse,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Fade,
  Form,
  FormGroup,
  FormText,
  FormFeedback,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Label,
  Row,
} from 'reactstrap';
// import PropTypes from 'prop-types';
class SubscriptionEdit extends Component {
  constructor(props){
    super(props);
    this.subscriptionName = React.createRef();
    this.description = React.createRef();
    this.price = React.createRef();
    this.totalTradePermitted = React.createRef();
    this.totalInventoryAllowed = React.createRef();
    this.timePeriod = React.createRef();
    let subscriptionId = this.props.match.params.id;
    this.state = {
      editSubscription: {},
      subscriptionId: subscriptionId,
      validation:{
        subscriptionName:{
          rules: {
            notEmpty: {
              message: 'Subscription name field can\'t be left blank',
              valid: false
            }
          },
          valid: null,
          message: ''
        },
        description:{
          rules: {
            notEmpty: {
              message: 'Description field can\'t be left blank',
              valid: false
            }
          },
          valid: null,
          message: ''
        },
        price: {
          rules: {
            notEmpty: {
              message: 'Price field can\'t be left blank',
              valid: false
            },
          },
          valid: null,
          message: ''
        },
        totalTradePermitted: {
          rules: {
            notEmpty: {
              message: 'Trade field can\'t be left blank',
              valid: false
            },
          },
          valid: null,
          message: ''
        },
        totalInventoryAllowed: {
          rules: {
            notEmpty: {
              message: 'Inventory field can\'t be left blank',
              valid: false
            },
          },
          valid: null,
          message: ''
        },
      }
    };
  }
  cancelHandler(){
    this.props.history.push("/subscriptions");
  }
  submitHandler(e){
      e.preventDefault();
      let formSubmitFlag = true;
      for (let field in this.state.validation) {
        let lastValidFieldFlag = true;
        let subscriptionAdd = this.state.validation;
        subscriptionAdd[field].valid = null;
        for(let fieldCheck in this.state.validation[field].rules){
          switch(fieldCheck){
            case 'notEmpty':
              if(lastValidFieldFlag === true && this[field].value.length === 0){
                  lastValidFieldFlag = false;
                  formSubmitFlag = false;
                  subscriptionAdd[field].valid = false;
                  subscriptionAdd[field].message = subscriptionAdd[field].rules[fieldCheck].message;

               }
              break;
          }
        }
        this.setState({ validation: subscriptionAdd});
      }

      if(formSubmitFlag){
        let editSubscription = this.state.editSubscription;
        editSubscription.subscriptionName = this.subscriptionName.value;
        editSubscription.description = this.description.value;
        editSubscription.price = this.price.value;
        editSubscription.totalTradePermitted = this.totalTradePermitted.value;
        editSubscription.totalInventoryAllowed = this.totalInventoryAllowed.value;
        editSubscription.timePeriod = this.timePeriod.value;
        console.log("editSubscription",editSubscription)
        axios.put('/subscription/updateSubscription', editSubscription).then(result => {
          if(result.data.code ===200){
              this.props.history.push("/subscriptions");
          }
        });
      }
  }

  componentDidMount() {
    //if(localStorage.getItem('jwtToken') != null)
      //axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
      axios.get('/subscription/viewSubscription/' + this.state.subscriptionId).then(result => {
       // console.log(result); 
         if(result.data.code === 200){
        //   //localStorage.setItem('jwtToken', result.data.result.accessToken);
           this.setState({ editSubscription: result.data.result});
          
           this.subscriptionName.value = result.data.result.subscriptionName;
           this.description.value = result.data.result.description;
           this.price.value = result.data.result.price;
           this.totalTradePermitted.value = result.data.result.totalTradePermitted;
           this.totalInventoryAllowed.value = result.data.result.totalInventoryAllowed;
           this.timePeriod.value = result.data.result.timePeriod;

        }
      })
      .catch((error) => {
        if(error.status === 401) {
          this.props.history.push("/login");
        }
      });

  }
  render() {
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12" sm="12">
            <Card>
              <CardHeader>
                <strong>Subscription</strong>
                <small> Edit</small>
              </CardHeader>
              <CardBody>
              
                <Row>
                  <Col xs="4" sm="12">
                    <FormGroup>
                      <Label >Subscription Name</Label>
                      <Input type="text" innerRef={input => (this.subscriptionName = input)}    />

                      {/* <FormFeedback invalid={this.state.validation.advertisementName.valid === false}>{this.state.validation.advertisementName.message}</FormFeedback> */}

                    </FormGroup>
                    </Col>
                    <Col xs="4" sm="12">
                    <FormGroup>
                      <Label htmlFor="middlename">Description</Label>
                      <Input type="text" innerRef={input => (this.description = input)}  />
                    </FormGroup>
                    </Col>
                    <Col xs="4" sm="12">
                    <FormGroup>
                      <Label htmlFor="lastname">Price</Label>
                      <Input type="number"   innerRef={input => (this.price = input)} required/>
                    </FormGroup>
                  </Col>
                  <Col xs="4" sm="12">
                    <FormGroup>
                    <Label htmlFor="username">Total Trade Permitted</Label>
                  <Input type="number" innerRef={input => (this.totalTradePermitted = input)} />
                    </FormGroup>
                  </Col>
                  <Col xs="4" sm="12">
                    <FormGroup>
                    <Label htmlFor="username">Total Inventory Allowed</Label>
                  <Input type="number" innerRef={input => (this.totalInventoryAllowed = input)} />
                    </FormGroup>
                  </Col>
                  <Col xs="4" sm="12">
                    <FormGroup>
                    <Label htmlFor="username">Time Period</Label>
                  <Input type="number" innerRef={input => (this.timePeriod = input)}  />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col xs="6" className="text-right">
                    <Button onClick={(e)=>this.submitHandler(e)} color="success" className="px-4">Submit</Button>
                  </Col>
                  <Col xs="6">
                    <Button onClick={()=>this.cancelHandler()} color="primary" className="px-4">Cancel</Button>
                  </Col>
                </Row>
               </CardBody>
            </Card>
          </Col>
        </Row>
        </div>
    );
  }
}
// ProjectItem.propTypes = {
//   project: PropTypes.object
// };
export default SubscriptionEdit;
