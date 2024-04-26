
const ingredientInput = document.getElementById('ingredientInput');
const searchButton = document.getElementById('searchButton');
const recipeResults = document.getElementById('recipeResults');

searchButton.addEventListener('click', () => {
  const mealName = ingredientInput.value.trim();
  if (mealName) {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`)
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
  } else {
    recipeResults.textContent = 'Please enter a meal name';
  }
});

function displayRecipes(meals) {
  recipeResults.innerHTML = ''; 
  meals.forEach(meal => {
    const mealItem = document.createElement('div');
    const mealTitle = document.createElement('h3'); 
    mealTitle.textContent = meal.strMeal; 
    console.log('Recipe ID:', meal.idMeal);
    mealTitle.style.cursor = 'pointer'; 
    mealTitle.addEventListener('click', () => {
      handleRecipeClick(meal.idMeal); 
    });
    mealItem.appendChild(mealTitle); 

    recipeResults.appendChild(mealItem); 
  });
}


function handleRecipeClick(recipeId) {
  console.log('Fetching recipe details for recipe ID:', recipeId);

  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeId}`)
      .then(response => {
          if (!response.ok) {
              throw new Error('Network error');
          }
          return response.json();
      })
      .then(data => {
          if (data.meals) {
              displayRecipeDetails(data.meals[0]);
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
  console.log("Recipe details container:", recipeDetailsContainer); 
  recipeDetailsContainer.innerHTML = '';
  console.log("inside display recipe details");

  const recipeTitle = document.createElement('h2');
  recipeTitle.textContent = recipe.strMeal;
  console.log("Recipe title element:", recipeTitle); 
  recipeDetailsContainer.appendChild(recipeTitle);

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

const recipeList = document.getElementById('recipeList');
recipeList.addEventListener('click', event => {
  const clickedRecipeId = event.target.dataset.recipeId;
  if (clickedRecipeId) {
      handleRecipeClick(clickedRecipeId);
  }
});