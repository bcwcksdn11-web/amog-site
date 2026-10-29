// 다음 목요일 낮 12시(한국 시각)까지 남은 시간
(function () {
  var el = document.querySelector('#count b');
  if (el) {
    var tick = function () {
      var now = Date.now();
      var kst = new Date(now + 9 * 3600e3);
      var d = (4 - kst.getUTCDay() + 7) % 7;
      var t = Date.UTC(kst.getUTCFullYear(), kst.getUTCMonth(), kst.getUTCDate() + d, 3, 0, 0); // 12시 KST = 03시 UTC
      if (t <= now) t += 7 * 864e5;
      var s = Math.floor((t - now) / 1000);
      var dd = Math.floor(s / 86400), hh = Math.floor((s % 86400) / 3600), mm = Math.floor((s % 3600) / 60);
      el.textContent = (dd ? dd + '일 ' : '') + hh + '시간 ' + mm + '분';
    };
    tick();
    setInterval(tick, 30000);
  }
  // 마주 보기: 몇 초마다 사람 모양 → 사진 → 다시
  var av = document.getElementById('av'), tx = document.getElementById('revealText');
  if (av && tx) {
    var on = false;
    setInterval(function () {
      on = !on;
      av.classList.toggle('face', on);
      tx.textContent = on ? '두 분이 마주 보게 되었어요' : '두 분 모두 마주 보면 사진이 보여요';
    }, 3200);
  }
})();

// 출시 알림 신청 → 서버 waitlist_join (0049). 공개 키(anon)로 신청 함수만 부를 수 있다
(function () {
  var f = document.getElementById('notifyForm');
  if (!f) return;
  var msg = document.getElementById('notifyMsg');
  var cfg = window.AMOG || {};
  f.addEventListener('submit', function (e) {
    e.preventDefault();
    var email = f.email.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { msg.textContent = '이메일 주소를 확인해 주세요'; f.email.focus(); return; }
    if (!f.adult.checked || !f.privacy.checked || !f.ad.checked) { msg.textContent = '필수 항목 세 개에 모두 동의해 주세요'; return; }
    var btn = f.querySelector('button'); btn.disabled = true; btn.textContent = '보내는 중…'; msg.textContent = '';
    fetch(cfg.url + '/rest/v1/rpc/waitlist_join', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: cfg.key, Authorization: 'Bearer ' + cfg.key },
      body: JSON.stringify({ p_email: email, p_adult: true, p_privacy: true, p_ad: true, p_source: (new URLSearchParams(location.search).get('from') || 'site').slice(0, 40) })
    }).then(function (r) {
      if (!r.ok) throw new Error(String(r.status));
      f.innerHTML = '<p class="n-done">신청했어요. 출시되면 <b>' + email.replace(/</g, '') + '</b>로 가장 먼저 알려 드릴게요.</p>';
    }).catch(function () {
      btn.disabled = false; btn.textContent = '알림 받기';
      msg.textContent = '지금은 신청을 받지 못했어요. 잠시 뒤 다시 해 주세요.';
    });
  });
})();
