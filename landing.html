<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>PsyBook | 로그인 및 개인정보 동의</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: sans-serif;
      background-color: #ffffff;
    }
    .background-img {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      object-fit: cover;
      z-index: -1;
      opacity: 0.08;
      pointer-events: none;
    }
    .container {
      display: flex;
      flex-direction: row;
      width: 100%;
      min-height: 100vh;
    }
    .left, .right {
      flex: 1;
      padding: 40px;
      box-sizing: border-box;
    }
    .left {
      background-color: rgba(245, 245, 245, 0.9);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      box-shadow: inset -10px 0 20px rgba(0,0,0,0.05);
    }
    .left .inner {
      margin: 0 auto;
      max-width: 400px;
    }
    .left h1 {
      margin-top: 0;
      font-size: 2.2em;
    }
    .left p {
      margin: 10px 0;
      line-height: 1.6;
    }
    .right {
      background-color: rgba(255, 255, 255, 0.8);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    form {
      display: flex;
      flex-direction: column;
      width: 100%;
      max-width: 300px;
    }
    input {
      margin-bottom: 15px;
      padding: 10px;
      font-size: 16px;
      border: 1px solid #ccc;
      outline: none;
    }
    button {
      padding: 10px;
      font-size: 16px;
      background-color: #4CAF50;
      color: white;
      border: none;
      cursor: pointer;
    }
    button:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
  </style>
</head>
<body>
  <img class="background-img" src="https://raw.githubusercontent.com/JuKang80/Psybook/main/knu_psy_logo.jpg" alt="배경">

  <div class="container">
    <div class="left">
      <h1>📚 PsyBook</h1>
<h3>심리학과 도서대여 웹서비스</h3>
<p>
  <strong>운영기간:</strong> 평일과 주말 24시간<br>
  <strong>대상:</strong> 사회과학대학 204호 심리학과 과방 내 전공책 도서
</p>
<p>
  수집된 정보는 대여 관리 목적 외 다른 용도로 활용되지 않으며, 
  <strong>수집 이용의 목적 달성 시까지</strong> 보관됩니다.
</p>
<p style="color: red; font-weight: bold;">
  ❗ 사이트를 통하지 않고 무단 사용하거나 허위로 정보를 작성할 경우, 
  즉시 대여가 취소되며 앞으로의 이용이 제한될 수 있습니다.
</p>
<p>
  👉 <strong>대여사업 관리:</strong> <a href="tel:01021728496">010-2172-8496</a>
</p>
<p>
  본 서비스는 <strong>이름, 학번, 전화번호, 이메일</strong>을 수집하며, 
  도서 대여 이력 관리를 위해서만 사용됩니다.
</p>
<label>
  <input type="checkbox" id="agreeCheckbox"> 개인정보 수집 및 이용에 동의합니다.
</label>
    </div>

    <div class="right">
      <form id="userForm">
        <input type="text" id="name" placeholder="이름" required>
        <input type="text" id="studentId" placeholder="학번" required>
        <input type="tel" id="phone" placeholder="전화번호" required>
        <input type="email" id="email" placeholder="이메일" required>
        <button type="submit" id="submitBtn" disabled>책 보러가기</button>
      </form>
    </div>
  </div>

  <script>
  const form = document.getElementById("userForm");
  const checkbox = document.getElementById("agreeCheckbox");
  const submitBtn = document.getElementById("submitBtn");
  const nameInput = document.getElementById("name");
  const studentIdInput = document.getElementById("studentId");
  const phoneInput = document.getElementById("phone");
  const emailInput = document.getElementById("email");

  function isNotBlank(str) { return str.trim().length > 0; }
  function isValidEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }
  function applyValidationStyle(input, valid) {
    input.style.border = valid ? "1px solid #ccc" : "2px solid red";
  }
  function validateForm() {
    const nv = isNotBlank(nameInput.value);
    const siv = isNotBlank(studentIdInput.value);
    const pv = isNotBlank(phoneInput.value);
    const ev = isNotBlank(emailInput.value) && isValidEmail(emailInput.value);
    applyValidationStyle(nameInput, nv);
    applyValidationStyle(studentIdInput, siv);
    applyValidationStyle(phoneInput, pv);
    applyValidationStyle(emailInput, ev);
    submitBtn.disabled = !(nv && siv && pv && ev && checkbox.checked);
  }

  checkbox.addEventListener("change", validateForm);
  [nameInput, studentIdInput, phoneInput, emailInput].forEach(i => i.addEventListener("input", validateForm));

  form.addEventListener("submit", e => {
    e.preventDefault();
    submitBtn.disabled = true;
    submitBtn.textContent = "저장 중...";
    google.script.run
      .withSuccessHandler(html => {
        document.body.innerHTML = html;
        initLibrary();
      })
      .withFailureHandler(err => {
        console.error(err);
        submitBtn.disabled = false;
        submitBtn.textContent = "책 보러가기";
      })
      .saveUserInfoAndLoadLibrary(
        nameInput.value,
        studentIdInput.value,
        phoneInput.value,
        emailInput.value
      );
  });

  function initLibrary() {
    let backdrop, modal, track;

    function buildModal() {
      backdrop = document.createElement('div');
      backdrop.className = 'shelf-backdrop';
      backdrop.addEventListener('click', closeAll);

      modal = document.createElement('div');
      modal.className = 'book-modal';

      const prev = document.createElement('button');
      prev.className = 'modal-arrow'; prev.innerHTML = '&#9664;';
      const next = document.createElement('button');
      next.className = 'modal-arrow'; next.innerHTML = '&#9654;';
      track = document.createElement('div');
      track.className = 'modal-track';
      prev.onclick = () => track.scrollBy({ left: -300, behavior: 'smooth' });
      next.onclick = () => track.scrollBy({ left:  300, behavior: 'smooth' });

      modal.append(prev, track, next);
    }

    function closeAll() {
      backdrop && backdrop.remove();
      modal && modal.remove();
      document.querySelectorAll('.shelf-row.selected').forEach(r => r.classList.remove('selected'));
    }

    if (!window.shelfData) {
      google.script.run.withSuccessHandler(data => window.shelfData = data)
                       .getShelfData();
    }

    document.querySelectorAll('.shelf-row').forEach(row => {
      row.addEventListener('click', () => {
        if (!backdrop) buildModal();
        closeAll();

        row.classList.add('selected');

        const rect = row.getBoundingClientRect();
        const topPos  = window.scrollY + rect.top;
        const leftPos = window.scrollX + rect.left;

        Object.assign(backdrop.style, {
          top:     topPos   + 'px',
          left:    leftPos  + 'px',
          width:   rect.width  + 'px',
          height:  rect.height + 'px',
          display: 'block'
        });
        document.body.append(backdrop);

        track.innerHTML = '';
        const id  = row.textContent.trim();
        const blk = id.charAt(0), idx = id.slice(-1);
        (window.shelfData?.[blk]?.[idx] || []).forEach(t => {
          const c = document.createElement('div');
          c.className = 'modal-card';
          c.textContent = t || '(제목 없음)';
          track.append(c);
        });

        Object.assign(modal.style, {
          top:     topPos   + 'px',
          left:    leftPos  + 'px',
          display: 'flex'
        });
        document.body.append(modal);

        // 변경된 애니메이션 호출: setTimeout을 사용
        setTimeout(() => {
          modal.classList.add('show');
        }, 0);
      });
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeAll();
    });
  }
</script>

</body>
</html>
