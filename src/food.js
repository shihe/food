(function($, window) {
	var restaurantIndex = 0;
	window.onload = () => {
		console.log("Hello");
		$("#search").on("click", function() {
			search();
		});

		// Detect if the device is mobile
		var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

		// If the device is mobile, use the swipe event listener
		if (isMobile) {
			$("#picture").on("swipeleft", function() {
				if (restaurantIndex >= 2) {
					restaurantIndex -= 2;
				}
				showRestaurant(getRestaurantDetails(restaurantIndex));
			});

			$("#picture").on("swiperight", function() {
				showRestaurant(getRestaurantDetails(restaurantIndex));
			});
		} else {
			$("#picture").on("click", function() {
				showRestaurant(getRestaurantDetails(restaurantIndex));
			});
		}
	};

	function search() {
		$("#forms").hide();
		$("#loading").show();
		fetch('https://shihe.github.io/food/src/json/searchMock.json')
			.then((response) => response.json())
			.then((json) => sessionStorage.setItem("searchResponse", JSON.stringify(json)));
		$("#loading").hide();
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

		const weightedRating = getWeightedRating(restaurantDetails.rating, restaurantDetails.review_count);
		const ratingStr = "Score: " + weightedRating +
			" / Rating: " + restaurantDetails.rating +
			" / Reviews: " + restaurantDetails.review_count;
		$("#rating").text(ratingStr);

		const categoryStr = restaurantDetails.categories.map((category) => category.title).join(", ");
		$("#categories").text(categoryStr);
		$("#price").text(restaurantDetails.price);

		let cardImg = document.createElement("img");
		cardImg.src = restaurantDetails.image_url;
		$("#picture").html(cardImg);

		const borderColor = "5px solid " + getBorderColor(weightedRating);
		$("#restaurant").css({"border": borderColor});

		$("#restaurant").show();
		restaurantIndex++;
	};

	function getWeightedRating(rating, review_count) {
		return Math.trunc(rating * Math.min(20, (Math.log(review_count) * 3)));
	}

	function getBorderColor(weightedRating) {
		if (weightedRating < 50) {
			return "black";
		} else if (weightedRating < 60) {
			return "sienna";
		} else if (weightedRating < 70) {
			return "grey";
		} else if (weightedRating < 80) {
			return "gold";
		} else if (weightedRating < 90) {
			return "dodgerblue";
		} else {
			return "crimson";
		}
	}

}) (jQuery, window);