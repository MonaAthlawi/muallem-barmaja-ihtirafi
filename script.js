// ===== إعدادات العرض: خط + غامق + ليلي =====
const root = document.documentElement;
let fsScale = parseFloat(localStorage.getItem('fsScale')||'1');
function applyFs(){
  root.style.setProperty('--fs-scale', fsScale);
  document.getElementById('fontSizeLabel').textContent = Math.round(fsScale*100)+'%';
  document.getElementById('fontRange').value = Math.round(fsScale*100);
  localStorage.setItem('fsScale', fsScale);
}
document.getElementById('fontIncrease').onclick = ()=>{ fsScale=Math.min(1.6, +(fsScale+0.1).toFixed(2)); applyFs(); };
document.getElementById('fontDecrease').onclick = ()=>{ fsScale=Math.max(0.8, +(fsScale-0.1).toFixed(2)); applyFs(); };
document.getElementById('fontRange').oninput = e=>{ fsScale=e.target.value/100; applyFs(); };
const boldBtn=document.getElementById('boldToggle');
function applyBold(){ const on=document.body.classList.contains('bold-all'); boldBtn.textContent='غامق: '+(on?'تشغيل':'إيقاف'); boldBtn.classList.toggle('active',on); localStorage.setItem('bold',on?'1':'0'); }
boldBtn.onclick=()=>{ document.body.classList.toggle('bold-all'); applyBold(); };
if(localStorage.getItem('bold')==='1') document.body.classList.add('bold-all');
const themeBtn=document.getElementById('themeToggle');
function applyTheme(){ const d=document.body.classList.contains('dark'); themeBtn.textContent=d?'☀️ نهاري':'🌙 ليلي'; localStorage.setItem('theme',d?'dark':'light'); }
themeBtn.onclick=()=>{ document.body.classList.toggle('dark'); applyTheme(); };
if(localStorage.getItem('theme')==='dark') document.body.classList.add('dark');
document.getElementById('resetA11y').onclick=()=>{ fsScale=1; document.body.classList.remove('dark','bold-all'); applyFs(); applyBold(); applyTheme(); };
applyFs(); applyBold(); applyTheme();

// قائمة الموبايل
document.getElementById('menuBtn').onclick=()=>document.getElementById('navLinks').classList.toggle('open');

// ===== التقدم العام =====
function updateProgress(){
  const stepsDone = JSON.parse(localStorage.getItem('stepsDone')||'[]').length;
  const quizDone = localStorage.getItem('quizDone')==='1' ? 1 : 0;
  const pct = Math.round(((stepsDone + quizDone*3)/10)*100);
  document.getElementById('globalProgress').style.width=pct+'%';
  document.getElementById('progressText').textContent=pct+'%';
}

// ===== الرحلة 7 خطوات =====
const journey=[
 {t:'إنشاء حساب مجاني', d:'ادخلي موقع appinventor.mit.edu واضغطي Create Apps! وسجّلي بإيميلك. هذه ورشتك الخاصة.', b:'🧱 افتحي الموقع وسجّلي'},
 {t:'التعرف على الواجهة', d:'الشاشة مقسومة: يمين Designer للرسم، ويسار Blocks للأوامر، وفوق زر Connect للتجربة.', b:'🎨 ميّزي بين المصمم والبلوكات'},
 {t:'إضافة المكونات (Designer)', d:'اسحبي: Label للعنوان، TextBox للكتابة، Button للضغط، Image للصورة، Sound للصوت. كل مكوّن له اسم مثل زر1.', b:'➕ أضيفي زر + مربع نص + لافتة'},
 {t:'تركيب البلوكات (Blocks)', d:'افتحي Blocks: اختاري حدث «عند الضغط زر1» ثم ركّبي تحته أوامر النصوص والشروط والمتغيرات.', b:'🧩 ركّبي أول حدث عند الضغط'},
 {t:'التجربة الحية', d:'من Connect ← AI Companion امسحي QR بتطبيق الهاتف. أي تغيير يظهر فوراً! هذه هي المتعة.', b:'📱 جرّبي على الهاتف'},
 {t:'الحفظ والمشاركة', d:'من Projects ← Save. يمكنك تحميل ملف .aia وإرساله لمعلمتك لترى عملك.', b:'💾 احفظي مشروعك'},
 {t:'التصدير: المخرجات APK', d:'من Build ← Android App (.apk). ستحصلين على ملف تثبيت — ثبّتيه وافرحي! هذا هو OUTPUT النهائي 🎉', b:'📦 صدّري تطبيقك APK'},
];
let stepsDone = new Set(JSON.parse(localStorage.getItem('stepsDone')||'[]'));
const tl=document.getElementById('timeline');
function renderJourney(){
  tl.innerHTML='';
  journey.forEach((s,i)=>{
    const done=stepsDone.has(i);
    const div=document.createElement('div'); div.className='step'+(done?' done':'');
    div.innerHTML=`<div class="num">${done?'✔':i+1}</div><div style="flex:1"><h3>الخطوة ${i+1}: ${s.t}</h3><p>${s.d}</p><div class="block ${i%2?'b-proc':'b-control'} small">${s.b}</div><br><button class="btn small ${done?'':'secondary'} done-btn" data-i="${i}">${done?'تمت بنجاح ✔':'تحديد كتم ✔'}</button></div>`;
    tl.appendChild(div);
  });
  tl.querySelectorAll('.done-btn').forEach(b=>b.onclick=()=>{
    const i=+b.dataset.i; stepsDone.has(i)?stepsDone.delete(i):stepsDone.add(i);
    localStorage.setItem('stepsDone', JSON.stringify([...stepsDone])); renderJourney(); updateProgress();
  });
}
renderJourney();

// ===== موسوعة البلوكات =====
const CATS=[
 {id:'events', name:'🟤 الأحداث Events', color:'#C88330', desc:'نقطة البداية: متى يعمل البرنامج؟'},
 {id:'control', name:'🟡 التحكم Control', color:'#E5A91C', desc:'الشروط والتكرار: القرارات!'},
 {id:'logic', name:'🔵 المنطق Logic', color:'#4A90D9', desc:'صح أم خطأ؟ ومقارنات'},
 {id:'math', name:'🔷 الرياضيات Math', color:'#3B6FE0', desc:'جمع وطرح وعشوائي'},
 {id:'text', name:'🟢 النصوص Text', color:'#5FAE4A', desc:'الكلمات والرسائل والدمج'},
 {id:'lists', name:'🟤 القوائم Lists', color:'#9A6A3A', desc:'صناديق تحفظ عدة أشياء'},
 {id:'vars', name:'🟠 المتغيرات Variables', color:'#E26A2D', desc:'علب تتذكر الأرقام'},
 {id:'proc', name:'🟣 الإجراءات Procedures', color:'#8A55D7', desc:'وصفات جاهزة نناديها'},
 {id:'comp', name:'📱 المكونات Components', color:'#2196F3', desc:'زر، صورة، صوت، تخزين'},
];
const BLOCKS={
 events:[
  {n:'عند الضغط زر1 افعل', c:'b-events', m:'الحدث الأشهر: عندما تلمس الطالبة الزر ينفذ كل ما تحته بالترتيب.', e:'مثال: عند الضغط زر_ترحيب ← اعرض «أهلاً سارة!»'},
  {n:'عند بدء الشاشة Screen.Initialize', c:'b-events', m:'يعمل مرة واحدة لحظة فتح التطبيق. نستخدمه لضبط البداية (تصفير النقاط).', e:'عند البدء ← عيّن النقاط إلى 0 + اعرض «جاهزة؟»'},
  {n:'عند إدخال نص TextBox.TextChanged', c:'b-events', m:'يعمل مع كل حرف تكتبه الطالبة. مفيد للبحث الفوري أو العد.', e:'عند تغيّر النص ← اعرض طول النص'},
 ],
 control:[
  {n:'إذا if / وإلا else', c:'b-control', m:'أهم أمر! إذا الشرط صحيح افعلي كذا وإلا افعلي كذا. مثل: إذا كتبت الاسم رحّبي وإلا نبهيها.', e:'إذا الاسم = فارغ ← «اكتبي اسمك!» وإلا ← «أهلاً» + الاسم'},
  {n:'كرر repeat / for', c:'b-control', m:'تكرار عمل عدة مرات بدون كتابة مملة. كرر 5 مرات: اعرض نجمة ⭐', e:'كرر 5 مرات ← زد النقاط 1 (النتيجة 5)'},
  {n:'بينما while', c:'b-control', m:'كرر طالما الشرط صحيح. انتبهي: يجب أن يتوقف الشرط وإلا لا يتوقف أبداً!', e:'بينما النقاط < 10 ← زد النقاط'},
  {n:'انتظر / مؤقت Clock.Timer', c:'b-control', m:'افعل شيئاً كل ثانية مثل الساعة أو لعبة العد التنازلي.', e:'كل 1000ms ← انقص الوقت 1'},
 ],
 logic:[
  {n:'=  ≠  >  <', c:'b-logic', m:'مقارنات تعطي صح ✅ أو خطأ ❌. نضعها داخل «إذا».', e:'هل 5 > 3 ؟ ← صح ✅'},
  {n:'و and / أو or / ليس not', c:'b-logic', m:'دمج شرطين: «و» تحتاج الاثنين صح، «أو» يكفي واحد، «ليس» تعكس.', e:'إذا (الاسم ≠ فارغ) و (العمر > 7) ← ادخلي'},
  {n:'صح true / خطأ false', c:'b-logic', m:'قيمتان فقط! نستخدمهما لتشغيل وإطفاء مثل: الصوت يعمل = صح.', e:'عيّن الصوت_يعمل إلى صح 🔊'},
 ],
 math:[
  {n:'+  −  ×  ÷', c:'b-math', m:'عمليات حسابية. في الألعاب نحسب النقاط والوقت.', e:'النقاط = النقاط + 1  (كل فوز يزيد نقطة)'},
  {n:'رقم عشوائي random', c:'b-math', m:'يختار رقماً مفاجئاً! أساس ألعاب الحظ والنرد 🎲', e:'ارمِ نرداً: عشوائي من 1 إلى 6'},
  {n:'الباقي / الجذر / التقريب', c:'b-math', m:'أدوات مساعدة: الباقي لمعرفة زوجي/فردي، التقريب لإظهار أرقام جميلة.', e:'إذا باقي العدد ÷ 2 = 0 ← العدد زوجي'},
 ],
 text:[
  {n:'نص " ... "', c:'b-text', m:'أي كلمة بين علامتين تعتبر نصاً. تُعرض في اللافتات والرسائل.', e:'"أهلاً يا بطلتي 🌟"'},
  {n:'دمج join +', c:'b-text', m:'لصق نصين معاً: «أهلاً » + اسم الطالبة = «أهلاً سارة». الأكثر استخداماً!', e:'ادمج «مجموعك: » + النقاط'},
  {n:'طول النص length / تحويل', c:'b-text', m:'طول النص يعد الحروف. والتحويل يحوّل الكتابة «5» إلى رقم 5 للحساب.', e:'طول «سارة» = 4 حروف'},
  {n:'اعرض Notifier.ShowAlert', c:'b-text', m:'رسالة منبثقة صغيرة تظهر وتختفي — هي المخرجات OUTPUT التي تراها الطالبة.', e:'اعرض «أحسنتِ! 🎉»'},
 ],
 lists:[
  {n:'أنشئ قائمة list', c:'b-lists', m:'صندوق واحد يحفظ عدة أشياء مرتبة: [تفاح، موز، عنب].', e:'قائمة الفواكه = [🍎، 🍌، 🍇]'},
  {n:'اختر عنصر select / أضف add', c:'b-lists', m:'اختر العنصر رقم 1 (أول واحد!) أو أضيفي عنصراً جديداً للنهاية.', e:'اعرض العنصر رقم 2 ← 🍌'},
  {n:'طول القائمة / هل فارغة؟', c:'b-lists', m:'كم عنصراً فيها؟ مفيد للتأكد قبل الاختيار حتى لا يحدث خطأ.', e:'إذا طول القائمة > 0 ← اعرض أول عنصر'},
 ],
 vars:[
  {n:'متغير عام global اسم', c:'b-variables', m:'علبة مسماة تحفظ قيمة تتغير: النقاط، الاسم، الوقت. نبدأها بقيمة أولية.', e:'أنشئ متغير «النقاط» = 0'},
  {n:'عيّن set إلى', c:'b-variables', m:'نغيّر ما داخل العلبة. أهم عملية في الألعاب: زيادة النقاط!', e:'عيّن النقاط إلى النقاط + 1'},
  {n:'احصل على get القيمة', c:'b-variables', m:'نقرأ ما داخل العلبة لعرضه أو حسابه بدون تغييره.', e:'اعرض «نقاطك: » + احصل على النقاط'},
 ],
 proc:[
  {n:'إجراء افعل doSomething', c:'b-proc', m:'وصفة نسميها ونستخدمها كثيراً بدل التكرار. مثل زر «احتفال» يعرض صوت+رسالة.', e:'إجراء احتفال: اعرض 🎉 + شغّل تصفيق'},
  {n:'إجراء مع مدخلات + مخرجات', c:'b-proc', m:'وصفة تأخذ مكوناً (الاسم) وتُخرج طبقاً (الترحيب). توفر وقتاً كبيراً!', e:'رحّبي بـ(سارة) ← تُخرج «أهلاً سارة»'},
 ],
 comp:[
  {n:'زر Button / لافتة Label', c:'b-sensor', m:'الزر للضغط، واللافتة لعرض النصوص (المخرجات). غيّري لونها وحجمها من Designer.', e:'عند الضغط ← عيّن نص_اللافتة إلى «أهلاً!»'},
  {n:'صورة Image / صوت Sound', c:'b-sound', m:'اعرضي صورة مفرحة وشغّلي صوت تشجيع عند الفوز. التطبيق الجميل يجذب!', e:'عند الفوز ← شغّل صوت_تصفيق 🔊'},
  {n:'حفظ TinyDB', c:'b-math', m:'دفتر يتذكر حتى بعد إغلاق التطبيق! نحفظ أعلى نتيجة ولا تضيع.', e:'احفظ (أعلى_نتيجة ← النقاط) واسترجعها عند البدء'},
  {n:'مستشعر Sensor / كاميرا', c:'b-sensor', m:'استخدمي ميلان الهاتف أو الموقع أو الكاميرا لصنع تطبيقات ذكية حقيقية!', e:'عند هز الهاتف ← غيّر الصورة'},
 ],
};
const tabsEl=document.getElementById('tabs'), grid=document.getElementById('blocksGrid');
let activeCat='events';
function renderTabs(){
  tabsEl.innerHTML='';
  CATS.forEach(c=>{
    const b=document.createElement('button'); b.textContent=c.name; b.style.background=c.color;
    if(c.id===activeCat) b.style.outline='3px solid #2d2a26';
    b.onclick=()=>{activeCat=c.id; renderTabs(); renderBlocks();};
    tabsEl.appendChild(b);
  });
  const cat=CATS.find(c=>c.id===activeCat);
  const info=document.createElement('div'); info.style.cssText='width:100%;text-align:center;color:var(--muted)';
  info.textContent='💡 '+cat.desc;
  tabsEl.appendChild(info);
}
function renderBlocks(){
  grid.innerHTML='';
  BLOCKS[activeCat].forEach(x=>{
    const d=document.createElement('div'); d.className='bcard';
    d.style.borderTopColor=getComputedStyle(document.querySelector('.b-'+x.c.split('-')[1])||document.body).backgroundColor;
    d.innerHTML=`<div class="block ${x.c}">${x.n}</div><h4>📌 ماذا يعني؟</h4><p>${x.m}</p><div class="ex"><b>مثال عملي:</b> ${x.e}</div>`;
    grid.appendChild(d);
  });
}
renderTabs(); renderBlocks();

// ===== المختبر =====
const PALETTE=[
 {t:'🚀 عند بدء التطبيق', c:'b-events', code:'START', ar:'عندما يفتح التطبيق: صفّر النقاط ورحّب'},
 {t:'👆 عند الضغط على الزر', c:'b-events', code:'CLICK', ar:'عندما تضغط الطالبة الزر نفّذ ما يلي'},
 {t:'🔀 إذا الشرط وإلا', c:'b-control', code:'IF name!="" THEN greet ELSE warn', ar:'إذا الاسم مكتوب رحّبي، وإلا نبهي لكتابة الاسم'},
 {t:'🔁 كرر 5 مرات +1 نقطة', c:'b-control', code:'REPEAT 5: score=score+1', ar:'كرري زيادة النقطة 5 مرات (حلقة)'},
 {t:'🧮 النقاط = النقاط + 1', c:'b-math', code:'score=score+1', ar:'زودي نقطة واحدة (عملية حسابية)'},
 {t:'💬 اعرض رسالة ترحيب', c:'b-text', code:'SHOW "أهلاً "+name+" 🎉"', ar:'اعرضي رسالة دمج النص مع الاسم (مخرجات)'},
 {t:'🎲 رقم عشوائي للنرد', c:'b-math', code:'dice=random(1,6)', ar:'اختاري رقماً عشوائياً من 1 إلى 6'},
 {t:'🎉 إجراء احتفال (صوت+رسالة)', c:'b-proc', code:'CALL celebrate()', ar:'نادِ وصفة الاحتفال الجاهزة'},
 {t:'💾 احفظ أعلى نتيجة', c:'b-math', code:'SAVE best=score', ar:'احفظي النتيجة في ذاكرة الهاتف'},
];
let lab=[];
const palEl=document.getElementById('palette'), canvas=document.getElementById('labCanvas'),
 explain=document.getElementById('labExplain'), output=document.getElementById('labOutput');
function renderPal(){
  palEl.innerHTML='';
  PALETTE.forEach((p,i)=>{
    const d=document.createElement('div'); d.className='block '+p.c; d.textContent=p.t; d.title=p.ar;
    d.onclick=()=>{ if(lab.length===0&&canvas.querySelector('.empty'))canvas.innerHTML=''; lab.push(p); renderLab(); };
    palEl.appendChild(d);
  });
}
function renderLab(){
  canvas.innerHTML='';
  if(!lab.length) canvas.innerHTML='<li class="empty">لوحتك فارغة... أضيفي أول بلوك من اليسار 👈</li>';
  lab.forEach((p,i)=>{
    const li=document.createElement('li');
    li.innerHTML=`<span><b>${i+1}.</b> ${p.t}<br><small style="color:var(--muted)">${p.ar}</small></span>`;
    const del=document.createElement('button'); del.className='del'; del.textContent='✖';
    del.onclick=()=>{lab.splice(i,1); renderLab();};
    li.appendChild(del); canvas.appendChild(li);
  });
  explain.innerHTML = lab.length ? '<ol>'+lab.map(p=>`<li>${p.ar} <code dir="ltr">${p.code}</code></li>`).join('')+'</ol>' : '—';
}
document.getElementById('clearLab').onclick=()=>{lab=[]; renderLab(); output.textContent='في انتظار التشغيل...';};
document.getElementById('runLab').onclick=()=>{
  if(!lab.length){output.textContent='⚠️ أضيفي بلوكاً أولاً!'; return;}
  let score=0, name='سارة', lines=['▶ بدء تشغيل برنامجك...'];
  lab.forEach(p=>{
    if(p.code==='START'){score=0; lines.push('✅ تهيئة: النقاط = 0 — «أهلاً بكِ!»');}
    else if(p.code==='CLICK'){lines.push('👆 حدث ضغطة زر! ننفذ ما بعده...');}
    else if(p.code.startsWith('IF')){lines.push(name?`🔀 الشرط تحقق (الاسم موجود) → المخرجات: «أهلاً ${name} 🎉»`:'⚠️ الاسم فارغ → المخرجات: «اكتبي اسمك!»'); if(name)score++;}
    else if(p.code.startsWith('REPEAT')){score+=5; lines.push('🔁 حلقة 5 مرات → +5 نقاط! (النقاط الآن '+score+')');}
    else if(p.code.startsWith('score=')){score++; lines.push('🧮 حساب: النقاط أصبحت '+score);}
    else if(p.code.startsWith('SHOW')){lines.push(`💬 مخرجات على الشاشة: «أهلاً ${name} 🎉»`);}
    else if(p.code.startsWith('dice')){const d=Math.floor(Math.random()*6)+1; lines.push(`🎲 نرد عشوائي → ${d}`);}
    else if(p.code.startsWith('CALL')){lines.push('🎉 احتفال! 🔊👏 + «ممتاز!»'); score++;}
    else if(p.code.startsWith('SAVE')){lines.push(`💾 حُفظت أعلى نتيجة = ${score} ولن تضيع!`);}
  });
  lines.push('🏁 انتهى! النقاط النهائية = '+score+' ⭐');
  output.textContent=lines.join('\n');
  document.getElementById('simScore').textContent=score;
  document.getElementById('simMsg').textContent='نتيجة المختبر: '+score+' نقاط ⭐ أحسنتِ!';
};
renderPal(); renderLab();

// ===== المحاكي =====
let simScore=0;
function beep(){ try{ const ctx=new (window.AudioContext||window.webkitAudioContext)(); const o=ctx.createOscillator(), g=ctx.createGain(); o.connect(g); g.connect(ctx.destination); o.frequency.value=660; o.type='sine'; g.gain.value=.15; o.start(); setTimeout(()=>{o.frequency.value=880;},120); setTimeout(()=>{o.stop(); ctx.close();},350);}catch(e){} }
document.getElementById('simHello').onclick=()=>{
  const n=document.getElementById('simName').value.trim();
  const msg=document.getElementById('simMsg');
  if(!n){msg.textContent='⚠️ اكتبي اسمك أولاً يا حلوة! (هذا شرط if)'; msg.style.borderColor='red';}
  else{simScore++; document.getElementById('simScore').textContent=simScore; msg.textContent=`أهلاً ${n} 🎉 أنتِ نجمة! (دمج نصوص)`; msg.style.borderColor='#4CAF50'; beep(); checkMission();}
};
const colors=['#FFF6E8','#E3F2FD','#F3E5F5','#E8F5E9','#FFF3E0','#FCE4EC'];
let ci=0;
document.getElementById('simColor').onclick=()=>{ci=(ci+1)%colors.length; document.querySelector('.phone-screen').style.background=colors[ci];};
document.getElementById('simSound').onclick=()=>{beep(); document.getElementById('simMsg').textContent='👏 تصفيق! (بلوك الصوت يعمل)';};
function checkMission(){ if(simScore>=5) document.getElementById('missionDone').classList.remove('hidden'); }
function heroDemo(){ document.getElementById('heroPhoneLabel').textContent='🎉 أحسنتِ! هكذا يعمل الزر!'; beep(); }

// ===== الاختبار =====
const QUIZ=[
 {q:'ماذا نستخدم لرسم شكل التطبيق (أزرار وصور)؟', o:['المصمم Designer 🎨','البلوكات Blocks 🧩','التصدير APK 📦'], a:0},
 {q:'أي بلوك يبدأ دائماً بكلمة «عند»؟', o:['بلوك حدث Event 🟤','بلوك جمع ➕','بلوك حفظ 💾'], a:0},
 {q:'ماذا يفعل بلوك «إذا / وإلا»؟', o:['يأخذ قراراً حسب الشرط 🔀','يحذف التطبيق 🗑','يغيّر لون الهاتف فقط'], a:0},
 {q:'كيف نزيد النقاط بمقدار 1؟', o:['عيّن النقاط إلى النقاط + 1 🧮','احذف النقاط ❌','أطفئ الهاتف 📴'], a:0},
 {q:'ما نتيجة دمج «أهلاً » + «سارة»؟', o:['«أهلاً سارة» 🎉','«سارة أهلاً»','خطأ'], a:0},
 {q:'القائمة [🍎، 🍌، 🍇] — ما العنصر رقم 2؟', o:['🍌','🍎','🍇'], a:0},
 {q:'أين تُعرض رسالة Notifier؟', o:['على الشاشة للطالبة (مخرجات) 📱','داخل البطارية 🔋','لا تظهر أبداً'], a:0},
 {q:'ما فائدة TinyDB؟', o:['حفظ البيانات حتى بعد الإغلاق 💾','تكبير الشاشة 🔍','تشغيل الموسيقى فقط'], a:0},
 {q:'كيف نجرّب التطبيق لحظياً على الهاتف؟', o:['بتطبيق AI Companion و QR 📱','بالصراخ عليه 📢','لا يمكن'], a:0},
 {q:'ما هي المخرجات النهائية التي نثبّتها؟', o:['ملف APK 📦','ورقة 📄','قلم ✏️'], a:0},
];
let qi=0, qs=0, answered=false;
const qText=document.getElementById('qText'), qOpts=document.getElementById('qOpts'),
 qFeed=document.getElementById('qFeedback'), qNext=document.getElementById('qNext');
function renderQ(){
  answered=false; qFeed.textContent=''; qNext.disabled=true;
  document.getElementById('qCount').textContent=`السؤال ${qi+1} / ${QUIZ.length}`;
  document.getElementById('qBarFill').style.width=(qi/QUIZ.length*100)+'%';
  document.getElementById('qScore').textContent='النقاط: '+qs;
  qText.textContent=(qi+1)+'. '+QUIZ[qi].q;
  qOpts.innerHTML='';
  QUIZ[qi].o.forEach((t,i)=>{
    const b=document.createElement('button'); b.textContent=t;
    b.onclick=()=>{
      if(answered) return; answered=true;
      const ok=i===QUIZ[qi].a;
      if(ok){qs++; b.classList.add('correct'); qFeed.textContent='✅ أحسنتِ! إجابة صحيحة!'; qFeed.style.color='green'; beep();}
      else{b.classList.add('wrong'); qOpts.children[QUIZ[qi].a].classList.add('correct'); qFeed.textContent='❌ ليس تماماً. الإجابة الخضراء هي الصحيحة.'; qFeed.style.color='red';}
      [...qOpts.children].forEach(x=>x.disabled=true);
      document.getElementById('qScore').textContent='النقاط: '+qs;
      qNext.disabled=false; qNext.textContent=qi===QUIZ.length-1?'عرض النتيجة 🏆':'التالي ⬅';
    };
    qOpts.appendChild(b);
  });
  document.getElementById('quizResult').classList.add('hidden');
}
qNext.onclick=()=>{
  if(qi<QUIZ.length-1){qi++; renderQ();}
  else{
    document.getElementById('qBarFill').style.width='100%';
    const r=document.getElementById('quizResult'); r.classList.remove('hidden');
    let msg, emoji;
    if(qs>=9){msg='مذهلة! أنتِ مبرمجة محترفة 🌟'; emoji='🏆';}
    else if(qs>=6){msg='رائعة! فهمتِ الأساس جيداً 👏'; emoji='🎉';}
    else{msg='بداية جميلة! راجعي البلوكات وحاولي مجدداً 💪'; emoji='📚';}
    r.innerHTML=`<div class="big">${emoji}</div><h3>نتيجتك: ${qs} / ${QUIZ.length}</h3><p>${msg}</p><button class="btn secondary" onclick="restartQuiz()">🔄 إعادة المحاولة</button>`;
    qText.textContent='انتهى الاختبار!'; qOpts.innerHTML=''; qFeed.textContent=''; qNext.disabled=true;
    if(qs>=6){localStorage.setItem('quizDone','1');}
    updateProgress();
  }
};
function restartQuiz(){qi=0; qs=0; renderQ();}
renderQ();

// ===== الشهادة =====
function genCert(){
  const name=document.getElementById('certName').value.trim()||'نجمتنا الصغيرة';
  const c=document.getElementById('certCanvas'), x=c.getContext('2d');
  const g=x.createLinearGradient(0,0,800,450); g.addColorStop(0,'#FFF9F0'); g.addColorStop(1,'#FFE9C9');
  x.fillStyle=g; x.fillRect(0,0,800,450);
  x.strokeStyle='#FF9F1C'; x.lineWidth=12; x.strokeRect(14,14,772,422);
  x.strokeStyle='#7C4DFF'; x.lineWidth=4; x.strokeRect(30,30,740,390);
  x.textAlign='center'; x.fillStyle='#2d2a26';
  x.font='900 44px Cairo, sans-serif'; x.fillText('🎓 شهادة نجمة البرمجة 🌟',400,110);
  x.font='700 28px Cairo, sans-serif'; x.fillText('تشهد معلمة البرمجة بأن الطالبة',400,170);
  x.font='900 52px Cairo, sans-serif'; x.fillStyle='#7C4DFF'; x.fillText(name,400,245);
  x.font='700 24px Cairo, sans-serif'; x.fillStyle='#2d2a26';
  x.fillText('أتمت رحلة App Inventor من الصفر حتى المخرجات 🧩📱',400,300);
  x.fillText(`النقاط في الاختبار: ${qs} / ${QUIZ.length} — التقدم: ${document.getElementById('progressText').textContent}`,400,340);
  x.font='700 20px Cairo, sans-serif'; x.fillStyle='#7a6f65'; x.fillText('MIT App Inventor • المدخلات ← المعالجة ← المخرجات',400,390);
  // confetti
  for(let i=0;i<80;i++){x.fillStyle=`hsl(${Math.random()*360},90%,60%)`; x.fillRect(Math.random()*800,Math.random()*120,8,8);}
  beep();
}
updateProgress();
