/************************************************************
 *  Code.gs ― PsyBook Web-App (수정 완료 전면 버전)
 *  - landing.html  ↔ library.html SPA 흐름 지원
 *  - 개인정보 저장, 책장 데이터 제공
 ************************************************************/

/**
 * 웹앱 엔드포인트
 *   .../exec              → landing.html
 *   .../exec?page=library → library.html
 */
function doGet(e) {
  const page = (e && e.parameter.page) ? e.parameter.page : 'landing';
  return HtmlService.createHtmlOutputFromFile(page)
           .setTitle('PsyBook');
}

/**
 * 개인정보를 psybook_data 시트에 저장
 * @param {{name:string, studentId:string, phone:string, email:string}} data
 * @return {boolean}  true = 저장 성공 / false = 실패
 */
function storeUserData(data) {
  try {
    const ss    = SpreadsheetApp.openById('15m357HDnL8Kv6ZE4EZiani0bmvRTOoTQbeyp39TTadY');
    const sheet = ss.getSheetByName('psybook_data');
    sheet.appendRow([
      new Date(),          // 타임스탬프
      data.name,
      data.studentId,
      data.phone,
      data.email
    ]);
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

/**
 * 1) 개인정보 저장
 * 2) library.html 의 <style> + <body>를 한꺼번에 반환
 */
function saveUserInfoAndLoadLibrary(name, studentId, phone, email) {
  // ① 개인정보 저장
  const ok = storeUserData({ name, studentId, phone, email });
  if (!ok) return '<p style="color:red">❌ 저장 실패</p>';

  // ② library.html 전체 소스 가져오기
  const full = HtmlService.createHtmlOutputFromFile('library').getContent();

  // ③ <head> 영역 안의 모든 <style>…</style> 태그 뽑기
  const styles = (full.match(/<style[^>]*>[\s\S]*?<\/style>/gi) || []).join('\n');

  // ④ <body>…</body> 안쪽만 추출
  const bodyOnly = (full.match(/<body[^>]*>([\s\S]*?)<\/body>/i) || [,''])[1];

  // ⑤ 스타일 + 본문을 합쳐서 landing.html 로 돌려줌
  return styles + '\n' + bodyOnly;
}

/**
 * 책장 시트(Bookshelf A·B·C) 정보를
 * {A:{1:[…],2:[…],3:[…]}, B:{…}, C:{…}} 형태로 반환
 */
function getShelfData() {
  const ss      = SpreadsheetApp.openById('15m357HDnL8Kv6ZE4EZiani0bmvRTOoTQbeyp39TTadY');
  const blocks  = ['A', 'B', 'C'];
  const result  = {};
  blocks.forEach(b => result[b] = {1:[], 2:[], 3:[]});

  blocks.forEach(block => {
    const sheet = ss.getSheetByName('Bookshelf ' + block);
    if (!sheet) return;
    const last = sheet.getLastRow();
    if (last < 2) return;
    const rows = sheet.getRange(2, 1, last - 1, 3).getValues();
    rows.forEach(([shelfId, , title]) => {
      shelfId = String(shelfId).trim();
      title   = String(title).trim();
      if (!shelfId) return;
      const blk = shelfId.charAt(0);
      const idx = parseInt(shelfId.slice(-1), 10);
      if (result[blk] && result[blk][idx]) result[blk][idx].push(title);
    });
  });

  return result;
}
