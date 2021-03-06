import React,{ Component }from 'react'
import axios from 'axios'
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
class DonationAdd extends Component {

  constructor(props){
    super(props)
    this.productName = React.createRef(),
    this.description = React.createRef(),
    this.productCategory = React.createRef(),
    this.userId = React.createRef(),
    this.size = React.createRef(),
    this.color = React.createRef(),
    this.brand = React.createRef(),
    this.productAge = React.createRef(),

    
    this.state = {
      donationadd: {},
      validation:{
        productName: {
          rules: {
            notEmpty: {
              message: 'Product name can\'t be left blank',
              valid: false

            }
          },
          valid: null,
          message: ''
        },
        description:{
          rules: {
            notEmpty: {
              message: 'Product description can\'t be left blank',
              valid: false
            }
          },
          valid: null,
          message: ''
        },
        size: {
          rules: {
            notEmpty: {
              message: 'size can\'t be left blank',
              valid: false
            }
          },
          valid: null,
          message: ''
        },
        color: {
          rules: {
            notEmpty: {
              message: 'Please provide a color for the product',
              valid: false
            }
          },
          valid: null,
          message: ''
        },
        brand: {
            rules: {
              notEmpty: {
                message: 'brand can\'t be left blank',
                valid: false
              }
            },
            valid: null,
            message: ''
          },
          productAge: {
           rules: {
              notEmpty: {
               message: 'Age can\'t be left blank',
                valid: false
              }
            },
            valid: null,
            message: ''
          },
      }
    } 
  }

  submitHandler(e){
    e.preventDefault()
    let formSubmitFlag = true;
    for (let field in this.state.validation) {
      let lastValidFieldFlag = true;
      let donationadd = this.state.validation;
      donationadd[field].valid = null;
      for(let fieldCheck in this.state.validation[field].rules){
        switch(fieldCheck){
          case 'notEmpty':
            if(lastValidFieldFlag === true && this[field].value.length === 0){
                lastValidFieldFlag = false;
                formSubmitFlag = false;
                donationadd[field].valid = false;
                donationadd[field].message = donationadd[field].rules[fieldCheck].message;

             }
            break;
          
        }
      }
      this.setState({ validation: donationadd});
    }
    if(formSubmitFlag){
      let donationadd = this.state.donationadd;
      donationadd.productName = this.productName.value;
      donationadd.description = this.description.value;
      donationadd.productCategory = this.productCategory.value;
      donationadd.userId = this.userId.value;
      donationadd.size = this.size.value;
      donationadd.color = this.color.value;
      donationadd.brand = this.brand.value;
      donationadd.productAge = this.productAge.value;

      axios.post('/donation/donate', donationadd).then(result => {
        if(result.data.code == '200'){
          this.props.history.push('./donations');
        }
      })
    }
  }


  render(){
    return (
      <div>
        <Card>
              <CardHeader>
                <strong>New Donation Form</strong>
              </CardHeader>
              <CardBody>
                <Form action="" method="post" encType="multipart/form-data" className="form-horizontal">
                  
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="advertisementName">Product Name</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="text" invalid={this.state.validation.productName.valid === false} innerRef={input => (this.productName = input)} placeholder="Product Name" />
                      <FormFeedback invalid={this.state.validation.productName.valid === false}>{this.state.validation.productName.message}</FormFeedback>
                      
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="description">Description</Label>
                    </Col>
                    <Col xs="12" md="9">
                    
                      <Input type="text" invalid={this.state.validation.description.valid === false} innerRef={input => (this.description = input)} placeholder="Description" />
                      <FormFeedback invalid={this.state.validation.description.valid === false}>{this.state.validation.description.message}</FormFeedback>
                      
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                  <Col md="3">
                  <Label htmlFor="category">Category</Label>
                  </Col>
                  <Col xs="12" md="9">
                    <select innerRef={select => (this.productCategory = select)} class="form-control" >
					                <option value="0">Please select</option>
					                <option value="1">Samsung</option>
					                <option value="2">Television</option>
					                <option value="3">Nokia</option>
                    </select> 
                  </Col>
                </FormGroup>
                 <FormGroup row>
                 <Col md="3">
                  <Label htmlFor="user">User</Label>
                  </Col>
                  <Col xs="12" md="9">
                   <select innerRef={input => (this.userId = input)} id="select" class="form-control" >
					  <option value="0">Please select</option>
					  <option value="1">JJ</option>
					  <option value="2">Dekwano</option>
					  <option value="3">Paul</option>
                  </select> 
                  </Col>
                </FormGroup>
                <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="Size">Size</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="text" invalid={this.state.validation.size.valid === false} innerRef={input => (this.size = input)} placeholder="Size" />
                      <FormFeedback invalid={this.state.validation.size.valid === false}>{this.state.validation.size.message}</FormFeedback>
                      
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="color">Color</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="text" invalid={this.state.validation.color.valid === false} innerRef={input => (this.color = input)} placeholder="Color" />
                      <FormFeedback invalid={this.state.validation.color.valid === false}>{this.state.validation.color.message}</FormFeedback>
                      
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="brand">Brand</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="text" invalid={this.state.validation.brand.valid === false} innerRef={input => (this.brand= input)} placeholder="Brand" />
                      <FormFeedback invalid={this.state.validation.brand.valid === false}>{this.state.validation.brand.message}</FormFeedback>
                      
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="productAge">Age</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="text" invalid={this.state.validation.productAge.valid === false} innerRef={input => (this.productAge = input)} placeholder="Age" />
                      <FormFeedback invalid={this.state.validation.productAge.valid === false}>{this.state.validation.productAge.message}</FormFeedback>
                      
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="Status">Status</Label>
                    </Col>
                    <Col xs="12" md="9">
                    <select innerRef={input => (this.status = input)} id="status" class="form-control" >
					  <option value="1">Active</option>
					  <option value="0">Inactive</option>					
                  </select>
                    </Col>
                  </FormGroup>
                
                    
                </Form>
              </CardBody>
              <CardFooter>
                <Button type="submit" size="sm" color="primary"  onClick={(e)=>this.submitHandler(e)}><i className="fa fa-dot-circle-o"></i> Submit</Button>
                <Button type="reset" size="sm" color="danger"><i className="fa fa-ban"></i> Reset</Button>
              </CardFooter>
            </Card>
        
      </div>
    )
  }

}

export default DonationAdd;
