const Repository = require('./../../common/Repository');
const RecipeModel = require('./recipe.schema');

class RecipeRepository extends Repository {
	constructor() {
		super();
		this.model = RecipeModel;
	}
}

module.exports = new RecipeRepository();
