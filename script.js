// script.js

(function (global) {
  var dc = {};

  // URL для получения категорий и меню
  dc.url = "https://davids-restaurant.herokuapp.com"; // пример API

  // Загрузка HTML фрагментов
  var insertHtml = function (selector, html) {
    document.querySelector(selector).innerHTML = html;
  };

  var insertProperty = function (string, propName, propValue) {
    var propToReplace = "{{" + propName + "}}";
    return string.replace(new RegExp(propToReplace, "g"), propValue);
  };

  // Генерация случайной категории
  dc.randomCategoryShortName = function (categories) {
    var randomIndex = Math.floor(Math.random() * categories.length);
    return categories[randomIndex].short_name;
  };

  // Загрузка главной страницы с заменой {{randomCategoryShortName}}
  dc.loadHome = function () {
    // Получаем HTML фрагмент главной страницы
    fetch("snippets/home-snippet.html")
      .then((response) => response.text())
      .then((homeHtml) => {
        // Получаем список категорий
        fetch(dc.url + "/categories.json")
          .then((response) => response.json())
          .then((categories) => {
            var randomShortName = dc.randomCategoryShortName(categories);
            var homeHtmlFinal = insertProperty(
              homeHtml,
              "randomCategoryShortName",
              randomShortName
            );
            insertHtml("#main-content", homeHtmlFinal);
          });
      });
  };

  // Загрузка элементов меню по категории
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

  // Событие загрузки страницы
  document.addEventListener("DOMContentLoaded", function (event) {
    dc.loadHome();
  });

  global.$dc = dc;
})(window);