import React, {useEffect, useState} from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import EditButton from '../EditButton';
import DeleteButton from '../DeleteButton';
import {Link, useHistory, useParams} from 'react-router-dom';
import API from '../../utils/api';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import LikeButton from '../LikeButton';

const OneRecipe = ({user}) => {
  const [recipe, setRecipe] = useState({});
  const [recipeIsLoading, setRecipeIsLoading] = useState(false);
  const [recipeLoadingErrorMessage, setRecipeLoadingErrorMessage] = useState('');

  let { id } = useParams();

  useEffect(() => {
    setRecipeIsLoading(true);
    API.get(`recipes/${id}`)
      .then(res => {
        const recipe = res.data;
        setRecipeLoadingErrorMessage("");
        setRecipe(recipe);
        setRecipeIsLoading(false);
      })
      .catch(error => {
        if(error.response) {
          setRecipeLoadingErrorMessage(error.response.statusText)
        } else {
          setRecipeLoadingErrorMessage("Oops, something went wrong");
        }
        setRecipeIsLoading(false);
      });
  }, [id]);

  const updateRecipe = () => {
    API.get(`recipes/${id}`)
    .then(res => {
      const recipe = res.data;
      setRecipeLoadingErrorMessage("");
      setRecipe(recipe);
      setRecipeIsLoading(false);
    })
    .catch(error => {
      if(error.response) {
        setRecipeLoadingErrorMessage(error.response.statusText)
      } else {
        setRecipeLoadingErrorMessage("Oops, something went wrong");
      }
      setRecipeIsLoading(false);
    });
  };

  const history = useHistory();
  const handleDelete = (id) => {
    API.delete(`recipes/${id}`)
      .then(res => {
        history.goBack();
      })
      .catch(error => {
        console.log(error);
      });
  };

  const likeHandle = (recipe) => {
    console.log("likeHandle");
    let newUser_likes_arr = recipe.user_likes_arr;
    if (newUser_likes_arr.includes(user._id)) {
      newUser_likes_arr = newUser_likes_arr.filter(el => el !== user._id);
    } else {
      newUser_likes_arr.push(user._id);
    }
    console.log(newUser_likes_arr);
    console.log(recipe._id);

    API.patch(`recipes/${recipe._id}`, {
      user_likes_arr: newUser_likes_arr,
    })
    .then((response) => {
      updateRecipe();
    }, (error) => {

    });
  };

  return (
    <Container className="pt-5">
      <Row>
        {recipeIsLoading ?
          <Spinner className="mx-auto mt-5" animation="border"/>
          :
          (
            !!recipeLoadingErrorMessage.length &&
              <Col>
                <Alert variant="danger">
                  {recipeLoadingErrorMessage}
                </Alert>
              </Col>
          )
        }
      </Row>

      {!recipeLoadingErrorMessage.length && !recipeIsLoading &&
        <Row>
          <Col md={8}>
            <Row>
              <Col>
                <h1 className="text-break">{recipe.title}</h1>
              </Col>
              <Col className="col-auto d-flex">
                <p className="d-flex justify-content-end m-0">
                  {recipe.user_likes_arr && recipe.user_likes_arr.length}
                  <LikeButton active={user && recipe.user_likes_arr && recipe.user_likes_arr.includes(user._id)} onClick={
                    user && (() => likeHandle(recipe))
                  }/>
                </p>
                {user && (user._id === recipe.user_id) &&
                  <>
                    <EditButton as={Link} to={"/edit/" + recipe._id}/>
                    < DeleteButton onClick={() => handleDelete(recipe._id)}/>
                  </>
                }
              </Col>
            </Row>
            <p className="font-italic text-break">"{recipe.shortDesc}"</p>
            <h4>Directions</h4>
            <p className="text-break">{recipe.longDesc}</p>
          </Col>
          <Col md={4}>
            <Image src="https://source.unsplash.com/random" rounded fluid/>
          </Col>
        </Row>
        }
    </Container>
  );
};

export default OneRecipe;
