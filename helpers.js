function filterFields(object) {
  const parts = {};

  Object.keys(object).forEach(key => {
    const value = object[key];

    if (value && typeof value !== 'object')
      parts[key] = value
  });

  return parts;
}

function sortObject(object, sort_function = null) {
  // Sort
  const keys = Object.keys(object);
  if (sort_function)
    keys.sort(sort_function);
  else
    keys.sort();

  // Get values base on sorted keys
  const result = {};
  for (let key of keys) {
    if (object.hasOwnProperty(key))
      result[key] = object[key]
  }


  return result;
}

/**
 * @param {URL} url
 * @return {{hostname: string, password: string, protocol: string, search: string, port: string, origin: string, host: string, href: string, hash: string, pathname: string, searchParams: URLSearchParams, username: string}}
 */
function getUrlDetail(url) {

  return filterFields({
    hash: url.hash,
    host: url.host,
    hostname: url.hostname,
    href: url.href,
    origin: url.origin,
    password: url.password,
    pathname: url.pathname,
    port: url.port,
    protocol: url.protocol,
    search: url.search,
    searchParams: url.searchParams,
    username: url.username
  });
}


module.exports.filterFields = filterFields;
module.exports.sortObject = sortObject;
module.exports.getUrlDetail = getUrlDetail;

