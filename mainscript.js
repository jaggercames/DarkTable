
var globalPlayerList = [];

function toggleInfo() { // Caixa de dúvida, onde fica a informação de como calcular os dados.
  var infoBox = document.getElementById("info-box");
  // Toggle a visibilidade da caixinha
  if (infoBox.style.display === "none" || infoBox.style.display === "") {
    infoBox.style.display = "block";
  } else {
    infoBox.style.display = "none";
  }
}

//----------------

document.getElementById("enterButton").addEventListener("click", async (event) => { // Função que insere o jogador na database, caso o nome for novo, e atualiza o jogador, caso o nome já exista na database.
    const jogadorInput = document.getElementById("name"); // Pega o campo de entrada do nome
    const nomeJogador = jogadorInput ? jogadorInput.value.trim() : ""; // Extrai o nome do jogador

    // Verifica se o nome do jogador foi preenchido
    if (!nomeJogador) {
        alert("Você deve inserir um nome.");
        return; // Interrompe o processo caso o nome esteja vazio
    }

    // Verifica se o jogador existe no servidor (requisição GET)
    let checkResponse1 = await fetch(`/check_player/${encodeURIComponent(nomeJogador)}`);
    if (!checkResponse1.ok) {
        console.error("Erro ao verificar o jogador:", checkResponse1.status, checkResponse1.statusText);
        return; // Interrompe o processo se houver erro na requisição
    }
    
    
    event.preventDefault(); // Evita que a página recarregue
    let playerName = null;
    let playerHP = null;
    let playerState = null;
    let playerBloodLevel = 0;
    let playerTrauma = null;
    let playerLuta = null;
    let playerInteligencia = null;
    let playerAgilidade = null;
    let playerFisico = null;
    let playerResistencia = null;
    let playerReflexo = null;
    let playerPontaria = null;
    let playerPersuasao = null;
    let playerConhecimento = null;
    let playerInvestigacao = null;
    let playerIntimidacao = null;
    let playerPilotagem = null;

    try {
        // Obtém o valor do dado
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

        
        // Coleta os valores preenchidos pelo usuário
        let playerName = document.getElementById("name").value.trim();
        let playerHP = document.getElementById("hp").value.trim();
        let playerState = document.getElementById("state").value.trim();
        let playerBloodLevel = document.getElementById("blood_level").value.trim();
        let playerTrauma = document.getElementById("trauma").value.trim();
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

        // Verifica se o nome do jogador já existe no servidor (requisição GET)
        let checkResponse = await fetch(`/check_player/${encodeURIComponent(playerName)}`);
        if (!checkResponse.ok) {
            console.error("Erro ao verificar o jogador:", checkResponse.status, checkResponse.statusText);
            return;
        }
        let playerExists = await checkResponse.json();

        // Define a URL do endpoint, dependendo se é uma criação ou atualização
        let url = playerExists.exists ? "/update_player" : "/add_player";



        // Realiza a requisição ao endpoint com os dados preenchidos
        let response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: playerName,
                hp: playerHP,
                state: playerState,
                blood_level: playerBloodLevel,
                trauma: playerTrauma,
                dice_roll: diceValue,
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
                pilotagem: playerPilotagem
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
    let checkResponse1 = await fetch(`/check_player/${encodeURIComponent(nomeJogador)}`);
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
    let playerState = document.getElementById("state").value.trim();
    let playerBloodLevel = document.getElementById("blood_level").value.trim();
    let playerTrauma = document.getElementById("trauma").value.trim();
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
        default:
            valorAtributo = "0"; // Valor padrão se o atributo não for encontrado
    }

    // Converte para número ou usa 0 se inválido
    const intvalorAtributo = parseInt(valorAtributo, 10) || 0;

    // Obtém o valor do bônus ou usa 0 se não for preenchido
    const bonus_roll = document.getElementById("bonus_roll")?.value || "0";
    const intbonus = parseInt(bonus_roll, 10) || 0;

    // Soma os valores do dado rolado, bônus e o atributo
    const dice_rollSOMA = result + intbonus + intvalorAtributo;
    const dice_rollINT = `D${diceSides}[${result}:${dice_rollSOMA}]`;

    // Exibe o valor do dado na interface
    diceRollDiv.textContent = dice_rollINT;

    // Verifica o estado da rolagem e aplica as cores corretamente
    applyDiceRollState(dice_rollINT, Critico, Falha, diceRollDiv);

    // Realiza a verificação se o jogador existe
    let checkResponse = await fetch(`/check_player/${encodeURIComponent(playerName)}`);
    if (!checkResponse.ok) {
        console.error("Erro ao verificar o jogador:", checkResponse.status, checkResponse.statusText);
        return;
    }
    let playerExists = await checkResponse.json();

    let url = playerExists.exists ? "/update_player" : "/add_player";

    let response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: playerName,
            hp: playerHP,
            state: playerState,
            blood_level: playerBloodLevel,
            trauma: playerTrauma,
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
        }),
    });

    

    if (!response.ok) {
        console.error("Erro na requisição:", response.status, response.statusText);
    }
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
  let hp = document.getElementById("hp").value;
  let state = document.getElementById("state").value;
  let dice_roll = document.getElementById("dice_roll").value;
  let trauma = document.getElementById("trauma").value;
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

  let playerData = {
    name: name,
    hp: hp,
    state: state, 
    trauma: trauma, 
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
    inteligencia: inteligencia
  };

  // Enviando os dados com acentos removidos
  fetch("/add_player", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(playerData)
  })
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Erro:', error));
});

//----------------

function fillInputs(playerName) { //Pega os inputs do formulario e preenche com os dados player.

    let playerData = globalPlayerList.find(player => player.name === playerName);
    if(playerData === undefined || playerData === null)
        throw new Error("Player não encontrado.")
    
    document.getElementById('name').value = playerData.name;
    document.getElementById('hp').value = playerData.hp;
    document.getElementById('state').value = playerData.state;
    document.getElementById('trauma').value = playerData.trauma;
    document.getElementById('dice_roll').value = playerData.dice_roll;
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

}


        function renderPlayers(players) {

            globalPlayerList = players;

            const playerList = document.getElementById('playerList');
            playerList.innerHTML = '<h2 style="color: rgb(204, 204, 204); background-color: rgba(0, 0, 0, 0.5); padding: 15px; border-radius: 10px; box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.418); border: 1px solid #ffffff56; width: 450px; margin-left: 20px; margin: 20px auto;"><img src="icons/players.jpg"> Jogadores Conectados:</h2>';
            
            players.forEach(player => {
                var playerCardHTML;

                const playerItem = document.createElement('div');
                playerItem.className = 'player-item';
                
                // Verifica o estado e define a imagem correspondente
                switch (player.state) {
                    case 'Consciente':
                        stateImage = '<img src="icons/consi.jpg" class="player-state-image" alt="Consciente">';
                        break;
                    case 'Lento':
                        stateImage = '<img src="icons/sloww.jpg" class="player-state-image" alt="Lento">';
                        break;
                    case 'Sonolento':
                        stateImage = '<img src="icons/sleepy.jpg" class="player-state-image" alt="Sonolento">';
                        break;
                    case 'Dormindo':
                        stateImage = '<img src="icons/sleeping.jpg" class="player-state-image" alt="Dormindo">';
                        break;
                    case 'Desmaiado':
                        stateImage = '<img src="icons/uncon.jpg" class="player-state-image" alt="Desmaiado">';
                        break;
                    case 'Sangrando':
                        stateImage = '<img src="icons/bleed.jpg" class="player-state-image" alt="Sangrando">';
                        break;
                    case 'Hemorragia':
                        stateImage = '<img src="icons/hemo.jpg" class="player-state-image" alt="Hemorragia">';
                        break;
                    case 'Envenenado':
                        stateImage = '<img src="icons/poisoned.jpg" class="player-state-image" alt="Envenenado">';
                        break;
                    case 'Paralisado':
                        stateImage = '<img src="icons/parali.jpg" class="player-state-image" alt="Paralisado">';
                        break;
                    case 'Preso':
                        stateImage = '<img src="icons/preso2.jpg" class="player-state-image" alt="Preso">';
                        break;
                    case 'Ansioso':
                        stateImage = '<img src="icons/ansioso.jpg" class="player-state-image" alt="Ansioso">';
                        break;
                    case 'Insano':
                        stateImage = '<img src="icons/insano.jpg" class="player-state-image" alt="Insano">';
                        break;
                    case 'Estado Terminal':
                        stateImage = '<img src="icons/estterminal.jpg" class="player-state-image" alt="Estado Terminal">';
                        break;
                    case 'Morto':
                        stateImage = '<img src="icons/death.jpg" class="player-state-image" alt="Morto">';
                        playerItem.className += " player-item-dead";
                        break;
                    default:
                        stateImage = '<img src="icons/default.jpg" class="player-state-image" alt="Estado Desconhecido">';
                        break;
                }
                
                

                playerCardHTML = `<div>`

                if (player.state === "Morto") {
                    ;
                    playerCardHTML += `
                        <div id="playerCardDeadImage${player.name}" class="playerCardDeadImage">
                            <img src="rndimages/death.png" alt="Morto"/ style="width: 100%; top: -25px; height: auto;">
                        </div>
                        `;
                        playerCardHTML += `<div id="playerCardContainer${player.name}" class="deadPlayerCard">`
                } else {

                    playerCardHTML = `<div>`;
                }
                

                playerCardHTML  +=`
                    
                        <label class="textdice" for="blood_level" style="font-size: 20px; font-weight: bold; color: rgb(204, 204, 204);"><img src="icons/finaldiceroll.png"> Dado: </label>
                        <div id="dice_roll2 diceDivPlayer" class ="dice_roll diceDivPlayer" style="color: diceDivPlayer">${player.dice_roll}</div> 
                        <div class="player-info" style="color: rgb(204, 204, 204);"><strong><img src="icons/name.jpg" class="player-state-image" alt="nome">Nome: </strong> ${player.name}</div>
                        <div class="player-info" style="color: rgb(204, 204, 204);"><strong><img src="icons/life.jpg" class="player-state-image" alt="vida">Vida:</strong> ${player.hp} HP</div>
                        <div class="player-info" style="color: rgb(204, 204, 204);"><strong><img src="icons/state.jpg" class="player-state-image" alt="estado">Estado:</strong> ${stateImage} ${player.state}</div>
                        <div class="player-info" style="color: rgb(204, 204, 204);"><strong><img src="icons/blood.jpg" class="player-state-image" alt="sangue">Nivel de Sangue:</strong> ${player.blood_level}%</div>
                        <div class="player-info" style="color: rgb(204, 204, 204);"><strong><img src="icons/fear.jpg" class="player-state-image" alt="trauma">Trauma:</strong> ${player.trauma}</div>
                        <div class="player-info" style="color: rgb(204, 204, 204);"><strong><img src="icons/fis.png" class="player-state-image" alt="trauma">Fisico:</strong> ${player.fisico}</div>
                        <div class="player-info" style="color: rgb(204, 204, 204);"><strong><img src="icons/res.jpg" class="player-state-image" alt="trauma">Resistencia:</strong> ${player.resistencia}</div>
                        <div class="player-info" style="color: rgb(204, 204, 204);"><strong><img src="icons/pon.jpg" class="player-state-image" alt="trauma">Pontaria:</strong> ${player.pontaria}</div>
                        <div class="player-info" style="color: rgb(204, 204, 204);"><strong><img src="icons/agi.jpg" class="player-state-image" alt="trauma">Agilidade:</strong> ${player.agilidade}</div>
                        <div class="player-info" style="color: rgb(204, 204, 204);"><strong><img src="icons/per.jpg" class="player-state-image" alt="trauma">Persuasao:</strong> ${player.persuasao}</div>
                        <div class="player-info" style="color: rgb(204, 204, 204);"><strong><img src="icons/conhe.jpg" class="player-state-image" alt="trauma">Conhecimento:</strong> ${player.conhecimento}</div>
                        <div class="player-info" style="color: rgb(204, 204, 204);"><strong><img src="icons/ref.jpg" class="player-state-image" alt="trauma">Reflexo:</strong> ${player.reflexo}</div>
                        <div class="player-info" style="color: rgb(204, 204, 204);"><strong><img src="icons/pilo.jpg" class="player-state-image" alt="trauma">Pilotagem:</strong> ${player.pilotagem}</div>
                        <div class="player-info" style="color: rgb(204, 204, 204);"><strong><img src="icons/inves.jpg" class="player-state-image" alt="trauma">Investigacao:</strong> ${player.investigacao}</div>
                        <div class="player-info" style="color: rgb(204, 204, 204);"><strong><img src="icons/intimi.jpg" class="player-state-image" alt="trauma">Intimidacao:</strong> ${player.intimidacao}</div>
                        <div class="player-info" style="color: rgb(204, 204, 204);"><strong><img src="icons/luta.jpg" class="player-state-image" alt="trauma">Luta:</strong> ${player.luta}</div>
                        <div class="player-info" style="color: rgb(204, 204, 204);"><strong><img src="icons/int.jpg" class="player-state-image" alt="trauma">Inteligencia:</strong> ${player.inteligencia}</div>
                    </div>
                    <div style="margin-bottom: 10px; display: flex; justify-content: right; min-width: 100%;">
                        <button class="medieval-button" onclick="fillInputs('${player.name}'); window.scrollTo({ top: 0, behavior: 'smooth' });" style="color: white; margin-right: 10px;">Editar</button>
                        <button class="button" onclick="deletePlayer('${player.name}')" >Excluir</button>
                    </div>
                `;

                playerItem.innerHTML = playerCardHTML;
                
                playerList.appendChild(playerItem);
                

                
                
            });

        }

        
        function deletePlayer(playerName) {
            var showingError = false;

            fetch(`/delete_player?name=${playerName}`, { method: 'DELETE' })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        renderPlayers(data.players);
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
        
        function checkIfPlayerExists(name) {
            return fetch('/check_player?name=' + name)
                .then(response => response.json())
                .then(data => data.exists);
        }

        function updateStatus() {
            const name = document.getElementById('name').value;
            const hp = document.getElementById('hp').value;
            const state = document.getElementById('state').value;
            const blood_level = document.getElementById('blood_level').value;
            const trauma = document.getElementById('trauma').value;
            const dice_roll = document.getElementById('dice_roll').value;
            const furtivo = document.getElementById('furtivo').value;
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

            checkIfPlayerExists(name).then(exists => {
                if (exists) {
                    fetch('/update_player', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        name, hp, state, blood_level, trauma, dice_roll, furtivo, fisico, resistencia,
        pontaria, agilidade, persuasao, conhecimento, reflexo, pilotagem, investigacao, 
        intimidacao, luta, inteligencia
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
            const state = document.getElementById('state').value;
            const blood_level = document.getElementById('blood_level').value;
            const trauma = document.getElementById('trauma').value;
            const dice_roll = document.getElementById('dice_roll').value;
            const furtivo = document.getElementById('furtivo').value;
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

            checkIfPlayerExists(name).then(exists => {
                if (exists) {
                    fetch('/update_player', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({name, hp, state, blood_level, trauma, dice_roll, furtivo, fisico, resistencia, pontaria, agilidade, persuasao, 
                            conhecimento, reflexo, pilotagem, investigacao, intimidacao, luta, inteligencia}),
                    }) 
                    .then(response => response.json())
                    .then(data => {
                        renderPlayers(data.players);
                        document.getElementById('playerForm').reset();
                    });
                } else {
                    fetch('/add_player', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({name, hp, state, blood_level, trauma, dice_roll, furtivo, fisico, resistencia, pontaria, agilidade, persuasao, 
                            conhecimento, reflexo, pilotagem, investigacao, intimidacao, luta, inteligencia}),
                    })
                    .then(response => response.json())
                    .then(data => {
                        renderPlayers(data.players);
                        document.getElementById('playerForm').reset();
                    });
                }
            });
        });
        
        document.getElementById('clearPlayers').addEventListener('click', () => {
    fetch('/clear_players', { method: 'POST' })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                // Atualiza a interface para refletir a remoção dos jogadores
                renderPlayers([]); // Passa uma lista vazia para limpar os jogadores exibidos
                alert(data.message); // Exibe uma mensagem de sucesso
            } else if (data.error) {
                alert('Erro: ' + data.error); // Mostra o erro retornado pelo servidor
            }
        })
        .catch(error => {
            console.error('Erro ao limpar jogadores:', error);
            alert('Falha ao comunicar com o servidor.');
        });
        updatePlayerListInsta();
}); 
        
        function updatePlayerList() { //Função pra atualizar a playerList a cada request.
            let showingError = false;
            fetch('/get_players')
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

        function showError() {
            document.getElementById("serverCommunicationError").classList.add("display");
        }

        function hideError() {
            document.getElementById("serverCommunicationError").classList.remove("display");
        }
        
        function updatePlayerListInsta() {
            fetch('/get_players')
                .then(response => response.json())
                .then(data => renderPlayers(data.players));
        }
        
        setInterval(updatePlayerList, 2500); // Atualização automática do servidor
        
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
        