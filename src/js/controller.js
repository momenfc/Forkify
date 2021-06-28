import 'core-js/stable';
import 'regenerator-runtime/runtime';
import {CLOSE_UPLOAD_WINDOW_SEC} from './config.js';
import AddRecipeView from './views/AddRecipeView.js';
import * as model from './model.js';
import BookmarkView from './views/BookmarkView.js';
import PaginationView from './views/PaginationView.js';
import recipeVeiw from './views/RecipeVeiw.js';
import ResultsView from './views/ResultsView.js';
import SearchView from './views/SearchView.js';

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeVeiw.renderSpinner();
    ResultsView.updata(model.recipeToShow());
    await model.loadRecipe(id);
    recipeVeiw.render(model.state.recipe);
    BookmarkView.updata(model.state.bookmark);
  } catch (err) {
    recipeVeiw.errorRender();
  }
};

const controlBookmark = function () {
  if (!model.state.recipe.bookmark) {
    model.addBookmark(model.state.recipe);
  } else {
    model.deleteBookmark(model.state.recipe.id);
  }
  recipeVeiw.updata(model.state.recipe);
  BookmarkView.render(model.state.bookmark);
};

const ctrlBookmark = function () {
  BookmarkView.render(model.state.bookmark);
};

const getSearchResults = async function () {
  try {
    ResultsView.renderSpinner();
    const query = SearchView.getQuery();
    if (!query) return;

    await model.searchRecipe(query);
    ResultsView.render(model.recipeToShow());
    PaginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (page) {
  ResultsView.render(model.recipeToShow(page));
  PaginationView.render(model.state.search);
};

const controlServings = function (servings) {
  model.updataServings(servings);
  recipeVeiw.updata(model.state.recipe);
};

const controlAddRecipe = async function (newRecipe) {
  try{
    AddRecipeView.renderSpinner()
 await model.uploadRecipe(newRecipe);
  recipeVeiw.render(model.state.recipe);
  AddRecipeView.messageRender()
  BookmarkView.render(model.state.bookmark)
  setTimeout(function () { 
    AddRecipeView.closeWindow();
    AddRecipeView.render(model.state.recipe)
   },CLOSE_UPLOAD_WINDOW_SEC * 1000);
// change id in URL
window.history.pushState(null, '', `#${model.state.recipe.id}`)

  }catch(err){
    AddRecipeView.errorRender(err.message)
  }
};

function init() {
  recipeVeiw.addHandlerRender(controlRecipes);
  recipeVeiw.addHandlerServings(controlServings);
  recipeVeiw.addHandelerBookmark(controlBookmark);
  BookmarkView.addHandelerRender(ctrlBookmark);
  SearchView.addHandelerRender(getSearchResults);
  PaginationView.addHandelerRender(controlPagination);
  AddRecipeView.addHandelerAddRecipe(controlAddRecipe);
}

init();
