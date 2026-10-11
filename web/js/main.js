const listaProdutos = document.querySelector("#listaProdutos");
const filtroProduto = document.querySelector("#filtroProduto");
const filtroCategoria = document.querySelector("#filtroCategoria");
const ordenarProdutos = document.querySelector("#ordenarProdutos");
const mensagemFiltro = document.querySelector("#mensagemFiltro");

mostrarCategorias();
mostrarProdutos(produtos);

filtroProduto.addEventListener("input", filtrarProdutos);
filtroCategoria.addEventListener("change", filtrarProdutos);
ordenarProdutos.addEventListener("change", filtrarProdutos);

function mostrarProdutos(lista) {
  listaProdutos.innerHTML = "";

  if (lista.length === 0) {
    mensagemFiltro.textContent = "Nenhum produto foi encontrado.";
    return;
  }

  mensagemFiltro.textContent = "";

  lista.forEach((produto) => {
    listaProdutos.innerHTML += `
      <article class="col-md-6 col-lg-4">
        <div class="produto-card">
          <img
            class="imagem-card"
            src="${produto.imagem}"
            alt="${produto.alt}"
            width="400"
            height="300"
            loading="lazy"
          >

          <div class="conteudo-card">
            <p class="categoria">${produto.categoria}</p>
            <h3>${produto.nome}</h3>
            <p>${produto.descricaoCurta}</p>
            <p class="regra">${produto.regra}</p>
            <p class="preco">${formatarPreco(produto.preco)}</p>
            <a class="botao" href="produto.html?id=${produto.id}">Ver detalhes</a>
          </div>
        </div>
      </article>
    `;
  });
}

function mostrarCategorias() {
  const categorias = [];

  produtos.forEach((produto) => {
    if (!categorias.includes(produto.categoria)) {
      categorias.push(produto.categoria);
    }
  });

  categorias.forEach((categoria) => {
    filtroCategoria.innerHTML += `
      <option value="${categoria}">${categoria}</option>
    `;
  });
}

function filtrarProdutos() {
  const pesquisa = normalizarTexto(filtroProduto.value);
  const categoriaEscolhida = filtroCategoria.value;
  const ordemEscolhida = ordenarProdutos.value;

  let produtosFiltrados = produtos.filter((produto) => {
    const nome = normalizarTexto(produto.nome);
    const categoria = normalizarTexto(produto.categoria);
    const regra = normalizarTexto(produto.regra);

    const correspondePesquisa =
      nome.includes(pesquisa) ||
      categoria.includes(pesquisa) ||
      regra.includes(pesquisa);

    const correspondeCategoria =
      categoriaEscolhida === "" ||
      produto.categoria === categoriaEscolhida;

    return correspondePesquisa && correspondeCategoria;
  });

  if (ordemEscolhida === "nome") {
    produtosFiltrados.sort((primeiroProduto, segundoProduto) => {
      return primeiroProduto.nome.localeCompare(segundoProduto.nome);
    });
  }

  if (ordemEscolhida === "menor-preco") {
    produtosFiltrados.sort((primeiroProduto, segundoProduto) => {
      return primeiroProduto.preco - segundoProduto.preco;
    });
  }

  if (ordemEscolhida === "maior-preco") {
    produtosFiltrados.sort((primeiroProduto, segundoProduto) => {
      return segundoProduto.preco - primeiroProduto.preco;
    });
  }

  mostrarProdutos(produtosFiltrados);
}

function normalizarTexto(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function formatarPreco(preco) {
  return preco.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}
