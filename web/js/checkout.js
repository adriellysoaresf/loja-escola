const form = document.querySelector("#checkoutForm");
const cepInput = document.querySelector("#cep");
const buscarCepButton = document.querySelector("#buscarCep");
const cepFeedback = document.querySelector("#cepFeedback");
const telefoneInput = document.querySelector("#telefone");
const quantidadeResumo = document.querySelector("#quantidadeResumo");
const mensagemCheckout = document.querySelector("#mensagemCheckout");

const compraSalva = sessionStorage.getItem("compra");

let compra;
let produtoSelecionado;

if (compraSalva) {
  compra = JSON.parse(compraSalva);

  produtoSelecionado = produtos.find((produto) => {
    return produto.id === compra.produtoId;
  });
}

if (compra && produtoSelecionado) {
  mostrarResumo();
} else {
  mostrarCompraInexistente();
}

quantidadeResumo.addEventListener("change", atualizarQuantidade);
cepInput.addEventListener("input", aplicarMascaraCep);
telefoneInput.addEventListener("input", aplicarMascaraTelefone);
buscarCepButton.addEventListener("click", buscarCep);
form.addEventListener("submit", finalizarCompra);

function mostrarResumo() {
  quantidadeResumo.value = compra.quantidade;

  document.querySelector("#resumoProduto").textContent =
    produtoSelecionado.nome;

  document.querySelector("#resumoPreco").textContent =
    formatarPreco(produtoSelecionado.preco);

  atualizarValores();
}

function atualizarValores() {
  const subtotal = produtoSelecionado.preco * compra.quantidade;

  let frete = 18.90;

  if (subtotal >= 200) {
    frete = 0;
  }

  const total = subtotal + frete;

  document.querySelector("#resumoSubtotal").textContent =
    formatarPreco(subtotal);

  document.querySelector("#resumoFrete").textContent =
    frete === 0 ? "Grátis" : formatarPreco(frete);

  document.querySelector("#resumoTotal").textContent =
    formatarPreco(total);
}

function atualizarQuantidade() {
  const novaQuantidade = Number(quantidadeResumo.value);

  if (novaQuantidade < 1 || novaQuantidade > 10) {
    mensagemCheckout.textContent =
      "Escolha uma quantidade entre 1 e 10.";

    quantidadeResumo.value = compra.quantidade;
    quantidadeResumo.focus();
    return;
  }

  mensagemCheckout.textContent = "";

  compra.quantidade = novaQuantidade;

  sessionStorage.setItem("compra", JSON.stringify(compra));

  atualizarValores();
}

function aplicarMascaraCep() {
  cepInput.value = formatarCep(cepInput.value);
}

function somenteNumeros(valor) {
  return valor.replace(/\D/g, "");
}

function formatarCep(valor) {
  const numeros = somenteNumeros(valor).slice(0, 8);

  if (numeros.length <= 5) {
    return numeros;
  }

  return numeros.slice(0, 5) + "-" + numeros.slice(5);
}

function aplicarMascaraTelefone() {
  const numeros = somenteNumeros(telefoneInput.value).slice(0, 11);

  if (numeros.length <= 2) {
    telefoneInput.value = numeros;
    return;
  }

  if (numeros.length <= 7) {
    telefoneInput.value =
      "(" + numeros.slice(0, 2) + ") " + numeros.slice(2);

    return;
  }

  telefoneInput.value =
    "(" + numeros.slice(0, 2) + ") " +
    numeros.slice(2, 7) + "-" +
    numeros.slice(7);
}

async function buscarCep() {
  const cep = somenteNumeros(cepInput.value);

  if (cep.length !== 8) {
    cepFeedback.textContent = "Digite um CEP com oito números.";
    cepInput.focus();
    return;
  }

  cepFeedback.textContent = "Buscando endereço...";
  buscarCepButton.disabled = true;

  try {
    const resposta = await fetch(
      "https://viacep.com.br/ws/" + cep + "/json/"
    );

    if (!resposta.ok) {
      throw new Error("Não foi possível consultar o CEP.");
    }

    const endereco = await resposta.json();

    if (endereco.erro) {
      throw new Error("CEP não encontrado.");
    }

    document.querySelector("#logradouro").value =
      endereco.logradouro || "";

    document.querySelector("#bairro").value =
      endereco.bairro || "";

    document.querySelector("#cidade").value =
      endereco.localidade || "";

    document.querySelector("#estado").value =
      endereco.uf || "";

    cepFeedback.textContent = "Endereço encontrado.";

    document.querySelector("#numero").focus();
  } catch (erro) {
    cepFeedback.textContent =
      erro.message || "Não foi possível buscar o CEP.";
  } finally {
    buscarCepButton.disabled = false;
  }
}

function finalizarCompra(event) {
  event.preventDefault();

  const cepValido = somenteNumeros(cepInput.value).length === 8;

  cepInput.setCustomValidity(
    cepValido ? "" : "Informe um CEP válido."
  );

  if (!form.checkValidity()) {
    form.classList.add("was-validated");

    const campoInvalido = form.querySelector(":invalid");

    if (campoInvalido) {
      campoInvalido.focus();
    }

    return;
  }

  const subtotal = produtoSelecionado.preco * compra.quantidade;
  const frete = subtotal >= 200 ? 0 : 18.90;
  const total = subtotal + frete;

  const pedido = {
    numero: criarNumeroPedido(),
    cliente: document.querySelector("#nome").value.trim(),
    email: document.querySelector("#email").value.trim(),
    produto: produtoSelecionado.nome,
    produtoId: produtoSelecionado.id,
    quantidade: compra.quantidade,
    subtotal: subtotal,
    frete: frete,
    total: total,
    pagamento: document.querySelector("#pagamento").value
  };

  sessionStorage.setItem(
    "pedidoConcluido",
    JSON.stringify(pedido)
  );

  sessionStorage.removeItem("compra");

  window.location.href = "sucesso.html";
}

function criarNumeroPedido() {
  const numero = Math.floor(
    100000 + Math.random() * 900000
  );

  return "PED-" + numero;
}

function mostrarCompraInexistente() {
  document.querySelector(".conteudo-checkout").style.display = "none";

  mensagemCheckout.innerHTML = `
    <section class="produto-inexistente">
      <h1>Nenhum produto selecionado</h1>
      <p>Escolha um produto antes de acessar o checkout.</p>
      <a class="btn btn-dark" href="index.html">Voltar para a vitrine</a>
    </section>
  `;
}

function formatarPreco(preco) {
  return preco.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}