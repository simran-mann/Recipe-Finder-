const searchByNameBtn = document.getElementById('searchByNameBtn');
const searchByIngredientsBtn = document.getElementById('searchByIngredientsBtn');
const browseRandomBtn = document.getElementById('browseRandomBtn');
const viewSavedBtn = document.getElementById('viewSavedBtn');
const recipeResults = document.getElementById('recipeResults');
const recipeDetails = document.getElementById('recipeDetails');

let displayedRecipeId;


searchByNameBtn.addEventListener('click', () => {
    clearRecipeResults();
    const query = prompt('Enter a recipe name:');
    if (query) {
        searchRecipesByName(query);
    }
});

browseRandomBtn.addEventListener('click', () => {
    clearRecipeResults();
    getRandomRecipes();
});

function clearRecipeResults() {
    recipeResults.innerHTML = '';
    recipeDetails.innerHTML = '';
}

function searchRecipesByName(name) {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`)
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

function getRandomRecipes() {
    fetch('https://www.themealdb.com/api/json/v1/1/random.php')
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
                recipeResults.textContent = 'No random recipes found';
            }
        })
        .catch(error => {
            console.error('Error with the fetch operation:', error);
        });
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

