function generateDecision(type) {
    const options = {
      comida: ["Pizza", "Sushi", "Hambúrguer", "Salada", "Churrasco", "Massas", "Lasanha", "Ala Minuta"],
      assistir: ["Um filme de ação", "Uma comédia", "Uma série de drama", "Um documentário", "Anime", "Reality Show", "Uma comédia romantica", "Uma animação"],
      sair: ["Sim, saia e aproveite!", "Não, fique em casa e relaxe!", "Talvez, veja como você se sente mais tarde."]
    };

    const randomIndex = Math.floor(Math.random() * options[type].length);
    const decision = options[type][randomIndex];

    document.getElementById('output').textContent = decision;
  }