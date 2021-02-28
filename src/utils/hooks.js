import { useAsync } from 'react-async';
import axios from 'axios';

import config from '../config';
import { partial } from '../utils/func';

const buildHeaders = (additionalHeaders = {}) => ({
  ...{ Authorization: `Bearer ${localStorage.getItem("token")}` },
  ...additionalHeaders,
});

const useRest = (
  method,
  endPoint,
  args,
  raOpts = {},
  additionalHeaders = {}
) => {
  return useAsync({
    deferFn: ([runArgs]) =>
      new Promise((resolve, reject) => {
        axios({
          method,
          headers: buildHeaders(additionalHeaders),
          url: `${config.restApiBase}${endPoint}`,
          [method === "get" ? "params" : "data"]: args || runArgs,
        })
          .then(({ data }) => {
            if (!(data && data.meta))
              reject({ msg: "An unknown error occurred." });
            if (data.meta.code >= 200 && data.meta.code < 300) {
              resolve(data.data);
            } else {
              reject({ message: data.meta.message });
            }
          })
          .catch((error) => {
            if (error.response) {
              reject(error.response.data);
            } else {
              reject({ msg: "An unknown error occurred." });
            }
          })
      }),
    ...raOpts, // react-async options
  });
};

export const useGet = partial(useRest, "get");
export const usePost = partial(useRest, "post");
export const usePut = partial(useRest, "put");
export const useDelete = partial(useRest, "delete");