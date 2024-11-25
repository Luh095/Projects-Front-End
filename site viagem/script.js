function assinarNewsletter() {
    const email = document.querySelector(".newsletter input").value;
    if (email) {
      alert(`Obrigado por assinar nossa newsletter, ${email}!`);
    } else {
      alert("Por favor, insira um e-mail válido.");
    }
  }
  