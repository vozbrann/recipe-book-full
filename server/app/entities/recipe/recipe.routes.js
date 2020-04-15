const express = require('express');
const recipe = express.Router();
const recipeService = require('./recipe.service');

const auth = require('../../middleware/auth');

recipe.route('/')
	.get((req, res) => {
		recipeService.getAllRecipes()
			.then(recipes => {
				res.send(recipes);
			})
			.catch(err => {
				console.log(err);
			});
	})
	.post((req, res) => {
		recipeService.addRecipe(req.body)
			.then(recipe => {
				res.send(recipe);
			})
			.catch(err => {
				console.log(err);
			});
	});


recipe.route('/:id')
	.patch((req, res) => {
    recipeService.updateRecipe(req.params.id, req.body)
    .then(recipe => {
      res.send(recipe);
    })
    .catch(err => {
      console.log(err);
    });

	})
	.get((req, res) => {
		recipeService.getRecipeById(req.params.id)
			.then(recipe => {
				res.send(recipe);
			})
			.catch(err => {
				console.log(err);
			});
	})
	.delete((req, res) => {
		recipeService.deleteRecipe(req.params.id)
			.then(recipe => {
				res.send(recipe);
			})
			.catch(err => {
				console.log(err);
			});
	});

module.exports = recipe;
