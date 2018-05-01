const endpoint = document.querySelector("#endpoint");
const requestType = document.querySelector("#request-type");
const requestData = document.querySelector("#request-data > tbody");
const addData = document.querySelector("#add-data");
const sendRequest = document.querySelector("#send");
const placeholder = document.querySelector(".placeholder");
const loading = document.querySelector(".loading");
const output = document.querySelector(".output");

requestData.addEventListener("click", e => {
  if (e.target.type == "button") {
    e.target.parentNode.parentNode.remove();
  }
});
addData.addEventListener("click", () => {
  let name = prompt("Digite o nome do parâmetro");
  if (name === "") {
    return alert("ERRO: O nome não pode estar vazio");
  }
  let value = prompt("Digite o valor do parâmetro");
  let tr = document.createElement("tr");
  tr.innerHTML = `<td>${name}</td><td>${value}</td><td><button type="button">Excluir</button></td>`;
  requestData.appendChild(tr);
});
sendRequest.addEventListener("click", () => {
  if (endpoint.value === "") { return alert("ERRO: O endereço não pode estar vazio.") }
  let requestUrl = endpoint.value;
  let requestInit = {
    method: requestType.value,
    pragma: "no-cache",
    "cache-control": "no-cache"
  };
  if (requestData.children.length > 0) {
    if (requestType.value === "get") {
      requestUrl += "?";
      Array.prototype.forEach.call(requestData.children, row => {
        requestUrl += `${row.children[0].innerText}=${row.children[1].innerText}`;
      });
    } else {
      let formData = new FormData();
      Array.prototype.forEach.call(requestData.children, row => {
        formData.append(row.children[0].innerText, row.children[1].innerText);
      });
      requestInit.body = formData;
    }
  }
  placeholder.style.display = "none";
  loading.style.display = "inline-flex";
  output.style.display = "none";
  let request = fetch(encodeURI(requestUrl), requestInit);
  request.then((result) => {
    if (result.ok) {
      return result.text();
    } else {
      throw new Error(`Falha no carregamento\nCódigo HTTP: ${result.status} (${result.statusText})`);
    }
  }).then(text => {
    let escaped = text.replace("\r\n", "<br>");
    loading.style.display = "none";
    output.innerHTML = escaped;
    output.style.display = "block";
  }, error => {
    loading.style.display = "none";
    output.innerHTML = error.message
    output.style.display = "block";
  });
});