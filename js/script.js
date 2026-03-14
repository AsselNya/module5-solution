(function (global) {
  var dc = {};

  // URL API
  dc.url = "https://davids-restaurant.herokuapp.com";

  var insertHtml = function (selector, html) {
    document.querySelector(selector).innerHTML = html;
  };

  var insertProperty = function (string, propName, propValue) {
    var propToReplace = "{{" + propName + "}}";
    return string.replace(new RegExp(propToReplace, "g"), propValue);
  };

  dc.randomCategoryShortName = function (categories) {
    var randomIndex = Math.floor(Math.random() * categories.length);
    return categories[randomIndex].short_name;
  };

  dc.loadHome = function () {
    fetch("snippets/home-snippet.html")
      .then((response) => response.text())
      .then((homeHtml) => {
        fetch(dc.url + "/categories.json")
          .then((response) => response.json())
          .then((categories) => {
            var randomShortName = dc.randomCategoryShortName(categories);
            var finalHtml = insertProperty(
              homeHtml,
              "randomCategoryShortName",
              randomShortName
            );
            insertHtml("#main-content", finalHtml);
          });
      });
  };

  dc.loadMenuItems = function (categoryShort) {
    fetch(dc.url + "/menu_items.json?category=" + categoryShort)
      .then((response) => response.json())
      .then((menuItems) => {
        var title = menuItems.category.name;
        var html = "<h2>" + title + "</h2><ul>";
        menuItems.menu_items.forEach(function (item) {
          html += "<li>" + item.name + "</li>";
        });
        html += "</ul>";
        insertHtml("#main-content", html);
      });
  };

  document.addEventListener("DOMContentLoaded", function () {
    dc.loadHome();
  });

  global.$dc = dc;
})(window);