app.modules.menu = (function(self) {
  const _menuTemplate = require('../templates/main_menu.hbs');

  function _init() {
    _serializeData();
  }

  function _initTab(tabId) {
    const $menuContainer = $('#' + tabId).find('.js-main-menu');

    _drawMenu($menuContainer);
    _selectMenuItem($menuContainer.find('.js-menu-item').eq(0));
  }

  function _listener() {
    $(document)
      .on('initTab:calculator', function(event, tabId) {
        _initTab(tabId);
      })
      .on('click', '.js-menu-item', function() {
        _selectMenuItem($(this));
      })
      .on('click', '.js-submenu-item', function() {
        _selectSubmenuItem($(this));
      });
  }

  function _serializeData() {
    // Итерируем массив с пунктами меню
    app.config.mainMenu.data.forEach(function(menuItem) {
      // Подготавливаем ключик для сериализованного массива
      menuItem.serializedItems = [];
      // Итерируем все айдишники в items
      menuItem.items.forEach(function(id) {
        // На каждую итерацию добавляем в наш массив сериализованных данных объект с окном
        menuItem.serializedItems.push(app.config.windows.data.find(function(window) {
          // Функция find находит для нас из общего списка окон то, которое нам нужно и возвращает этот объект
          return window.id === id;
        }));
      });
    });
  }

  function _drawMenu($menuContainer) {
    $menuContainer.html(_menuTemplate({menuItems: app.config.mainMenu.data}));
  }

  function _selectMenuItem($menuItem) {
    let
      $menuContainer = $menuItem.closest('.js-main-menu'),
      idx = $menuContainer.find('.js-menu-item').index($menuItem),
      $submenu = $menuContainer.find('.js-submenu-items').eq(idx);

    $menuItem.addClass('active').siblings('.js-menu-item').removeClass('active');
    $submenu.addClass('active').siblings('.js-submenu-items').removeClass('active');
    $(document).trigger('changeWindowType:calculator', [
      $menuContainer.closest('.js-tab').prop('id'),
      $menuItem.data('id')
    ]);

    _selectSubmenuItem($submenu.find('.js-submenu-item').eq(0));
  }

  function _selectSubmenuItem($submenuItem) {
    $submenuItem.addClass('active').siblings('.js-submenu-item').removeClass('active');
    $(document).trigger('selectWindow:calculator', [
      $submenuItem.closest('.js-tab').prop('id'),
      $submenuItem.data('id')
    ]);
  }

  self.load = function() {
    _init();
    _listener();
  };

  return self;
})(app.modules.menu || {});
