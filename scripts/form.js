const LEAD_GATEWAY_URL = 'https://lead-gateway-henna.vercel.app/api/leads';
const LEAD_GATEWAY_API_KEY = 'b0ffff3c2299551401bdfcf35ea9be8283c0aab612cc0241c5d813e4f0f2a393';

function getContactField(id) {
  return document.getElementById(id);
}

function buildLeadPayload() {
  const firstName = getContactField('name')?.value.trim() || '';
  const lastName = getContactField('last-name')?.value.trim() || '';
  const email = getContactField('email')?.value.trim() || '';
  const phone = getContactField('phone')?.value.trim() || '';
  const investmentBudget = getContactField('service')?.value.trim() || '';
  const message = getContactField('message')?.value.trim() || '';

  return {
    // This is the website identifier configured in the lead gateway.
    website: 'website-a',
    source: 'contact-form',
    name: [firstName, lastName].filter(Boolean).join(' '),
    email,
    phone,
    company: 'Commercial Property Holds',
    message: [
      message,
      investmentBudget && `Investment budget: ${investmentBudget}`,
      `Submitted from: ${window.location.href}`,
    ].filter(Boolean).join('\n'),
  };
}

function showModal(message) {
  const modal = document.getElementById('alertModal');
  const messageNode = document.getElementById('alertMessage');

  if (!modal || !messageNode) {
    window.alert(message);
    return;
  }

  messageNode.textContent = message;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
}

function closeAlertModal() {
  const modal = document.getElementById('alertModal');

  if (!modal) {
    return;
  }

  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
}

async function sendLead(payload) {
  const response = await fetch(LEAD_GATEWAY_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': LEAD_GATEWAY_API_KEY,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorDetail = await response.text().catch(() => '');
    throw new Error(`Lead gateway request failed (${response.status})${errorDetail ? `: ${errorDetail}` : ''}`);
  }

  return response.json().catch(() => null);
}

async function handleSubmit(event) {
  event.preventDefault();

  const form = event.target.closest('form') || document.getElementById('contact-form');
  const button = form?.querySelector('.form-submit');
  const defaultText = button?.textContent;

  if (!form || !button) {
    return;
  }

  button.disabled = true;
  button.textContent = 'Sending...';

  try {
    await sendLead(buildLeadPayload());
    showModal('Your message has been sent successfully!');
    form.reset();
  } catch (error) {
    console.error('Unable to send lead:', error);
    showModal('There was an error sending your message. Please try again.');
  } finally {
    button.disabled = false;
    button.textContent = defaultText;
  }
}

function initContactForm() {
  window.handleSubmit = handleSubmit;
  window.closeAlertModal = closeAlertModal;

  const modal = document.getElementById('alertModal');
  if (modal) {
    modal.addEventListener('click', (event) => {
      if (event.target === modal) {
        closeAlertModal();
      }
    });
  }
}
