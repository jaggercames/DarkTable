import random
import sqlite3
import json
import http.server
from http.server import BaseHTTPRequestHandler, HTTPServer

PORT = 8080
DIRECTORY = "."

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
                id INTEGER PRIMARY KEY,
                name TEXT NOT NULL,
                hp INTEGER NOT NULL,
                state TEXT NOT NULL,
                blood_level INTEGER NOT NULL,
                trauma TEXT NOT NULL,
                dice_roll INTEGER NOT NULL,
                furtivo INTEGER NOT NULL,
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
                inteligencia INTEGER NOT NULL
            )
        ''')
        conn.commit()
        conn.close()

# Função para adicionar jogador ao banco de dados
def add_player(name, hp, state, blood_level, trauma, furtivo, fisico, resistencia, pontaria, agilidade, persuasao, conhecimento, reflexo, pilotagem, investigacao, intimidacao, luta, inteligencia, dice_roll):
    conn = connect_db()
    if conn:
        c = conn.cursor()
        c.execute('''
            INSERT INTO players (name, hp, state, blood_level, trauma, furtivo, fisico, resistencia, pontaria, agilidade, persuasao, conhecimento, reflexo, pilotagem, investigacao, intimidacao, luta, inteligencia, dice_roll) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (name, hp, state, blood_level, trauma, furtivo, fisico, resistencia, pontaria, agilidade, persuasao, conhecimento, reflexo, pilotagem, investigacao, intimidacao, luta, inteligencia, dice_roll))
        conn.commit()
        conn.close()


# Função para atualizar um jogador existente
def update_player(name, hp, state, blood_level, trauma, furtivo, fisico, resistencia, pontaria, agilidade, persuasao, conhecimento, reflexo, pilotagem, investigacao, intimidacao, luta, inteligencia, dice_roll):
    conn = connect_db()
    if conn:
        c = conn.cursor()
        c.execute(''' 
            UPDATE players SET hp = ?, state = ?, blood_level = ?, trauma = ?, dice_roll = ?, furtivo = ?, fisico = ?, resistencia = ?, pontaria = ?, agilidade = ?, persuasao = ?, conhecimento = ?, reflexo = ?, pilotagem = ?, investigacao = ?, intimidacao = ?, luta = ?, inteligencia = ? 
            WHERE name = ?
        ''', (hp, state, blood_level, trauma, dice_roll, furtivo, fisico, resistencia, pontaria, agilidade, persuasao, conhecimento, reflexo, pilotagem, investigacao, intimidacao, luta, inteligencia, name))
        conn.commit()
        conn.close()


# Função para pegar todos os jogadores do banco de dados
def get_players():
    conn = connect_db()
    if conn:
        c = conn.cursor()
        c.execute(''' 
            SELECT name, hp, state, blood_level, trauma, dice_roll, furtivo, fisico, resistencia, pontaria, agilidade, persuasao, conhecimento, reflexo, pilotagem, investigacao, intimidacao, luta, inteligencia 
            FROM players
        ''')
        players = c.fetchall()
        conn.close()
        return [{'name': player[0], 'hp': player[1], 'state': player[2], 'blood_level': player[3], 'trauma': player[4], 'dice_roll': player[5], 'furtivo': player[6], 'fisico': player[7], 'resistencia': player[8], 'pontaria': player[9], 'agilidade': player[10], 'persuasao': player[11], 'conhecimento': player[12], 'reflexo': player[13], 'pilotagem': player[14], 'investigacao': player[15], 'intimidacao': player[16], 'luta': player[17], 'inteligencia': player[18]} for player in players]
    return []


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
    conn = connect_db()
    if conn:
        c = conn.cursor()
        c.execute('DELETE FROM players WHERE name = ?', (name,))
        conn.commit()
        conn.close()

def delete_all_players():
    try:
        conn = sqlite3.connect("players.db")
        cursor = conn.cursor()
        cursor.execute("DELETE FROM players")  # Remove todos os registros
        conn.commit()
        conn.close()
        return True
    except Exception as e:
        print(f"Erro ao deletar jogadores: {e}")
        return False

# Classe para lidar com as requisições HTTP
class MyHttpRequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # Verifica a requisição para /check_player/{playerName}
        if self.path.startswith('/check_player/'):
            player_name = self.path.split('/')[-1]  # Extrai o nome do jogador da URL
            exists = check_player(player_name)
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'exists': exists}).encode())

        elif self.path == '/get_players':
            players = get_players()
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
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
                self.end_headers()
                self.wfile.write(json.dumps({'error': "'name' é obrigatório"}).encode())
                return

            try:
                delete_player(player_name)
                players = get_players()
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'success': True, 'players': players}).encode())
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
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
                self.end_headers()
                self.wfile.write(json.dumps({'error': "'name' é obrigatório"}).encode())
                return

            name = data['name']
            hp = data['hp']
            state = data.get('state', 'Unknown')
            blood_level = data.get('blood_level', 100)
            trauma = data.get('trauma', 'None')
            furtivo = data.get('furtivo', 0)
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
            dice_roll = data.get('dice_roll', random.randint(1, 6))

            # Validação de blood_level
            blood_level = validate_blood_level(blood_level)

            if action == 'add':
                if check_player(name):  # Verifica se o jogador já existe
                    self.send_response(400)
                    self.send_header('Content-type', 'application/json')
                    self.end_headers()
                    self.wfile.write(json.dumps({'error': 'Jogador já existe'}).encode())
                    return
                else:
                    add_player(name, hp, state, blood_level, trauma, furtivo, fisico, resistencia, pontaria, agilidade, persuasao, conhecimento, reflexo, pilotagem, investigacao, intimidacao, luta, inteligencia, dice_roll)
                    self.send_response(200)
                    self.send_header('Content-type', 'application/json')
                    self.end_headers()
                    self.wfile.write(json.dumps({'message': 'Jogador adicionado com sucesso'}).encode())

            elif action == 'update':
                if check_player(name):  # Verifica se o jogador existe
                    update_player(name, hp, state, blood_level, trauma, furtivo, fisico, resistencia, pontaria, agilidade, persuasao, conhecimento, reflexo, pilotagem, investigacao, intimidacao, luta, inteligencia, dice_roll)
                    self.send_response(200)
                    self.send_header('Content-type', 'application/json')
                    self.end_headers()
                    self.wfile.write(json.dumps({'message': 'Jogador atualizado com sucesso'}).encode())
                else:
                    self.send_response(404)
                    self.send_header('Content-type', 'application/json')
                    self.end_headers()
                    self.wfile.write(json.dumps({'error': 'Jogador não encontrado'}).encode())

        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'error': f'Erro ao processar a requisição: {str(e)}'}).encode())


# Inicializa e começa o servidor
if __name__ == '__main__':
    create_table()  # Cria a tabela ao iniciar
    http.server.test(HandlerClass=MyHttpRequestHandler, port=PORT)
