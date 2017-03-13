app.modules.selectedWindow = (function(self) {
  let
    _windowTemplate = require('../templates/selectedWindow.hbs'),
    _currentWindows = {};

  function _listener() {
    $(document)
      .on('selectWindow:calculator', function(event, tabId, windowId) {
        _currentWindows[tabId] = windowId;
        _renderWindow(tabId, windowId);
      })
      .on('change', '.js-window-size', function() {
        let
          $input = $(this),
          value = parseFloat($input.val()),
          tabId = $input.closest('.js-tab').prop('id'),
          sizeOption = $input.prop('name'),
          sizeObject = _findWindow(_currentWindows[tabId]).sizes[sizeOption];

        if (isFinite(value) && value <= sizeObject.max && value >= sizeObject.min) {
          $input.removeClass('invalid');
          $(document).trigger('changeSpecs:calculator', [tabId, sizeOption, value]);
        } else {
          $input.addClass('invalid');
        }
      })
      .on('deleteTab:calculator', function(event, tabId) {
        delete _currentWindows[tabId];
      });
  }

  function _renderWindow(tabId, windowId) {
    $('#' + tabId).find('.js-selected-window').html(_windowTemplate({
      window: _findWindow(windowId)
    }));
  }

  function _findWindow(id) {
    return app.config.windows.data.find(window => window.id === id);
  }

  self.load = function() {
    _listener();
  }

  return self;
})(app.modules.selectedWindow || {});
