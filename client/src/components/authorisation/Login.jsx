import React, {useState} from 'react';
import { useFormik } from 'formik';

import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import { Redirect } from 'react-router-dom/';

import * as yup from 'yup';
import AUTH from '../../utils/auth';

const schema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().min(8).required()
});

const Login = ({user, login}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const {handleSubmit, handleChange, values, errors } = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: schema,
    onSubmit: values => {
      AUTH.post(`login`, {
        ...values
      })
      .then(res => {
        const {user, token} = res.data;
        login(user, token);
        setIsLoading(false);
      })
      .catch(error => {
        localStorage.setItem('jwt_token', '');
        setErrorMessage("Invalid Login or password.");
        setIsLoading(false);
      });
    },
  });

  return (
    user ?
      <Redirect to="/recipes"/>
        :
      <Container className="pt-5">
        <Row className="justify-content-center">
          <Col xs lg="4">
            <h3 className="text-center">Log in</h3>
            <Form className="mb-3" onSubmit={handleSubmit}>
              <Form.Group controlId="formGroupEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  name="email"
                  type="email"
                  placeholder="Enter email"
                  onChange={handleChange}
                  value={values.email}
                  isInvalid={!!errors.email}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="formGroupPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Password"
                  onChange={handleChange}
                  value={values.password}
                  isInvalid={!!errors.password}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.password}
                </Form.Control.Feedback>
              </Form.Group>
              <Button variant="primary" type="submit" disabled={!!isLoading}>
                {isLoading ? <Spinner animation="border" size="sm" /> : "Submit"}
              </Button>
            </Form>
            {errorMessage &&
              <Alert variant={"danger"}>
                {errorMessage}
              </Alert>
            }
          </Col>
        </Row>
      </Container>
  );
};

export default Login;
