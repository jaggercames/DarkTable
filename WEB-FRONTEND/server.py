import sqlite3
import json
import http.server
from http.server import BaseHTTPRequestHandler, HTTPServer
from http.server import HTTPServer, SimpleHTTPRequestHandler
import urllib.parse
PORT = 8080
connected_clients = set()
# Função para conectar ao banco de dados
def connect_db():
    try:
        conn = sqlite3.connect('players.db')
        return conn
    except sqlite3.Error as e:
        print(f"Erro ao conectar ao banco de dados: {e}")
        return None




# Criação da tabela de jogadores, se não existir
def create_table():
    conn = connect_db()
    if conn:
        c = conn.cursor()
        c.execute(''' 
            CREATE TABLE IF NOT EXISTS players (
                name TEXT NOT NULL,
                playerClass TEXT NOT NULL,
                playerRealName TEXT NOT NULL,
                playerSkills TEXT NOT NULL,
                hp INTEGER NOT NULL,
                state TEXT NOT NULL,
                blood_level INTEGER NOT NULL,
                trauma TEXT NOT NULL,
                playerAdrenalina TEXT NOT NULL,
                obs TEXT NOT NULL,
                dice_roll TEXT NOT NULL,
                fisico INTEGER NOT NULL,
                resistencia INTEGER NOT NULL,
                pontaria INTEGER NOT NULL,
                agilidade INTEGER NOT NULL,
                persuasao INTEGER NOT NULL,
                conhecimento INTEGER NOT NULL,
                reflexo INTEGER NOT NULL,
                pilotagem INTEGER NOT NULL,
                investigacao INTEGER NOT NULL,
                intimidacao INTEGER NOT NULL,
                luta INTEGER NOT NULL,
                inteligencia INTEGER NOT NULL,
                playerSorte INTEGER NOT NULL,
                playerHeadState TEXT NOT NULL,
                playerChestState TEXT NOT NULL,
                playerRightArmState TEXT NOT NULL,
                playerLeftArmState TEXT NOT NULL,
                playerStomachState TEXT NOT NULL,
                playerLeftLegState TEXT NOT NULL,
                playerRightLegState TEXT NOT NULL
            )
        ''')
        conn.commit()
        conn.close()

# Função para adicionar jogador ao banco de dados
def add_player(name, playerClass, hp, playerRealName, playerSkills, state, blood_level, trauma, playerAdrenalina, obs, fisico, resistencia, pontaria, agilidade, persuasao, conhecimento, reflexo, pilotagem, investigacao, intimidacao, luta, inteligencia, playerSorte, dice_roll, 
               playerHeadState, playerChestState, playerRightArmState, playerLeftArmState, playerStomachState, playerLeftLegState, playerRightLegState):
    try:
        conn = connect_db()
        if conn:
            c = conn.cursor()
            c.execute('''
                INSERT INTO players (name, playerClass, hp, playerRealName, playerSkills, state, blood_level, trauma, playerAdrenalina, obs, fisico, resistencia, pontaria, agilidade, persuasao, conhecimento, reflexo, pilotagem, investigacao, intimidacao, luta, inteligencia, playerSorte, dice_roll, playerHeadState, playerChestState, playerRightArmState, playerLeftArmState, playerStomachState, playerLeftLegState, playerRightLegState) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (name, playerClass, hp, playerRealName, playerSkills, state, blood_level, trauma, playerAdrenalina, obs, fisico, resistencia, pontaria, agilidade, persuasao, conhecimento, reflexo, pilotagem, investigacao, intimidacao, luta, inteligencia, playerSorte, dice_roll, playerHeadState, playerChestState, playerRightArmState, playerLeftArmState, playerStomachState, playerLeftLegState, playerRightLegState))
            conn.commit()
            conn.close()
    except Exception as e:
        print("Erro ao adicionar jogador:", e)
        return {'error': str(e)}

        
# Função para atualizar um jogador existente
def update_player(name, playerClass=None, hp=None, playerRealName=None, playerSkills=None, state=None, blood_level=None, trauma=None, playerAdrenalina=None, obs=None, fisico=None, resistencia=None, pontaria=None, agilidade=None, persuasao=None, conhecimento=None, reflexo=None, pilotagem=None, investigacao=None, intimidacao=None, luta=None, inteligencia=None, playerSorte=None, dice_roll=None, 
                  playerHeadState=None, playerChestState=None, playerRightArmState=None, playerLeftArmState=None, playerStomachState=None, playerLeftLegState=None, playerRightLegState=None):
    try:
        # Log para verificar valores recebidos
        print(f"[LOG] Atualizando jogador com name: {name} e playerAdrenalina: {playerAdrenalina}")

        conn = connect_db()
        if conn:
            c = conn.cursor()

            # Atualizando somente os campos fornecidos
            c.execute('''
                UPDATE players
                SET playerClass = COALESCE(?, playerClass),
                    hp = COALESCE(?, hp),
                    playerRealName = COALESCE(?, playerRealName),
                    playerSkills = COALESCE(?, playerSkills),
                    state = COALESCE(?, state),
                    blood_level = COALESCE(?, blood_level),
                    trauma = COALESCE(?, trauma),
                    playerAdrenalina = COALESCE(?, playerAdrenalina),
                    obs = COALESCE(?, obs),
                    fisico = COALESCE(?, fisico),
                    resistencia = COALESCE(?, resistencia),
                    pontaria = COALESCE(?, pontaria),
                    agilidade = COALESCE(?, agilidade),
                    persuasao = COALESCE(?, persuasao),
                    conhecimento = COALESCE(?, conhecimento),
                    reflexo = COALESCE(?, reflexo),
                    pilotagem = COALESCE(?, pilotagem),
                    investigacao = COALESCE(?, investigacao),
                    intimidacao = COALESCE(?, intimidacao),
                    luta = COALESCE(?, luta),
                    inteligencia = COALESCE(?, inteligencia),
                    playerSorte = COALESCE(?, playerSorte),
                    dice_roll = COALESCE(?, dice_roll),
                    playerHeadState = COALESCE(?, playerHeadState),
                    playerChestState = COALESCE(?, playerChestState),
                    playerRightArmState = COALESCE(?, playerRightArmState),
                    playerLeftArmState = COALESCE(?, playerLeftArmState),
                    playerStomachState = COALESCE(?, playerStomachState),
                    playerLeftLegState = COALESCE(?, playerLeftLegState),
                    playerRightLegState = COALESCE(?, playerRightLegState)
                WHERE name = ?
            ''', (playerClass, hp, playerRealName, playerSkills, state, blood_level, trauma, playerAdrenalina, obs, fisico, resistencia, pontaria, agilidade, persuasao, conhecimento, reflexo, pilotagem, investigacao, intimidacao, luta, inteligencia, playerSorte, dice_roll, playerHeadState, playerChestState, playerRightArmState, playerLeftArmState, playerStomachState, playerLeftLegState, playerRightLegState, name))

            conn.commit()

            # Log após o commit
            print(f"[LOG] Jogador {name} atualizado com sucesso!")
            conn.close()

    except sqlite3.Error as e:
        print(f"[ERROR] Erro ao atualizar jogador: {e}")



# Função para pegar todos os jogadores do banco de dados
def get_players():
    conn = connect_db()
    if conn:
        c = conn.cursor()
        c.execute(''' 
            SELECT name, playerClass, hp, playerRealName, playerSkills, state, blood_level, trauma, obs, dice_roll, fisico, resistencia, pontaria, agilidade, persuasao, conhecimento, reflexo, pilotagem, investigacao, intimidacao, luta, inteligencia, playerSorte, playerHeadState, playerChestState, playerRightArmState, playerLeftArmState, playerStomachState, playerLeftLegState, playerRightLegState, playerAdrenalina
            FROM players
        ''')
        players = c.fetchall()
        conn.close()
        return [{
            'name': player[0],
            'playerClass': player[1],
            'hp': player[2],
            'playerRealName': player[3],
            'playerSkills': player[4],
            'state': player[5],
            'blood_level': player[6],
            'trauma': player[7],
            'obs': player[8],
            'dice_roll': player[9],
            'fisico': player[10],
            'resistencia': player[11],
            'pontaria': player[12],
            'agilidade': player[13],
            'persuasao': player[14],
            'conhecimento': player[15],
            'reflexo': player[16],
            'pilotagem': player[17],
            'investigacao': player[18],
            'intimidacao': player[19],
            'luta': player[20],
            'inteligencia': player[21],
            'playerSorte': player[22],
            'playerHeadState': player[23],
            'playerChestState': player[24],
            'playerRightArmState': player[25],
            'playerLeftArmState': player[26],
            'playerStomachState': player[27],
            'playerLeftLegState': player[28],
            'playerRightLegState': player[29],
            'playerAdrenalina': player[30]  # Corrigido para o índice correto
        } for player in players]

# Função para verificar se o jogador já existe
def check_player(name):
    conn = connect_db()
    if conn:
        c = conn.cursor()
        c.execute('SELECT 1 FROM players WHERE name = ?', (name,))
        exists = c.fetchone()
        conn.close()
        return exists is not None
    return False


# Função para garantir que o blood_level seja um número inteiro válido
def validate_blood_level(blood_level):
    if isinstance(blood_level, int):
        return blood_level
    elif isinstance(blood_level, str) and blood_level.isdigit():  # Caso seja uma string com números
        return int(blood_level)
    else:
        print(f"Valor de blood_level inválido: {blood_level}")
        return 100  # Valor padrão se inválido


# Função para deletar jogador
def delete_player(name):
    """
    Deleta um jogador do banco de dados pelo nome.

    Parâmetros:
        name (str): Nome do jogador a ser deletado.

    Retorna:
        bool: True se o jogador foi deletado com sucesso, False caso contrário.
    """
    try:
        # Decodifica o nome para converter %20 em espaços, entre outros caracteres
        decoded_name = urllib.parse.unquote(name)

        # Conecta ao banco de dados
        conn = connect_db()
        if conn:
            c = conn.cursor()

            # Executa a query para deletar o jogador
            c.execute('DELETE FROM players WHERE name = ?', (decoded_name,))

            # Verifica se alguma linha foi afetada (ou seja, se o jogador existia)
            if c.rowcount > 0:
                print(f"Jogador '{decoded_name}' deletado com sucesso.")
                conn.commit()  # Salva as alterações no banco de dados
                conn.close()   # Fecha a conexão
                return True
            else:
                print(f"Jogador '{decoded_name}' não encontrado no banco de dados.")
                conn.close()   # Fecha a conexão
                return False
        else:
            print("Erro ao conectar ao banco de dados.")
            return False
    except Exception as e:
        print(f"Erro ao deletar jogador '{name}': {e}")
        if conn:
            conn.close()  # Fecha a conexão em caso de erro
        return False

# Classe para lidar com as requisições HTTP
class MyHttpRequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_OPTIONS(self):
        # Responde às requisições preflight
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, DELETE, PUT')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        
        
    def do_GET(self):
        # Verifica a requisição para /check_player/{playerName}
        if self.path.startswith('/check_player/'):
            player_name = self.path.split('/')[-1]  # Extrai o nome do jogador da URL
            exists = check_player(player_name)
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({'exists': exists}).encode())

        elif self.path == '/get_players':
            players = get_players()
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({'players': players}).encode())

        else:
            super().do_GET()

    def do_POST(self):
        if self.path == '/add_player':
            # Lógica para adicionar jogador
            self.handle_player_request('add')
        
        elif self.path == '/update_player':
            # Lógica para atualizar jogador
            self.handle_player_request('update')
            
    def do_DELETE(self):
        if self.path.startswith('/delete_player'):
            # Extrai o nome do jogador da URL
            query = self.path.split('?')[-1]
            params = {key: value for key, value in (pair.split('=') for pair in query.split('&'))}
            player_name = params.get('name')

            if not player_name:
                self.send_response(400)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({'error': "'name' é obrigatório"}).encode())
                return

            try:
                delete_player(player_name)
                players = get_players()
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({'success': True, 'players': players}).encode())
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({'error': f'Erro ao deletar jogador: {str(e)}'}).encode())


    def handle_player_request(self, action):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)

        try:
            data = json.loads(post_data.decode())
            print(f"Dados recebidos: {data}")

            if 'name' not in data:
                self.send_response(400)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({'error': "'name' é obrigatório"}).encode())
                return

            name = data['name']
            hp = data['hp']
            playerRealName = data.get('playerRealName', 'None')
            playerSkills = data.get('playerSkills', 'None')
            playerClass = data.get('playerClass', 'None')
            state = data.get('state', 'Unknown')
            blood_level = data.get('blood_level', 100)
            trauma = data.get('trauma', 'None')
            playerAdrenalina = data.get('playerAdrenalina', 'None')
            obs = data.get('obs', 'None')
            dice_roll = data.get('dice_roll', '0')
            fisico = data.get('fisico', 0)
            resistencia = data.get('resistencia', 0)
            pontaria = data.get('pontaria', 0)
            agilidade = data.get('agilidade', 0)
            persuasao = data.get('persuasao', 0)
            conhecimento = data.get('conhecimento', 0)
            reflexo = data.get('reflexo', 0)
            pilotagem = data.get('pilotagem', 0)
            investigacao = data.get('investigacao', 0)
            intimidacao = data.get('intimidacao', 0)
            luta = data.get('luta', 0)
            inteligencia = data.get('inteligencia', 0)
            playerSorte = data.get('playerSorte', 0)
            playerHeadState  = data.get('playerHeadState', '0')
            playerChestState = data.get('playerChestState', '0')
            playerRightArmState  = data.get('playerRightArmState', '0')
            playerLeftArmState = data.get('playerLeftArmState', '0')
            playerStomachState = data.get('playerStomachState', '0')
            playerLeftLegState = data.get('playerLeftLegState', '0')
            playerRightLegState  = data.get('playerRightLegState', '0')

            # Validação de blood_level
            blood_level = validate_blood_level(blood_level)

            if action == 'add':
                if check_player(name):  # Verifica se o jogador já existe
                    self.send_response(400)
                    self.send_header('Content-type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    self.wfile.write(json.dumps({'error': 'Jogador já existe'}).encode())
                    return
                else:
                    add_player(name, playerClass, hp, playerRealName, playerSkills, state, blood_level, trauma, playerAdrenalina, obs, fisico, resistencia, pontaria, agilidade, persuasao, conhecimento, reflexo, pilotagem, investigacao, intimidacao, luta, inteligencia, playerSorte, dice_roll, playerHeadState, playerChestState, playerRightArmState, playerLeftArmState,playerStomachState, playerLeftLegState, playerRightLegState)
                    self.send_response(200)
                    self.send_header('Content-type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    self.wfile.write(json.dumps({'message': 'Jogador adicionado com sucesso'}).encode())

            elif action == 'update':
                if check_player(name):  # Verifica se o jogador existe
                    update_player(name, playerClass, hp, playerRealName, playerSkills, state, blood_level, trauma, playerAdrenalina, obs, fisico, resistencia, pontaria, agilidade, persuasao, conhecimento, reflexo, pilotagem, investigacao, intimidacao, luta, inteligencia, playerSorte, dice_roll, playerHeadState, playerChestState, playerRightArmState, playerLeftArmState,playerStomachState, playerLeftLegState, playerRightLegState)
                    self.send_response(200)
                    self.send_header('Content-type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    self.wfile.write(json.dumps({'message': 'Jogador atualizado com sucesso'}).encode())
                else:
                    self.send_response(404)
                    self.send_header('Content-type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    self.wfile.write(json.dumps({'error': 'Jogador não encontrado'}).encode())

        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({'error': f'Erro ao processar a requisição: {str(e)}'}).encode())

# Inicializa e começa o servidor
if __name__ == '__main__':
    create_table()  # Cria a tabela ao iniciar
    http.server.test(HandlerClass=MyHttpRequestHandler, port=PORT)
