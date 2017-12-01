import React from 'react';

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

import { shallow, mount, render } from 'enzyme';

import SearchContentPagination from '../SearchContentPagination';


describe("SearchContentPagination", function() {

  test('Render SearchContentPagination page', () => {
    const nodes = [{
      "_id": "tag_firewall/gproxy_LmdpdGh1Yi1jbG91ZC5zMy5hbWF6b25hd3MuY29t",
      "id": "LmdpdGh1Yi1jbG91ZC5zMy5hbWF6b25hd3MuY29t",
      "name": ".github-cloud.s3.amazonaws.com",
      "provider": "gproxy",
      "timestamp": 1511247666,
      "properties": null,
      "properties_metadata": null,
      "type": "tag_firewall"
    },{
      "_id": "tag_firewall/gproxy_LnMzLXNhLWVhc3QtMS5hbWF6b25hd3MuY29t",
      "id": "LnMzLXNhLWVhc3QtMS5hbWF6b25hd3MuY29t",
      "name": ".s3-sa-east-1.amazonaws.com",
      "provider": "gproxy",
      "timestamp": 1511247655,
      "properties": null,
      "properties_metadata": null,
      "type": "tag_firewall"
    }]

    const wrapper = shallow(
      <SearchContentPagination
        nodes={nodes} />
    );
    const element = wrapper.find('.search-content-pagination');
    expect(element.length).toBe(1);
  });

});
