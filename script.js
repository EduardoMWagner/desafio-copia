// USUÁRIOS
const usuarios = [
    {usuario:"engenheiro1", senha:"123", tipo:"usuario"},
    {usuario:"engenheiro2", senha:"123", tipo:"usuario"},
    {usuario:"supervisor", senha:"123", tipo:"supervisor"}
]

// LOGIN
function login(){
    let usuarioDigitado = document.getElementById("usuario").value
    let senhaDigitada = document.getElementById("senha").value

    let usuarioEncontrado = usuarios.find(user =>
        user.usuario === usuarioDigitado && user.senha === senhaDigitada
    )

    if(usuarioEncontrado){
        if(usuarioEncontrado.tipo === "supervisor"){
            window.location.href = "supervisor.html"
        }else{
            window.location.href = "orcamento.html"
        }
    }else{
        alert("Usuário ou senha incorretos")
    }
}

// PRODUTOS
const produtos = [
{codigo:"001", nome:"Cimento CP II"},
{codigo:"002", nome:"Areia Média"},
{codigo:"003", nome:"Brita 1"},
{codigo:"004", nome:"Tijolo Cerâmico"},
{codigo:"005", nome:"Argamassa"},
{codigo:"006", nome:"Arame"},
{codigo:"007", nome:"Aço CA50"}
]

let itensOrcamento = []

// AUTOCOMPLETE
function filtrarProdutos(){
    let texto = document.getElementById("produto").value.toLowerCase()
    let lista = document.getElementById("listaProdutos")
    lista.innerHTML = ""

    if(texto === "") return

    let resultados = produtos.filter(produto =>
        produto.nome.toLowerCase().includes(texto)
    )

    resultados.forEach(produto => {
        let item = document.createElement("div")
        item.textContent = `${produto.nome} (${produto.codigo})`
        item.onclick = function(){
            document.getElementById("produto").value = produto.nome
            document.getElementById("codigo").value = produto.codigo
            lista.innerHTML = ""
        }
        lista.appendChild(item)
    })
}

// ADICIONAR ITEM
function adicionarItem(){
    let codigo = document.getElementById("codigo").value
    let produto = document.getElementById("produto").value
    let quantidade = document.getElementById("quantidade").value
    let obs = document.getElementById("obs").value

    if(!produto || !quantidade){
        alert("Preencha produto e quantidade")
        return
    }

    itensOrcamento.push({codigo, produto, quantidade, observacao: obs})

    atualizarTabela()
    limparCampos()
}

// TABELA
function atualizarTabela(){
    let tabela = document.getElementById("tabelaItens")
    tabela.innerHTML = ""

    itensOrcamento.forEach(item => {
        let linha = document.createElement("tr")
        linha.innerHTML = `
            <td>${item.codigo}</td>
            <td>${item.produto}</td>
            <td>${item.quantidade}</td>
            <td>${item.observacao}</td>
        `
        tabela.appendChild(linha)
    })
}

// LIMPAR
function limparCampos(){
    document.getElementById("codigo").value = ""
    document.getElementById("produto").value = ""
    document.getElementById("quantidade").value = ""
    document.getElementById("obs").value = ""
}

// ENVIAR ORÇAMENTO
function enviarOrcamento(){

    let numeroPedido = document.getElementById("numeroPedido").value
    let obra = document.getElementById("obra").value
    let dataInicio = document.getElementById("dataInicio").value
    let dataFim = document.getElementById("dataFim").value

    if(!numeroPedido || !obra){
        alert("Preencha os dados da obra!")
        return
    }

    if(itensOrcamento.length === 0){
        alert("Adicione itens antes de enviar")
        return
    }

    let novoOrcamento = {
        id: crypto.randomUUID(), 
        numeroPedido,
        obra,
        dataInicio,
        dataFim,
        status: "pendente",
        itens: [...itensOrcamento]
    }

    let lista = JSON.parse(localStorage.getItem("orcamentos")) || []
    lista.push(novoOrcamento)

    localStorage.setItem("orcamentos", JSON.stringify(lista))

    alert("Orçamento enviado!")

    itensOrcamento = []
    atualizarTabela()
}

// MOSTRAR ORÇAMENTOS
function mostrarOrcamentos(){

    let lista = JSON.parse(localStorage.getItem("orcamentos")) || []
    let container = document.getElementById("listaOrcamentos")

    container.innerHTML = ""

    lista.forEach(orcamento => {

        let cor = {
            pendente: "orange",
            aprovado: "green",
            rejeitado: "red"
        }[orcamento.status] || "black"

        let bloco = document.createElement("div")

        bloco.innerHTML = `
            <h4>Pedido: ${orcamento.numeroPedido}</h4>
            <p><b>Obra:</b> ${orcamento.obra}</p>
            <p><b>Status:</b> <span style="color:${cor}">${orcamento.status}</span></p>

            <button onclick="aprovar('${orcamento.id}')">Aprovar</button>
            <button onclick="rejeitar('${orcamento.id}')">Rejeitar</button>

            <table border="1">
                <tr>
                    <th>Código</th>
                    <th>Produto</th>
                    <th>Quantidade</th>
                    <th>Obs</th>
                </tr>
                ${orcamento.itens.map(item => `
                    <tr>
                        <td>${item.codigo}</td>
                        <td>${item.produto}</td>
                        <td>${item.quantidade}</td>
                        <td>${item.observacao}</td>
                    </tr>
                `).join("")}
            </table>
            <hr>
        `

        container.appendChild(bloco)
    })
}

// APROVAR / REJEITAR
function aprovar(id){
    let lista = JSON.parse(localStorage.getItem("orcamentos")) || []

    lista.forEach(o => {
        if(o.id === id){
            o.status = "aprovado"
        }
    })

    localStorage.setItem("orcamentos", JSON.stringify(lista))
    mostrarOrcamentos()
}

function rejeitar(id){
    let lista = JSON.parse(localStorage.getItem("orcamentos")) || []

    lista.forEach(o => {
        if(o.id === id){
            o.status = "rejeitado"
        }
    })

    localStorage.setItem("orcamentos", JSON.stringify(lista))
    mostrarOrcamentos()
}
function limparOrcamentos(){
    localStorage.removeItem("orcamentos")
    alert("Dados apagados")
}