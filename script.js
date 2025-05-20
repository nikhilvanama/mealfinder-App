const search = document.getElementById('search'),
  submit = document.getElementById('submit'),
  random = document.getElementById('random'),
  mealsEl = document.getElementById('meals'),
  resultHeading = document.getElementById('result-heading'),
  single_mealEl = document.getElementById('single-meal');

// Search meal and fetch from API
async function searchMeal(e) {
  e.preventDefault();

  // Clear single meal
  single_mealEl.innerHTML = '';

  // Get search term
  const term = search.value.trim();

  // Check for empty
  if (!term) {
    alert('Please enter a search term');
    return;
  }

  try {
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`);
    const data = await res.json();

    console.log(data);

    resultHeading.innerHTML = `<h2>Search results for '${term}':</h2>`;

    if (!data.meals) {
      resultHeading.innerHTML = `<p>There are no search results. Try again!</p>`;
      mealsEl.innerHTML = ''; // Clear previous meals if no result
    } else {
      mealsEl.innerHTML = data.meals
        .map(
          meal => `
          <div class="meal">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
            <div class="meal-info" data-mealID="${meal.idMeal}">
              <h3>${meal.strMeal}</h3>
            </div>
          </div>
        `
        )
        .join('');
    }
  } catch (error) {
    console.error('Error fetching meals:', error);
    resultHeading.innerHTML = `<p>Something went wrong. Please try again later.</p>`;
  }

  // Clear search input
  search.value = '';
}


// Fetch meal by ID
async function getMealById(mealID) {
  try {
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`);
    const data = await res.json();
    const meal = data.meals[0];

    addMealToDOM(meal);
  } catch (error) {
    console.error("Error fetching meal by ID:", error);
  }
}


// Fetch random meal from API
async function getRandomMeal() {
  try {
    // Clear meals and heading
    mealsEl.innerHTML = '';
    resultHeading.innerHTML = '';

    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/random.php`);
    const data = await res.json();
    const meal = data.meals[0];

    addMealToDOM(meal);
  } catch (error) {
    console.error("Error fetching random meal:", error);
  }
}


// Add meal to DOM
function addMealToDOM(meal) {
  const ingredients = [];

  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
    } else {
      break;
    }
  }

  single_mealEl.innerHTML = `
    <div class="single-meal">
      <h1>${meal.strMeal}</h1>
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
      <div class="single-meal-info">
        ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
        ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
      </div>
      <div class="main">
        <p>${meal.strInstructions}</p>
        <h2>Ingredients</h2>
        <ul>
          ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
        </ul>
      </div>
    </div>
  `;
}


// Event listeners
submit.addEventListener('submit', searchMeal);
random.addEventListener('click', getRandomMeal);

mealsEl.addEventListener('click', e => {
  const mealInfo = e.composedPath().find(item => {
    if (item.classList) {
      return item.classList.contains('meal-info');
    } else {
      return false;
    }
  });

  if (mealInfo) {
    const mealID = mealInfo.getAttribute('data-mealid');
    getMealById(mealID);
  }
});
