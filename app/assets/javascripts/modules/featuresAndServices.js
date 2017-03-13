app.modules.featuresAndServices = (function(self) {
  let
    _filteredFeatures = {},
    _filteredServices = {},
    _normalized = {},
    _featuresTemplate = require('../templates/features.hbs'),
    _servicesTemplate = require('../templates/services.hbs');

  function _listener() {
    $(document)
      .on('changeWindowType:calculator', function(event, tabId, windowTypeId) {
        _filterFeatures(tabId, windowTypeId);
        _filterServices(tabId, windowTypeId);
        _normalizeData(tabId);
        _renderFeaturesAndServices(tabId);
      })
      .on('change', '.js-additional', function() {
        _toggleFeature($(this));
      })
      .on('change', '.js-feature', function() {
        _setPrice($(this));
      })
      .on('deleteTab:calculator', function(event, tabId) {
        delete _filteredFeatures[tabId];
        delete _filteredServices[tabId];
        delete _normalized[tabId];
      });
  }

  function _getOptionsFor(optionsKey, windowTypeId) {
    var filteredData;

    // Клонируем оригинальный объект
    filteredData = $.extend(true, {id: windowTypeId}, app.config[optionsKey]);

    // Перезаписываем существующий ключ data на отфильтрованный
    filteredData.data = filteredData.data.filter(function(item) {
      // Далее нам необходимо проверить, есть ли цена для данного типа окон
      // и перезапишем сам ключ. Если есть цена - то будет int, если нет false
      item.price = item.price.hasOwnProperty(windowTypeId) && item.price[windowTypeId];
      // Затем отфильтруем наш массив данных по наличию цены
      return !!item.price;
    });

    if (filteredData.data.length) {
      filteredData.price = filteredData.data[0].price;
      return filteredData;
    }
  }

  function _filterFeatures(tabId, windowTypeId) {
    _filteredFeatures[tabId] = [];
    ['windowLedge', 'windowSill', 'windowReveal'].forEach(featureName => {
      let feature = _getOptionsFor(featureName, windowTypeId);

      if (feature) {
        _filteredFeatures[tabId].push(feature);
      }
    });
  }

  function _filterServices(tabId, windowTypeId) {
    _filteredServices[tabId] = _getOptionsFor('services', windowTypeId);
  }

  function _renderFeaturesAndServices(tabId) {
    $('#' + tabId)
      .find('.js-features').html(_featuresTemplate({features: _filteredFeatures[tabId]})).end()
      .find('.js-services').html(_servicesTemplate({services: _filteredServices[tabId]}));
  }

  function _normalizeData(tabId) {
    let normalizedArray = [];

    normalizedArray = normalizedArray.concat(_filteredFeatures[tabId]);
    normalizedArray = normalizedArray.concat(_filteredServices[tabId].data);

    _normalized[tabId] = normalizedArray;
  }

  function _toggleFeature($checkbox) {
    let
      tabId = $checkbox.closest('.js-tab').prop('id'),
      slug = $checkbox.data('slug'),
      featureObject;

    featureObject = _normalized[tabId].find(item => item.slug === slug);

    $(document).trigger('toggleFeature:calculator', [
      tabId,
      $.extend(true, {}, featureObject),
      $checkbox.prop('checked')
    ]); // экстенд, потому что нужна копия, а не ссылка
  }

  function _setPrice($feature) {
    var
      tabId = $feature.closest('.js-tab').prop('id'),
      slug = $feature.closest('.js-feature').data('slug'),
      price = parseInt($feature.val());

    _normalized[tabId].find(item => item.slug === slug).price = price;

    $feature.closest('.js-feature-item').find('.js-price').text(price);

    $(document).trigger('updateFeaturePrice:calculator', [tabId, slug, price]);
  }

  self.load = function() {
    _listener();
  }

  return self;
})(app.modules.featuresAndServices || {});
