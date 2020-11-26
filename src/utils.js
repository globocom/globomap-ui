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

import forOwn from 'lodash/forOwn';

export const customMapsSuffix = '_custom_maps';

export const traverseItems = (nList, fn) => {
  for (let i in nList) {
    let node = nList[i];

    fn.apply(this, [node]);

    if (node.items !== undefined && node.items.length > 0) {
      traverseItems(node.items, fn);
    }
  }
};

export const composeEdges = (node, edges) => {
  let nEdges = { in: [], out: [] };

  for(let i=0, l=edges.length; i<l; ++i) {
    let edge = edges[i];

    if(node._id === edge._to) {
      edge.dir = 'in';
      nEdges.in.push(edge);
    }

    if(node._id === edge._from) {
      edge.dir = 'out';
      nEdges.out.push(edge);
    }
  }

  return nEdges;
};

export const getEdgeLinks = (graph) => {
  let collections = [];

  graph.links.forEach((edge) => {
    edge.from_collections.forEach((key) => {
      collections.push(key);
    })
    edge.to_collections.forEach((key) => {
      collections.push(key);
    })
  });

  return collections;
};

const uuidv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c === 'x' ? r : ((r & 0x3) | 0x8);
    return v.toString(16);
  });
};

export const uuid = () => {
  return uuidv4();
};

export const sortBy = (arr, prop) => {
  let arrCopy = arr.slice();

  arrCopy.sort((a, b) => {
    let aProp = a[prop].toUpperCase(),
        bProp = b[prop].toUpperCase();

    if(aProp < bProp) {
      return -1;
    }

    if(aProp > bProp) {
      return 1;
    }

    return 0;
  });

  return arrCopy;
};

export const sortByName = (arr) => {
  return sortBy(arr, 'name');
};

export const sortByTimestampAndName = (arr, reverse=false) => {
  return sortBy(arr, 'name').sort((a,b) => {
    if (reverse) {
      return b['timestamp'] - a['timestamp']
    }
    return a['timestamp'] - b['timestamp']
  });
};

export const turnOffLoadings = (state) => {
  return forOwn(state, (v, k, o) => {
    if (typeof k === 'string' && k.toLowerCase().includes('loading')) {
      o[k] = false;
    }
    if (typeof v === 'object') {
      o[k] = turnOffLoadings(v);
    }
  });
};

const containsObject = (obj, list) => {
  for (let i=0, j=list.length; i<j; i++) {
    if (list[i]._id === obj._id) {
      return true;
    }
  }
  return false;
};

const removeEdges = (fatherId, node) => {
  let newNode = Object.assign({}, node);
  if (newNode.edges) {
    newNode.edges = Object.assign({}, node.edges);
    newNode.edges.in = newNode.edges.in.filter(_edge => {
      return _edge._from === fatherId;
    });
    newNode.edges.out = newNode.edges.out.filter(_edge => {
      return _edge._to === fatherId;
    });
  }
  return newNode;
}

const addChildren = (graph, node) => {
  const nodeId = node._id;
  let newNode = Object.assign({}, node);

  if (!newNode.items) {
    newNode.items = [];
  }

  for (let i=0, j=graph.edges.length; i<j; i++) {
    if (graph.edges[i]._from === nodeId) {
      let newChild = graph.nodes.filter(_node => {
        return _node._id === graph.edges[i]._to;
      });

      if (newChild.length > 0) {
        if (!containsObject(newChild[0], newNode.items)) {
          newChild[0].items = [];
          let childNode = Object.assign({'uuid': uuid()}, newChild[0]);
          childNode = removeEdges(newNode._id, childNode);
          newNode.items.push(childNode);
        }
      }
    } else if (graph.edges[i]._to === nodeId) {
      let newChild = graph.nodes.filter(_node => {
        return _node._id === graph.edges[i]._from;
      });

      if (newChild.length > 0) {
        if (!containsObject(newChild[0], newNode.items)) {
          newChild[0].items = [];
          let childNode = Object.assign({'uuid': uuid()}, newChild[0]);
          childNode = removeEdges(newNode._id, childNode);
          newNode.items.push(childNode);
        }
      }
    }
  }

  return newNode;
};

const addChildrenNoRepetition = (graph, father, uniqueProp) => {
  let possibleChildren = addChildren(graph, father.node).items;
  father.node.items = [];
  for (let i=0, l=possibleChildren.length; i<l; i++) {
    if (!father.ancestors.includes(possibleChildren[i][uniqueProp])) {
      father.node.items.push(possibleChildren[i]);
    }
  }
};

const getNextGeneration = (father, uniqueProp) => {
  let nextGeneration = [];
  for (let i=0, l=father.node.items.length; i<l; i++) {
    nextGeneration.push({
      'ancestors': [...father.ancestors, father.node[uniqueProp]],
      'node': father.node.items[i]
    });
  }
  return nextGeneration;
};

export const traversalToStage = (src, uniqueProp='_id') => {
  if (src.length === 0) {
    return [];
  }

  let graph = src[0];
  let tree = [Object.assign({'root': true, 'uuid': uuid()}, graph.nodes[0])];

  tree[0] = addChildren(graph, tree[0]);

  let newestNodes = [];
  for (let i=0, l=tree[0].items.length; i<l ; i++) {
    newestNodes.push({'ancestors': [tree[0][uniqueProp]], 'node': tree[0].items[i]});
  }

  while (newestNodes.length > 0) {
    let nextNodes = [];
    for (let i=0, l=newestNodes.length; i<l; i++) {
      addChildrenNoRepetition(graph, newestNodes[i], uniqueProp);
      nextNodes.push.apply(nextNodes, getNextGeneration(newestNodes[i], uniqueProp));
    }
    newestNodes = nextNodes;
  }

  return tree;
};

export const fakeEdge = {
  _key: "",
  _id: "",
  _from: "",
  _to: "",
  _rev: "",
  id: "",
  name: "",
  provider: "",
  timestamp: 1564035134,
  type: "port",
  properties: {},
  properties_metadata: {}
};

export const saveLocal = (item, value) => {
  try {
    localStorage.setItem(item, value);
  } catch {
    // Ignore write errors.
  }
};

export const getLocal = (item) => {
  try {
    const value = localStorage.getItem(item);
    return value;
  } catch (err) {
    return null;
  }
};

export const loadState = () => {
  const serializedState = getLocal('gmapState');

  if (serializedState === null) {
    return undefined;
  }

  return JSON.parse(serializedState);
};

export const saveState = (state) => {
  const serializedState = JSON.stringify(state);
  saveLocal('gmapState', serializedState);
};
