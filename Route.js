const URL = require('url').URL;

const {sortObject, filterFields, getUrlDetail} = require('./helpers');

function parseURL(urlString) {
  if (typeof urlString !== 'string')
    throw new Error('Only support to parse URL as string');

  if (urlString.startsWith('/'))
    return {pathname: urlString};

  let urlDetail;

  try {
    urlDetail = getUrlDetail(new URL(urlString));
  } catch (e) {
    return {hostname: urlString};
  }

  return filterFields(urlDetail);
}


class Route {
  /**
   * @param {string|{}} detail
   */
  constructor(detail = null) {
    this._detail = {};
    this._base = {};

    if (detail)
      this.detail = detail;
  }

  set base(value) {
    if (value instanceof Route) {
      this._base = Object.assign({}, value.detail);

      return;
    }

    if (typeof value === 'object') {
      this._base = value;

      return;
    }

    if (typeof value === 'string') {
      this._base = parseURL(value);

      return;
    }

    console.error(value);

    throw new Error('Base detail must be object, string or other Route instance');
  }

  get base() {
    return this._base;
  }

  get detail() {
    let result = Object.assign({}, this._base, this._detail);

    result = filterFields(result);

    return sortObject(result);
  }

  set detail(value) {
    let typeOfValue = typeof value;

    if (typeOfValue === 'string')
      this._detail = parseURL(value);
    else if (typeOfValue === 'object')
      this._detail = value;
    else
      throw new Error('Type of detail is invalid, only support string or object')
  }

  /**
   * @param {string} key
   * @param {*} default_value
   * @return {*}
   */
  get(key, default_value = null) {
    if (!this._detail.hasOwnProperty(key))
      return default_value;

    return this._detail[key];
  }

  setInfo(key, value, in_lower_case = true) {
    value = value.trim();

    if (in_lower_case)
      value = value.toLowerCase();

    this._detail[key.trim()] = value;

    return this;
  }

  unset(keys) {
    if (!(key instanceof Array))
      keys = [keys];

    for (let key of keys)
      delete this._detail[key];

    return this;
  }

  protocol(value) {
    if (!value.endsWith(':'))
      value += ':';

    this.setInfo('protocol', value);

    return this;
  }

  hostname(value) {
    this.setInfo('hostname', value);

    return this;
  }

  method(value) {
    this.setInfo('method', value);

    return this;
  }

  methodPost() {
    this.method('POST');

    return this;
  }

  methodGet() {
    this.method('GET');

    return this;
  }

  pathname(value) {
    this.setInfo('pathname', value, false);

    return this;
  }

  query(value) {
    this.setInfo('query', value, false);

    return this;
  }

  hash(value) {
    this.setInfo('hash', value, false);

    return this;
  }

  extends(detail = null) {
    const instance = new Route();

    instance.base = this.detail;

    if (detail)
      instance.detail = detail;

    return instance;
  }

  isMatch(urlDetail) {
    const detail = this.detail;

    for (let key in detail) {
      if (!detail.hasOwnProperty(key))
        continue;

      if (detail[key] !== urlDetail[key])
        return false;
    }

    return true;
  }
}


module.exports = Route;
