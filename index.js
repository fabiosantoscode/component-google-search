'use strict';

exports.__esModule = true;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _economistComponentIcon = require('@economist/component-icon');

var _economistComponentIcon2 = _interopRequireDefault(_economistComponentIcon);

var _economistComponentLoading = require('@economist/component-loading');

var _economistComponentLoading2 = _interopRequireDefault(_economistComponentLoading);

var _promisescript = require('promisescript');

var _promisescript2 = _interopRequireDefault(_promisescript);

/* eslint-disable no-undef, no-underscore-dangle, id-match, id-length, no-console */

var GoogleSearch = (function (_React$Component) {
  _inherits(GoogleSearch, _React$Component);

  _createClass(GoogleSearch, null, [{
    key: 'propTypes',
    get: function get() {
      return {
        enableHistory: _react2['default'].PropTypes.bool,
        noResultsString: _react2['default'].PropTypes.string,
        newWindow: _react2['default'].PropTypes.bool,
        gname: _react2['default'].PropTypes.string,
        queryParameterName: _react2['default'].PropTypes.string,
        language: _react2['default'].PropTypes.string,
        resultsUrl: _react2['default'].PropTypes.string,
        cx: _react2['default'].PropTypes.string,
        searchLabel: _react2['default'].PropTypes.string,
        iconsSize: _react2['default'].PropTypes.string,
        googleScriptUrl: _react2['default'].PropTypes.string
      };
    }
  }, {
    key: 'defaultProps',
    get: function get() {
      return {
        enableHistory: true,
        noResultsString: 'Your query returned no results. Please try a\n      different search term. (Did you check your spelling? You can also\n        try rephrasing your query or using more general search terms.)',
        newWindow: false,
        gname: 'economist-search',
        queryParameterName: 'ss',
        language: 'en',
        resultsUrl: 'http://www.economist.com/search/',
        cx: '013751040265774567329:pqjb-wvrj-q',
        searchLabel: 'Search',
        iconsSize: '28',
        googleScriptUrl: 'www.google.com/cse/cse.js'
      };
    }
  }]);

  function GoogleSearch(props) {
    _classCallCheck(this, GoogleSearch);

    _React$Component.call(this, props);
    this.state = {
      statusClassName: 'search--close',
      searchTerm: '',
      fallbackHTML: ''
    };
  }

  GoogleSearch.prototype.showSearchFieldHandler = function showSearchFieldHandler(e) {
    var _this = this;

    e.stopPropagation();
    e.preventDefault();
    this.setState({
      statusClassName: 'search--loading'
    });
    this.ensureScriptHasLoaded().then(function () {
      _this.setState({
        statusClassName: 'search--open'
      });
      _this.focusSearchField();
    });
    // Required for preventDefault on Safari.
    return false;
  };

  GoogleSearch.prototype.clearSearchField = function clearSearchField() {
    this.setState({
      searchTerm: '',
      statusClassName: 'search--close'
    });
    document.querySelector('.search input.gsc-input').value = '';
  };

  GoogleSearch.prototype.focusSearchField = function focusSearchField() {
    document.querySelector('.search input.gsc-input').focus();
  };

  GoogleSearch.prototype.ensureScriptHasLoaded = function ensureScriptHasLoaded() {
    var _this2 = this;

    var self = this;
    function renderSearchElement() {
      google.search.cse.element.render({
        div: 'google-search-box',
        tag: 'searchbox-only',
        attributes: {
          enableHistory: self.props.enableHistory,
          noResultsString: self.props.noResultsString,
          newWindow: self.props.newWindow,
          gname: self.props.gname,
          queryParameterName: self.props.queryParameterName,
          language: self.props.language,
          resultsUrl: self.props.resultsUrl
        }
      });
      self.focusSearchField();
    }

    function myCallback() {
      if (document.readyState === 'complete') {
        renderSearchElement();
      } else {
        google.setOnLoadCallback(renderSearchElement, true);
      }
    }

    if (!this.script) {
      window.__gcse = {
        parsetags: 'explicit',
        callback: myCallback
      };
      var protocol = document.location.protocol === 'https:' ? 'https:' : 'http:';
      var src = protocol + '//' + this.props.googleScriptUrl + '?cx=' + this.props.cx;
      this.script = _promisescript2['default']({
        url: src,
        type: 'script'
      })['catch'](function (e) {
        // Let provide a fallback if we can't load the GCS script.
        var fallbackHTML = '\n            <form acceptCharset="UTF-8" method="GET"\n              id="search-theme-form" action="' + _this2.props.resultsUrl + '"\n              class="gsc-input"\n            >\n              <input\n                type="text" maxLength="128" name="' + _this2.props.queryParameterName + '"\n                id="edit-search-theme-form-1"\n                value=""\n                title="Enter the terms you wish to search for."\n                class="gsc-input"\n              />\n              <input type="hidden" name="cx"\n                value="' + _this2.props.cx + '" id="edit-cx"\n              />\n            </form>';
        _this2.setState({
          fallbackHTML: fallbackHTML
        });
        console.error('An error occurs loading or executing Google Custom Search: ', e.message);
      });
    }
    return this.script;
  };

  GoogleSearch.prototype.render = function render() {
    return _react2['default'].createElement(
      'div',
      { className: 'search ' + this.state.statusClassName },
      _react2['default'].createElement(
        'div',
        { className: 'search__show-field-group' },
        _react2['default'].createElement(
          'a',
          { className: 'search__magnifier',
            onClick: this.showSearchFieldHandler.bind(this),
            href: this.props.resultsUrl
          },
          _react2['default'].createElement(_economistComponentIcon2['default'], { icon: 'magnifier',
            color: 'white',
            size: this.props.iconsSize
          })
        ),
        _react2['default'].createElement(
          'div',
          {
            className: 'search__search-box',
            id: 'google-search-box'
          },
          _react2['default'].createElement('div', { className: 'fallback',
            dangerouslySetInnerHTML: { __html: this.state.fallbackHTML }
          })
        ),
        _react2['default'].createElement(
          'a',
          { className: 'search__search-label',
            onClick: this.showSearchFieldHandler.bind(this),
            href: this.props.resultsUrl
          },
          this.props.searchLabel
        ),
        _react2['default'].createElement(
          'div',
          { className: 'search__preloader' },
          _react2['default'].createElement(_economistComponentLoading2['default'], null)
        ),
        _react2['default'].createElement(
          'a',
          { className: 'search__search-close',
            onClick: this.clearSearchField.bind(this)
          },
          _react2['default'].createElement(_economistComponentIcon2['default'], {
            icon: 'close',
            size: this.props.iconsSize
          })
        )
      )
    );
  };

  return GoogleSearch;
})(_react2['default'].Component);

exports['default'] = GoogleSearch;
module.exports = exports['default'];