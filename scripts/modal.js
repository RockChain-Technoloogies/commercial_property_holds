let currentIrr = 14;

function setModalOpenState(isOpen) {
  const overlay = document.getElementById('modalOverlay');

  if (!overlay) {
    return;
  }

  overlay.classList.toggle('open', isOpen);
  overlay.setAttribute('aria-hidden', String(!isOpen));
}

function openModal(name, loc, val, irr) {
  document.getElementById('modalTitle').textContent = name;
  document.getElementById('modalLoc').textContent = '📍 ' + loc;
  document.getElementById('modalVal').textContent = val;
  document.getElementById('modalIrr').textContent = irr;
  document.getElementById('modalAmount').value = '';
  document.getElementById('sharesOut').textContent = '—';
  document.getElementById('incomeOut').textContent = '—';
  currentIrr = parseFloat(irr);
  setModalOpenState(true);
}

function closeModal(event) {
  const overlay = document.getElementById('modalOverlay');

  if (!overlay) {
    return;
  }

  if (!event || event.target === overlay) {
    setModalOpenState(false);
  }
}

function calcShares() {
  const amt = parseFloat(document.getElementById('modalAmount').value);

  if (!amt || amt < 200000) {
    document.getElementById('sharesOut').textContent = '—';
    document.getElementById('incomeOut').textContent = '—';
    return;
  }

  const shares = Math.floor(amt / 200000);
  const income = Math.round(amt * (currentIrr / 100));
  document.getElementById('sharesOut').textContent = shares.toLocaleString('en-IN') + ' shares';
  document.getElementById('incomeOut').textContent = '₹' + income.toLocaleString('en-IN') + '/yr';
}

function initModal() {
  window.openModal = openModal;
  window.closeModal = closeModal;
  window.calcShares = calcShares;

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeModal();
    }
  });
}
