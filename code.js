/**
 * PsyBook – Google Apps Script backend (code.gs)
 * 완전 새로 작성 (ES5 호환) – 2025‑07‑19
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
var SHEET_LOG        = 'psybook_data'; // 로그인 + 대출 내역 시트
var SHEETS_BOOKSHELF = ['Bookshelf A', 'Bookshelf B', 'Bookshelf C'];
/**************************************************/

/**
 * HTML 템플릿 include 헬퍼  (<?= include('file') ?>)
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * WebApp 진입점 : landing.html 반환 (탬플릿)
 */
function doGet() {
  return HtmlService.createTemplateFromFile('landing').evaluate()
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * 사용자 정보를 SHEET_LOG 에 저장하고, 해당 행 번호(RowIndex)를 반환한다.
 * @param {string} name      이름
 * @param {string} studentId 학번
 * @param {string} phone     전화번호
 * @param {string} email     이메일
 * @return {number}          시트 행 번호 (1‑based)
 */
function saveUserInfo(name, studentId, phone, email) {
  var ss   = SpreadsheetApp.openById(SPREADSHEET_ID);
  var logS = ss.getSheetByName(SHEET_LOG);
  if (!logS) throw new Error('로그 시트를 찾을 수 없습니다: ' + SHEET_LOG);

  var now = new Date();
  var newRow = [now, name, studentId, phone, email, '', '', '', ''];
  logS.appendRow(newRow);
  return logS.getLastRow(); // 행 번호 반환
}

/**
 * 선반 시트(A/B/C)에서 전체 재고 데이터를 읽어 객체로 반환.
 * @return {Object}  { A: {1:{id,title},2:{…}}, B: {…}, C:{…} }
 */
/**
 * 선반 시트(A/B/C)에서 전체 재고 데이터를 읽어 객체로 반환.
 * @return {Object}  { A: {1:[{id,title,checkout}, …]}, B: {…}, … }
 */
function getShelfData() {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var result = {};

  for (var i = 0; i < SHEETS_BOOKSHELF.length; i++) {
    var sheetName = SHEETS_BOOKSHELF[i];
    var sh = ss.getSheetByName(sheetName);
    if (!sh) continue;

    var vals = sh.getDataRange().getValues();
    for (var r = 1; r < vals.length; r++) {     // 헤더 제외
      var row   = vals[r];
      var slot  = row[0];                       // A01, B01 …
      var id    = row[1];
      var title = row[2];
      var ck    = row[3];                       // D열 CheckOut (FREE 또는 학번)

      var blk = slot.charAt(0);                 // 'A' | 'B' | 'C'
      var idx = parseInt(slot.slice(2), 10);    // 01→1, 02→2 …

      if (!result[blk])        result[blk] = {};
      if (!result[blk][idx])   result[blk][idx] = [];   // 배열로 초기화
      result[blk][idx].push({
        id: id,
        title: title,
        checkout: ck
      });
    }
  }
  return result;
}


/**
 * 대출 기록을 남기고 선반 CheckOut 열을 학번으로 기입.
 * @param {number} rowIdx        saveUserInfo 가 반환한 로그 시트 행 번호
 * @param {string} slot          "A01" 형식
 * @param {string} checkoutDate  YYYY‑MM‑DD
 * @param {string} dueDate       YYYY‑MM‑DD
 */
function borrowBook(rowIdx, slot, checkoutDate, dueDate) {
  var ss   = SpreadsheetApp.openById(SPREADSHEET_ID);
  var logS = ss.getSheetByName(SHEET_LOG);
  if (!logS) throw new Error('로그 시트를 찾을 수 없습니다.');

  var userRow = logS.getRange(rowIdx, 1, 1, 9).getValues()[0];
  var studentId = userRow[2];
  var name      = userRow[1];

  // 1) 선반 시트에서 해당 슬롯 찾기 & 상태 업데이트
  var found = false;
  for (var i = 0; i < SHEETS_BOOKSHELF.length && !found; i++) {
    var sh = ss.getSheetByName(SHEETS_BOOKSHELF[i]);
    if (!sh) continue;
    var vals = sh.getDataRange().getValues();
    for (var r = 1; r < vals.length; r++) {
      if (vals[r][0] === slot) {
        if (vals[r][3] !== 'FREE') throw new Error('이미 대출 중인 책입니다.');
        sh.getRange(r+1, 4).setValue(studentId); // D열 CheckOut 에 학번 입력
        var bookId = vals[r][1];
        var title  = vals[r][2];
        found = true;
        break;
      }
    }
  }
  if (!found) throw new Error('해당 슬롯을 찾을 수 없습니다: ' + slot);

  // 2) 로그 시트 F‑I 열 채우기 (행 번호는 rowIdx)
  logS.getRange(rowIdx, 6, 1, 4).setValues([[bookId, title, checkoutDate, dueDate]]);
}

function borrowBook(row, id, title, startDate, endDate) {
  SpreadsheetApp.getActive()
    .getSheetByName('psybook_data')   // 탭 이름
    .getRange(row, 6, 1, 4)           // F(6)~I(9) 열
    .setValues([[id, title, startDate, endDate]]);
}

