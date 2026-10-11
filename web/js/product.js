const parametros = new URLSearchParams(window.location.search);
const idProduto = Number(parametros.get("id"));

const produtoSelecionado = produtos.find((produto) => {
  return produto.id === idProduto;
});

const detalhesProduto = document.querySelector("#detalhesProduto");
const mensagemProduto = document.querySelector("#mensagemProduto");
const formProduto = document.querySelector("#formProduto");
const quantidade = document.querySelector("#quantidade");
const feedback = document.querySelector("#produtoFeedback");

if (produtoSelecionado) {
  mostrarProduto();
  formProduto.addEventListener("submit", comprarProduto);
} else {
  mostrarProdutoInexistente();
}

function mostrarProduto() {
  document.title = produtoSelecionado.nome + " | Herbário Impossível";

  document.querySelector("#nomeBreadcrumb").textContent = produtoSelecionado.nome;
  document.querySelector("#categoriaProduto").textContent = produtoSelecionado.categoria;
  document.querySelector("#nomeProduto").textContent = produtoSelecionado.nome;
  document.querySelector("#descricaoProduto").textContent = produtoSelecionado.descricaoDetalhada;

  document.querySelector("#precoProduto").textContent =
    produtoSelecionado.preco.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });

  document.querySelector("#regraProduto").textContent = produtoSelecionado.regra;
  document.querySelector("#materialProduto").textContent = produtoSelecionado.material;
  document.querySelector("#dimensoesProduto").textContent = produtoSelecionado.dimensoes;
  document.querySelector("#modoUsoProduto").textContent = produtoSelecionado.modoDeUso;

  const imagemProduto = document.querySelector("#imagemProduto");

  imagemProduto.src = produtoSelecionado.imagem;
  imagemProduto.alt = produtoSelecionado.alt;
}

function mostrarProdutoInexistente() {
  detalhesProduto.style.display = "none";

  mensagemProduto.innerHTML = `
    <section class="produto-inexistente">
      <h1>Produto não encontrado</h1>
      <p>O produto informado não existe ou não está disponível.</p>
      <a class="btn btn-dark" href="index.html">Voltar para a vitrine</a>
    </section>
  `;
}

function comprarProduto(event) {
  event.preventDefault();

  const quantidadeEscolhida = Number(quantidade.value);

  if (quantidadeEscolhida < 1 || quantidadeEscolhida > 10) {
    feedback.textContent = "Escolha uma quantidade entre 1 e 10.";
    quantidade.focus();
    return;
  }

  const compra = {
    produtoId: produtoSelecionado.id,
    quantidade: quantidadeEscolhida
  };

  sessionStorage.setItem("compra", JSON.stringify(compra));

  window.location.href = "checkout.html";
}