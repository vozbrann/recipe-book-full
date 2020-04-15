import React, {useState} from 'react';
import Form from 'react-bootstrap/Form';
import API from '../../utils/api';

import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';

import {useHistory} from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import Row from 'react-bootstrap/Row';

const Add = ({user}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [longDescription, setLongDescription] = useState('');

  const [validated, setValidated] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [loadingError, setloadingError] = useState('');


  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleShortDescriptionChange = (e) => {
    setShortDescription(e.target.value);
  };

  const handleLongDescriptionChange = (e) => {
    setLongDescription(e.target.value);
  };

  const history = useHistory();

  const handleSubmit = (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    if (!form.checkValidity()) {

    } else {
      setIsLoading(true);
      API.post('recipes', {
        title,
        category,
        createdAt: "" + new Date().getTime(),
        shortDesc: shortDescription,
        longDesc: longDescription,
        user_id: user._id,
        user_likes_arr: []
      })
        .then((response) => {
          setloadingError('');
          history.goBack();
        }, (error) => {
          setloadingError('Failed to add recipe.');
          console.log(error);
          setIsLoading(false);
        });
    }

    setValidated(true);
  };

  return (
    <Container>
      <h2 className="text-center p-3">Add new recipe</h2>
      <Row>
        {isLoading ?
          <Spinner className="mx-auto mt-5" animation="border"/>
          :
          (
            !!loadingError.length &&
            <Col>
              <Alert variant="danger">
                {loadingError}
              </Alert>
              <Button onClick={history.goBack} variant="danger">
                Back
              </Button>
            </Col>
          )
        }
      </Row>
      {!loadingError.length && !isLoading &&
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Title</Form.Label>
          <Form.Control required minLength={3} type="text" value={title}
                        onChange={handleTitleChange}/>
          <Form.Control.Feedback type="invalid">
            Title is required (minLength = 3)
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group>
          <Form.Label>Category</Form.Label>
          <Form.Control required minLength={3} type="text" value={category}
                        onChange={handleCategoryChange}/>
          <Form.Control.Feedback type="invalid">
            Title is required (minLength = 3)
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group>
          <Form.Label>Short description</Form.Label>
          <Form.Control minLength={15} required
                        onChange={handleShortDescriptionChange}
                        value={shortDescription} as="textarea" rows="3"/>
          <Form.Control.Feedback type="invalid">
            Title is required (minLength = 15)
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group>
          <Form.Label>Directions</Form.Label>
          <Form.Control minLength={15} required
                        onChange={handleLongDescriptionChange}
                        value={longDescription} as="textarea" rows="6"/>
          <Form.Control.Feedback type="invalid">
            Title is required (minLength = 15)
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="text-center">
          <Button onClick={history.goBack} className="mx-3" variant="danger">
            Discard
          </Button>
          <Button className="mx-3" variant="primary" type="submit">
            Submit
          </Button>
        </Form.Group>
      </Form>}
    </Container>
  );
};

export default Add;
