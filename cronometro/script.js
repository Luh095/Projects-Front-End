// ----- helpers -----
    function formatTime(s){
      const mm = Math.floor(s/60).toString().padStart(2,'0');
      const ss = (s%60).toString().padStart(2,'0');
      return `${mm}:${ss}`;
    }

    // Simple Timer
    (function(){
      const minIn = document.getElementById('simple-min');
      const secIn = document.getElementById('simple-sec');
      const display = document.getElementById('simple-display');
      const startBtn = document.getElementById('simple-start');
      const pauseBtn = document.getElementById('simple-pause');
      const resetBtn = document.getElementById('simple-reset');

      let total = parseInt(secIn.value,10) + (parseInt(minIn.value,10)||0)*60;
      let timerId = null;
      let remaining = total;

      function updateDisplay(){ display.textContent = formatTime(Math.max(0,remaining)); }
      function tick(){ if(remaining<=0){ stop(); beep(); return; } remaining--; updateDisplay(); }
      function start(){ if(timerId) return; // prevent double
        total = (parseInt(minIn.value,10)||0)*60 + (parseInt(secIn.value,10)||0);
        remaining = total; updateDisplay(); timerId = setInterval(tick,1000);
      }
      function pause(){ if(!timerId) return; clearInterval(timerId); timerId=null; }
      function stop(){ if(timerId){ clearInterval(timerId); timerId=null; } remaining=0; updateDisplay(); }
      function reset(){ pause(); total = (parseInt(minIn.value,10)||0)*60 + (parseInt(secIn.value,10)||0); remaining = total; updateDisplay(); }

      startBtn.addEventListener('click', ()=>{ start(); });
      pauseBtn.addEventListener('click', ()=>{ pause(); });
      resetBtn.addEventListener('click', ()=>{ reset(); });

      // update UI if inputs change
      minIn.addEventListener('input', ()=>{ reset(); });
      secIn.addEventListener('input', ()=>{ reset(); });

      // init
      reset();
    })();

    // Pomodoro Timer
    (function(){
      const focusInput = document.getElementById('focus-min');
      const breakInput = document.getElementById('break-min');
      const cyclesInput = document.getElementById('cycles');
      const display = document.getElementById('pom-display');
      const info = document.getElementById('pom-info');
      const startBtn = document.getElementById('pom-start');
      const pauseBtn = document.getElementById('pom-pause');
      const skipBtn = document.getElementById('pom-skip');
      const resetBtn = document.getElementById('pom-reset');
      const ring = document.getElementById('ring');
      const ringText = document.getElementById('ring-text');

      let focusSec = parseInt(focusInput.value,10)*60;
      let breakSec = parseInt(breakInput.value,10)*60;
      let cycles = parseInt(cyclesInput.value,10);

      let mode = 'focus'; // 'focus' or 'break'
      let remaining = focusSec;
      let timerId = null;
      let completedCycles = 0;

      const RADIUS = 48;
      const CIRC = 2*Math.PI*RADIUS; // ~302
      ring.style.strokeDasharray = String(CIRC);

      function updateRing(){
        const total = (mode==='focus'? focusSec: breakSec);
        const frac = Math.max(0, Math.min(1, remaining/total));
        const offset = CIRC * (1 - frac);
        ring.style.strokeDashoffset = String(offset);
      }

      function updateUI(){
        display.textContent = formatTime(Math.max(0,remaining));
        ringText.textContent = mode==='focus'? 'FOCO' : 'DESC';
        info.textContent = `Sessão: ${mode==='focus'?'Foco':'Descanso'} • Ciclos completos: ${completedCycles}`;
        updateRing();
      }

      function tick(){
        if(remaining<=0){
          // switch mode
          if(mode==='focus'){
            mode='break'; remaining = breakSec; beep();
          } else {
            completedCycles++;
            if(completedCycles>=cycles){ // finished all cycles
              pause(); beep(3); mode='focus'; remaining = focusSec; updateUI(); return;
            } else {
              mode='focus'; remaining = focusSec; beep();
            }
          }
          updateUI();
          return;
        }
        remaining--; updateUI();
      }

      function start(){ if(timerId) return; timerId = setInterval(tick,1000); }
      function pause(){ if(timerId){ clearInterval(timerId); timerId=null; } }
      function reset(){ pause(); focusSec = (parseInt(focusInput.value,10)||25)*60; breakSec = (parseInt(breakInput.value,10)||5)*60; cycles = Math.max(1,parseInt(cyclesInput.value,10)||1); mode='focus'; remaining=focusSec; completedCycles=0; updateUI(); }
      function skip(){ // move to next mode immediately
        if(mode==='focus'){ mode='break'; remaining = breakSec; } else { mode='focus'; remaining = focusSec; completedCycles++; }
        updateUI(); beep();
      }

      startBtn.addEventListener('click', ()=> start());
      pauseBtn.addEventListener('click', ()=> pause());
      resetBtn.addEventListener('click', ()=> reset());
      skipBtn.addEventListener('click', ()=> skip());

      focusInput.addEventListener('input', ()=> reset());
      breakInput.addEventListener('input', ()=> reset());
      cyclesInput.addEventListener('input', ()=> reset());

      // small beep using WebAudio
      function beep(times=1){
        try{
          const ctx = new (window.AudioContext || window.webkitAudioContext)();
          let t = 0;
          const dur = 0.12;
          for(let i=0;i<times;i++){
            const o = ctx.createOscillator();
            const g = ctx.createGain();
            o.type = 'sine';
            o.frequency.value = (i===0? 880: 660);
            o.connect(g);
            g.connect(ctx.destination);
            g.gain.setValueAtTime(0.0001, ctx.currentTime + t);
            g.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + t + 0.01);
            o.start(ctx.currentTime + t);
            g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + t + dur);
            o.stop(ctx.currentTime + t + dur + 0.02);
            t += dur + 0.05;
          }
        }catch(e){ /* audio not available */ }
      }

      // init
      reset();

    })();

    // Accessibility: allow space on focused button to toggle
    document.addEventListener('keydown', (e)=>{
      if(e.code==='Space' && document.activeElement && document.activeElement.tagName==='BUTTON'){
        e.preventDefault(); document.activeElement.click();
      }
    });