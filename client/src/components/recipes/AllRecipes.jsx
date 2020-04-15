import React, {useEffect, useState} from 'react';
import {Link, useHistory, Redirect} from 'react-router-dom';

import styled from 'styled-components';

import {AsyncTypeahead} from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';

import API from '../../utils/api';

import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Badge from 'react-bootstrap/Badge';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';
import DeleteButton from '../DeleteButton';
import EditButton from '../EditButton';
import LikeButton from '../LikeButton';

const StyledCard = styled(Card)`
  height: 100%;
  img {
    transition: all 0.3s ease;
    filter: brightness(1);
  }
  :hover {
    .card-img-top, .card-body {
      cursor: pointer;
    }
    
  }
  :hover img{
    filter: brightness(0.7);
  }
`;
const StyledCardImg = styled(Card.Img)`
  object-fit: cover;
  height: 200px;
`;
const StyledCardText = styled(Card.Text)`
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
`;

const AllRecipes = ({user, onlyMy, liked}) => {
  const [recipes, setRecipes] = useState([]);
  const [categoriesOptions, setCategoriesOptions] = useState([]);
  const [categoriesSelected, setCategoriesSelected] = useState(
    !!localStorage.getItem('selectedCategories') ? JSON.parse(
      localStorage.getItem('selectedCategories')) : []);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [searchText, setSearchText] = useState(
    localStorage.getItem('searchText') || '');
  const [fetchErrorMessage, setFetchErrorMessage] = useState('');
  const [recipesLoading, setRecipesLoading] = useState(false);
  const [sortAsc, setSortAsc] = useState(!!localStorage.getItem('sortAsc'));

  const history = useHistory();

  const filterByCategories = (recipes) => {
    if (!categoriesSelected.length) {
      return recipes;
    }
    return recipes.filter(
      recipe => categoriesSelected.includes(recipe.category));
  };

  const searchByName = (recipes) => {
    if (!searchText) {
      return recipes;
    }
    return recipes.filter(
      recipe => recipe.title.toLowerCase().includes(searchText.toLowerCase()));
  };

  const sortByDate = (recipes) => {
    return recipes.sort((a, b) => {
      return sortAsc ? a.createdAt - b.createdAt : b.createdAt -
        a.createdAt;
    });
  };

  const filterAndSortRecipes = (recipes) => {
    let res = sortByDate(searchByName(filterByCategories(recipes)));
    if (onlyMy && user) {
      return res.filter(el => el.user_id === user._id)
    }
    if (liked && user) {
      return res.filter(el => el.user_likes_arr.includes(user._id))
    }
    return res;
  };

  useEffect(() => {
    setRecipesLoading(true);
    API.get(`recipes`)
    .then(res => {
      setFetchErrorMessage('');
      const recipes = res.data;
      setRecipes(recipes);
      setRecipesLoading(false);
    })
    .catch(error => {
      setFetchErrorMessage('Failed to fetch recipes.');
      console.log(error);
      setRecipesLoading(false);
    });
  }, []);

  const updateRecipes = () => {
    API.get(`recipes`)
    .then(res => {
      setFetchErrorMessage('');
      const recipes = res.data;
      setRecipes(recipes);
      setRecipesLoading(false);
    })
    .catch(error => {
      setFetchErrorMessage('Failed to fetch recipes.');
      console.log(error);
      setRecipesLoading(false);
    });
  };

  const handleCategoriesSearch = () => {
    setCategoriesLoading(true);
    API.get(`recipes`)
      .then(res => {
        const categories = [
          ...new Set(res.data.map(recipe => recipe.category))];
        setCategoriesOptions(categories);
        setCategoriesLoading(false);
      })
      .catch(error => {
        console.log(error);
        setCategoriesLoading(false);
      });
  };

  const handleDelete = (id) => {
    API.delete(`recipes/${id}`)
      .then(res => {
        updateRecipes();
      })
      .catch(error => {
        console.log(error);
      });
  };

  const onSelectedCategoriesChange = (selected) => {
    setCategoriesSelected(selected);
    localStorage.setItem('selectedCategories', JSON.stringify(selected));
  };

  const onSearchInputChange = (e) => {
    setSearchText(e.target.value);
    localStorage.setItem('searchText', e.target.value);
  };

  const onSortOrderChange = () => {
    const newSortAsc = !sortAsc;
    setSortAsc(newSortAsc);
    localStorage.setItem('sortAsc', newSortAsc ? 'true' : '');
  };

  const likeHandle = (recipe) => {
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
      updateRecipes();
    }, (error) => {

    });
  };

  let title = "";
  if (liked) {
    title = "Liked recipes"
  } else if (onlyMy) {
    title = "My recipes"
  } else {
    title = "All recipes"
  }
  return (
    <Container className="pt-3">
      <h1 className="pb-3">{title}</h1>
      <Row>
        <Col md={6} className="mb-3">
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text>Search by name:</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl value={searchText} onChange={onSearchInputChange}/>
          </InputGroup>
        </Col>
        <Col md={6} className="mb-3">
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text>Filter by categories:</InputGroup.Text>
            </InputGroup.Prepend>
            <AsyncTypeahead
              isLoading={categoriesLoading}
              minLength={1}
              clearButton
              onChange={selected => onSelectedCategoriesChange(selected)}
              selected={categoriesSelected}
              id="categories-filter"
              labelKey="categories"
              onSearch={handleCategoriesSearch}
              multiple
              options={categoriesOptions}
            />
          </InputGroup>
        </Col>
      </Row>
      <div className="d-flex justify-content-between">
        <Button onClick={onSortOrderChange} className="mb-3"
                variant="secondary">
          Sort by date
          {sortAsc ?
            <span className="material-icons align-bottom">arrow_drop_up</span>
            :
            <span className="material-icons align-bottom">arrow_drop_down</span>
          }
        </Button>
        {user &&
          <Button as={Link} to='/add' className="mb-3" variant="success">
            Add new <span className="material-icons align-bottom pb-0">add</span>
          </Button>
        }
      </div>
      <Row>
        {recipesLoading ?
          <Spinner className="mx-auto mt-5" animation="border"/>
          :
          (
            !!fetchErrorMessage.length ?
              <Col className="mx-auto">
                <Alert variant="danger">
                  {fetchErrorMessage}
                </Alert>
              </Col>
              :
              filterAndSortRecipes(recipes).map(recipe => (
                <Col key={recipe._id} md={6} lg={4} className="mb-4">
                  <StyledCard>
                    <StyledCardImg
                      onClick={() => history.push('/recipes/' + recipe._id)}
                      variant="top" src="https://source.unsplash.com/random"/>
                    <Card.Body
                      onClick={() => history.push('/recipes/' + recipe._id)}>
                      <Card.Title>
                        <span className="mr-2">
                        {recipe.title}
                        </span>
                        <Badge className="d-inline-block text-truncate" style={{maxWidth: "95%"}} pill variant="secondary">{recipe.category}</Badge>
                      </Card.Title>
                      <StyledCardText>{recipe.shortDesc}</StyledCardText>
                    </Card.Body>
                    <Card.Footer className="d-flex justify-content-between">
                      <span>
                        <small>
                          <time
                            dateTime={new Date(
                              parseInt(recipe.createdAt)).toLocaleDateString()}
                            className="text-muted">
                          {new Date(parseInt(recipe.createdAt)).toLocaleDateString()}
                          </time>
                        </small>
                      </span>
                      <div className="d-flex">
                        <p className="d-flex justify-content-end m-0">
                          {recipe.user_likes_arr.length}
                          <LikeButton active={user && recipe.user_likes_arr.includes(user._id)} onClick={
                            user && (() => likeHandle(recipe))
                          }/>
                        </p>
                        {user && (user._id === recipe.user_id) &&
                          <>
                            <EditButton as={Link} to={"edit/"+recipe._id}/>
                            <DeleteButton onClick={() => {
                              handleDelete(recipe._id)
                            }}/>
                          </>
                        }
                      </div>
                    </Card.Footer>
                  </StyledCard>
                </Col>
              )
            )
          )
        }
      </Row>
    </Container>
  );
};

export default AllRecipes;
