import { Ajax } from "./helpers.js";
import { API, COUNT_OF_RECIPE_TO_SHOW, KEY } from "./config.js";

export const state = {
  recipe: {},
  search: {
    results: [],
    query: "",
    page: 1,
    pagesCount: 0,
  },
  bookmark: [],
};

const createRecipeObject = function(data){
    const { recipe } = data.data;
  return{
      id: recipe.id,
      cookingTime: recipe.cooking_time,
      servings: recipe.servings,
      publisher: recipe.publisher,
      ingredients: recipe.ingredients,
      url: recipe.source_url,
      image: recipe.image_url,
      title: recipe.title,
      ...(recipe.key && {key: recipe.key}) 
    }
}

export const loadRecipe = async function (id) {
  try {
    // 1) get recipe from api
    const data = await Ajax(`${API}${id}?key=${KEY}`);
    state.recipe = createRecipeObject(data);

    if (state.bookmark.some((bookmark) => bookmark.id === id))
      state.recipe.bookmark = true;
    else state.recipe.bookmark = false;
  } catch (err) {
    throw err;
  }
};

export const searchRecipe = async function (recipe) {
  try {
    const searchResults = await Ajax(`${API}?search=${recipe}&key=${KEY}`);
    const { recipes } = searchResults.data;
    state.search.results = recipes.map(
      (recipe) =>
        (recipe = {
          id: recipe.id,
          title: recipe.title,
          image: recipe.image_url,
          publisher: recipe.publisher,
        })
    );
 
     state.search.query = recipe;
    state.search.page = 1;
  } catch (err) {
    throw err;
  }
};

export const recipeToShow = function (page = state.search.page) {
  state.search.page = page;
  const pagesCount = Math.ceil(
    state.search.results.length / COUNT_OF_RECIPE_TO_SHOW
  );
  state.search.pagesCount = pagesCount;
  let min, max;
  min = (page - 1) * COUNT_OF_RECIPE_TO_SHOW;
  max = page * COUNT_OF_RECIPE_TO_SHOW;
  return state.search.results.slice(min, max);
};

export const updataServings = function (newServing) {
  state.recipe.ingredients.forEach(
    (ing) =>
      (ing.quantity = (ing.quantity * newServing) / state.recipe.servings)
  );
  state.recipe.servings = newServing;
};

export const getLocalBookmark = function () {
  const storage = localStorage.getItem("bookmarks");
  if (storage) state.bookmark = JSON.parse(storage);
};

const persistBookmark = function () {
  localStorage.setItem("bookmarks", JSON.stringify(state.bookmark));
};

export const addBookmark = function (recipe) {
  state.bookmark.push(recipe);
  if(recipe.id === state.recipe.id) state.recipe.bookmark = true;

  persistBookmark();
};

export const deleteBookmark = function (id) {
  const index = state.bookmark.findIndex((book) => book.id === id);
  state.bookmark.splice(index, 1);
  state.recipe.bookmark = false;

  persistBookmark();
};

export const clearBookmark = function(){
  localStorage.clear('bookmarks')
}
// clearBookmark()

export const uploadRecipe = async function(newRecipe){
  try{
  const ingredients = Object.entries(newRecipe).filter(entry=>entry[0].startsWith('ingredient') && entry[1] !== '').map(ing=>{
    const ingArr = ing[1].replaceAll(' ', '').split(',');
    if(ingArr.length !== 3 ) throw new Error('Wrong ingredient format! please use the correct format :)');
const [quantity, unit, description] = ingArr
return {quantity: quantity ? +quantity : null, unit, description}
  });

const recipe = {
  title:newRecipe.title,
  source_url: newRecipe.sourceUrl,
  image_url : newRecipe.image,
  publisher: newRecipe.publisher,
  servings: +newRecipe.servings,
  cooking_time: +newRecipe.cookingTime,
  ingredients,
}
  const data = await Ajax(`${API}?key=${KEY}`, recipe)
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe)
   }catch(err){
    throw err
  }
}


export const init = function () {
  getLocalBookmark();
};
init();
