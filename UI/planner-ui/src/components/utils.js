function getDependencies(id, objects) {
  const dependencies = [];

  function findDependencies(currentId) {
    const obj = objects.find((obj) => obj.name === currentId || obj.id === currentId);
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
  return objects.filter((obj) => dependencies.includes(obj.id));
}

export { getDependencies };
