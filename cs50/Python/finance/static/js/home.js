(function () {

  document.querySelectorAll('tr button').forEach(item => {
    item.addEventListener('click', onButtonClick)
  })

  var modal = new bootstrap.Modal(document.getElementById('transactionModal'))
  const modalTitle = document.querySelector(".modal-title");
  const modalSubtitle = document.getElementById("modalSubTitle");
  const modalForm = document.getElementById("actionForm");
  const modalSubmitButton = document.getElementById("modalFormSubmitButton");
  const symbolInput = document.getElementById("symbolInput");
  const sharesInput = document.getElementById("sharesInput");

  modalFormSubmitButton.addEventListener('click', submitModalForm);

  function onButtonClick(e) {
    e.preventDefault();
    const el = e.target;
    const symbol = el.getAttribute("data-symbol");
    const path = el.getAttribute("data-path");

    if (path == "/buy") {
      modalTitle.innerText = `Buy more ${symbol} shares`;
      modalSubtitle.innerText = "How many shares would you like to buy:"
      modalSubmitButton.innerText = "Buy";
      modalSubmitButton.classList.remove("btn-danger")
      modalSubmitButton.classList.add("btn-success");
    } else {
      modalTitle.innerText = `Sell ${symbol} shares`;
      modalSubmitButton.innerText = "Sell";
      modalSubmitButton.classList.remove("btn-success")
      modalSubmitButton.classList.add("btn-danger");
      modalSubtitle.innerText = "How many shares would you like to sell:"
    }
    modalForm.setAttribute('action', path);
    symbolInput.setAttribute("value", symbol);
    //show the modal
    modal.toggle();
  }


  function submitModalForm(e) {
    e.preventDefault();
    const shares = parseInt(sharesInput.value);
    if (shares > 0) {
      modalForm.submit();
      modalSubmitButton.disabled = true;
      modalSubmitButton.innerText = "Loading...";
    } else {
      sharesInput.classList.add("border-danger", "border-4");

    }
  }

})();