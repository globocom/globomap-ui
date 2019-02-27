/*
Copyright 2019 Globo.com

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import _ from 'lodash';

const FIND_REPORT_NODES = 'find_report_nodes';
const FIND_REPORT_NODES_SUCCESS = 'find_report_nodes_success';
const FIND_REPORT_NODES_FAIL = 'find_report_nodes_fail';

const CLEAR_REPORT_NODES = 'clear_report_nodes';

const initialState = {
  reportNodeslist: [],
  totalPages: 1,
  perPage: 10,
  currentPage: 1,
  searchOptions: {},
  loaded: false,
  loading: false
};

export default function reducer(state=initialState, action={}) {
  let data;

  switch (action.type) {

    case FIND_REPORT_NODES:
      console.log('find report nodes...');
      return {
        ...state,
        loading: true
      };

    case FIND_REPORT_NODES_SUCCESS:
      const { result, options } = action;
      data = result.data;

      return {
        ...state,
        reportNodeslist: data.documents,
        totalPages: data.total_pages,
        perPage: data.total,
        currentPage: options.page,
        searchOptions: options,
        loaded: true,
        loading: false
      };

    case FIND_REPORT_NODES_FAIL:
      console.log(action.error);
      return {
        ...state,
        reportNodeslist: [],
        loaded: false,
        loading: false,
        error: action.error
      };

    case CLEAR_REPORT_NODES:
      return {
        ...state,
        reportNodeslist: []
      };

    default:
      return state;
  }
}

export function findReportNodes(opts) {
  const options = _.merge({
    query: '',
    queryProps: [],
    collections: [],
    per_page: null,
    page: 1
  }, opts);

  return {
    types: [FIND_REPORT_NODES, FIND_REPORT_NODES_SUCCESS, FIND_REPORT_NODES_FAIL],
    promise: (client) => client.get('/api/find-nodes', options),
    options
  };
}

export function clearReportNodes() {
  return {
    type: CLEAR_REPORT_NODES
  };
}
