/**
 * PsyBook – Google Apps Script backend (code.gs)
 * 완전 새로 작성 (ES5 호환) – 2025-07-21
 *   • 로그인 + 대출 정보를 한 시트(SHEET_LOG)에 기록
 *   • 선반 재고는 Bookshelf A/B/C 세 시트에서 관리
 *   • 반납 로직 없음 (관리자가 시트 D열을 FREE 로 수동 초기화)
 *
 *  !!! 수정해야 할 값 !!!
 *    1) SPREADSHEET_ID   : 실제 스프레드시트 ID
 *    2) SHEET_LOG        : 로그인·대출 기록 시트 이름
 *    3) SHEETS_BOOKSHELF : 선반 시트 이름 배열
 * -------------------------------------------------------
 */

/********************  CONFIG  ********************/
var SPREADSHEET_ID   = '15m357HDnL8Kv6ZE4EZiani0bmvRTOoTQbeyp39TTadY';
var SHEET_LOG        = 'psybook_data';            // 로그인 + 대출 내역 시트
var SHEETS_BOOKSHELF = ['Bookshelf A', 'Bookshelf B', 'Bookshelf C'];
/**************************************************/

/* ---------- 템플릿·라우팅 ---------- */

/** <?= include('file') ?> 헬퍼 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/** WebApp 진입점 – landing.html 반환 */
function doGet() {
  return HtmlService.createTemplateFromFile('landing')
    .evaluate()
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/* ---------- 사용자 정보 ---------- */

/**
 * 사용자 정보를 SHEET_LOG 에 저장하고 행 번호 반환
 * @return {number} RowIndex (1-based)
 */
function saveUserInfo(name, studentId, phone, email) {
  var ss   = SpreadsheetApp.openById(SPREADSHEET_ID);
  var logS = ss.getSheetByName(SHEET_LOG);
  if (!logS) throw new Error('로그 시트를 찾을 수 없습니다: ' + SHEET_LOG);

  var now = new Date();
  logS.appendRow([now, name, studentId, phone, email, '', '', '', '']);
  return logS.getLastRow();
}

/* ---------- 선반 데이터 ---------- */

/**
 * 선반 시트(A/B/C)에서 전체 재고 정보를 읽어 객체로 반환
 * @return {Object} { A:{1:[{id,title,checkout},…]}, B:{…}, C:{…} }
 */
function getShelfData() {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var result = {};

  SHEETS_BOOKSHELF.forEach(function(sheetName){
    var sh = ss.getSheetByName(sheetName);
    if (!sh) return;

    var vals = sh.getDataRange().getValues();   // A:D
    for (var r = 1; r < vals.length; r++) {     // 헤더 제외
      var slot  = vals[r][0];                   // A01, B01 …
      var blk   = slot.charAt(0);               // 'A' | 'B' | 'C'
      var idx   = parseInt(slot.slice(2), 10);  // 01→1 …
      if (!result[blk])      result[blk] = {};
      if (!result[blk][idx]) result[blk][idx] = [];

      result[blk][idx].push({
        id:       vals[r][1],
        title:    vals[r][2],
        checkout: vals[r][3]            // 'FREE' | '대출'
      });
    }
  });
  return result;
}

/* ---------- 대출 처리 ---------- */

/**
 * 대출 기록을 남기고 선반 CheckOut 열을 **'대출'** 로 기입.
 * 프런트 호출 시그니처와 일치:
 *   borrowBook(rowIdx, slot, bookId, title, checkoutDate, dueDate)
 */
function borrowBook(rowIdx, slot, bookId, title, checkoutDate, dueDate) {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);

  /* 1) 선반 시트 D열 상태 확인 및 업데이트 */
  var updated = false;
  SHEETS_BOOKSHELF.forEach(function(name){
    if (updated) return;
    var sh = ss.getSheetByName(name);
    if (!sh) return;

    var vals = sh.getDataRange().getValues();   // A:D
    for (var r = 1; r < vals.length; r++){
      if (vals[r][0] === slot && vals[r][1] === bookId){
        if (vals[r][3] === '대출'){
          throw new Error('이미 대출된 책입니다.');
        }
        sh.getRange(r+1, 4).setValue('대출');   // D열 ← '대출'
        updated = true;
        break;
      }
    }
  });
  if (!updated) throw new Error('해당 슬롯을 찾을 수 없습니다: ' + slot);

  /* 2) SHEET_LOG F-I 열 기록 */
  var logS = ss.getSheetByName(SHEET_LOG);
  if (!logS) throw new Error('로그 시트를 찾을 수 없습니다: ' + SHEET_LOG);
  logS.getRange(rowIdx, 6, 1, 4)
      .setValues([[bookId, title, checkoutDate, dueDate]]);
}

/* ---- 이전 버전의 중복 함수는 삭제/주석 처리 ----
function borrowBook(row, id, title, startDate, endDate) { … }
*/
