app.modules.calculator = (function(self) {
  let
    _priceTemplate = require('../templates/calculator.hbs'),
    _result = {},
    _$overallPrice;

  function _init() {
    _$overallPrice = $('.js-overall-price');
  }

  function _listener() {
    $(document)
      .on('selectWindow:calculator', function(event, tabId, windowTypeId) {
        _updateResult(tabId, _findWindow(windowTypeId));
        _renderResult(tabId);
      })
      .on('toggleFeature:calculator', function(event, tabId, feature, isChecked) {
        _toggleFeature(tabId, feature, isChecked);
      })
      .on('updateFeaturePrice:calculator', function(event, tabId, slug, price) {
        _updatePrice(tabId, slug, price);
      })
      .on('changeSpecs:calculator', function(event, tabId, sizeOption, value) {
        _result[tabId].currentSelection.sizes[sizeOption].current = value;
      })
      .on('deleteTab:calculator', function(event, tabId) {
        delete _result[tabId];
        _renderOverallPrice();
      });
  }

  function _findWindow(id) {
    return app.config.windows.data.find(window => window.id === id);
  }

  function _updateResult(tabId, object) {
    let window = $.extend(true, {options: []}, object);

    _result[tabId] = {
      currentSelection: window,
      totalPrice: window.price
    }
  }

  function _renderResult(tabId) {
    $('#' + tabId).find('.js-total-price').html(
      _priceTemplate({totalPrice: _result[tabId].totalPrice}
    ));

    _renderOverallPrice();
  }

  function _toggleFeature(tabId, feature, isChecked) {
    let result = _result[tabId];

    if (isChecked) {
      result.currentSelection.options.push(feature);
      result.totalPrice = result.totalPrice + feature.price;
    } else {
      result.totalPrice = result.totalPrice - feature.price;
      result.currentSelection.options.forEach(function(item, index) {
        if (item.slug === feature.slug) {
          result.currentSelection.options.splice(index, 1);
        }
      });
    }

    _renderResult(tabId);
  }

  function _updatePrice(tabId, slug, price) {
    let
      result = _result[tabId],
      currentOption = result.currentSelection.options.find(option => option.slug === slug);

    if (currentOption) {
      result.totalPrice = result.totalPrice + price - currentOption.price;
      currentOption.price = price;
      _renderResult(tabId);
    }
  }

  function _calcOverallPrice() {
    return Object.keys(_result).reduce((sum, key) => {
      return sum + _result[key].totalPrice;
    }, 0);
  }

  function _renderOverallPrice() {
    _$overallPrice.html(_priceTemplate({totalPrice: _calcOverallPrice()}));
  }

  self.load = function() {
    _init();
    _listener();
  }

  return self;
})(app.modules.calculator || {});
