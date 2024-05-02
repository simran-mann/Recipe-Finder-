const searchByNameBtn = document.getElementById('searchByNameBtn');
const searchByIngredientsBtn = document.getElementById('searchByIngredientsBtn');
const browseRandomBtn = document.getElementById('browseRandomBtn');
const viewSavedBtn = document.getElementById('viewSavedBtn');
const recipeResults = document.getElementById('recipeResults');
const recipeDetails = document.getElementById('recipeDetails');

let displayedRecipeId;


//event listener for search by name button 

searchByNameBtn.addEventListener('click', () => {
  //executes when the button is clicked 
    clearRecipeResults();
    const query = prompt('Enter a recipe name:');
    if (query) {
        searchRecipesByName(query);
    }
});

//event listener for browse random recipes button 
browseRandomBtn.addEventListener('click', () => {
    clearRecipeResults();
    getRandomRecipes();
});

//clears the results of all recipes being displayed 
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
    const mealContainer = document.createElement('div'); 
    const mealTitle = document.createElement('h3');
    mealTitle.textContent = meal.strMeal; 
    console.log('Recipe ID:', meal.idMeal);
    mealTitle.style.cursor = 'pointer'; 
    mealTitle.dataset.recipeId = meal.idMeal; 
    mealTitle.addEventListener('click', () => {
      handleRecipeClick(meal.idMeal); 
    });
    mealContainer.appendChild(mealTitle); 


    const recipeDetailsContainer = document.createElement('div');
    recipeDetailsContainer.classList.add('recipe-details-container');
    mealContainer.appendChild(recipeDetailsContainer); 

    recipeResults.appendChild(mealContainer); 
  });
}




function handleRecipeClick(recipeId) {
  const clickedRecipe = document.querySelector(`[data-recipe-id="${recipeId}"]`);
  console.log('Clicked Recipe:', clickedRecipe);
  
  if (!clickedRecipe) {
    console.error('Clicked recipe element not found');
    return;
  }


  if (displayedRecipeId === recipeId) {
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


        displayedRecipeId = recipeId;
      } else {
        console.log('Recipe details not found');
      }
    })
    .catch(error => {
      console.error('Error fetching recipe details:', error);
    });
}

function displayRecipeDetails(recipe) {
  const recipeDetailsContainer = document.getElementById('recipeDetails');

  recipeDetailsContainer.innerHTML = '';


  const recipeIngredients = document.createElement('ul');
  for (let i = 1; i <= 20; i++) {
      const ingredient = recipe[`strIngredient${i}`];
      const measure = recipe[`strMeasure${i}`];
      if (ingredient && measure) {
          const ingredientItem = document.createElement('li');
          ingredientItem.textContent = `${ingredient} - ${measure}`;
          console.log("Ingredient item:", ingredientItem); 
          recipeIngredients.appendChild(ingredientItem);
      }
  }
  console.log("Recipe ingredients list:", recipeIngredients); 
  recipeDetailsContainer.appendChild(recipeIngredients);

  const recipeInstructions = document.createElement('p');
  recipeInstructions.textContent = recipe.strInstructions;
  console.log("Recipe instructions paragraph:", recipeInstructions);
  recipeDetailsContainer.appendChild(recipeInstructions);
}

