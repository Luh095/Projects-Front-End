// Elementos do DOM
const generateBtn = document.getElementById('generate-btn');
const categorySelect = document.getElementById('category');
const ideaOutput = document.getElementById('idea-output');

// Dados: ideias para cada categoria
const ideas = {
    projetos: [
        "Uma plataforma online para conectar voluntários a ONGs.",
        "Um app para ajudar estudantes a gerenciar o tempo de estudos.",
        "Uma loja virtual especializada em produtos ecológicos.",
        "Um jogo educativo para crianças aprenderem programação.",
        "Um site que conecta artistas independentes a galerias.",
        "Uma ferramenta para visualizar dados em tempo real."
    ],
    empresas: [
        "EcoVita - Soluções Sustentáveis.",
        "TechBloom - Crescimento Digital.",
        "IdeaSpark - Inovação e Criatividade.",
        "MindBridge - Consultoria Empresarial.",
        "ByteCrafters - Desenvolvimento de Software.",
        "GreenWorks - Projetos Sustentáveis."
    ],
    roteiros: [
        "Uma aventura épica onde um personagem viaja no tempo para salvar o futuro.",
        "Uma comédia romântica envolvendo dois rivais de negócios.",
        "Um suspense onde um detetive descobre um segredo que ninguém deveria saber.",
        "Um drama sobre a jornada de um artista desconhecido em busca do sucesso.",
        "Um roteiro distópico sobre um mundo sem eletricidade.",
        "Uma história de ficção científica envolvendo uma missão espacial fracassada."
    ]
};

// Gerar uma ideia aleatória
function generateIdea() {
    const selectedCategory = categorySelect.value;
    const ideasList = ideas[selectedCategory];
    const randomIndex = Math.floor(Math.random() * ideasList.length);
    ideaOutput.textContent = ideasList[randomIndex];
}

// Evento de clique no botão
generateBtn.addEventListener('click', generateIdea);
