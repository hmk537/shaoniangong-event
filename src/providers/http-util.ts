import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import CONSTANTS from '../app/constants'
/*
  Generated class for the HttpUtilProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class HttpUtilProvider {

  constructor(public http: HttpClient) {
    console.log('Hello HttpUtilProvider Provider');
  }

  public queryDict(type, isOrg = false) {
    return this.post(isOrg ? CONSTANTS['ORG_DICTIONARY'] : CONSTANTS['COMMON_DICTIONARY'], { type: type, orgId: localStorage.orgId })
  }

  public post(url, req, withOrg = true) {
    return this.request('post', url, req, withOrg)
  }

  public get(url, req, withOrg = true) {
    return this.request('get', url, req, withOrg)
  }

  private request(method, url, req, withOrg) {
    if(withOrg){
      const orgId = localStorage.orgId
      if(orgId && !req.orgId) {
        req['orgId'] = orgId
      }
    }

    return new Promise((resolve, reject) => {
      /* let formData = new FormData()
      for (const key in req) {
        formData.append(key, req[key])
      } */
      let _req = '', i = 0
      for (const key in req) {
        i++
        if (req[key] instanceof Array) {
          req[key].forEach((val, i) => {
            _req += `${key}=${val}`
            if (i < req[key].length - 1) {
              _req += '&'
            }
          })
        } else {
          _req += `${key}=${req[key]}`
        }
        if (i < Object.keys(req).length) {
          _req += '&'
        }
      }
      /* const body = new HttpParams()
      for (const key in req) {
        body.set(key, req[key])
      } */

      console.log(`REQUEST: ${_req}`)

      const headers = new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      })
      // headers.set('Content-Type', 'application/x-www-form-urlencoded')

      if (method === 'post') {
        this.http.post(url, _req, {
          headers: headers/* ,
          withCredentials: true */
        }).subscribe(_callback)
      } else if (method === 'get') {
        this.http.get(url + '?' + _req, /* {
          headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
        } */).subscribe(_callback)
      } else {
        alert(`不支持的方法：${method}`)
      }

      function _callback(res) {
        if (res['code'] && res['code'] == 0/*  && res['data'] !== null */) {
          resolve(res['data'])
        } else {
          if (res['msg']) {
            reject(res['msg'])
          } else if (res) {// fixme
            resolve(res)
          } else {
            reject('后台错误')
          }
        }

      }

      setTimeout(() => {
        reject('请求超时')
      }, 1000 * 60)
    })
  }
}
