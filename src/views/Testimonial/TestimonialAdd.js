import React,{ Component }from 'react'
import {Link} from 'react-router-dom';
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
class TestimonialAdd extends Component {

  constructor(props){
    super(props)
    this.title = React.createRef(),
    this.description = React.createRef(),
    this.author = React.createRef(),
    
    this.state = {
      addTestimonial: {},
      validation:{
        title: {
          rules: {
            notEmpty: {
              message: 'Testimonial title can\'t be left blank',
              valid: false

            }
          },
          valid: null,
          message: ''
        },
        description:{
          rules: {
            notEmpty: {
              message: 'Testimonial description can\'t be left blank',
              valid: false
            }
          },
          valid: null,
          message: ''
        },
        author: {
          rules: {
            notEmpty: {
              message: 'redirectURL can\'t be left blank',
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
      let addTestimonial = this.state.validation;
      addTestimonial[field].valid = null;
      for(let fieldCheck in this.state.validation[field].rules){
        switch(fieldCheck){
          case 'notEmpty':
            if(lastValidFieldFlag === true && this[field].value.length === 0){
                lastValidFieldFlag = false;
                formSubmitFlag = false;
                addTestimonial[field].valid = false;
                addTestimonial[field].message = addTestimonial[field].rules[fieldCheck].message;

             }
            break;
          
        }
      }
      this.setState({ validation: addTestimonial});
    }
    if(formSubmitFlag){
      let addTestimonial = this.state.addTestimonial;
      addTestimonial.title = this.title.value;
      addTestimonial.description = this.description.value;
      addTestimonial.author = this.author.value;
      axios.post('/testimonial/newTestimonial', addTestimonial  ).then(result => {
        if(result.data.code == '200'){
          this.props.history.push('./Testimonial');
        }
      })
    }
  }


  render(){
    return (
      <div>
        <Card>
              <CardHeader>
                <strong>New Testimonial Form</strong>
                <Link to="/testimonial" className="btn btn-success btn-sm pull-right">Back</Link>
              </CardHeader>
              <CardBody>
                <Form action="" method="post" encType="multipart/form-data" className="form-horizontal">
                  
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="title">Title</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="text" invalid={this.state.validation.title.valid === false} innerRef={input => (this.title = input)} placeholder="Title" required/>
                      <FormFeedback invalid={this.state.validation.title.valid === false}>{this.state.validation.title.message}</FormFeedback>
                      
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="description">Description</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="textarea" invalid={this.state.validation.description.valid === false} innerRef={input => (this.description = input)} placeholder="Description" required/>
                      <FormFeedback invalid={this.state.validation.description.valid === false}>{this.state.validation.description.message}</FormFeedback>
                      
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="author">Author</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="text"  invalid={this.state.validation.author.valid === false} innerRef={input => (this.author = input)}  placeholder="Author" required/>
                      
                      <FormFeedback invalid={this.state.validation.author.valid === false}>{this.state.validation.author.message}</FormFeedback>
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

export default TestimonialAdd;
