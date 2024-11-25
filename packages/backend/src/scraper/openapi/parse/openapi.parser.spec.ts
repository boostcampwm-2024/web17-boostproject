/* eslint-disable max-lines-per-function */
import { parseMessage } from './openapi.parser';

const answer = [
  {
    STOCK_ID: '005930',
    MKSC_SHRN_ISCD: 5930,
    STCK_CNTG_HOUR: 93354,
    STCK_PRPR: 71900,
    PRDY_VRSS_SIGN: 5,
    PRDY_VRSS: -100,
    PRDY_CTRT: -0.14,
    WGHN_AVRG_STCK_PRC: 72023.83,
    STCK_OPRC: 72100,
    STCK_HGPR: 72400,
    STCK_LWPR: 71700,
    ASKP1: 71900,
    BIDP1: 71800,
    CNTG_VOL: 1,
    ACML_VOL: 3052507,
    ACML_TR_PBMN: 219853241700,
    SELN_CNTG_CSNU: 5105,
    SHNU_CNTG_CSNU: 6937,
    NTBY_CNTG_CSNU: 1832,
    CTTR: 84.9,
    SELN_CNTG_SMTN: 1366314,
    SHNU_CNTG_SMTN: 1159996,
    CCLD_DVSN: 1,
    SHNU_RATE: 0.39,
    PRDY_VOL_VRSS_ACML_VOL_RATE: 20.28,
    OPRC_HOUR: 90020,
    OPRC_VRSS_PRPR_SIGN: 5,
    OPRC_VRSS_PRPR: -200,
    HGPR_HOUR: 90820,
    HGPR_VRSS_PRPR_SIGN: 5,
    HGPR_VRSS_PRPR: -500,
    LWPR_HOUR: 92619,
    LWPR_VRSS_PRPR_SIGN: 2,
    LWPR_VRSS_PRPR: 200,
    BSOP_DATE: 20230612,
    NEW_MKOP_CLS_CODE: 20,
    TRHT_YN: 'N',
    ASKP_RSQN1: 65945,
    BIDP_RSQN1: 216924,
    TOTAL_ASKP_RSQN: 1118750,
    TOTAL_BIDP_RSQN: 2199206,
    VOL_TNRT: 0.05,
    PRDY_SMNS_HOUR_ACML_VOL: 2424142,
    PRDY_SMNS_HOUR_ACML_VOL_RATE: 125.92,
    HOUR_CLS_CODE: 0,
    MRKT_TRTM_CLS_CODE: null,
    VI_STND_PRC: 72100,
  },
];

describe('openapi parser test', () => {
  test('parse json websocket data', () => {
    const message = `{
        "header": {
            "tr_id": "H0STCNT0", 
            "tr_key": "005930", 
            "encrypt": "N"
            }, 
        "body": {
            "rt_cd": "0", 
            "msg_cd": "OPSP0000",
            "msg1": "SUBSCRIBE SUCCESS", 
            "output": {
                "iv": "0123456789abcdef", 
                "key": "abcdefghijklmnopabcdefghijklmnop"}
            }
        }`;

    const result = parseMessage(message);

    expect(result).toEqual(JSON.parse(message));
  });

  test('parse stockData', () => {
    const message =
      '0|H0STCNT0|001|005930^093354^71900^5^-100^-0.14^72023.83^72100^72400^71700^71900^71800^1^3052' +
      '507^219853241700^5105^6937^1832^84.90^1366314^1159996^1^0.39^20.28^090020^5^-2' +
      '00^090820^5^-500^092619^2^200^20230612^20^N^65945^216924^1118750^2199206^0.05^' +
      '2424142^125.92^0^^72100';

    const result = parseMessage(message);

    expect(result).toEqual(answer);
  });

  test('parse stockData', () => {
    const message =
      '0|H0STCNT0|002|005930^093354^71900^5^-100^-0.14^72023.83^72100^72400^71700^71900^71800^1^3052' +
      '507^219853241700^5105^6937^1832^84.90^1366314^1159996^1^0.39^20.28^090020^5^-2' +
      '00^090820^5^-500^092619^2^200^20230612^20^N^65945^216924^1118750^2199206^0.05^' +
      '2424142^125.92^0^^72100^' +
      '005930^093354^71900^5^-100^-0.14^72023.83^72100^72400^71700^71900^71800^1^3052' +
      '507^219853241700^5105^6937^1832^84.90^1366314^1159996^1^0.39^20.28^090020^5^-2' +
      '00^090820^5^-500^092619^2^200^20230612^20^N^65945^216924^1118750^2199206^0.05^' +
      '2424142^125.92^0^^72100';

    const result = parseMessage(message);

    expect(result).toEqual([answer[0], answer[0]]);
  });
});
