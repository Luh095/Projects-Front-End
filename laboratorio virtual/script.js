const htmlCode = document.getElementById("htmlCode");
    const cssCode = document.getElementById("cssCode");
    const jsCode = document.getElementById("jsCode");
    const outputFrame = document.getElementById("outputFrame");

    // Atualiza a visualização
    function updateOutput() {
      const html = htmlCode.value;
      const css = `<style>${cssCode.value}</style>`;
      const js = `<script>${jsCode.value}</script>`;

      const output = `${html}\n${css}\n${js}`;
      outputFrame.srcdoc = output;
    } 

    // Atualiza em tempo real
    htmlCode.addEventListener("input", updateOutput);
    cssCode.addEventListener("input", updateOutput);
    jsCode.addEventListener("input", updateOutput);

    // Atualização inicial
    updateOutput();