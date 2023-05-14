// function getDependencies(id, objects) {
//   const dependencies = [];

//   function findDependencies(currentId) {
//     const obj = objects.find((obj) => obj.name === currentId || obj.id === currentId);
//     if (obj) {
//       obj.dependsOnSubProjectIds?.forEach((dependencyId) => {
//         findDependencies(dependencyId);
//         if (!dependencies.includes(dependencyId)) {
//           dependencies.push(dependencyId);
//         }
//       });
//     }
//   }

//   findDependencies(id);
//   return objects.filter((obj) => dependencies.includes(obj.id));
// }

function getDependencies(id, objects) {
  const dependencies = [];

  function findDependencies(currentId) {
    const obj = objects?.find?.((obj) => obj.id === currentId);
    if (obj) {
      obj.dependsOnSubProjectIds?.forEach((dependencyId) => {
        findDependencies(dependencyId);
        if (!dependencies.includes(dependencyId)) {
          dependencies.push(dependencyId);
        }
      });
    }
  }

  findDependencies(id);
  const result = objects.filter((obj) => dependencies.includes(obj.id));
  const originalObject = objects?.find?.((obj) => obj.id === id);
  if (originalObject && !result.includes(originalObject)) {
    result.push(originalObject);
  }
  return result;
}

function getIdFromName(objects, name) {
  const foundObject = objects?.find?.((obj) => obj.name === name);
  return foundObject ? foundObject.id : null;
}
function setTextAsSoleChild(id, text) {
  const element = document.getElementById(id);
  //   if (element) {
  //     const parent = element.parentNode;
  //     parent.removeChild(element);
  //     parent.appendChild(element);
  //   }

  if (element) {
    element.innerHTML = '';
    const textNode = document.createTextNode(text);
    element.appendChild(textNode);
  }
}
function getSubsetIndices(superset, subset) {
  const indices = [];
  for (let i = 0; i < subset.length; i++) {
    const item = subset[i];
    const index = superset.findIndex((obj) => obj.id === item.id);
    if (index !== -1) {
      indices.push(index);
    }
  }
  return indices;
}

function destroyAndMountNewNode(id) {
  const oldNode = document.getElementById(id);
  if (oldNode) {
    const newNode = document.createElement('div');
    newNode.id = id;
    newNode.style={minHeight:'500px'}
    oldNode.parentNode.replaceChild(newNode, oldNode);
  }
}
export {
  getDependencies,
  getIdFromName,
  setTextAsSoleChild,
  getSubsetIndices,
  destroyAndMountNewNode
};
