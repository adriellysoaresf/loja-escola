const painelSucesso = document.querySelector("#painelSucesso");
const mensagemAcesso = document.querySelector("#mensagemAcesso");

const pedidoSalvo = sessionStorage.getItem("pedidoConcluido");

if (pedidoSalvo) {
  const pedido = JSON.parse(pedidoSalvo);

  mostrarPedido(pedido);
} else {
  mostrarAcessoInvalido();
}

function mostrarPedido(pedido) {
  document.querySelector("#mensagemCliente").textContent =
    pedido.cliente + ", seus dados foram validados e sua compra foi concluída.";

  document.querySelector("#numeroPedido").textContent =
    pedido.numero;

  document.querySelector("#pedidoProduto").textContent =
    pedido.produto;

  document.querySelector("#pedidoQuantidade").textContent =
    pedido.quantidade;

  document.querySelector("#pedidoSubtotal").textContent =
    formatarPreco(pedido.subtotal);

  document.querySelector("#pedidoFrete").textContent =
    pedido.frete === 0 ? "Grátis" : formatarPreco(pedido.frete);

  document.querySelector("#pedidoPagamento").textContent =
    mostrarFormaPagamento(pedido.pagamento);

  document.querySelector("#pedidoTotal").textContent =
    formatarPreco(pedido.total);
}

function mostrarAcessoInvalido() {
  painelSucesso.style.display = "none";

  mensagemAcesso.innerHTML = `
    <section class="produto-inexistente">
      <h1>Nenhuma compra foi concluída</h1>
      <p>Finalize uma compra antes de acessar esta página.</p>
      <a class="btn btn-dark" href="index.html">Voltar para a vitrine</a>
    </section>
  `;
}

function mostrarFormaPagamento(pagamento) {
  if (pagamento === "pix") {
    return "Pix";
  }

  if (pagamento === "credito") {
    return "Cartão de crédito";
  }

  if (pagamento === "boleto") {
    return "Boleto";
  }

  return "Não informada";
}

function formatarPreco(preco) {
  return preco.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}
