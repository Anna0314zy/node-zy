
const url = require('url')

module.exports = {
   get path() { //Object.defineProperty
    //   console.log(this); //谁调用就是谁
      let {pathname} = url.parse(this.req.url)
      return pathname;

   },
   get query() {
    let {query} = url.parse(this.req.url,true)
    return query;
   },
   get header() {
    return this.req.headers;
  },

  /**
   * Set request header.
   *
   * @api public
   */

  set header(val) {
    this.req.headers = val;
  }
}