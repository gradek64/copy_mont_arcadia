const regexString = '([A-Z]+-[0-9]+|e2e|hotfix)'

module.exports.getBranchId = (str) => {
  const match = str.match(new RegExp(regexString, 'i'))
  return match && match.length ? match[0].toUpperCase() : null
}

module.exports.startsWithValidBranchId = (str) => {
  return str.match(new RegExp(`^${regexString}`, 'i')) ? true : false
}
