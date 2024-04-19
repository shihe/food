(function($, window) {
    window.onload = () => {
        if (localStorage.getItem("api_key")) {
            $('#api_key').val(localStorage.getItem("api_key"));
        }
        $("#term").on("focus", function() {
            $("#term").attr("placeholder", "Search for Pizza, Asian, Brunch")
        });
        $("#term").on("focusout", function() {
            $("#term").attr("placeholder", "Restaurants")
        });
        $("#location").on("focus", function() {
            $("#location").attr("placeholder", "Neighborhood, city, state or zip code")
        });
        $("#location").on("focusout", function() {
            $("#location").attr("placeholder", "Irvine, CA")
        });
        $("#search").on("click", function() {
            search();
        });
    };

    function search() {
        $("#loading").show();
        let apiKey;
        if ($('#api_key').val()) {
            localStorage.setItem("api_key", $('#api_key').val());
            apiKey = $('#api_key').val()
        } else if (localStorage.getItem("api_key")) {
            apiKey = localStorage.getItem("api_key");
        }
        const settings = {
            async: true,
            crossDomain: true,
            url: constructSearchUrl(),
            method: 'GET',
            headers: {
                accept: 'application/json',
                "Access-Control-Allow-Origin": "*",
                Authorization: 'Bearer ' + apiKey
            }
        };
        $.ajax(settings).done(function(response) {
            sessionStorage.setItem("searchResponse", JSON.stringify(response));
            showRestaurant(getRestaurants());
        }).fail(function(jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
            $("#error").show();
        }).always(function() {
            $("#loading").hide();
        });
    }

    function constructSearchUrl() {
        const termParam = $('#term').val() ? $('#term').val() : "restaurants";
        const locationParam = $('#location').val() ? $('#location').val() : "Irvine, CA";
        const openTimeParam = $('#open_at').val() ? Math.trunc(Date.now() / 1000 + 60 * $('#open_at').val()) : Math.trunc(Date.now() / 1000 + 1800);
        const params = {
            term: termParam,
            location: locationParam,
            open_at: openTimeParam,
            sort_by: "best_match",
            limit: 50
        }
        return "https://corsproxy.io/?https://api.yelp.com/v3/businesses/search?" + $.param(params);
    }

    function getRestaurants() {
        return JSON.parse(sessionStorage.getItem("searchResponse")).businesses;
    }

    function showRestaurant(restaurants) {
        $('#restaurant > div').empty();
        for (let i = 0; i < restaurants.length; i++) {
            let restaurantDetails = restaurants[i];
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
        const itemRatings = $('<div>', {
            'class': 'details'
        });
        const itemDetails = $('<div>', {
            'class': 'details'
        });
        const weightedRating = getWeightedRating(restaurantDetails.rating, restaurantDetails.review_count);
        const ratingStr = "Score: " + weightedRating + " | " + restaurantDetails.rating + " (" + restaurantDetails.review_count + " reviews)";
        itemRatings.append(ratingStr);
        const categoryStr = restaurantDetails.categories.map((category) => category.title).join(", ");
        const priceStr = restaurantDetails.price ? restaurantDetails.price : "";
        const itemDetailsStr = categoryStr + " " + priceStr;
        itemDetails.text(itemDetailsStr);
        itemCaption.append(titleHeading);
        itemCaption.append(itemRatings);
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