/* eslint-disable @typescript-eslint/no-explicit-any*/
/* eslint-disable max-lines-per-function */

export type DetailDataQuery = {
  fid_cond_mrkt_div_code: 'J';
  fid_input_iscd: string;
  fid_div_cls_code: '0' | '1';
};
export type FinancialData = {
  stac_yymm: string; // 결산 년월
  grs: string; // 매출액 증가율
  bsop_prfi_inrt: string; // 영업 이익 증가율
  ntin_inrt: string; // 순이익 증가율
  roe_val: string; // ROE 값
  eps: string; // EPS
  sps: string; // 주당매출액
  bps: string; // BPS
  rsrv_rate: string; // 유보 비율
  lblt_rate: string; // 부채 비율
};

export function isFinancialData(data: any): data is FinancialData {
  return (
    data &&
    typeof data.stac_yymm === 'string' &&
    typeof data.grs === 'string' &&
    typeof data.bsop_prfi_inrt === 'string' &&
    typeof data.ntin_inrt === 'string' &&
    typeof data.roe_val === 'string' &&
    typeof data.eps === 'string' &&
    typeof data.sps === 'string' &&
    typeof data.bps === 'string' &&
    typeof data.rsrv_rate === 'string' &&
    typeof data.lblt_rate === 'string'
  );
}

export type ProductDetail = {
  pdno: string; // 상품번호
  prdt_type_cd: string; // 상품유형코드
  mket_id_cd: string; // 시장ID코드
  scty_grp_id_cd: string; // 증권그룹ID코드
  excg_dvsn_cd: string; // 거래소구분코드
  setl_mmdd: string; // 결산월일
  lstg_stqt: string; // 상장주수 - 이거 사용
  lstg_cptl_amt: string; // 상장자본금액
  cpta: string; // 자본금
  papr: string; // 액면가
  issu_pric: string; // 발행가격
  kospi200_item_yn: string; // 코스피200종목여부 - 이것도 사용
  scts_mket_lstg_dt: string; // 유가증권시장상장일자
  scts_mket_lstg_abol_dt: string; // 유가증권시장상장폐지일자
  kosdaq_mket_lstg_dt: string; // 코스닥시장상장일자
  kosdaq_mket_lstg_abol_dt: string; // 코스닥시장상장폐지일자
  frbd_mket_lstg_dt: string; // 프리보드시장상장일자
  frbd_mket_lstg_abol_dt: string; // 프리보드시장상장폐지일자
  reits_kind_cd: string; // 리츠종류코드
  etf_dvsn_cd: string; // ETF구분코드
  oilf_fund_yn: string; // 유전펀드여부
  idx_bztp_lcls_cd: string; // 지수업종대분류코드
  idx_bztp_mcls_cd: string; // 지수업종중분류코드
  idx_bztp_scls_cd: string; // 지수업종소분류코드
  stck_kind_cd: string; // 주식종류코드
  mfnd_opng_dt: string; // 뮤추얼펀드개시일자
  mfnd_end_dt: string; // 뮤추얼펀드종료일자
  dpsi_erlm_cncl_dt: string; // 예탁등록취소일자
  etf_cu_qty: string; // ETFCU수량
  prdt_name: string; // 상품명
  prdt_name120: string; // 상품명120
  prdt_abrv_name: string; // 상품약어명
  std_pdno: string; // 표준상품번호
  prdt_eng_name: string; // 상품영문명
  prdt_eng_name120: string; // 상품영문명120
  prdt_eng_abrv_name: string; // 상품영문약어명
  dpsi_aptm_erlm_yn: string; // 예탁지정등록여부
  etf_txtn_type_cd: string; // ETF과세유형코드
  etf_type_cd: string; // ETF유형코드
  lstg_abol_dt: string; // 상장폐지일자
  nwst_odst_dvsn_cd: string; // 신주구주구분코드
  sbst_pric: string; // 대용가격
  thco_sbst_pric: string; // 당사대용가격
  thco_sbst_pric_chng_dt: string; // 당사대용가격변경일자
  tr_stop_yn: string; // 거래정지여부
  admn_item_yn: string; // 관리종목여부
  thdt_clpr: string; // 당일종가
  bfdy_clpr: string; // 전일종가
  clpr_chng_dt: string; // 종가변경일자
  std_idst_clsf_cd: string; // 표준산업분류코드
  std_idst_clsf_cd_name: string; // 표준산업분류코드명
  idx_bztp_lcls_cd_name: string; // 지수업종대분류코드명
  idx_bztp_mcls_cd_name: string; // 지수업종중분류코드명
  idx_bztp_scls_cd_name: string; // 지수업종소분류코드명
  ocr_no: string; // OCR번호
  crfd_item_yn: string; // 크라우드펀딩종목여부
  elec_scty_yn: string; // 전자증권여부
  issu_istt_cd: string; // 발행기관코드
  etf_chas_erng_rt_dbnb: string; // ETF추적수익율배수
  etf_etn_ivst_heed_item_yn: string; // ETFETN투자유의종목여부
  stln_int_rt_dvsn_cd: string; // 대주이자율구분코드
  frnr_psnl_lmt_rt: string; // 외국인개인한도비율
  lstg_rqsr_issu_istt_cd: string; // 상장신청인발행기관코드
  lstg_rqsr_item_cd: string; // 상장신청인종목코드
  trst_istt_issu_istt_cd: string; // 신탁기관발행기관코드
};

export const isProductDetail = (data: any): data is ProductDetail => {
  return (
    typeof data.pdno === 'string' &&
    typeof data.prdt_type_cd === 'string' &&
    typeof data.mket_id_cd === 'string' &&
    typeof data.scty_grp_id_cd === 'string' &&
    typeof data.excg_dvsn_cd === 'string' &&
    typeof data.setl_mmdd === 'string' &&
    typeof data.lstg_stqt === 'string' &&
    typeof data.lstg_cptl_amt === 'string' &&
    typeof data.cpta === 'string' &&
    typeof data.papr === 'string' &&
    typeof data.issu_pric === 'string' &&
    typeof data.kospi200_item_yn === 'string' &&
    typeof data.scts_mket_lstg_dt === 'string' &&
    typeof data.scts_mket_lstg_abol_dt === 'string' &&
    typeof data.kosdaq_mket_lstg_dt === 'string' &&
    typeof data.kosdaq_mket_lstg_abol_dt === 'string' &&
    typeof data.frbd_mket_lstg_dt === 'string' &&
    typeof data.frbd_mket_lstg_abol_dt === 'string' &&
    typeof data.reits_kind_cd === 'string' &&
    typeof data.etf_dvsn_cd === 'string' &&
    typeof data.oilf_fund_yn === 'string' &&
    typeof data.idx_bztp_lcls_cd === 'string' &&
    typeof data.idx_bztp_mcls_cd === 'string' &&
    typeof data.idx_bztp_scls_cd === 'string' &&
    typeof data.stck_kind_cd === 'string' &&
    typeof data.mfnd_opng_dt === 'string' &&
    typeof data.mfnd_end_dt === 'string' &&
    typeof data.dpsi_erlm_cncl_dt === 'string' &&
    typeof data.etf_cu_qty === 'string' &&
    typeof data.prdt_name === 'string' &&
    typeof data.prdt_name120 === 'string' &&
    typeof data.prdt_abrv_name === 'string' &&
    typeof data.std_pdno === 'string' &&
    typeof data.prdt_eng_name === 'string' &&
    typeof data.prdt_eng_name120 === 'string' &&
    typeof data.prdt_eng_abrv_name === 'string' &&
    typeof data.dpsi_aptm_erlm_yn === 'string' &&
    typeof data.etf_txtn_type_cd === 'string' &&
    typeof data.etf_type_cd === 'string' &&
    typeof data.lstg_abol_dt === 'string' &&
    typeof data.nwst_odst_dvsn_cd === 'string' &&
    typeof data.sbst_pric === 'string' &&
    typeof data.thco_sbst_pric === 'string' &&
    typeof data.thco_sbst_pric_chng_dt === 'string' &&
    typeof data.tr_stop_yn === 'string' &&
    typeof data.admn_item_yn === 'string' &&
    typeof data.thdt_clpr === 'string' &&
    typeof data.bfdy_clpr === 'string' &&
    typeof data.clpr_chng_dt === 'string' &&
    typeof data.std_idst_clsf_cd === 'string' &&
    typeof data.std_idst_clsf_cd_name === 'string' &&
    typeof data.idx_bztp_lcls_cd_name === 'string' &&
    typeof data.idx_bztp_mcls_cd_name === 'string' &&
    typeof data.idx_bztp_scls_cd_name === 'string' &&
    typeof data.ocr_no === 'string' &&
    typeof data.crfd_item_yn === 'string' &&
    typeof data.elec_scty_yn === 'string' &&
    typeof data.issu_istt_cd === 'string' &&
    typeof data.etf_chas_erng_rt_dbnb === 'string' &&
    typeof data.etf_etn_ivst_heed_item_yn === 'string' &&
    typeof data.stln_int_rt_dvsn_cd === 'string' &&
    typeof data.frnr_psnl_lmt_rt === 'string' &&
    typeof data.lstg_rqsr_issu_istt_cd === 'string' &&
    typeof data.lstg_rqsr_item_cd === 'string' &&
    typeof data.trst_istt_issu_istt_cd === 'string'
  );
};

export type StockDetailQuery = {
  pdno: string;
  code: string;
};

//export type FinancialDetail = {
//  stac_yymm: string; // 결산 년월
//  sale_account: string; // 매출액
//  sale_cost: string; // 매출원가
//  sale_totl_prfi: string; // 매출총이익
//  depr_cost: string; // 감가상각비
//  sell_mang: string; // 판매관리비
//  bsop_prti: string; // 영업이익
//  bsop_non_ernn: string; // 영업외수익
//  bsop_non_expn: string; // 영업외비용
//  op_prfi: string; // 영업이익
//  spec_prfi: string; // 특별이익
//  spec_loss: string; // 특별손실
//  thtr_ntin: string; // 세전순이익
//};

//export const isFinancialDetail = (data: any): data is FinancialDetail => {
//  return (
//    typeof data.stac_yymm === 'string' &&
//    typeof data.sale_account === 'string' &&
//    typeof data.sale_cost === 'string' &&
//    typeof data.sale_totl_prfi === 'string' &&
//    typeof data.depr_cost === 'string' &&
//    typeof data.sell_mang === 'string' &&
//    typeof data.bsop_prti === 'string' &&
//    typeof data.bsop_non_ernn === 'string' &&
//    typeof data.bsop_non_expn === 'string' &&
//    typeof data.op_prfi === 'string' &&
//    typeof data.spec_prfi === 'string' &&
//    typeof data.spec_loss === 'string' &&
//    typeof data.thtr_ntin === 'string'
//  );
//};
