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

import io from 'socket.io-client';

function uiSocket() {
  var uiSocket = io('http://localhost:8888');
  uiSocket.on('error', function(err) {
    console.log('uiSocket error');
  });
  return uiSocket;
}

function traverseItems(nList, fn) {
  for (let i in nList) {
    let node = nList[i];

    fn.apply(this, [node]);

    if (node.items !== undefined && node.items.length > 0) {
      traverseItems(node.items, fn);
    }
  }
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

function sortByName(arr) {
  let arrCopy = arr.slice();

  arrCopy.sort((a, b) => {
    let aName = a.name.toUpperCase(),
        bName = b.name.toUpperCase();

    if(aName < bName) {
      return -1;
    }

    if(aName > bName) {
      return 1;
    }

    return 0;
  });

  return arrCopy;
}

export {
  sortByName,
  traverseItems,
  uiSocket,
  uuid
};
