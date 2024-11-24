/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-lines-per-function */

export type StockData = {
  MKSC_SHRN_ISCD: string; // 유가증권 단축 종목코드
  STCK_CNTG_HOUR: string; // 주식 체결 시간
  STCK_PRPR: string; // 주식 현재가
  PRDY_VRSS_SIGN: string; // 전일 대비 부호
  PRDY_VRSS: string; // 전일 대비
  PRDY_CTRT: string; // 전일 대비율
  WGHN_AVRG_STCK_PRC: string; // 가중 평균 주식 가격
  STCK_OPRC: string; // 주식 시가
  STCK_HGPR: string; // 주식 최고가
  STCK_LWPR: string; // 주식 최저가
  ASKP1: string; // 매도호가1
  BIDP1: string; // 매수호가1
  CNTG_VOL: string; // 체결 거래량
  ACML_VOL: string; // 누적 거래량
  ACML_TR_PBMN: string; // 누적 거래 대금
  SELN_CNTG_CSNU: string; // 매도 체결 건수
  SHNU_CNTG_CSNU: string; // 매수 체결 건수
  NTBY_CNTG_CSNU: string; // 순매수 체결 건수
  CTTR: string; // 체결강도
  SELN_CNTG_SMTN: string; // 총 매도 수량
  SHNU_CNTG_SMTN: string; // 총 매수 수량
  CCLD_DVSN: string; // 체결구분
  SHNU_RATE: string; // 매수비율
  PRDY_VOL_VRSS_ACML_VOL_RATE: string; // 전일 거래량 대비 등락율
  OPRC_HOUR: string; // 시가 시간
  OPRC_VRSS_PRPR_SIGN: string; // 시가대비구분
  OPRC_VRSS_PRPR: string; // 시가대비
  HGPR_HOUR: string; // 최고가 시간
  HGPR_VRSS_PRPR_SIGN: string; // 고가대비구분
  HGPR_VRSS_PRPR: string; // 고가대비
  LWPR_HOUR: string; // 최저가 시간
  LWPR_VRSS_PRPR_SIGN: string; // 저가대비구분
  LWPR_VRSS_PRPR: string; // 저가대비
  BSOP_DATE: string; // 영업 일자
  NEW_MKOP_CLS_CODE: string; // 신 장운영 구분 코드
  TRHT_YN: string; // 거래정지 여부
  ASKP_RSQN1: string; // 매도호가 잔량1
  BIDP_RSQN1: string; // 매수호가 잔량1
  TOTAL_ASKP_RSQN: string; // 총 매도호가 잔량
  TOTAL_BIDP_RSQN: string; // 총 매수호가 잔량
  VOL_TNRT: string; // 거래량 회전율
  PRDY_SMNS_HOUR_ACML_VOL: string; // 전일 동시간 누적 거래량
  PRDY_SMNS_HOUR_ACML_VOL_RATE: string; // 전일 동시간 누적 거래량 비율
  HOUR_CLS_CODE: string; // 시간 구분 코드
  MRKT_TRTM_CLS_CODE: string; // 임의종료구분코드
  VI_STND_PRC: string; // 정적VI발동기준가
};

export function parseStockData(message: string[]): StockData {
  return {
    MKSC_SHRN_ISCD: message[0],
    STCK_CNTG_HOUR: message[1],
    STCK_PRPR: message[2],
    PRDY_VRSS_SIGN: message[3],
    PRDY_VRSS: message[4],
    PRDY_CTRT: message[5],
    WGHN_AVRG_STCK_PRC: message[6],
    STCK_OPRC: message[7],
    STCK_HGPR: message[8],
    STCK_LWPR: message[9],
    ASKP1: message[10],
    BIDP1: message[11],
    CNTG_VOL: message[12],
    ACML_VOL: message[13],
    ACML_TR_PBMN: message[14],
    SELN_CNTG_CSNU: message[15],
    SHNU_CNTG_CSNU: message[16],
    NTBY_CNTG_CSNU: message[17],
    CTTR: message[18],
    SELN_CNTG_SMTN: message[19],
    SHNU_CNTG_SMTN: message[20],
    CCLD_DVSN: message[21],
    SHNU_RATE: message[22],
    PRDY_VOL_VRSS_ACML_VOL_RATE: message[23],
    OPRC_HOUR: message[24],
    OPRC_VRSS_PRPR_SIGN: message[25],
    OPRC_VRSS_PRPR: message[26],
    HGPR_HOUR: message[27],
    HGPR_VRSS_PRPR_SIGN: message[28],
    HGPR_VRSS_PRPR: message[29],
    LWPR_HOUR: message[30],
    LWPR_VRSS_PRPR_SIGN: message[31],
    LWPR_VRSS_PRPR: message[32],
    BSOP_DATE: message[33],
    NEW_MKOP_CLS_CODE: message[34],
    TRHT_YN: message[35],
    ASKP_RSQN1: message[36],
    BIDP_RSQN1: message[37],
    TOTAL_ASKP_RSQN: message[38],
    TOTAL_BIDP_RSQN: message[39],
    VOL_TNRT: message[40],
    PRDY_SMNS_HOUR_ACML_VOL: message[41],
    PRDY_SMNS_HOUR_ACML_VOL_RATE: message[42],
    HOUR_CLS_CODE: message[43],
    MRKT_TRTM_CLS_CODE: message[44],
    VI_STND_PRC: message[45],
  };
}

export type OpenApiMessage = {
  header: {
    approval_key: string;
    custtype: string;
    tr_type: string;
    'content-type': string;
  };
  body: {
    input: {
      tr_id: string;
      tr_key: string;
    };
  };
};

export type MessageResponse = {
  header: {
    tr_id: string;
    tr_key: string;
    encrypt: string;
  };
  body: {
    rt_cd: string;
    msg_cd: string;
    msg1: string;
    output?: {
      iv: string;
      key: string;
    };
  };
};

export function isMessageResponse(data: any): data is MessageResponse {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof data.header === 'object' &&
    data.header !== null &&
    typeof data.header.tr_id === 'object' &&
    typeof data.header.tr_key === 'object' &&
    typeof data.header.encrypt === 'object' &&
    typeof data.body === 'object' &&
    data.body !== null &&
    typeof data.body.rt_cd === 'object' &&
    typeof data.body.msg_cd === 'object' &&
    typeof data.body.msg1 === 'object' &&
    typeof data.body.output === 'object'
  );
}
