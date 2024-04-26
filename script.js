
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

// function displayRecipes(meals) {
//   recipeResults.innerHTML = ''; 
//   meals.forEach(meal => {
//     const mealItem = document.createElement('div');
//     const mealTitle = document.createElement('h3'); 
//     mealTitle.textContent = meal.strMeal; 
//     console.log('Recipe ID:', meal.idMeal);
//     mealTitle.style.cursor = 'pointer'; 
//     mealTitle.addEventListener('click', () => {
//       handleRecipeClick(meal.idMeal); 
//     });
//     mealItem.appendChild(mealTitle); 

//     recipeResults.appendChild(mealItem); 
//   });
// }
function displayRecipes(meals) {
  recipeResults.innerHTML = ''; 
  meals.forEach(meal => {
    const mealItem = document.createElement('div');
    const mealTitle = document.createElement('h3'); 
    mealTitle.textContent = meal.strMeal; 
    mealTitle.dataset.recipeId = meal.idMeal; 
    mealTitle.style.cursor = 'pointer'; 
    mealTitle.addEventListener('click', () => {
      handleRecipeClick(meal.idMeal); 
    });
    mealItem.appendChild(mealTitle); 

    recipeResults.appendChild(mealItem); 
  });
}


// function handleRecipeClick(recipeId) {
//   console.log('Fetching recipe details for recipe ID:', recipeId);

//   fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeId}`)
//       .then(response => {
//           if (!response.ok) {
//               throw new Error('Network error');
//           }
//           return response.json();
//       })
//       .then(data => {
//           if (data.meals) {
//               displayRecipeDetails(data.meals[0]);
//           } else {
//               console.log('Recipe details not found');
//           }
//       })
//       .catch(error => {
//           console.error('Error fetching recipe details:', error);
//       });
// }

// let displayedRecipeId = null;
// function handleRecipeClick(recipeId) {
//   const clickedRecipe = document.querySelector(`[data-recipe-id="${recipeId}"]`);
//   console.log('Clicked Recipe:', clickedRecipe);
  
//   if (!clickedRecipe) {
//     console.error('Clicked recipe element not found');
//     return;
//   }

//   const recipeDetailsContainer = document.querySelector('.recipe-details-container');
//   if (recipeDetailsContainer && recipeDetailsContainer.dataset.recipeId === recipeId) {
//     // Recipe details are already displayed, hide them
//     recipeDetailsContainer.remove();
//     return;
//   }
//   // Fetch the details of the clicked recipe from the API
//   fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeId}`)
//     .then(response => {
//       if (!response.ok) {
//         throw new Error('Network error');
//       }
//       return response.json();
//     })
//     .then(data => {
//       if (data.meals) {
//         const recipe = data.meals[0];
//         const recipeDetailsContainer = document.createElement('div');
//         recipeDetailsContainer.classList.add('recipe-details-container');
        
//         const recipeTitle = document.createElement('h2');
//         recipeTitle.textContent = recipe.strMeal;
//         recipeDetailsContainer.appendChild(recipeTitle);
        
//         const recipeIngredients = document.createElement('ul');
//         for (let i = 1; i <= 20; i++) {
//           const ingredient = recipe[`strIngredient${i}`];
//           const measure = recipe[`strMeasure${i}`];
//           if (ingredient && measure) {
//             const ingredientItem = document.createElement('li');
//             ingredientItem.textContent = `${ingredient} - ${measure}`;
//             recipeIngredients.appendChild(ingredientItem);
//           }
//         }
//         recipeDetailsContainer.appendChild(recipeIngredients);
        
//         const recipeInstructions = document.createElement('p');
//         recipeInstructions.textContent = recipe.strInstructions;
//         recipeDetailsContainer.appendChild(recipeInstructions);
        
//         // Insert the recipe details container after the clicked recipe item
//         clickedRecipe.insertAdjacentElement('afterend', recipeDetailsContainer);
//       } else {
//         console.log('Recipe details not found');
//       }
//     })
//     .catch(error => {
//       console.error('Error fetching recipe details:', error);
//     });
// }

let displayedRecipeId = null;

function handleRecipeClick(recipeId) {
  const recipeDetailsUrl = `recipe-details.html?recipeId=${recipeId}`;
  

  window.location.href = recipeDetailsUrl;

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
        
        const recipeTitle = document.createElement('h2');
        recipeTitle.textContent = recipe.strMeal;
        recipeDetailsContainer.appendChild(recipeTitle);
        
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


        clickedRecipe.insertAdjacentElement('afterend', recipeDetailsContainer);


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