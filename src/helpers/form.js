import { isEqual, isNil } from 'lodash';
import { confirm } from '../components/_popup/Confirm';
import {SilencedError} from "../exceptions/errors";

/**
 * Append object values to provided FormData.
 *
 * @param {FormData} formData
 * @param {object} data
 * @param keyPrefix
 * @return {FormData}
 */
export function appendToFormData(formData, data, keyPrefix) {
  if (data instanceof Object) {
    Object.keys(data).forEach(k => {
      const v = data[k];

      /**
       * Skip null or undefined values.
       */
      if ( ! isNil(v)) {
        if (keyPrefix) {
          k = `${keyPrefix}[${k}]`;
        }

        /**
         * Check the object to be pure javascript Object
         * to avoid the issue when value could be an array
         * or another type of Object that don't need to be
         * parsed, ex. File, ...
         */
        if (v instanceof Object && v.constructor.name === 'Object') {
          return appendToFormData(formData, v, k);
        }

        if (v instanceof Array) {
          v.forEach((v, i) => {
            if (v instanceof Object && v.constructor.name === 'Object') {
              appendToFormData(formData, v, `${k}[${i}]`);
            }
            else {
              formData.append(`${k}[${i}]`, v);
            }
          });
        } else {
          formData.append(k, v);
        }
      }
    });
  }

  return formData;
}

/**
 * Check if there are some differences between
 * initial form data and the data from state.
 *
 * @param {object} initialFormData
 * @param {object} currentFormState
 * @returns {boolean}
 */
export function didFormDataHasChanged(initialFormData, currentFormState) {
  for (let key in initialFormData) {
    if (currentFormState.hasOwnProperty(key)) {
      if( ! isEqual(initialFormData[key], currentFormState[key])) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Helper method that prevent popup from closing
 * if given param is true.
 * Confirm will be shown to let user decide if
 * wants to close it.
 *
 * @param _this, The object reference where is stored the state
 * @param param, The object property key where is stored the state
 */
export const catchAccidentalFormClose = (_this, param = '__formDataHasChanged') => (
  (resolve, reject) => {
    if (_this[param]) {
      confirm("There are some changes, are you sure you want to close the dialog?", {
        omitOverflow: true,
      })
      .then(
        () => {
          resolve();
        },
        () => {
          reject(
            new SilencedError(
              'User chose to not close the dialog.'
            )
          );
        }
      );
    }
    else {
      resolve();
    }
  }
);
