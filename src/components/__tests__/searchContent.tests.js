import React from 'react';
import ReactDOM from 'react-dom';
import {unmountComponentAtNode} from "react-dom";

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

import sinon from "sinon";
import { shallow, mount, render } from 'enzyme';

import SearchContent from '../SearchContent';


describe("SearchContent", function() {

  test('Render the SearchContent box', () => {
    const stageNodes = [];

    const wrapper = shallow(
      <SearchContent />
    );
    const element = wrapper.find('.search-content');
    expect(element.length).toEqual(1);
  });

});
