import { CLEAN_UP_REPORT_URL, TRIGGER_CLEANUP } from ".";


import {createClient} from '../../../plugins/axios'

export const fetchCleanUpReport = (page = 1) => {
  return createClient().get(
    `${CLEAN_UP_REPORT_URL}?page=${page}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

export const triggerCleanUpReport = () => {
  return createClient().post(
    TRIGGER_CLEANUP,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};