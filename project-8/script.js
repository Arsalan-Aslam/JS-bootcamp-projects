// DOM Elements

const search = document.getElementById('search');
const submit = document.getElementById('submit');
const generate = document.getElementById('generate');
const resultsHeading = document.getElementById('results-heading');
const meals = document.getElementById('meals');
const selectedMeal = document.getElementById('selected-meal');

// Function to search the meal using the API
function searchMeal(e) {
    // Prevent form submission and reditect
    e.preventDefault();
    // Get the value form search input field
    const searchText = search.value;
    // Check if search field is empty
    if (searchText.trim()) {
        // Search data from API
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchText}`)
            .then(res => res.json())
            .then(data => {
                console.log(data);
                // update results heading
                resultsHeading.innerHTML = `<h2>Search results for ${searchText}</h2>`;
                // Check if any meals returned from API
                if (data.meals === null) {
                    resultsHeading.innerHTML = `<h2>No results found for ${searchText}</h2>`;
                } else {
                    meals.innerHTML = data.meals.map( meal => `
                        <div class="meal">
                            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
                            <div class="meal-info" data-mealID="${meal.idMeal}">
                                <h3>${meal.strMeal}</h3>
                            </div>
                        </div>
                    `)
                    .join('')
                }
            })
        // Clear the search text
        search.value = '';
    } else {
        alert('Please enter search keyword');
    };
    // Remove previous selected meal info
    selectedMeal.innerHTML = '';

}; 

// Function to get details of selected meal
function getMeal(mealId) {
    // Fetch details of meal using the mealId
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
    .then(res => res.json())
    .then(data  => {
        const meal = data.meals[0];
        // Render in the UI
        displayMealDetails(meal);
    });
}

// Function to render meal details in UI
function displayMealDetails(meal) {
    // Clear Search Results
    meals.innerHTML = '';
    resultsHeading.innerHTML = '';
    console.log(meal);
    const ingredients = [];
    // Loop over ingredient attribute
    for ( let i = 1; i <= 20; i++) {
        // Check if ingredient exists
        if ( meal[`strIngredient${i}`] ) {
            // Push all the ingredients and measurements into the ingredients array 
            ingredients.push(`${meal[`strIngredient${i}`]}: ${meal[`strMeasure${i}`]}`);
        } else {
            break;
        }
    };
    // Render data into UI
    selectedMeal.innerHTML = `
    <div class="selected-meal-details">
        <h1>${meal.strMeal}</h1>
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
        <div class="selected-meal-info" >
            ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
            ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
        </div>
        <div class="selected-meal-instructions">
            <p>${meal.strInstructions}</p>
            <h3>Ingredients</h3>
            <ul>
                ${ingredients.map( ingredient => `<li>${ingredient}</li>`).join('')}
            </ul>
        </div>
    </div>
    `;
    
};

// Function for get random meal from API

function getRandomMeal() {
    // Fetch random meal from API
    fetch('https://www.themealdb.com/api/json/v1/1/random.php')
    .then(res => res.json())
    .then(data => {
        const meal = data.meals[0];
        displayMealDetails(meal);
        // console.log(displayMealDetails);
    })
}


// Event Listeners
// 1. Listen for form submit
submit.addEventListener('submit', searchMeal)

// 2. Listen for click on meals
meals.addEventListener('click', e => {
    // Find and return only if clicked on a meal-info div
    const mealInfo = e.path.find(item => {
        if (item.classList) {
            return item.classList.contains('meal-info');
        } else {
            return false;
        }
    });
    // Check if mealInfo exists
    if (mealInfo) {
        // Get the data-mealid attribute
        const mealId = mealInfo.getAttribute('data-mealid');
        // Fetch details of meal
        getMeal(mealId);
    }
});

// 3. Listen for random meal generate button
generate.addEventListener('click', getRandomMeal); 