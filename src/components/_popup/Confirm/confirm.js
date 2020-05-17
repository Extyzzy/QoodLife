import Confirmation from './Confirmation';
import { createConfirmation } from 'react-confirm';

const defaultConfirmation = createConfirmation(Confirmation);

export function confirm(title, options = {}) {
  return defaultConfirmation({title, ...options });
}
