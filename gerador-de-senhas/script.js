// Caracteres
    const sets = {
      lower: 'abcdefghijklmnopqrstuvwxyz',
      upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      numbers: '0123456789',
      symbols: '!@#$%^&*()-_=+[]{};:,.<>/?|~'
    };

    const excludeSimilarSet = 'il1LoO0';

    // Elementos
    const lengthRange = document.getElementById('lengthRange');
    const lengthNumber = document.getElementById('lengthNumber');
    const lengthLabel = document.getElementById('lengthLabel');
    const generateBtn = document.getElementById('generate');
    const passwordOutput = document.getElementById('passwordOutput');
    const copyBtn = document.getElementById('copyBtn');
    const refreshBtn = document.getElementById('refreshBtn');
    const meterBar = document.getElementById('meterBar');
    const entropyText = document.getElementById('entropyText');
    const recommendation = document.getElementById('recommendation');

    // Sincroniza range e número
    function syncLength(v){
      lengthRange.value = v;
      lengthNumber.value = v;
      lengthLabel.textContent = v;
    }
    lengthRange.addEventListener('input', e => syncLength(e.target.value));
    lengthNumber.addEventListener('input', e => {
      let v = parseInt(e.target.value) || 4;
      if(v < 4) v = 4; if(v > 128) v = 128;
      syncLength(v);
    });

    // Gera senha com RNG criptográfico
    function secureRandomInt(max){
      // retorna inteiro em [0, max)
      if(max <= 0) return 0;
      const uint32 = new Uint32Array(1);
      const limit = Math.floor(0xFFFFFFFF / max) * max;
      let r;
      do{ crypto.getRandomValues(uint32); r = uint32[0]; } while(r >= limit);
      return r % max;
    }

    function buildAlphabet(options){
      let chars = '';
      if(options.lower) chars += sets.lower;
      if(options.upper) chars += sets.upper;
      if(options.numbers) chars += sets.numbers;
      if(options.symbols) chars += sets.symbols;
      if(options.excludeSimilar){
        const filtered = chars.split('').filter(c => !excludeSimilarSet.includes(c)).join('');
        chars = filtered;
      }
      return chars;
    }

    function generatePassword(options){
      const alphabet = buildAlphabet(options);
      if(!alphabet.length) return '';
      const arr = [];
      for(let i=0;i<options.length;i++){
        const idx = secureRandomInt(alphabet.length);
        arr.push(alphabet[idx]);
      }
      return arr.join('');
    }

    function estimateEntropy(length, charsetSize){
      if(charsetSize <= 0) return 0;
      const bitsPerChar = Math.log2(charsetSize);
      return bitsPerChar * length;
    }

    function updateMeter(bits){
      const percent = Math.min(100, Math.round((bits / 128) * 100));
      meterBar.style.width = percent + '%';
      entropyText.textContent = Math.round(bits) + ' bits';
      if(bits < 40){ recommendation.textContent = 'Muito fraca'; }
      else if(bits < 60){ recommendation.textContent = 'Fraca'; }
      else if(bits < 80){ recommendation.textContent = 'Moderada'; }
      else if(bits < 100){ recommendation.textContent = 'Forte'; }
      else { recommendation.textContent = 'Muito forte'; }
    }

    function readOptions(){
      return {
        length: parseInt(lengthRange.value, 10),
        lower: document.getElementById('lower').checked,
        upper: document.getElementById('upper').checked,
        numbers: document.getElementById('numbers').checked,
        symbols: document.getElementById('symbols').checked,
        excludeSimilar: document.getElementById('excludeSimilar').checked
      }
    }

    function refresh(){
      const opts = readOptions();
      const pwd = generatePassword(opts);
      passwordOutput.textContent = pwd || 'Selecione pelo menos um conjunto de caracteres.';

      // atualizar medidor
      const alphabet = buildAlphabet(opts);
      const bits = estimateEntropy(opts.length, new Set(alphabet).size);
      updateMeter(bits);
    }

    // Eventos
    generateBtn.addEventListener('click', refresh);
    refreshBtn.addEventListener('click', refresh);

    copyBtn.addEventListener('click', async () => {
      const text = passwordOutput.textContent;
      if(!text || text.startsWith('Selecione')) return;
      try{
        await navigator.clipboard.writeText(text);
        copyBtn.textContent = 'Copiado!';
        setTimeout(()=>copyBtn.textContent = 'Copiar', 1400);
      }catch(e){
        // fallback
        const ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select();
        try{ document.execCommand('copy'); copyBtn.textContent = 'Copiado!'; setTimeout(()=>copyBtn.textContent = 'Copiar',1400);}catch(err){alert('Não foi possível copiar automaticamente. Selecione manualmente.');}
        ta.remove();
      }
    });

    // Gera na primeira carga
    window.addEventListener('load', () => { refresh(); });

    // atalhos de teclado: G para gerar, C para copiar
    window.addEventListener('keydown', (e) => {
      if(e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if(e.key.toLowerCase() === 'g') { refresh(); }
      if(e.key.toLowerCase() === 'c') { copyBtn.click(); }
    });