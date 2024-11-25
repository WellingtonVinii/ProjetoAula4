import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import path from 'path'

const porta = 3000;
const host = 'localhost';//ip de todas as interfaces (placas de rede do pc)

var listaClientes = [];

const app = express();

app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'MinH4Ch4v3S3cr3t4',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 15 //30 minutos
    }
}));

app.use(cookieParser());


app.use(express.static('./public'));

function cadastrarClienteView(req, res) {
    res.send(`
        <!DOCTYPE html>
        <html lang="pt-br">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Cadastro de produto</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" crossorigin="anonymous">
            <style>
                .error-message {
                    color: red;
                    font-size: 0.9em;
                }
                .form-control.is-invalid {
                    border-color: red;
                }
            </style>
        </head>
        <body>
            <div class="container mt-5">
                <h1>Cadastro de produto</h1>
                <h3>Preencha com as informações do produto</h3>
                <form id="formCadastro" action="/cadastrarCliente" method="POST" novalidate>
                    <div class="mb-3">
                        <label for="nome" class="form-label">Código de barras</label>
                        <input type="text" class="form-control" id="nome" name="nome" placeholder="Informe o código do produto">
                        <span class="error-message" id="erroNome"></span>
                    </div>
                    <div class="mb-3">
                        <label for="cpf" class="form-label">Nome do fabricante</label>
                        <input type="text" class="form-control" id="cpf" name="cpf" placeholder="Informe o nome do fabricante">
                        <span class="error-message" id="erroCpf"></span>
                    </div>
                    <div class="mb-3">
                        <label for="nascimento" class="form-label">Data de validade</label>
                        <input type="date" class="form-control" id="nascimento" name="nascimento">
                        <span class="error-message" id="erroNascimento"></span>
                    </div>
                    <div class="mb-3">
                        <label for="email" class="form-label">Preço de custo</label>
                        <input type="email" class="form-control" id="email" name="email" placeholder="R$00,00">
                        <span class="error-message" id="erroEmail"></span>
                    </div>
                    <div class="mb-3">
                        <label for="telefone" class="form-label">Preço de venda</label>
                        <input type="text" class="form-control" id="telefone" name="telefone" placeholder="R$00,00">
                        <span class="error-message" id="erroTelefone"></span>
                    </div>
                    <div class="mb-3">
                        <label for="genero" class="form-label">Quantidade em estoque</label>
                        <input type="text" class="form-select" id="genero" name="genero" placeholder="Informe a quantidade presente no estoque">
                        <span class="error-message" id="erroGenero"></span>
                    </div>
                    <div class="mb-3">
                        <label for="observacoes" class="form-label">Descrição</label>
                        <textarea class="form-control" id="observacoes" name="observacoes" rows="4" placeholder="Insira aqui a descrição do produto"></textarea>
                        <span class="error-message" id="erroObservacoes"></span>
                    </div>
                    <button type="submit" class="btn btn-primary">Cadastrar</button>
                </form>
                  <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav mr-auto">
                            <a class="nav-link disabled" href="#">Disabled</a> 
                     </ul>
                  </div>
            </div>
            <script>
                document.getElementById('formCadastro').addEventListener('submit', function(event) {
                    let isValid = true;

                    // Limpar mensagens de erro e classes
                    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
                    document.querySelectorAll('.form-control, .form-select').forEach(el => el.classList.remove('is-invalid'));

                    // Validação de campos
                    if (!document.getElementById('nome').value.trim()) {
                        document.getElementById('erroNome').textContent = 'Por favor, preencha o codigo de barras!';
                        document.getElementById('nome').classList.add('is-invalid');
                        isValid = false;
                    }
                    if (!document.getElementById('cpf').value.trim()) {
                        document.getElementById('erroCpf').textContent = 'Por favor, preencha o nome do fabricante!';
                        document.getElementById('cpf').classList.add('is-invalid');
                        isValid = false;
                    }
                    if (!document.getElementById('nascimento').value.trim()) {
                        document.getElementById('erroNascimento').textContent = 'Por favor, preencha a data de validade!';
                        document.getElementById('nascimento').classList.add('is-invalid');
                        isValid = false;
                    }
                    if (!document.getElementById('email').value.trim()) {
                        document.getElementById('erroEmail').textContent = 'Por favor, preencha o preço de custo!';
                        document.getElementById('email').classList.add('is-invalid');
                        isValid = false;
                    }
                    if (!document.getElementById('telefone').value.trim()) {
                        document.getElementById('erroTelefone').textContent = 'Por favor, preencha o preço de venda!';
                        document.getElementById('telefone').classList.add('is-invalid');
                        isValid = false;
                    }
                    if (!document.getElementById('genero').value.trim()) {
                        document.getElementById('erroGenero').textContent = 'Por favor, preencha a quantidade em estoque!';
                        document.getElementById('genero').classList.add('is-invalid');
                        isValid = false;
                    }
                    if (!document.getElementById('observacoes').value.trim()) {
                        document.getElementById('erroObservacoes').textContent = 'Por favor, preencha a descrição do produto!';
                        document.getElementById('observacoes').classList.add('is-invalid');
                        isValid = false;
                    }

                    // Impedir envio do formulário se inválido
                    if (!isValid) {
                        event.preventDefault();
                    }
                });
            </script>
        </body>
        </html>
    `);
}

function menuCliente(req,resp){
    const dataHoraUltimoLogin = req.cookies['dataHoraUltimoLogin'];
    if(!dataHoraUltimoLogin){
        dataHoraUltimoLogin='';
    }
    resp.send(`
        <!DOCTYPE html>
        <html lang="pt-br">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Cadastro de Cliente</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
        </head>
        <body>
        <nav class="navbar navbar-expand-lg bg-body-tertiary">
            <div class="container-fluid">
                <a class="navbar-brand" href="#">Menu Principal</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Alternar navegação">
                <span class="navbar-toggler-icon"></span></button>

                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                        <li class="nav-item">
                            <a class="nav-link active" aria-current="page" href="/cadastrarCliente">Cadastro de produto</a>
                            <a class="nav-link active" aria-current="page" href="/logout">Sair</a>
                            <a class="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">Seu último acesso foi realizado em ${dataHoraUltimoLogin}</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
</body>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
</html> `
    )
}

function cadastrarCliente(req,resp){
    const nome = req.body.nome;
    const cpf = req.body.cpf;
    const nascimento = req.body.nascimento;
    const email = req.body.email;
    const telefone = req.body.telefone;
    const genero = req.body.genero;
    const observacoes = req.body.observacoes;

    const dataHoraUltimoLogin = req.cookies['dataHoraUltimoLogin'];
    if (!dataHoraUltimoLogin){
        dataHoraUltimoLogin='';
    }

    const cliente = { nome, cpf, nascimento, email, telefone, genero, observacoes };
    listaClientes.push(cliente);

   
    resp.write(`   
        <!DOCTYPE html>
        <html lang="pt-br">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Lista de Cliente</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
        </head>
        <body>
        <table class="table">
  <thead>
    <tr>
      <th scope="col">Codigo de barras</th>
      <th scope="col">Nome do fabricante</th>
      <th scope="col">Validade</th>
      <th scope="col">Custo</th>
      <th scope="col">Preço de venda</th>
      <th scope="col">Qtd em estoque</th>
      <th scope="col">Descrição</th>
    </tr>
  </thead>
  <tbody>`);

  for (var i = 0; i < listaClientes.length; i++){
    resp.write(`<tr>
                <td>${listaClientes[i].nome}</td>
                <td>${listaClientes[i].cpf}</td>
                <td>${listaClientes[i].nascimento}</td>
                <td>${listaClientes[i].email}</td>
                <td>${listaClientes[i].telefone}</td>
                <td>${listaClientes[i].genero}</td>
                <td>${listaClientes[i].observacoes}</td>
                </tr>
        `)
  }

  resp.write(`
        </tbody>
        </table>
        <a class="btn btn-dark" href="/cadastrarCliente" role="button">Continuar cadastrando</a>
        <a class="btn btn-dark" href="/" role="button">Voltar para o menu</a>
         <div>
            <p><span>Seu último acesso foi realizado em ${dataHoraUltimoLogin}</span></p>
         </div>
        </body>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
        </html>
  `);

resp.end();

}



function autenticarUsuario(req, resp){
    const usuario = req.body.usuario;
    const senha = req.body.senha;

    if(usuario=== 'admin' && senha === '123'){
        //registrar que o usuario autenticou
        req.session.usuarioLogado = true;
        resp.cookie('dataHoraUltimoLogin', new Date().toLocaleString(), {maxAge: 1000 * 60 * 60 * 24 * 30, httpOnly: true });
        resp.redirect('/')
    }
    else{
        resp.send(`
                    <html>
                        <head>
                        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
                        </head>
                        <body>
                            <div class="container w-25"> 
                                <div class="alert alert-danger" role="alert">
                                Usuário ou senha inválidos!
                                </div>
                                <div>
                                    <a href="/login.html" class="btn btn-primary">Tentar novamente</a>
                                            </div>
                                </div>
                        </body>
                        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
                                integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM"
                                crossorigin="anonymous">
                        </script>
                    </html> 
                  `);
    }
}

function verificarAutenticacao(req, resp, next){
    if(req.session.usuarioLogado){
        next();
    }
    else
    {
        resp.redirect('/login.html');
    }
};

app.get('/login', (req, resp) => {
    resp.redirect('/login.html');
});

app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});


app.get('/logout', (req,resp)=>{
     req.session.destroy();
     resp.redirect('/login.html');
});
app.post('/login', autenticarUsuario);
app.get('/',verificarAutenticacao, menuCliente);
app.get('/cadastrarCliente',verificarAutenticacao, cadastrarClienteView);
app.post('/cadastrarCliente', verificarAutenticacao, cadastrarCliente);
app.listen(porta, host, () => {
    console.log('Servidor iniciado e em execução no endereço http://localhost:3000');
})

export default app;