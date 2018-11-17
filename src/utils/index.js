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

function traverseItems(nList, fn) {
  for (let i in nList) {
    let node = nList[i];

    fn.apply(this, [node]);

    if (node.items !== undefined && node.items.length > 0) {
      traverseItems(node.items, fn);
    }
  }
}

function composeEdges(node, edges) {
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
}

function getEdgeLinks(graph) {
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
}

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c === 'x' ? r : ((r & 0x3) | 0x8);
    return v.toString(16);
  });
}

function uuid() {
  return uuidv4();
}

function sortBy(arr, prop) {
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
}

function sortByName(arr) {
  return sortBy(arr, 'name');
}

export {
  sortBy, sortByName, traverseItems,
  composeEdges, getEdgeLinks, uuid
};
