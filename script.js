const search = document.getElementById('search'),
submit = document.getElementById('submit'),
random = document.getElementById('random'),
mealsEL = document.getElementById('meals'),
resultHeading = document.getElementById('result-heading'),
singleMealEl = document.getElementById('single-meal'),
error = document.getElementById('mySmall');


// Search meal and fetch from API
function searchMeal(e) {
    e.preventDefault();

     // Clear single meal
     singleMealEl.innerHTML = '';

     // Get search term
     const term = search.value;

     // Check for empty search
     if (term.trim()) {
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            resultHeading.innerHTML = `<h2>Search results for '${term}':</h2>`

            if(data.meals === null) {
                resultHeading.innerHTML = '<p>There are no search results. Try again</p>'
            } else {
                // meals is the array of data that we just fetched from API
                mealsEL.innerHTML = data.meals.map(meal => `
                    <div class="meal">
                        <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
                        <div class="meal-info" data-mealID="${meal.idMeal}">
                            <h3>${meal.strMeal}</h3>
                        </div>
                    </div>
                `
                )
                .join('');
            }
        })
    // Clear search text
    search.value = '';
    } else {
        error.classList.add('error-message--active');
        document.getElementById('mySmall').innerText = 'Please enter a search term';
    }
}

// Fetch meal by ID
function getMealById(mealID) {
    fetch (`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    .then(res => res.json())
    .then(data => {
        // meals is the array of data that we just fetched from API
        const meal = data.meals[0];

        addMealToDOM(meal);
    })
}

//Fetch random meal
function getRandomMeal() {
    // Clear meals and heading
    mealsEL.innerHTML = '';
    resultHeading.innerHTML = '';

    // Fetch random meal from API
    fetch ('https://www.themealdb.com/api/json/v1/1/random.php')
    .then(res => res.json())
    .then(data => {
        const meal = data.meals[0];
        addMealToDOM(meal);
    })
}

function addMealToDOM(meal) {
    const ingredients = [];
    for(let i = 1; i <= 20; i++) {
        if(meal[`strIngredient${i}`]) {
            ingredients.push(
                `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
            );
        } else {
            break;
        }
    }

    singleMealEl.innerHTML = `
        <div class="single-meal">
            <h1>${meal.strMeal}</h1>
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
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

mealsEL.addEventListener('click', e => {
    // Goes through all child elements/items
    const mealInfo = e.path.find(item => {
        if(item.classList) {
            return item.classList.contains('meal-info');
        } else {
            return false;
        }
    });

    if(mealInfo) {
        const mealID = mealInfo.getAttribute('data-mealID')
        getMealById(mealID);
    }
});