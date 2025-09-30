 // Utilitários
    const toHex = (n) => n.toString(16).padStart(2,'0');
    const randColor = () => '#'+[0,0,0].map(()=>toHex(Math.floor(Math.random()*256))).join('').toUpperCase();

    // Contraste para texto: retorna '#000' ou '#fff' conforme Luma
    function readableText(hex){
      const r=parseInt(hex.slice(1,3),16), g=parseInt(hex.slice(3,5),16), b=parseInt(hex.slice(5,7),16);
      const luma = 0.2126*r + 0.7152*g + 0.0722*b; // luma
      return luma > 150 ? '#031018' : '#FFFFFF';
    }

    const paletteEl = document.getElementById('palette');
    const generateBtn = document.getElementById('generate');
    const copyAllBtn = document.getElementById('copyAll');
    const countRange = document.getElementById('count');
    const countLabel = document.getElementById('countLabel');
    const lockBtn = document.getElementById('lockBtn');
    const exportJSON = document.getElementById('exportJSON');
    const shuffleBtn = document.getElementById('shuffle');

    let state = { colors: [], locked: false };

    function createSwatch(hex){
      const sw = document.createElement('div');
      sw.className = 'swatch';
      sw.style.background = hex;
      sw.setAttribute('data-hex', hex);

      const meta = document.createElement('div');
      meta.className = 'meta';

      const hexEl = document.createElement('div');
      hexEl.className = 'hex';
      hexEl.textContent = hex;
      hexEl.style.color = readableText(hex);

      const copyBtn = document.createElement('button');
      copyBtn.className = 'copy';
      copyBtn.textContent = 'Copiar';
      copyBtn.title = 'Copiar o código hexadecimal';
      copyBtn.addEventListener('click', async (e)=>{
        e.stopPropagation();
        try{
          await navigator.clipboard.writeText(hex);
          copyBtn.classList.add('copied');
          copyBtn.textContent = 'Copiado!';
          setTimeout(()=>{ copyBtn.classList.remove('copied'); copyBtn.textContent = 'Copiar'; }, 1200);
        }catch(err){
          alert('Não foi possível copiar. Permita o acesso à área de transferência.');
        }
      });

      meta.appendChild(hexEl);
      meta.appendChild(copyBtn);
      sw.appendChild(meta);

      // click na própria cor copia
      sw.addEventListener('click', async ()=>{
        try{
          await navigator.clipboard.writeText(hex);
          copyBtn.classList.add('copied');
          copyBtn.textContent = 'Copiado!';
          setTimeout(()=>{ copyBtn.classList.remove('copied'); copyBtn.textContent = 'Copiar'; }, 1000);
        }catch(e){
          alert('Erro ao copiar.');
        }
      });

      return sw;
    }

    function render(){
      paletteEl.innerHTML = '';
      const n = state.colors.length;
      // ajustar grid columns dinamicamente
      paletteEl.style.gridTemplateColumns = `repeat(${Math.min(Math.max(n,2),8)},1fr)`;
      state.colors.forEach(hex=> paletteEl.appendChild(createSwatch(hex)));
    }

    function generatePalette(count=5){
      const newColors = [];
      for(let i=0;i<count;i++){
        newColors.push(randColor());
      }
      state.colors = newColors;
      render();
    }

    // event handlers
    generateBtn.addEventListener('click', ()=> generatePalette(parseInt(countRange.value)));
    countRange.addEventListener('input', ()=>{ countLabel.textContent = countRange.value });

    copyAllBtn.addEventListener('click', async ()=>{
      const text = state.colors.join(', ');
      try{
        await navigator.clipboard.writeText(text);
        copyAllBtn.textContent = 'Copiado!';
        setTimeout(()=> copyAllBtn.textContent = 'Copiar todos', 1200);
      }catch(e){ alert('Não foi possível copiar todos os hex.'); }
    });

    lockBtn.addEventListener('click', ()=>{
      state.locked = !state.locked;
      lockBtn.setAttribute('aria-pressed', String(state.locked));
      lockBtn.textContent = state.locked ? '🔓 Aleatório desbloqueado' : '🔒 Bloquear aleatoriedade';
      // Nota: aqui 'lock' não evita a cópia — apenas é demonstrativo (poderíamos travar cores existentes)
    });

    exportJSON.addEventListener('click', ()=>{
      const data = { generatedAt: new Date().toISOString(), colors: state.colors };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'paleta.json';
      a.click();
      URL.revokeObjectURL(url);
    });

    shuffleBtn.addEventListener('click', ()=>{
      for(let i=state.colors.length-1;i>0;i--){
        const j = Math.floor(Math.random()*(i+1));
        [state.colors[i], state.colors[j]] = [state.colors[j], state.colors[i]];
      }
      render();
    });

    // atalho G para gerar
    window.addEventListener('keydown', (e)=>{
      if(e.key.toLowerCase() === 'g'){
        generatePalette(parseInt(countRange.value));
      }
    });

    // inicializa
    generatePalette(parseInt(countRange.value));