/*
Copyright 2017 Globo.com

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

const GET_PLUGINS = 'get_plugins'
const GET_PLUGINS_SUCCESS = 'get_plugins_success'
const GET_PLUGINS_FAIL = 'get_plugins_fail'

const GET_ZBX_MONITORING = 'get_zabbix_monitoring';
const GET_ZBX_MONITORING_SUCCESS = 'get_zabbix_monitoring_success';
const GET_ZBX_MONITORING_FAIL = 'get_zabbix_monitoring_fail';

const GET_ZBX_GRAPH = 'get_zabbix_graph';
const GET_ZBX_GRAPH_SUCCESS = 'get_zabbix_graph_success';
const GET_ZBX_GRAPH_FAIL = 'get_zabbix_graph_fail';

const initialState = {
  plugins: {},
  pluginsLoadind: false,
  pluginsLoaded: false,

  zbxMonitLoading: false,
  zbxGraphLoading: false,
  zbxTriggers: [],
  zbxGraph: null
};

export default function reducer(state=initialState, action={}) {

  switch (action.type) {

    case GET_PLUGINS:
      console.log('get plugins...');
      return {
        ...state,
        plugins: {},
        pluginsLoading: true
      };

    case GET_PLUGINS_SUCCESS:
      return {
        ...state,
        plugins: action.result.data,
        pluginsLoading: false,
        pluginsLoaded: true
      };

    case GET_PLUGINS_FAIL:
      console.log(action.error);
      return {
        ...state,
        plugins: {},
        pluginsLoading: false,
        pluginsLoaded: false
      };

    case GET_ZBX_MONITORING:
      console.log('get zabbix monitoring...');
      return {
        ...state,
        zbxMonitLoading: true
      };

    case GET_ZBX_MONITORING_SUCCESS:
      return {
        ...state,
        zbxMonitLoading: false,
        zbxTriggers: action.result.data
      };

    case GET_ZBX_MONITORING_FAIL:
      console.log(action.error);
      return {
        ...state,
        zbxMonitLoading: false,
        zbxTriggers: []
      };

      case GET_ZBX_GRAPH:
      console.log('get zabbix graph...');
      return {
        ...state,
        zbxGraphLoading: true
      };

    case GET_ZBX_GRAPH_SUCCESS:
      return {
        ...state,
        zbxGraphLoading: false,
        zbxGraph: action.result.data
      };

    case GET_ZBX_GRAPH_FAIL:
      console.log(action.error);
      return {
        ...state,
        zbxGraphLoading: false,
        zbxGraph: null
      };

    default:
      return state;
  }
}

function getPluginsStart(options) {
  return {
    types: [GET_PLUGINS, GET_PLUGINS_SUCCESS, GET_PLUGINS_FAIL],
    promise: (client) => client.post('/api/plugins', options)
  };
}

export function getPlugins(options) {
  return (dispatch, getState) => {
    if (getState().plugins.pluginsLoaded) {
      return;
    }
    return dispatch(getPluginsStart(options));
  }
}

export function getZabbixMonitoring(node) {
  const options = {
    equipment_type: node.properties.equipment_type,
    ips: node.properties.ips
  };

  return {
    types: [GET_ZBX_MONITORING, GET_ZBX_MONITORING_SUCCESS, GET_ZBX_MONITORING_FAIL],
    promise: (client) => client.get('/plugins/zabbix/monitoring', options)
  };
}

export function getZabbixGraph(node) {
  const options = {
    encoded: 1,
    graphId: node.id
  };

  return {
    types: [GET_ZBX_GRAPH, GET_ZBX_GRAPH_SUCCESS, GET_ZBX_GRAPH_FAIL],
    promise: (client) => client.get('/plugins/zabbix/graph', options)
  }
}
