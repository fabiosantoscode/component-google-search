import React from 'react';
import Icon from '@economist/component-icon';
import Loading from '@economist/component-loading';
import promisescript from 'promisescript';
/* eslint-disable no-undef, no-underscore-dangle, id-match, id-length, no-console */
export default class GoogleSearch extends React.Component {

  static get propTypes() {
    return {
      enableHistory: React.PropTypes.bool,
      noResultsString: React.PropTypes.string,
      newWindow: React.PropTypes.bool,
      gname: React.PropTypes.string,
      queryParameterName: React.PropTypes.string,
      language: React.PropTypes.string,
      resultsUrl: React.PropTypes.string,
      cx: React.PropTypes.string,
      searchLabel: React.PropTypes.string,
      iconsSize: React.PropTypes.string,
      googleScriptUrl: React.PropTypes.string,
    };
  }

  static get defaultProps() {
    return {
      enableHistory: true,
      noResultsString: `Your query returned no results. Please try a
      different search term. (Did you check your spelling? You can also
        try rephrasing your query or using more general search terms.)`,
      newWindow: false,
      gname: 'economist-search',
      queryParameterName: 'ss',
      language: 'en',
      resultsUrl: 'http://www.economist.com/search/',
      cx: '013751040265774567329:pqjb-wvrj-q',
      searchLabel: 'Search',
      iconsSize: '28',
      googleScriptUrl: 'www.google.com/cse/cse.js',
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      statusClassName: 'search--close',
      searchTerm: '',
      fallbackHTML: '',
    };
  }

  showSearchFieldHandler(e) {
    e.stopPropagation();
    e.preventDefault();
    this.setState({
      statusClassName: 'search--loading',
    });
    this.ensureScriptHasLoaded().then(() => {
      this.setState({
        statusClassName: 'search--open',
      });
      this.focusSearchField();
    });
    // Required for preventDefault on Safari.
    return false;
  }

  clearSearchField() {
    this.setState({
      searchTerm: '',
      statusClassName: 'search--close',
    });
    document.querySelector('.search input.gsc-input').value = '';
  }

  focusSearchField() {
    document.querySelector('.search input.gsc-input').focus();
  }

  ensureScriptHasLoaded() {
    const self = this;
    function renderSearchElement() {
      google.search.cse.element.render(
        {
          div: 'google-search-box',
          tag: 'searchbox-only',
          attributes: {
            enableHistory: self.props.enableHistory,
            noResultsString: self.props.noResultsString,
            newWindow: self.props.newWindow,
            gname: self.props.gname,
            queryParameterName: self.props.queryParameterName,
            language: self.props.language,
            resultsUrl: self.props.resultsUrl,
          },
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
        callback: myCallback,
      };
      const protocol = (document.location.protocol) === 'https:' ? 'https:' : 'http:';
      const src = `${protocol}//${this.props.googleScriptUrl}?cx=${this.props.cx}`;
      this.script = promisescript({
        url: src,
        type: 'script',
      }).catch((e) => {
        // Let provide a fallback if we can't load the GCS script.
        const fallbackHTML = `
            <form acceptCharset="UTF-8" method="GET"
              id="search-theme-form" action="${this.props.resultsUrl}"
              class="gsc-input"
            >
              <input
                type="text" maxLength="128" name="${this.props.queryParameterName}"
                id="edit-search-theme-form-1"
                value=""
                title="Enter the terms you wish to search for."
                class="gsc-input"
              />
              <input type="hidden" name="cx"
                value="${this.props.cx}" id="edit-cx"
              />
            </form>`;
        this.setState({
          fallbackHTML,
        });
        console.error('An error occurs loading or executing Google Custom Search: ', e.message);
      });
    }
    return this.script;
  }

  render() {
    return (<div className={`search ${this.state.statusClassName}`}>
              <div className="search__show-field-group">
                <a className="search__magnifier"
                  onClick={this.showSearchFieldHandler.bind(this)}
                  href={this.props.resultsUrl}
                >
                  <Icon icon="magnifier"
                    color="white"
                    size={this.props.iconsSize}
                  />
                </a>
                <div
                  className="search__search-box"
                  id="google-search-box"
                >
                  <div className="fallback"
                    dangerouslySetInnerHTML={{__html: this.state.fallbackHTML}}
                  >
                  </div>
                </div>
                <a className="search__search-label"
                  onClick={this.showSearchFieldHandler.bind(this)}
                  href={this.props.resultsUrl}
                >
                  {this.props.searchLabel}
                </a>
                <div className="search__preloader"><Loading /></div>
                <a className="search__search-close"
                  onClick={this.clearSearchField.bind(this)}
                >
                  <Icon
                    icon="close"
                    size={this.props.iconsSize}
                  />
                </a>
              </div>
            </div>
          );
  }
}
