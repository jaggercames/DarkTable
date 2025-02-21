
var globalPlayerList = [];
var endpoint = "http://localhost:8080"; //TODO: Setar a variável usando o IP fixo do host.

function updatePlayerList() { //Função pra atualizar a playerList a cada request.
    let showingError = false;
    fetch(`${endpoint}/get_players`)
        .then(response => response.json())
        .then(data => {
            if (data && data.players) {
                renderPlayers(data.players);
            } else {
                console.error("Erro ao obter jogadores.");
            }


            showingError = false;
            hideError();
        })
        .catch(error => {
            if(!showingError)
                showError();

            showingError = true;
        });
}
updatePlayerList();

function toggleInfo(event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
  
    var target = event?.target.closest(".info-box, .info-button"); // Detecta o elemento pai relevante
    var infoBox;
  
    if (target) {
      if (target.classList.contains("info-box")) {
        // Fecha diretamente a div associada ao botão de close
        infoBox = target;
      } else if (target.nextElementSibling) {
        // Caso o botão seja associado a uma div dinâmica
        infoBox = target.nextElementSibling;
      }
    } else {
      // Caso padrão: ID fixo
      infoBox = document.getElementById("info-box");
    }
  
    if (infoBox) {
      // Alterna a visibilidade da caixa de informação
      if (infoBox.style.display === "none" || infoBox.style.display === "") {
        infoBox.style.display = "block";
      } else {
        infoBox.style.display = "none";
      }
    } else {
      console.error("Não foi possível encontrar a caixa de informação.");
    }
  }

let diceValue = 0;

//----------------

document.getElementById("name").addEventListener("input", function (event) {
    let inputValue = event.target.value;

    // Remove acentos e caracteres especiais
    inputValue = inputValue.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    // Permite letras, números, colchetes [], e substitui múltiplos espaços por um único
    inputValue = inputValue.replace(/[^a-zA-Z0-9\[\] ]/g, ""); // Remove caracteres não permitidos
    inputValue = inputValue.replace(/\s+/g, " "); // Substitui múltiplos espaços por um único

    // Remove espaços no início ou no final
    inputValue = inputValue.trim();

    // Atualiza o valor do input com o texto corrigido
    event.target.value = inputValue;
});

//-------------------------------

document.getElementById("enterButton").addEventListener("click", async (event) => {
    const jogadorInput = document.getElementById("name"); // Pega o campo de entrada do nome
    const nomeJogador = jogadorInput ? jogadorInput.value.trim() : ""; // Extrai o nome do jogador

    // Verifica se o nome do jogador foi preenchido
    if (!nomeJogador) {
        alert("Você deve inserir um nome.");
        return; // Interrompe o processo caso o nome esteja vazio
    }

    // Verifica se o jogador existe no servidor (requisição GET)
    let checkResponse1 = await fetch(`${endpoint}/check_player/${encodeURIComponent(nomeJogador)}`);
    if (!checkResponse1.ok) {
        console.error("Erro ao verificar o jogador:", checkResponse1.status, checkResponse1.statusText);
        return; // Interrompe o processo se houver erro na requisição
    }

    // Interrompe a ação do botão e impede o reload da página
    event.preventDefault();

    let playerName = nomeJogador;
    let playerHP = document.getElementById("hp").value.trim();
    let playerRealName = document.getElementById("realname").value.trim();
    let playerSkills = document.getElementById("skills").value.trim();
    let playerState = document.getElementById("state").value.trim();
    let playerObs = document.getElementById("obs").value.trim();
    let playerBloodLevel = document.getElementById("blood_level").value.trim();
    let playerTrauma = document.getElementById("trauma").value.trim();
    let playerAdrenalina = document.querySelector('#adrenalina input[name="adrenalina"]:checked').value.trim();
    let playerLuta = document.getElementById("luta").value.trim();
    let playerInteligencia = document.getElementById("inteligencia").value.trim();
    let playerAgilidade = document.getElementById("agilidade").value.trim();
    let playerFisico = document.getElementById("fisico").value.trim();
    let playerResistencia = document.getElementById("resistencia").value.trim();
    let playerReflexo = document.getElementById("reflexo").value.trim();
    let playerPontaria = document.getElementById("pontaria").value.trim();
    let playerPersuasao = document.getElementById("persuasao").value.trim();
    let playerConhecimento = document.getElementById("conhecimento").value.trim();
    let playerInvestigacao = document.getElementById("investigacao").value.trim();
    let playerIntimidacao = document.getElementById("intimidacao").value.trim();
    let playerPilotagem = document.getElementById("pilotagem").value.trim();
    let playerSorte = document.getElementById("sorte").value.trim();
    let playerHeadState = document.getElementById("head_state").value.trim();
    let playerChestState = document.getElementById("chest_state").value.trim();
    let playerRightArmState = document.getElementById("rightarm_state").value.trim();
    let playerLeftArmState = document.getElementById("leftarm_state").value.trim();
    let playerStomachState = document.getElementById("stomach_state").value.trim();
    let playerLeftLegState = document.getElementById("leftleg_state").value.trim();
    let playerClass = document.getElementById("playerClass").value.trim();
    let playerRightLegState = document.getElementById("rightleg_state").value.trim();

    try {
        let dice_roll = document.getElementById("dice_roll");
        if (!dice_roll) {
            console.error("Elemento com id 'dice_roll' não encontrado.");
            return;
        }

        let diceValue = dice_roll.innerText.trim();
        if (diceValue === "") {
            console.error("O valor do dado está vazio.");
            return;
        }

        // Verifica se o nome do jogador já existe no servidor (requisição GET)
        let checkResponse = await fetch(`${endpoint}/check_player/${encodeURIComponent(playerName)}`);
        if (!checkResponse.ok) {
            console.error("Erro ao verificar o jogador:", checkResponse.status, checkResponse.statusText);
            return;
        }
        let playerExists = await checkResponse.json();

        // Define a URL do endpoint, dependendo se é uma criação ou atualização
        let url = endpoint + ( playerExists.exists ? "/update_player" : "/add_player");

        // Realiza a requisição ao endpoint com os dados preenchidos
        let response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: playerName,
                playerClass: playerClass,
                playerRealName: playerRealName,
                playerSkills: playerSkills,
                hp: playerHP,
                state: playerState,
                blood_level: playerBloodLevel,
                trauma: playerTrauma,
                playerAdrenalina: playerAdrenalina,
                obs: playerObs,
                luta: playerLuta,
                inteligencia: playerInteligencia,
                agilidade: playerAgilidade,
                fisico: playerFisico,
                resistencia: playerResistencia,
                reflexo: playerReflexo,
                pontaria: playerPontaria,
                persuasao: playerPersuasao,
                conhecimento: playerConhecimento,
                investigacao: playerInvestigacao,
                intimidacao: playerIntimidacao,
                pilotagem: playerPilotagem,
                playerSorte: playerSorte,
                playerHeadState: playerHeadState,
                playerChestState: playerChestState,
                playerRightArmState: playerRightArmState,
                playerLeftArmState: playerLeftArmState,
                playerStomachState: playerStomachState,
                playerLeftLegState: playerLeftLegState,
                playerRightLegState: playerRightLegState
            }),
        });

        if (!response.ok) {
            console.error("Erro na requisição:", response.status, response.statusText);
            return;
        }

        let result = await response.json();
        console.log("Resultado:", result);
        updatePlayerListInsta();

    } catch (error) {
        console.error("Erro ao enviar os dados:", error);
    }

    if (playerState === "Morto") {
        // Mostrar a imagem
        document.getElementById("playerCardDeadImage").style.display = "block";
    }
});


//----------------

function rollDice() { //Função de fazer o rolamento dos dados, usando um argumento forte de geração aleatória de números.
    // Obtém o número de lados do dado a partir do elemento <select>
    const diceSelector = document.getElementById("dices");
    const diceSides = parseInt(diceSelector.value, 10); // Valor selecionado como número

    // Valida se o número de lados é válido
    if (isNaN(diceSides) || diceSides < 2) {
        alert("Selecione um dado válido.");
        return;
    }

    // Gera um número aleatório entre 1 e o número de lados do dado
    const result = Math.floor(Math.random() * diceSides) + 1;
    const Critico = (result === diceSides); // Se o resultado for o valor máximo
    const Falha = (result === 1); // Se o resultado for o valor mínimo
    console.log("Resultado do dado:", result);
    console.log("Critico:", Critico, "Falha:", Falha);

    return { result, Critico, Falha };
}

//----------------

function updateDiceColor(color) { //Função de atualizar a cor do resultado playerside do dado rolado, declarando como verde quando o resultado do result for o máximo para diceSides e vermelho caso result for igual ao menor valor possível pra diceSides.
  // Define o valor da variável CSS dinamicamente
  document.documentElement.style.setProperty('--bg-color', color);
}

//----------------

document.getElementById("rollDicebtn").addEventListener("click", async function () { // Evento de clique no botão de rolar o dado
    const jogadorInput = document.getElementById("name"); // Pega o campo de entrada do nome
    const nomeJogador = jogadorInput ? jogadorInput.value.trim() : ""; // Extrai o nome do jogador

    // Verifica se o nome do jogador foi preenchido
    if (!nomeJogador) {
        alert("O dado não pode ser rolado sem um jogador para ser vinculado!");
        return; // Interrompe o processo caso o nome esteja vazio
    }

    // Verifica se o jogador existe no servidor (requisição GET)
    let checkResponse1 = await fetch(`${endpoint}/check_player/${encodeURIComponent(nomeJogador)}`);
    if (!checkResponse1.ok) {
        console.error("Erro ao verificar o jogador:", checkResponse1.status, checkResponse1.statusText);
        return; // Interrompe o processo se houver erro na requisição
    }
    let jogadorExiste = await checkResponse1.json();

    if (!jogadorExiste.exists) {
        alert("Jogador não encontrado. Verifique o nome e tente novamente.");
        return; // Interrompe o processo se o jogador não existir
    }

    const diceSelector = document.getElementById("dices");
    const diceSides = parseInt(diceSelector.value, 10);
    const diceRoll = rollDice(); // Certifique-se de chamar a função
    const result = diceRoll?.result;
    const Critico = diceRoll?.Critico || false;
    const Falha = diceRoll?.Falha || false;

    console.log(`Resultado: ${result}, Crítico: ${Critico}, Falha: ${Falha}`);

    const diceRollDiv = document.getElementById("dice_roll");

    // Animação de números aleatórios
    await animateDiceRoll(diceRollDiv, diceSides, result);

    // Obtém o valor do atributo selecionado
    let atributo = document.getElementById("dicesatt").value;
    let valorAtributo;
    let playerName = document.getElementById("name").value;
    let playerHP = document.getElementById("hp").value.trim();
    let playerRealName = document.getElementById("realname").value.trim();
    let playerSkills = document.getElementById("skills").value.trim();
    let playerObs = document.getElementById("obs").value.trim();
    let playerClass = document.getElementById("playerClass").value.trim();
    let playerState = document.getElementById("state").value.trim();
    let playerBloodLevel = document.getElementById("blood_level").value.trim();
    let playerTrauma = document.getElementById("trauma").value.trim();
    let playerAdrenalina = document.querySelector('#adrenalina input[name="adrenalina"]:checked').value.trim();
    let playerLuta = document.getElementById("luta").value.trim();
    let playerInteligencia = document.getElementById("inteligencia").value.trim();
    let playerAgilidade = document.getElementById("agilidade").value.trim();
    let playerFisico = document.getElementById("fisico").value.trim();
    let playerResistencia = document.getElementById("resistencia").value.trim();
    let playerReflexo = document.getElementById("reflexo").value.trim();
    let playerPontaria = document.getElementById("pontaria").value.trim();
    let playerPersuasao = document.getElementById("persuasao").value.trim();
    let playerConhecimento = document.getElementById("conhecimento").value.trim();
    let playerInvestigacao = document.getElementById("investigacao").value.trim();
    let playerIntimidacao = document.getElementById("intimidacao").value.trim();
    let playerPilotagem = document.getElementById("pilotagem").value.trim();
    let playerSorte = document.getElementById("sorte").value.trim();
    let playerHeadState = document.getElementById("head_state").value.trim();
    let playerChestState = document.getElementById("chest_state").value.trim();
    let playerRightArmState = document.getElementById("rightarm_state").value.trim();
    let playerLeftArmState = document.getElementById("leftarm_state").value.trim();
    let playerStomachState = document.getElementById("stomach_state").value.trim();
    let playerLeftLegState = document.getElementById("leftleg_state").value.trim();
    let playerRightLegState = document.getElementById("rightleg_state").value.trim();

    // Define o valor do atributo selecionado
    switch (atributo) {
        case "Fisico":
            valorAtributo = document.getElementById("fisico").value;
            break;
        case "Resistencia":
            valorAtributo = document.getElementById("resistencia").value;
            break;
        case "Pontaria":
            valorAtributo = document.getElementById("pontaria").value;
            break;
        case "Agilidade":
            valorAtributo = document.getElementById("agilidade").value;
            break;
        case "Persuasao":
            valorAtributo = document.getElementById("persuasao").value;
            break;
        case "Conhecimento":
            valorAtributo = document.getElementById("conhecimento").value;
            break;
        case "Reflexo":
            valorAtributo = document.getElementById("reflexo").value;
            break;
        case "Pilotagem":
            valorAtributo = document.getElementById("pilotagem").value;
            break;
        case "Investigacao":
            valorAtributo = document.getElementById("investigacao").value;
            break;
        case "Intimidacao":
            valorAtributo = document.getElementById("intimidacao").value;
            break;
        case "Luta":
            valorAtributo = document.getElementById("luta").value;
            break;
        case "Inteligencia":
            valorAtributo = document.getElementById("inteligencia").value;
            break;
        case "Sorte":
            valorAtributo = document.getElementById("sorte").value;
            break;
        default:
            valorAtributo = "0"; // Valor padrão se o atributo não for encontrado
    }

    // Converte para número ou usa 0 se inválido
    const intvalorAtributo = parseInt(valorAtributo, 10) || 0;
    const dicesattElement = document.getElementById("dicesatt");
    const atributotxt = dicesattElement.value.slice(0, 5); // Pega apenas os 3 primeiros caracteres
    // Obtém o valor do bônus ou usa 0 se não for preenchido
    const bonus_roll = document.getElementById("bonus_roll")?.value || "0";
    const intbonus = parseInt(bonus_roll, 10) || 0;

    // Soma os valores do dado rolado, bônus e o atributo
    const dice_rollSOMA = result + intbonus + intvalorAtributo;
    const dice_rollINT = `D${diceSides}[${result}:${dice_rollSOMA}] (${atributotxt})`;
    // Exibe o valor do dado na interface
    diceRollDiv.textContent = dice_rollINT;

    // Verifica o estado da rolagem e aplica as cores corretamente
    

    // Realiza a verificação se o jogador existe
    let checkResponse = await fetch(`${endpoint}/check_player/${encodeURIComponent(playerName)}`);
    if (!checkResponse.ok) {
        console.error("Erro ao verificar o jogador:", checkResponse.status, checkResponse.statusText);
        return;
    }
    let playerExists = await checkResponse.json();

    let url = endpoint + (playerExists.exists ? "/update_player" : "/add_player");
    let response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: playerName,
            hp: playerHP,
            playerRealName: playerRealName,
            playerSkills: playerSkills,
            state: playerState,
            blood_level: playerBloodLevel,
            trauma: playerTrauma,
            playerAdrenalina: playerAdrenalina,
            obs: playerObs,
            playerClass: playerClass,
            dice_roll: dice_rollINT,
            luta: playerLuta,
            inteligencia: playerInteligencia,
            agilidade: playerAgilidade,
            fisico: playerFisico,
            resistencia: playerResistencia,
            reflexo: playerReflexo,
            pontaria: playerPontaria,
            persuasao: playerPersuasao,
            conhecimento: playerConhecimento,
            investigacao: playerInvestigacao,
            intimidacao: playerIntimidacao,
            pilotagem: playerPilotagem,
            playerSorte: playerSorte,
            playerHeadState: playerHeadState,
            playerChestState: playerChestState,
            playerRightArmState: playerRightArmState,
            playerLeftArmState: playerLeftArmState,
            playerStomachState: playerStomachState,
            playerLeftLegState: playerLeftLegState,
            playerRightLegState: playerRightLegState
        }),
    });

    

    if (!response.ok) {
        console.error("Erro na requisição:", response.status, response.statusText);
    }
    applyDiceRollState(dice_rollINT, Critico, Falha, diceRollDiv);
});

//----------------

async function animateDiceRoll(element, diceSides, finalResult) { // Função para animação de números aleatórios
    let currentValue = Math.floor(Math.random() * diceSides) + 1;
    let delay = 50;

    for (let i = 0; i < 15; i++) {
        element.textContent = currentValue;
        currentValue = Math.floor(Math.random() * diceSides) + 1;
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay += 10; // Aumenta o intervalo gradualmente
    }

    // Exibe o resultado final
    element.textContent = finalResult;
}

//----------------

function applyDiceRollState(dice_rollINT, Critico, Falha, diceRollDiv) { // Função para aplicar a cor e o estado ao dice_roll com base no resultado
    // Remove as classes anteriores 
    diceRollDiv.classList.remove('Critico', 'Falha', 'Normal');

    // Define a cor do texto com base nos estados
    if (Critico) {
        updateDiceColor('green');
        diceRollDiv.classList.add('Critico');
        diceRollDiv.classList.remove('Falha');
    } else if (Falha) {
        updateDiceColor('red');
        diceRollDiv.classList.add('Falha');
        diceRollDiv.classList.remove('Critico');
    }
    else{
        updateDiceColor('blue');
        diceRollDiv.classList.remove('Critico');
        diceRollDiv.classList.remove('Falha');
    }
}

//----------------

function normalizeText(inputText) { //Normalizar o inputText pra não conflitar com argumentos da database.
            return inputText.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        }

        document.getElementById("enterButton").addEventListener("click", () => {
            // Obtém o valor atual do dice_roll
            let diceRollDiv = document.getElementById("dice_roll").textContent;

            // Verifica se o valor é válido (não vazio ou o padrão "-")
            if (diceRollDiv === "-" || diceRollDiv.trim() === "") {
                console.error("Erro: Nenhum número foi rolado.");
                return;
            }

        });
document.getElementById("playerForm").addEventListener("submit", function(event) {
  event.preventDefault();
  
  let name = document.getElementById("name").value;
  let playerClass = document.getElementById("playerClass").value.trim();
  let hp = document.getElementById("hp").value;
  let playerRealName = document.getElementById("realname").value.trim();
  let playerSkills = document.getElementById("skills").value.trim();
  let state = document.getElementById("state").value;
  let obs = document.getElementById("obs").value;
  let dice_roll = document.getElementById("dice_rollINT").value;
  let trauma = document.getElementById("trauma").value;
  let playerAdrenalina = document.querySelector('#adrenalina input[name="adrenalina"]:checked').value.trim();
  let blood_level = document.getElementById("blood_level").value;
  let fisico = document.getElementById("fisico").value;
  let resistencia = document.getElementById("resistencia").value;
  let pontaria = document.getElementById("pontaria").value;
  let agilidade = document.getElementById("agilidade").value;
  let persuasao = document.getElementById("persuasao").value;
  let conhecimento = document.getElementById("conhecimento").value;
  let reflexo = document.getElementById("reflexo").value;
  let pilotagem = document.getElementById("pilotagem").value;
  let investigacao = document.getElementById("investigacao").value;
  let intimidacao = document.getElementById("intimidacao").value;
  let luta = document.getElementById("luta").value;
  let inteligencia = document.getElementById("inteligencia").value;
  let playerSorte = document.getElementById("sorte").value;
  let playerHeadState = document.getElementById("head_state").value.trim();
    let playerChestState = document.getElementById("chest_state").value.trim();
    let playerRightArmState = document.getElementById("rightarm_state").value.trim();
    let playerLeftArmState = document.getElementById("leftarm_state").value.trim();
    let playerStomachState = document.getElementById("stomach_state").value.trim();
    let playerLeftLegState = document.getElementById("leftleg_state").value.trim();
    let playerRightLegState = document.getElementById("rightleg_state").value.trim();

  let playerData = {
    name: name,
    playerClass: playerClass,
    hp: hp,
    playerRealName: playerRealName,
    playerSkills: playerSkills,
    state: state, 
    trauma: trauma, 
    playerAdrenalina: playerAdrenalina,
    obs: obs,
    dice_roll: dice_roll,
    blood_level: blood_level,
    fisico: fisico,
    resistencia: resistencia,
    pontaria: pontaria,
    agilidade: agilidade,
    persuasao: persuasao,
    conhecimento: conhecimento,
    reflexo: reflexo,
    pilotagem: pilotagem,
    investigacao: investigacao,
    intimidacao: intimidacao,
    luta: luta,
    inteligencia: inteligencia,
    playerSorte: playerSorte,
    playerHeadState: playerHeadState,
    playerChestState:  playerChestState,
    playerRightArmState: playerRightArmState,
    playerLeftArmState: playerLeftArmState,
    playerStomachState: playerStomachState,
    playerLeftLegState: playerLeftLegState,
    playerRightLegState: playerRightLegState
  };
});

//----------------

function fillInputs(playerName) { //Pega os inputs do formulario e preenche com os dados player.

    let playerData = globalPlayerList.find(player => player.name === playerName);
    if(playerData === undefined || playerData === null)
        throw new Error("Player não encontrado.")
    
    document.getElementById('name').value = playerData.name;
    document.getElementById('hp').value = playerData.hp;
    document.getElementById("playerClass").value = playerData.playerClass;
    document.getElementById('state').value = playerData.state;
    document.getElementById("obs").value = playerData.obs;
    document.getElementById("realname").value = playerData.playerRealName;
    document.getElementById("skills").value = playerData.playerSkills;
    document.getElementById('trauma').value = playerData.trauma;
    document.getElementById('blood_level').value = playerData.blood_level;
    document.getElementById('fisico').value = playerData.fisico;
    document.getElementById('resistencia').value = playerData.resistencia;
    document.getElementById('pontaria').value = playerData.pontaria;
    document.getElementById('agilidade').value = playerData.agilidade;
    document.getElementById('persuasao').value = playerData.persuasao;
    document.getElementById('conhecimento').value = playerData.conhecimento;
    document.getElementById('reflexo').value = playerData.reflexo;
    document.getElementById('pilotagem').value = playerData.pilotagem;
    document.getElementById('investigacao').value = playerData.investigacao;
    document.getElementById('intimidacao').value = playerData.intimidacao;
    document.getElementById('luta').value = playerData.luta;
    document.getElementById('inteligencia').value = playerData.inteligencia;
    document.getElementById("sorte").value = playerData.playerSorte;
    document.getElementById("head_state").value = playerData.playerHeadState;
    document.getElementById("chest_state").value = playerData.playerChestState;
    document.getElementById("rightarm_state").value = playerData.playerRightArmState;
    document.getElementById("leftarm_state").value = playerData.playerLeftArmState;
    document.getElementById("stomach_state").value = playerData.playerStomachState;
    document.getElementById("leftleg_state").value = playerData.playerLeftLegState;
    document.getElementById("rightleg_state").value = playerData.playerRightLegState;

}

function toggleObsDiv() {
    const obsDiv = document.getElementById("obs-div");
    const btn = document.getElementById("show-obs-btn");

    // Alterna entre mostrar ou esconder
    if (obsDiv.style.display === "none") {
      obsDiv.style.display = "block";
      btn.innerText = "Esconder Observação";
    } else {
      obsDiv.style.display = "none";
      btn.innerText = "Mostrar Observação";
    }
  }

        function renderPlayers(players) {
            

            globalPlayerList = players;

            const playerList = document.getElementById('playerList');
            playerList.innerHTML = '<h2 style="color: rgb(204, 204, 204); background-color: rgba(0, 0, 0, 0.5); padding: 15px; border-radius: 10px; box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.418); border: 1px solid #ffffff56; width: 450px; margin-left: 20px; margin: 20px auto;"><img src="images/icons/players.jpg"> Jogadores Conectados:</h2>';
            
            players.forEach(player => {
                var playerCardHTML;
                var updateObs = "";

                const playerItem = document.createElement('div');
                playerItem.className = 'player-item';
                
                // Verifica o estado e define a imagem correspondente
                switch (player.state) {
                    case 'Consciente':
                        stateImage = '<img src="images/icons/consi.jpg" class="player-state-image" alt="Consciente">';
                        break;
                    case 'Lento':
                        stateImage = '<img src="images/icons/sloww.jpg" class="player-state-image" alt="Lento">';
                        break;
                    case 'Sonolento':
                        stateImage = '<img src="images/icons/sleepy.jpg" class="player-state-image" alt="Sonolento">';
                        break;
                    case 'Dormindo':
                        stateImage = '<img src="images/icons/sleeping.jpg" class="player-state-image" alt="Dormindo">';
                        break;
                    case 'Desmaiado':
                        stateImage = '<img src="images/icons/uncon.jpg" class="player-state-image" alt="Desmaiado">';
                        break;
                    case 'Sangrando':
                        stateImage = '<img src="images/icons/bleed.jpg" class="player-state-image" alt="Sangrando">';
                        break;
                    case 'Hemorragia':
                        stateImage = '<img src="images/icons/hemo.jpg" class="player-state-image" alt="Hemorragia">';
                        break;
                    case 'Envenenado':
                        stateImage = '<img src="images/icons/poisoned.jpg" class="player-state-image" alt="Envenenado">';
                        break;
                    case 'Paralisado':
                        stateImage = '<img src="images/icons/parali.jpg" class="player-state-image" alt="Paralisado">';
                        break;
                    case 'Preso':
                        stateImage = '<img src="images/icons/preso2.jpg" class="player-state-image" alt="Preso">';
                        break;
                    case 'Ansioso':
                        stateImage = '<img src="images/icons/ansioso.jpg" class="player-state-image" alt="Ansioso">';
                        break;
                    case 'Insano':
                        stateImage = '<img src="images/icons/insano.jpg" class="player-state-image" alt="Insano">';
                        break;
                    case 'Estado Terminal':
                        stateImage = '<img src="images/icons/estterminal.jpg" class="player-state-image" alt="Estado Terminal">';
                        break;
                    case 'Morto':
                        stateImage = '<img src="images/icons/death.jpg" class="player-state-image" alt="Morto">';
                        playerItem.className += " player-item-dead";
                        break;
                    default:
                        stateImage = '<img src="images/icons/default.jpg" class="player-state-image" alt="Estado Desconhecido">';
                        break;
                }
                

                playerCardHTML = `<div>`

                if (player.state === "Morto") {
                    ;
                    playerCardHTML += `
                        <div id="playerCardDeadImage${player.name}" class="playerCardDeadImage">
                            <img src="images/death.png" alt="Morto"/ style="width: 100%; top: -25px; height: auto;">
                        </div>
                        `;
                        playerCardHTML += `<div id="playerCardContainer${player.name}" class="deadPlayerCard">`
                } else {

                    playerCardHTML = `<div>`;
                }

                playerCardHTML  +=`
                        <label class="textdice" for="blood_level" style="font-size: 20px; font-weight: bold; color: rgb(204, 204, 204);"><img src="images/icons/finaldiceroll.png"> Dado: </label>
                        <div id="dice_roll2 diceDivPlayer" class ="dice_roll diceDivPlayer" style="color: diceDivPlayer; font-size: 15px;">${player.dice_roll}</div>
                        <div class="player-info" style="color: rgb(204, 204, 204); text-align: center; margin: 0 auto; font-size: 8px;"><strong></strong>-NOME-</div>
                        <div class="player-info" style="color: rgb(204, 204, 204); text-align: center; margin: 0 auto; font-size: 25px; font-weight: 900;"><strong></strong> ${player.name}</div>
                        <hr style="border: 1x solid #ccc; margin: 10px 0;">
                        <div class="player-info" style="color: rgb(204, 204, 204);"><strong><img src="images/icons/realname.jpg" class="player-state-image" alt="obs">Nome do Jogador:</strong> ${player.playerRealName}</div>
                        <div class="player-info" style="color: rgb(204, 204, 204);"><strong><img src="images/icons/class.png" class="player-state-image" alt="nome">Classe: </strong> ${player.playerClass}</div>
                        <div class="player-info" style="color: rgb(204, 204, 204);"><strong><img src="images/icons/life.jpg" class="player-state-image" alt="vida">Vida:</strong> ${player.hp} HP</div>
                        <div class="player-info" style="color: rgb(204, 204, 204);"><strong><img src="images/icons/state.jpg" class="player-state-image" alt="estado">Estado:</strong> ${stateImage} ${player.state}</div>
                        <div class="player-info" style="color: rgb(204, 204, 204);"><strong><img src="images/icons/blood.jpg" class="player-state-image" alt="sangue">Nivel de Sangue:</strong> ${player.blood_level}%</div>
                        <div class="player-info" style="color: rgb(204, 204, 204);"><strong><img src="images/icons/fear.jpg" class="player-state-image" alt="trauma">Trauma:</strong> ${player.trauma}</div>
                        <div class="player-info" style="color: rgb(204, 204, 204);">
<div class="player-info" style="color: rgb(204, 204, 204); display: flex; align-items: center;">
  <strong style="margin-right: 10px;">
    <img src="images/icons/adrenalina.jpg" class="player-state-image" alt="obs">
    Adrenalina: [ ${player.playerAdrenalina} ]
  </strong>
  <progress value="${player.playerAdrenalina}" max="5" class="adrenalina-progress">
    ${player.playerAdrenalina}
  </progress>
</div>
                        <hr style="border: 1x solid #ccc; margin: 10px 0;">
                        <div class="player-info" style="color: rgb(204, 204, 204);"><strong><img src="images/icons/fis.png" class="player-state-image" alt="trauma">Fisico:</strong> ${player.fisico}</div>
                        <div class="player-info" style="color: rgb(204, 204, 204);"><strong><img src="images/icons/res.jpg" class="player-state-image" alt="trauma">Resistencia:</strong> ${player.resistencia}</div>
                        <div class="player-info" style="color: rgb(204, 204, 204);"><strong><img src="images/icons/pon.jpg" class="player-state-image" alt="trauma">Pontaria:</strong> ${player.pontaria}</div>
                        <div class="player-info" style="color: rgb(204, 204, 204);"><strong><img src="images/icons/agi.jpg" class="player-state-image" alt="trauma">Agilidade:</strong> ${player.agilidade}</div>
                        <div class="player-info" style="color: rgb(204, 204, 204);"><strong><img src="images/icons/per.jpg" class="player-state-image" alt="trauma">Persuasao:</strong> ${player.persuasao}</div>
                        <div class="player-info" style="color: rgb(204, 204, 204);"><strong><img src="images/icons/conhe.jpg" class="player-state-image" alt="trauma">Conhecimento:</strong> ${player.conhecimento}</div>
                        <div class="player-info" style="color: rgb(204, 204, 204);"><strong><img src="images/icons/ref.jpg" class="player-state-image" alt="trauma">Reflexo:</strong> ${player.reflexo}</div>
                        <div class="player-info" style="color: rgb(204, 204, 204);"><strong><img src="images/icons/pilo.jpg" class="player-state-image" alt="trauma">Pilotagem:</strong> ${player.pilotagem}</div>
                        <div class="player-info" style="color: rgb(204, 204, 204);"><strong><img src="images/icons/inves.jpg" class="player-state-image" alt="trauma">Investigacao:</strong> ${player.investigacao}</div>
                        <div class="player-info" style="color: rgb(204, 204, 204);"><strong><img src="images/icons/intimi.jpg" class="player-state-image" alt="trauma">Intimidacao:</strong> ${player.intimidacao}</div>
                        <div class="player-info" style="color: rgb(204, 204, 204);"><strong><img src="images/icons/luta.jpg" class="player-state-image" alt="trauma">Luta:</strong> ${player.luta}</div>
                        <div class="player-info" style="color: rgb(204, 204, 204);"><strong><img src="images/icons/int.jpg" class="player-state-image" alt="obs">Inteligencia:</strong> ${player.inteligencia}</div>
                        <div class="player-info" style="color: rgb(204, 204, 204);"><strong><img src="images/icons/int.jpg" class="player-state-image" alt="obs">Sorte:</strong> ${player.playerSorte}</div>
                        <div class="player-info" style="color: rgb(204, 204, 204);"><strong><img src="images/icons/skills.jpg" class="player-state-image" alt="obs">Habilidades:</strong></div>
<div class="obsdiv"
     style="width: 100%; 
            height: 425px; 
            background-color: white; 
            color: rgb(255, 255, 255); 
            font-size: 15px; 
            border: 1px solid white; 
            font-family: 'MinhaFonte', Courier, monospace; 
            padding: 5px; 
            box-sizing: border-box; 
            background-image: url(../images/leatherdiv.jpg); 
            background-size: 100%; 
            word-wrap: break-word;
            overflow-y: auto;">
    <pre>${player.playerSkills.replace(/</g, '&lt;').replace(/>/g, '&gt;')}
    </pre>
</div>
    <div class="player-info" style="color: rgb(204, 204, 204);"><strong><img src="images/icons/inventory.jpg" class="player-state-image" alt="obs">Inventario:</strong></div>
    <div class="obsdiv" 
    style="width: 100%; 
           height: 425px; 
           background-color: white; 
           color: rgb(255, 255, 255); 
           font-size: 15px; 
           border: 1px solid white; 
           font-family: 'MinhaFonte', Courier, monospace; 
           padding: 5px; 
           box-sizing: border-box; 
           background-image: url(../images/leatherdiv.jpg); 
           background-size: 100%; 
           word-wrap: break-word;
           overflow-y: auto;">
    <pre style="white-space: pre-wrap; word-wrap: break-word; overflow-wrap: break-word;">${player.obs.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
</div>                <div class="player-info" style="color: rgb(204, 204, 204);">
                        
<div class="container">
    <div id="dice-container">
        <label class="textbody" for="blood_level" style="font-size: 20px; font-weight: bold; color: rgb(204, 204, 204);">
            <label> Estado do Corpo: 
        </label>
    </div>`;


    //debugger;
    playerCardHTML +=`

    <div id="body-container${player.name}" class="body-container">
        <!-- Cabeça -->
        `;
        playerCardHTML +=`


        <div class="body-part" id="head"> <div style="font-size: 10px;">Cabeca</div>
            <img src="
            ${player.playerHeadState=="decepado"
                ?'images/icons/headoff.png'
                :player.playerHeadState=="critico"
                    ?'images/icons/headcritical.png'
                    :player.playerHeadState=="ferido"
                        ?'images/icons/headferido.png'
                        :'images/icons/head.png'}" alt="Cabeça">
            <div>${player.playerHeadState}</div>
        </div>`;


        playerCardHTML +=`
        <!-- Braço Esquerdo -->
        <div class="body-part" id="left-arm"> <div style="font-size: 10px;">Braco Esq.</div>
            <img src="
            ${player.playerLeftArmState=="decepado"
                ?'images/icons/rightarmoff.png'
                :player.playerLeftArmState=="critico"
                    ?'images/icons/rightarmcritical.png'
                    :player.playerLeftArmState=="ferido"
                        ?'images/icons/rightarmferido.png'
                        :'images/icons/rightarm.png'}"alt="Braço Esquerdo">
            <div>${player.playerLeftArmState}</div>
        </div>`;


        playerCardHTML +=`
        <!-- Peito -->
        <div class="body-part" id="chest"> <div style="font-size: 10px;">Peito</div>
            <img src="
            ${player.playerChestState=="decepado"
                ?'images/icons/chestoff.png' //o gif deveria ficar sobreposto em cima dessa imagem, se redimensionando pra nao ficar fora dela tambem!
                :player.playerChestState=="critico"
                    ?'images/icons/chestcritical.png'
                    :player.playerChestState=="ferido"
                        ?'images/icons/chestferido.png'
                        :'images/icons/chest.png'}"alt="Peito">
            <div>${player.playerChestState}</div>
        </div>`;


        playerCardHTML +=`
        <!-- Braço Direito -->
        <div class="body-part" id="right-arm"> <div style="font-size: 10px;">Braco Dir.</div>
            <img src="
            ${player.playerRightArmState=="decepado"
                ?'images/icons/leftarmoff.png'
                :player.playerRightArmState=="critico"
                    ?'images/icons/leftarmcritical.png'
                    :player.playerRightArmState=="ferido"
                        ?'images/icons/leftarmferido.png'
                        :'images/icons/leftarm.png'}"alt="Braço Direito">
            <div id="right-arm">${player.playerRightArmState}</div>
        </div>`;


        playerCardHTML +=`
        <!-- Estômago -->
        <div class="body-part" id="stomach"> <div style="font-size: 10px;">Abdomen</div>
            <img src="
            ${player.playerStomachState=="decepado"
                ?'images/icons/stomachoff.png'
                :player.playerStomachState=="critico"
                    ?'images/icons/stomachcritical.png'
                    :player.playerStomachState=="ferido"
                        ?'images/icons/stomachferido.png'
                        :'images/icons/stomach.png'}"alt="Estômago">
            <div>${player.playerStomachState}</div>
        </div>`;


        playerCardHTML +=`
        <!-- Perna Esquerda -->
        <div class="body-part" id="left-leg"> <div style="font-size: 10px;">Perna Esq.</div>
            <img src="
            ${player.playerLeftLegState=="decepado"
                ?'images/icons/leftlegoff.png'
                :player.playerLeftLegState=="critico"
                    ?'images/icons/leftlegcritical.png'
                    :player.playerLeftLegState=="ferido"
                        ?'images/icons/leftlegferido.png'
                        :'images/icons/leftleg.png'}"alt="Perna Esquerda">
            <div class>${player.playerLeftLegState}</div>
        </div>`;


        playerCardHTML +=`
        <!-- Perna Direita -->
        <div class="body-part" id="right-leg"> <div style="font-size: 10px;"> Perna Dir.</div>
            <img src="
            ${player.playerRightLegState=="decepado"
                ?'images/icons/rightlegoff.png'
                :player.playerRightLegState=="critico"
                    ?'images/icons/rightlegcritical.png'
                    :player.playerRightLegState=="ferido"
                        ?'images/icons/rightlegferido.png'
                        :'images/icons/rightleg.png'}"alt="Perna Direita">
            <div>${player.playerRightLegState}</div>
        </div>`;

        
        playerCardHTML +=`
        
    </div>
    <div style="margin-bottom: 10px; display: flex; justify-content: right; min-width: 100%;">
        <button class="medieval-button" onclick="fillInputs('${player.name}'); window.scrollTo({ top: 0, behavior: 'smooth' });" style="color: white; margin-right: 10px;">Editar</button>
        <button class="button" onclick="deletePlayer('${player.name}')" >Excluir</button>
    </div>
</div>
                `;
                
                playerItem.innerHTML = playerCardHTML;
                playerList.appendChild(playerItem);
                //alert(player.dice_roll);
                
            });

        }

//-------------------------------------------------

        
function deletePlayer(playerName) {
    var showingError = false;

    // Codifica o nome do jogador para ser seguro em URLs
    const encodedPlayerName = encodeURIComponent(playerName);

    fetch(`${endpoint}/delete_player?name=${encodedPlayerName}`, { method: 'DELETE' })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                renderPlayers(data.players);
            }

            showingError = false;
            hideError();
        })
        .catch(error => {
            if (!showingError)
                showError();

            showingError = true;
        });
}
        
        function checkIfPlayerExists(name) {
            return fetch(`${endpoint}/check_player/${name}`)  // Alterado para passar o nome na URL
                .then(response => response.json())
                .then(data => data.exists);
        }
        function updateStatus() {
            const name = document.getElementById('name').value;
            const playerClass = document.getElementById('playerClass').value;
            const playerRealName = document.getElementById('realname').value;
            const playerSkills = document.getElementById('skills').value;
            const hp = document.getElementById('hp').value;
            const state = document.getElementById('state').value;
            const obs = document.getElementById('obs').value;
            const blood_level = document.getElementById('blood_level').value;
            const trauma = document.getElementById('trauma').value;
            const playerAdrenalina = document.querySelector('#adrenalina input[name="adrenalina"]:checked').value.trim();
            const dice_roll = document.getElementById('dice_rollINT').value;
            const fisico = document.getElementById('fisico').value;
            const resistencia = document.getElementById('resistencia').value;
            const pontaria = document.getElementById('pontaria').value;
            const agilidade = document.getElementById('agilidade').value;
            const persuasao = document.getElementById('persuasao').value;
            const conhecimento = document.getElementById('conhecimento').value;
            const reflexo = document.getElementById('reflexo').value;
            const pilotagem = document.getElementById('pilotagem').value;
            const investigacao = document.getElementById('investigacao').value;
            const intimidacao = document.getElementById('intimidacao').value;
            const luta = document.getElementById('luta').value;
            const inteligencia = document.getElementById('inteligencia').value;
            const playerSorte = document.getElementById('sorte').value;
            const playerHeadState = document.getElementById("head_state").value.trim();
            const playerChestState = document.getElementById("chest_state").value.trim();
            const playerRightArmState = document.getElementById("rightarm_state").value.trim();
            const playerLeftArmState = document.getElementById("leftarm_state").value.trim();
            const playerStomachState = document.getElementById("stomach_state").value.trim();
            const playerLeftLegState = document.getElementById("leftleg_state").value.trim();
            const playerRightLegState = document.getElementById("rightleg_state").value.trim();

            checkIfPlayerExists(name).then(exists => {
                if (exists) {
                    fetch(`${endpoint}/update_player`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        name, playerClass, playerRealName, playerSkills, hp, state, blood_level, trauma, playerAdrenalina, obs, dice_roll, fisico, resistencia,
        pontaria, agilidade, persuasao, conhecimento, reflexo, pilotagem, investigacao, 
        intimidacao, luta, inteligencia, playerSorte, playerHeadState, playerChestState, playerRightArmState, playerLeftArmState, playerStomachState, playerLeftLegState, playerRightLegState
    }),
})
                    .then(response => response.json())
                    .then(data => {
                        renderPlayers(data.players);
                        document.getElementById('playerForm').reset();
                    });
                } else {
                    alert("O jogador não existe. Não é possível atualizar.");
                }
            });
        }

        document.getElementById('playerForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const name = normalizeText(document.getElementById('name').value);
            const hp = document.getElementById('hp').value;
            const playerRealName = document.getElementById('realname').value;
            const playerSkills = document.getElementById('skills').value;
            const playerClass = document.getElementById('playerClass').value;
            const state = document.getElementById('state').value;
            const blood_level = document.getElementById('blood_level').value;
            const trauma = document.getElementById('trauma').value;
            const playerAdrenalina = document.getElementById("adrenalina").value;
            const obs = document.getElementById('obs').value;
            const dice_roll = document.getElementById('dice_rollINT').value;
            const fisico = document.getElementById('fisico').value;
            const resistencia = document.getElementById('resistencia').value;
            const pontaria = document.getElementById('pontaria').value;
            const agilidade = document.getElementById('agilidade').value;
            const persuasao = document.getElementById('persuasao').value;
            const conhecimento = document.getElementById('conhecimento').value;
            const reflexo = document.getElementById('reflexo').value;
            const pilotagem = document.getElementById('pilotagem').value;
            const investigacao = document.getElementById('investigacao').value;
            const intimidacao = document.getElementById('intimidacao').value;
            const luta = document.getElementById('luta').value;
            const inteligencia = document.getElementById('inteligencia').value;
            const playerSorte = document.getElementById('sorte').value;
            const playerHeadState = document.getElementById("head_state").value.trim();
            const playerChestState = document.getElementById("chest_state").value.trim();
            const playerRightArmState = document.getElementById("rightarm_state").value.trim();
            const playerLeftArmState = document.getElementById("leftarm_state").value.trim();
            const playerStomachState = document.getElementById("stomach_state").value.trim();
            const playerLeftLegState = document.getElementById("leftleg_state").value.trim();
            const playerRightLegState = document.getElementById("rightleg_state").value.trim();

            checkIfPlayerExists(name).then(exists => {
                if (exists) {
                    fetch(`${endpoint}/update_player`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({name, playerClass, hp, playerRealName, playerSkills, state, blood_level, trauma, playerAdrenalina, obs, dice_roll, fisico, resistencia, pontaria, agilidade, persuasao, 
                            conhecimento, reflexo, pilotagem, investigacao, intimidacao, luta, inteligencia, playerSorte, playerHeadState, playerChestState, playerRightArmState, playerLeftArmState, playerStomachState, playerLeftLegState, playerRightLegState}),
                    }) 
                    .then(response => response.json())
                    .then(data => {
                        renderPlayers(data.players);
                        document.getElementById('playerForm').reset();
                    });
                } else {
                    fetch(`${endpoint}/add_player`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            name, playerClass, hp,  playerRealName, playerSkills, state, blood_level, trauma, playerAdrenalina, obs, dice_roll, fisico, resistencia, pontaria, agilidade, persuasao, 
                            conhecimento, reflexo, pilotagem, investigacao, intimidacao, luta, inteligencia, playerSorte,
                            playerHeadState, playerChestState, playerRightArmState, playerLeftArmState, 
                            playerStomachState, playerLeftLegState, playerRightLegState}),
                    })
                    .then(response => response.json())
                    .then(data => {
                        renderPlayers(data.players);
                        document.getElementById('playerForm').reset();
                    });
                }
            });
        });

        function showError() {
            document.getElementById("serverCommunicationError").classList.add("display");
        }
        function hideError() {
            document.getElementById("serverCommunicationError").classList.remove("display");
        }
        
        function updatePlayerListInsta() {
            fetch(`${endpoint}/get_players`)
                .then(response => response.json())
                .then(data => renderPlayers(data.players));
        }
        
        const toggleButton = document.getElementById("toggleAutoRefresh");
        let isAutoRefreshOn = false; // Estado inicial: desativado
        
        // Adicionar evento ao botão para alternar o estado
        toggleButton.addEventListener("click", function () {
          isAutoRefreshOn = !isAutoRefreshOn; // Alterna o estado
        
          if (isAutoRefreshOn) {
            toggleButton.textContent = "Recarregamento Automático: On";
            console.log("Auto-refresh ativado.");
            startAutoRefresh(); // Inicia o auto-refresh
          } else {
            toggleButton.textContent = "Recarregamento Automático: Off";
            console.log("Auto-refresh desativado.");
          }
        });
        
        // Função que gerencia o auto-refresh
        function startAutoRefresh() {
          if (!isAutoRefreshOn) return; // Interrompe se o auto-refresh estiver desativado
        
          // Aqui você coloca a lógica para buscar os dados
          fetch(`${endpoint}/get_players`)
            .then((response) => {
              if (!response.ok) {
                throw new Error("Erro ao obter a lista de jogadores");
              }
              return response.json();
            })
            .then((data) => {
             // console.log("Lista de jogadores atualizada:", data.players);
              renderPlayers(data.players); // Substitua por sua função de renderização
            })
            .catch((error) => {
              console.error("Erro ao atualizar lista de jogadores:", error);
            });
        
          // Configura o próximo ciclo de atualização
          setTimeout(startAutoRefresh, 5000);
        }
        
        
        $(document).ready(function() {
            $('#state').select2({
                templateResult: function(state) {
                    if (!state.id) { 
                        return state.text;
                    }
                    var $state = $( 
                        '<span><img src="' + $(state.element).data('icon') + '" class="img-flag" /> ' + state.text + '</span>' 
                    );
                    return $state;
                },
                templateSelection: function(state) {
                    return state.text;
                }
            });
        });
