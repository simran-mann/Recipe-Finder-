class Recipe {
  constructor(id, name, ingredients, instructions, saved) {
    this.id = id;
    this.name = name;
    this.ingredients = ingredients;
    this.instructions = instructions;
    this.shown = false; 
    this.saved = saved; 

  }
}
const searchByNameBtn = document.getElementById('searchByNameBtn');
const searchByIngredientsBtn = document.getElementById('searchByIngredientsBtn');
const browseRandomBtn = document.getElementById('browseRandomBtn');
const viewSavedBtn = document.getElementById('viewSavedBtn');
const recipeResults = document.getElementById('recipeResults');
const recipeDetails = document.getElementById('recipeDetails');

let displayedRecipeId;


function toggleRecipeSaved(recipeId) {
  console.log("Toggle function called with recipeId:", recipeId);
  const recipeIndex = recipes.findIndex(recipe => recipe.id === recipeId);
  console.log("Recipe index:", recipeIndex);
  if (recipeIndex !== -1) {

      recipes[recipeIndex].saved = !recipes[recipeIndex].saved;
      console.log("Recipe saved status:", recipes[recipeIndex].saved);
      console.log("Saved recipes:", recipes.filter(recipe => recipe.saved));
  } else {
      console.error("Recipe not found with ID:", recipeId);
  }
}

function updateSaveButtonUI(saveButton, isSaved) {
  saveButton.textContent = isSaved ? 'Unsave' : 'Save';
}


//stores recipes shown on the screen
let recipes = []; 

recipeResults.addEventListener('click', (event) => {
  const saveButton = event.target.closest('.save-button');
  if (saveButton) {
      const recipeContainer = saveButton.closest('.recipe');
      const recipeId = recipeContainer.querySelector('h3').dataset.recipeId;
      if (recipeId) {
          const isSaved = recipeContainer.classList.toggle('saved'); 
          toggleRecipeSaved(recipeId);
          updateSaveButtonUI(saveButton, isSaved);
      } else {
          console.error("recipe not found ");
  }
}});


searchByNameBtn.addEventListener('click', () => {
    clearRecipeResults();
    const query = prompt('Enter a recipe name:');
    if (query) {
        searchRecipesByName(query);
    }
});



viewSavedBtn.addEventListener('click', () => {
  console.log('View Saved button clicked');
  const savedRecipes = recipes.filter(recipe => recipe.saved);
  console.log("Svae recipes are", savedRecipes);
  displaySavedRecipes(savedRecipes); 
});


function displaySavedRecipes(savedRecipes) {
  recipeResults.innerHTML = ''; 

  savedRecipes.forEach(recipe => {

      const recipeContainer = document.createElement('div');
      recipeContainer.classList.add('recipe');

      const recipeTitle = document.createElement('h3');
      recipeTitle.textContent = recipe.name;
      recipeTitle.dataset.recipeId = recipe.id; 
      recipeTitle.style.cursor = 'pointer';
      recipeTitle.addEventListener('click', () => {
          handleRecipeClick(recipe.id);
      });
      recipeContainer.appendChild(recipeTitle);


      const saveButton = document.createElement('button');
      saveButton.textContent = recipe.saved ? 'Unsave' : 'Save';
      saveButton.classList.add('save-button');
      saveButton.addEventListener('click', () => {
          toggleRecipeSaved(recipe.id);
          updateSaveButtonUI(saveButton, !recipe.saved);
      });
      recipeContainer.appendChild(saveButton);


      const recipeDetailsContainer = document.createElement('div');
      recipeDetailsContainer.classList.add('recipe-details-container');
      recipeContainer.appendChild(recipeDetailsContainer);

      recipeResults.appendChild(recipeContainer);
  });
}




browseRandomBtn.addEventListener('click', () => {
    clearRecipeResults();
    getRandomRecipes();
});


function clearRecipeResults() {
    recipeResults.innerHTML = '';
    recipeDetails.innerHTML = '';
}

function getRecipes(url, numberOfRecipes) {
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network error');
            }
            return response.json();
        })
        .then(data => {
            if (data.meals) {
                return data.meals.slice(0, numberOfRecipes);
            } else {
                throw new Error('No recipes found');
            }
        });
}

function fetchRecipes(url, numberOfRecipes = 1) {
    const promises = Array.from({ length: numberOfRecipes }, () => getRecipes(url, 1));
    return Promise.all(promises)
        .then(results => results.flat())
        .catch(error => {
            console.error('Error fetching recipes:', error);
            return [];
        });
}

function searchRecipesByName(name) {
    const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`;
    fetchRecipes(url)
        .then(meals => displayRecipes(meals))
        .catch(error => console.error('Error searching recipes by name:', error));
}

function getRandomRecipes() {
    const url = 'https://www.themealdb.com/api/json/v1/1/random.php';
    const numberOfRecipes = 5;
    fetchRecipes(url, numberOfRecipes)
        .then(meals => displayRecipes(meals))
        .catch(error => console.error('Error fetching random recipes:', error));
}

searchByIngredientsBtn.addEventListener('click', () => {
    clearRecipeResults();
    const ingredients = prompt('Enter ingredients separated by commas:');
    if (ingredients) {
        searchRecipesByIngredients(ingredients);
    }
});

function searchRecipesByIngredients(ingredients) {
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredients}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network error');
            }
            return response.json();
        })
        .then(data => {
            if (data.meals) {
                displayRecipes(data.meals);
            } else {
                recipeResults.textContent = 'No recipes found';
            }
        })
        .catch(error => {
            console.error('Error with the fetch operation:', error);
        });
}



function displayRecipes(meals) {

  recipeResults.innerHTML = '';


  meals.forEach(meal => {

    const index = recipes.findIndex(recipe => recipe.id === meal.idMeal);
    let recipe ; 

    //getElementById.meal.idMeal; 
    if (index==-1){
      recipe = new Recipe(meal.idMeal, meal.strMeal, [], meal.strInstructions, meal.saved);
    }else{
      recipe = recipes[index];
    }


      recipes.push(recipe);

      const mealContainer = document.createElement('div');
      mealContainer.classList.add('recipe'); 

      const mealTitle = document.createElement('h3');
      mealTitle.textContent = meal.strMeal;
      mealTitle.style.cursor = 'pointer';
      mealTitle.dataset.recipeId = meal.idMeal; 
      mealTitle.addEventListener('click', () => {
          handleRecipeClick(meal.idMeal);
      });
      mealContainer.appendChild(mealTitle);
      console.log(mealContainer);


      const saveButton = document.createElement('button');
      updateSaveButtonUI(saveButton, recipe.saved);
      saveButton.classList.add('save-button');
      mealContainer.appendChild(saveButton);


      const recipeDetailsContainer = document.createElement('div');
      recipeDetailsContainer.classList.add('recipe-details-container');
      mealContainer.appendChild(recipeDetailsContainer);

      recipeResults.appendChild(mealContainer);
  });
}


function handleRecipeClick(recipeId) {
    for (const recipe of recipes){
      recipe.shown = false;
    }
    const clickedRecipe = document.querySelector(`[data-recipe-id="${recipeId}"]`);
    console.log('Clicked Recipe:', clickedRecipe);

    if (!clickedRecipe) {
        console.error('Clicked recipe element not found');
        return;
    }


    const recipeIndex = recipes.findIndex(recipe => recipe.id === recipeId);
    if (recipeIndex !== -1 && recipes[recipeIndex].shown) {
        console.log('Recipe already displayed');
        return;
    }

    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network error');
            }
            return response.json();
        })
        .then(data => {
            if (data.meals) {
                const recipe = data.meals[0];
                const recipeDetailsContainer = document.createElement('div');
                recipeDetailsContainer.classList.add('recipe-details-container');
                recipeDetailsContainer.dataset.recipeId = recipeId;

                const recipeIngredients = document.createElement('ul');
                for (let i = 1; i <= 20; i++) {
                    const ingredient = recipe[`strIngredient${i}`];
                    const measure = recipe[`strMeasure${i}`];
                    if (ingredient && measure) {
                        const ingredientItem = document.createElement('li');
                        ingredientItem.textContent = `${ingredient} - ${measure}`;
                        recipeIngredients.appendChild(ingredientItem);
                    }
                }
                recipeDetailsContainer.appendChild(recipeIngredients);

                const recipeInstructions = document.createElement('p');
                recipeInstructions.textContent = recipe.strInstructions;
                recipeDetailsContainer.appendChild(recipeInstructions);

                const existingRecipeDetailsContainer = document.querySelector('.recipe-details-container');
                if (existingRecipeDetailsContainer) {
                    existingRecipeDetailsContainer.remove();
                }

                clickedRecipe.parentNode.insertBefore(recipeDetailsContainer, clickedRecipe.nextSibling);


                if (recipeIndex !== -1) {
                    recipes[recipeIndex].shown = true;
                }
            } else {
                console.log('Recipe details not found');
            }
        })
        .catch(error => {
            console.error('Error fetching recipe details:', error);
        });
}
