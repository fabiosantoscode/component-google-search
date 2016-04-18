import 'babel-polyfill';
import GoogleSearch from '../src';
import React from 'react';
import chai from 'chai';
import chaiSpies from 'chai-spies';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';
chai.use(chaiEnzyme()).should();
chai.use(chaiSpies);

describe('GoogleSearch', () => {
  it('is compatible with React.Component', () => {
    GoogleSearch.should.be.a('function')
      .and.respondTo('render');
  });

  it('renders a React element', () => {
    React.isValidElement(<GoogleSearch />).should.equal(true);
  });

  it('checks for correct state when client-rendering', () => {
    // Shallow was used rather than mount, otherwise the component is mounted
    // twice in the example, as the Google APIs are called twice.
    const wrapper = shallow(<GoogleSearch />);
    wrapper.state().useFallback.should.equal(false);
  });

  describe('focusSearchField', () => {
    let comp = null;
    beforeEach(() => {
      comp = new GoogleSearch({}, {}, {});
      comp.googleSearchInput = { focus: chai.spy() };
    });
    it('focuses the element when the autoFocus prop is true', () => {
      comp.props.autoFocus = true;
      comp.focusSearchField();
      comp.googleSearchInput.focus.should.have.been.called.once();
    });
    it('doesn\'t focus the element if props.autoFocus is false', () => {
      comp.props.autoFocus = false;
      comp.focusSearchField();
      comp.googleSearchInput.focus.should.not.have.been.called();
    });
  });
});

