(function($, window) {
	var restaurantIndex = 0;
	window.onload = () => {
		console.log("Hello");
		$("#search").on("click", function() {
			search();
		});

		$("#restaurant").on("click", function() {
			showRestaurant(getRestaurantDetails(restaurantIndex));
		});
	};

	function search() {
		fetch('https://shihe.github.io/food/src/json/searchMock.json')
			.then((response) => response.json())
			.then((json) => sessionStorage.setItem("searchResponse", JSON.stringify(json)));
		restaurantIndex = 0;
		showRestaurant(getRestaurantDetails(restaurantIndex));
	}

	function getRestaurantDetails(restaurantIndex) {
		return JSON.parse(sessionStorage.getItem("searchResponse")).businesses[restaurantIndex];
	}

	function showRestaurant(restaurantDetails) {
	  	console.log(restaurantDetails);
	  	$("#title").attr("href", restaurantDetails.url);
	  	$("#title").text(restaurantDetails.name);

	  	const ratingStr = constructRatingStr(restaurantDetails.rating, restaurantDetails.review_count);
  		$("#rating").text(ratingStr);

  		const categoryStr = restaurantDetails.categories.map((category) => category.title).join(", ");
  		$("#categories").text(categoryStr);
  		$("#price").text(restaurantDetails.price);
	  	let cardImg = document.createElement("img");
	  	cardImg.src = restaurantDetails.image_url;
	  	$("#picture").html(cardImg);

	  	$("#restaurant").show();
	  	restaurantIndex++;
	};

	function constructRatingStr(rating, review_count) {
		const weightedRating = Math.trunc(rating * Math.min(20, (Math.log(review_count) * 3)));
		return "Score: " + weightedRating + " / Rating: " + rating + " / Reviews: " + review_count;
	}

}) (jQuery, window);