import { CLEAN_UP_REPORT_URL } from ".";


import {createClient} from '../../../plugins/axios'

export const fetchCleanUpReport = () => {
    console.log("logout")
  return createClient().get(
    CLEAN_UP_REPORT_URL,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};