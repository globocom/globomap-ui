import React from 'react';

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

import { shallow, mount, render } from 'enzyme';

import Properties from '../Properties';


describe("Properties", function() {

  test('Render Properties page', () => {
    const item = {
      "_id": "tag_firewall/gproxy_LnMzLmFtYXpvbi5jb20=",
      "id": "LnMzLmFtYXpvbi5jb20=",
      "name": ".s3.amazon.com",
      "provider": "gproxy",
      "timestamp": 1511247654,
      "properties": null,
      "properties_metadata": null,
      "type": "tag_firewall",
      "uuid": "f5a2612c-1d1c-48a7-b0de-76d694a7362c",
      "items": [],
      "root": true
    }

    const wrapper = shallow(
      <Properties
        item={item} />
    );
    const element = wrapper.find('.item-prop');
    expect(element.length).toBe(1);
  });

});
