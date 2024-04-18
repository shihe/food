(function($, window) {
    window.onload = () => {
        console.log("Hello");
        $("#search").on("click", function() {
            search();
        });
    };

    function search() {
        $("#loading").show();
        fetch('https://shihe.github.io/food/src/json/searchMock.json').then((response) => response.json()).then((json) => sessionStorage.setItem("searchResponse", JSON.stringify(json)));
        $("#loading").hide();
        showRestaurant(getRestaurants());
    }

    function getRestaurants() {
        return JSON.parse(sessionStorage.getItem("searchResponse")).businesses;
    }

    function showRestaurant(restaurants) {
        for (let i = 0; i < restaurants.length; i++) {
            let restaurantDetails = restaurants[i];
            console.log(restaurantDetails, i);
            const carouselItem = constructCarouselItem(restaurantDetails);
            $('#restaurant > div').append(carouselItem);
        }
        $('#restaurant > div').find('.carousel-item').first().addClass('active');
        $("#restaurant").carousel();
        $("#restaurant").show();
    };

    function constructCarouselItem(restaurantDetails) {
        const item = $('<div>', {
            'class': 'carousel-item'
        });
        const img = $('<img>', {
            'class': 'd-block w-100'
        }).attr('src', restaurantDetails.image_url);
        item.append(img);
        const itemCaption = $('<div>', {
            'class': 'carousel-caption d-block'
        });
        const titleHeading = $('<h5>');
        const title = $('<a>', {
            'class': 'details'
        }).attr('href', restaurantDetails.url).text(restaurantDetails.name);
        titleHeading.append(title);
        const itemDetails = $('<div>', {
            'class': 'details'
        });
        const weightedRating = getWeightedRating(restaurantDetails.rating, restaurantDetails.review_count);
        const ratingStr = "Score: " + weightedRating + " / Rating: " + restaurantDetails.rating + " / Reviews: " + restaurantDetails.review_count;
        const categoryStr = restaurantDetails.categories.map((category) => category.title).join(", ");
        const itemDetailsStr = ratingStr + "                  " + categoryStr + "                  " + restaurantDetails.price;
        itemDetails.text(itemDetailsStr);
        itemCaption.append(titleHeading);
        itemCaption.append(itemDetails);
        item.append(itemCaption);
        const borderColor = "5px solid " + getBorderColor(weightedRating);
        item.css({
            "border": borderColor
        });
        return item;
    }

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
})(jQuery, window);