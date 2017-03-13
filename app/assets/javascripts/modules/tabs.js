app.modules.tabs = (function(self) {
  const
    tabMenuTemplate = require('../templates/tab_menu_item.hbs'),
    tabTemplate = require('../templates/tab.hbs');

  function _init() {
    $('.js-tabs').tabs();
    _genTab();
  }

  function _listener() {
    $(document)
      .on('click', '.js-add-calc', _genTab)
      .on('click', '.js-delete-calc', _delTab);
  }

  function _genTab() {
    const
      id = Date.now(),
      $tab = $(tabTemplate({id}));

    $('.js-add-calc').before(tabMenuTemplate({id}));
    $('.js-tabs')
      .append($tab)
      .tabs('refresh')
      .tabs('option', 'active', $tab.index('.js-tab'));

    $(document).trigger('initTab:calculator', id);
  }

  function _delTab() {
    const
      $tabMenuItem = $(this).closest('.js-tabs-menu-item'),
      $tab = $('.js-tab:eq(' + $tabMenuItem.index('.js-tabs-menu-item') + ')');

    $(document).trigger('deleteTab:calculator', $tab.prop('id'));
    $tab.remove();
    $tabMenuItem.remove();
    $('.js-tabs').tabs('refresh');
  }

  self.load = function() {
    _init();
    _listener();
  }

  return self;
})(app.modules.tabs || {});
