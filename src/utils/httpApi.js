/* eslint-disable */
import axios from 'axios';
import _ from 'lodash';
import { HttpError } from './errors';
import { mapTransactionToDo } from './mappers';
import { HTTP_BASE_URL } from './values';
import * as schemas from './schemas';
import { deserialize, list } from './serializr';

const request = axios.create({
  baseURL: HTTP_BASE_URL,
  headers: { 'content-type': 'application/json' },
});

request.interceptors.response.use(
  response => {
    return response.data;
  },
  async error => {
    const { response } = error;
    let newError = error;
    if (response) {
      let code = HttpError.CODES.UNKNOWN_ERROR;
      if (response.status === 400) {
        code = HttpError.CODES.BAD_REQUEST;
      } else if (response.status === 500) {
        code = HttpError.CODES.INTERNAL_SERVICE_ERROR;
      }
      newError = new HttpError(response.data.message, { cause: error, code });
    } else {
      newError = new HttpError(error.message || 'Network Error', {
        cause: error,
        code: HttpError.CODES.NETWORK_ERROR,
      });
    }
    throw newError;
  },
);

export default {
  async getListOfNodes(data) {
    const result = await request({ method: 'post', url: '/listofnodes', data: data });
    return result;
  },
  async getDashboard(data) {
    const result = await request({ method: 'post', url: '/mydashboard', data: data });
    return result;
  },
  async getStakeAmountInfo(data) {
    const result = await request({ method: 'post', url: '/stakeamountinfo', data: data });
    return result;
  },
  async getNodeDetail(data) {
    const result = await request({ method: 'post', url: '/nodedetails', data: data });
    return result;
  },
  async getMyNodes(data) {
    const result = await request({ method: 'post', url: '/myvalidator', data: data });
    return result;
  },
  async getOverview() {
    const result = await request({ method: 'get', url: '/overview' });
    return result;
  },
};
