/**
 * ShopSteward Agreement & Certificate Generator
 * Real-time data binding, image upload handler, and A4 printing logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const inputs = {
    shopName: document.getElementById('inputShopName'),
    ownerName: document.getElementById('inputOwnerName'),
    phone: document.getElementById('inputPhone'),
    address: document.getElementById('inputAddress'),
    userId: document.getElementById('inputUserId'),
    password: document.getElementById('inputPassword'),
    loginUrl: document.getElementById('inputLoginUrl'),
    date: document.getElementById('inputDate'),
    tier: document.getElementById('inputTier'),
    setupFee: document.getElementById('inputSetupFee'),
    annualFee: document.getElementById('inputAnnualFee'),
  };

  const uploaders = {
    founderSig: document.getElementById('founderSigInput'),
    seal: document.getElementById('sealInput'),
    clientSig: document.getElementById('clientSigInput'),
  };

  const printBtn = document.getElementById('printBtn');
  const toggleControlsBtn = document.getElementById('toggleControlsBtn');
  const settingsDrawer = document.getElementById('settingsDrawer');

  // Load from localStorage if previously stored
  loadStoredData();

  // Attach live update listeners
  inputs.shopName?.addEventListener('input', () => updateSync('sync-shop-name', inputs.shopName.value));
  inputs.ownerName?.addEventListener('input', () => updateSync('sync-owner-name', inputs.ownerName.value));
  inputs.phone?.addEventListener('input', () => updateSync('sync-phone', inputs.phone.value));
  inputs.address?.addEventListener('input', () => updateSync('sync-address', inputs.address.value));
  inputs.userId?.addEventListener('input', () => updateSync('sync-user-id', inputs.userId.value));
  inputs.password?.addEventListener('input', () => updateSync('sync-password', inputs.password.value));
  inputs.loginUrl?.addEventListener('input', () => updateSync('sync-login-url', inputs.loginUrl.value));
  inputs.tier?.addEventListener('input', () => updateSync('sync-tier', inputs.tier.value));
  inputs.setupFee?.addEventListener('input', () => updateSync('sync-setup-fee', inputs.setupFee.value));
  inputs.annualFee?.addEventListener('input', () => updateSync('sync-annual-fee', inputs.annualFee.value));
  inputs.date?.addEventListener('input', () => updateDate(inputs.date.value));

  // Sync function
  function updateSync(className, value) {
    document.querySelectorAll('.' + className).forEach(el => {
      el.textContent = value;
    });
    saveState();
  }

  function updateDate(value) {
    document.querySelectorAll('.sync-date-line').forEach(el => {
      el.textContent = value.trim() ? value : '____________________';
    });
    saveState();
  }

  // Toggle Controls Drawer
  toggleControlsBtn?.addEventListener('click', () => {
    settingsDrawer.classList.toggle('open');
  });

  // Print / Save PDF
  printBtn?.addEventListener('click', () => {
    window.print();
  });

  // Handle Founder Signature Upload
  uploaders.founderSig?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      setFounderSignature(dataUrl);
      localStorage.setItem('shopsteward_founder_sig', dataUrl);
    };
    reader.readAsDataURL(file);
  });

  // Handle Official Seal Upload
  uploaders.seal?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      setOfficialSeal(dataUrl);
      localStorage.setItem('shopsteward_official_seal', dataUrl);
    };
    reader.readAsDataURL(file);
  });

  // Handle Client Signature Upload
  uploaders.clientSig?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      setClientSignature(dataUrl);
      localStorage.setItem('shopsteward_client_sig', dataUrl);
    };
    reader.readAsDataURL(file);
  });

  function setFounderSignature(src) {
    ['founderSigSlot1', 'founderSigSlot2'].forEach(id => {
      const slot = document.getElementById(id);
      if (slot) {
        slot.innerHTML = `<img src="${src}" alt="Founder Signature" class="founder-sig-img">`;
      }
    });
    const preview = document.getElementById('founderSigPreview');
    if (preview) {
      preview.innerHTML = `<img src="${src}" alt="Signature"> <span style="font-size:11px;color:#a3e635;">Uploaded ✓</span>`;
    }
  }

  function setOfficialSeal(src) {
    const slot = document.getElementById('officialSealSlot');
    if (slot) {
      slot.innerHTML = `<img src="${src}" alt="Official Seal" class="cert-seal-img">`;
    }
    const preview = document.getElementById('sealPreview');
    if (preview) {
      preview.innerHTML = `<img src="${src}" alt="Seal"> <span style="font-size:11px;color:#a3e635;">Uploaded ✓</span>`;
    }
  }

  function setClientSignature(src) {
    const slot = document.getElementById('clientSigSlot');
    if (slot) {
      slot.innerHTML = `<img src="${src}" alt="Client Signature" class="founder-sig-img">`;
    }
    const preview = document.getElementById('clientSigPreview');
    if (preview) {
      preview.innerHTML = `<img src="${src}" alt="Client Signature"> <span style="font-size:11px;color:#a3e635;">Uploaded ✓</span>`;
    }
  }

  // Save text inputs to localStorage
  function saveState() {
    const data = {};
    for (const key in inputs) {
      if (inputs[key]) {
        data[key] = inputs[key].value;
      }
    }
    localStorage.setItem('shopsteward_form_data', JSON.stringify(data));
  }

  // Load from localStorage
  function loadStoredData() {
    const saved = localStorage.getItem('shopsteward_form_data');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        for (const key in data) {
          if (inputs[key]) {
            inputs[key].value = data[key];
          }
        }
      } catch (err) {
        console.error('Error parsing stored data', err);
      }
    }

    // Refresh display
    for (const key in inputs) {
      if (inputs[key]) {
        inputs[key].dispatchEvent(new Event('input'));
      }
    }

    // Check stored images
    const storedSig = localStorage.getItem('shopsteward_founder_sig');
    if (storedSig) setFounderSignature(storedSig);

    const storedSeal = localStorage.getItem('shopsteward_official_seal');
    if (storedSeal) setOfficialSeal(storedSeal);

    const storedClientSig = localStorage.getItem('shopsteward_client_sig');
    if (storedClientSig) setClientSignature(storedClientSig);
  }
});
