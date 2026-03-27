// ============================
// PRODUTOS
// ============================
const produtos = [
    { nome: "Cimento", codigo: "001", unidade: "SC" },
    { nome: "Areia", codigo: "002", unidade: "M3" },
    { nome: "Brita", codigo: "003", unidade: "M3" },
    { nome: "Tijolo", codigo: "004", unidade: "UN" }
];

let itens = [];

// ============================
// BUSCAR POR CÓDIGO
// ============================
function buscarPorCodigo() {
    const codigo = document.getElementById("codigo").value;

    const produtoEncontrado = produtos.find(p => p.codigo === codigo);

    if (produtoEncontrado) {
        document.getElementById("produto").value = produtoEncontrado.nome;
        document.getElementById("unidade").value = produtoEncontrado.unidade;
    }
}

// ============================
// FILTRO POR NOME
// ============================
function filtrarProdutos() {
    const input = document.getElementById("produto").value.toLowerCase();
    const lista = document.getElementById("listaProdutos");

    lista.innerHTML = "";

    produtos
        .filter(p => p.nome.toLowerCase().includes(input))
        .forEach(p => {
            const div = document.createElement("div");
            div.textContent = p.nome;
            div.onclick = () => selecionarProduto(p);
            lista.appendChild(div);
        });
}

// ============================
// SELECIONAR PRODUTO
// ============================
function selecionarProduto(produto) {
    document.getElementById("produto").value = produto.nome;
    document.getElementById("codigo").value = produto.codigo;
    document.getElementById("unidade").value = produto.unidade;

    document.getElementById("listaProdutos").innerHTML = "";
}

// ============================
// ADICIONAR ITEM
// ============================
function adicionarItem() {
    const codigo = document.getElementById("codigo").value;
    const produto = document.getElementById("produto").value;
    const unidade = document.getElementById("unidade").value;
    const quantidade = document.getElementById("quantidade").value;
    const obs = document.getElementById("obs").value;

    if (!codigo || !produto || !quantidade) {
        alert("Preencha os campos do item!");
        return;
    }

    const item = {
        id: crypto.randomUUID(),
        numero: itens.length + 1,
        codigo,
        produto,
        unidade,
        quantidade,
        obs
    };

    itens.push(item);
    atualizarTabela();
    limparCamposItem();
}

// ============================
// LIMPAR CAMPOS
// ============================
function limparCamposItem() {
    document.getElementById("codigo").value = "";
    document.getElementById("produto").value = "";
    document.getElementById("unidade").value = "";
    document.getElementById("quantidade").value = "";
    document.getElementById("obs").value = "";
}

// ============================
// ATUALIZAR TABELA
// ============================
function atualizarTabela() {
    const tabela = document.getElementById("tabelaItens");
    const linhaInput = tabela.querySelector(".linha-input");

    tabela.innerHTML = "";
    tabela.appendChild(linhaInput);

    itens.forEach(item => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${item.numero}</td>
            <td>${item.codigo}</td>
            <td>${item.produto}</td>
            <td>${item.unidade}</td>
            <td>${item.quantidade}</td>
            <td>${item.obs}</td>
            <td></td>
        `;

        tabela.appendChild(row);
    });
}

// ============================
// ENVIAR SOLICITAÇÃO
// ============================
function enviarSolicitacao() {
    const projeto = document.getElementById("projeto").value;
    const local = document.getElementById("local").value;
    const data = document.getElementById("dataNecessidade").value;
    const urgencia = document.getElementById("urgencia").value;

    if (!projeto || !local || !data || !urgencia || itens.length === 0) {
        alert("Preencha tudo!");
        return;
    }

    const solicitacao = {
        id: crypto.randomUUID(),
        projeto,
        local,
        data,
        urgencia,
        itens,
        status: "pendente"
    };

    const lista = JSON.parse(localStorage.getItem("solicitacoes")) || [];
    lista.push(solicitacao);

    localStorage.setItem("solicitacoes", JSON.stringify(lista));

    alert("Solicitação enviada!");

    itens = [];
    atualizarTabela();
}