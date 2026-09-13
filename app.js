(() => {
  'use strict';

  const year = document.getElementById('copyright-year');
  if (year) year.textContent = String(new Date().getFullYear());

  const menu = document.querySelector('.menu-toggle');
  const navigation = document.getElementById('main-navigation');
  if (menu && navigation) {
    const mobile = window.matchMedia('(max-width: 760px)');
    const setOpen = (open) => {
      menu.setAttribute('aria-expanded', String(open));
      navigation.classList.toggle('is-open', open);
    };
    const syncMenu = () => {
      menu.hidden = !mobile.matches;
      setOpen(false);
    };
    document.documentElement.classList.add('menu-enabled');
    menu.addEventListener('click', () => setOpen(menu.getAttribute('aria-expanded') !== 'true'));
    navigation.addEventListener('click', (event) => {
      const link = event.target.closest('a');
      if (!link) return;
      setOpen(false);
      // Keep keyboard focus on the destination, not a newly hidden menu link.
      const href = link.getAttribute('href');
      const destination = href && href.startsWith('#') ? document.querySelector(href) : null;
      if (destination && mobile.matches) {
        destination.setAttribute('tabindex', '-1');
        destination.focus({ preventScroll: true });
        destination.addEventListener('blur', () => destination.removeAttribute('tabindex'), { once: true });
      }
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        menu.focus();
      }
    });
    mobile.addEventListener('change', syncMenu);
    syncMenu();
  }

  const examples = {
    documents: {
      input: ['A document arrives', 'An invoice, form, or file enters your existing workflow.'],
      process: ['Information takes shape', 'Extract relevant details and flag exceptions for review.'],
      output: ['The next step is ready', 'Route structured information to the right tool or person.'],
    },
    requests: {
      input: ['A customer needs help', 'A question or request reaches your support workflow.'],
      process: ['The request finds context', 'Identify the topic and prepare a response for your team to review.'],
      output: ['Your team can respond', 'Send the reviewed response or route the request to the right person.'],
    },
    knowledge: {
      input: ['Your team has a question', 'Someone needs information from your business documents.'],
      process: ['Relevant knowledge surfaces', 'Find related material within the sources your team can access.'],
      output: ['Answers have a source', 'Bring useful information and source references together for review.'],
    },
  };

  const tablist = document.querySelector('.workflow-tabs');
  const panel = document.getElementById('workflow-panel');
  if (tablist && panel) {
    const tabs = Array.from(tablist.querySelectorAll('[role="tab"]'));
    const selectTab = (selected, moveFocus = false) => {
      const example = examples[selected.dataset.workflow];
      if (!example) return;
      for (const tab of tabs) {
        const active = tab === selected;
        tab.setAttribute('aria-selected', String(active));
        tab.tabIndex = active ? 0 : -1;
      }
      for (const [step, [title, copy]] of Object.entries(example)) {
        document.getElementById(`flow-${step}-title`).textContent = title;
        document.getElementById(`flow-${step}-copy`).textContent = copy;
      }
      panel.setAttribute('aria-labelledby', selected.id);
      if (moveFocus) selected.focus();
    };
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('tabindex', '0');
    panel.removeAttribute('aria-label');
    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => selectTab(tab));
      tab.addEventListener('keydown', (event) => {
        let next;
        if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
        else if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
        else if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = tabs.length - 1;
        else return;
        event.preventDefault();
        selectTab(tabs[next], true);
      });
    });
    selectTab(tabs[0]);
    tablist.hidden = false;
  }

  const copyButton = document.querySelector('.copy-address');
  const status = document.querySelector('.copy-status');
  const address = document.querySelector('address');
  if (copyButton && status && address) {
    const text = 'SmartInterop Corp\n14 Estates Ct\nSan Carlos, CA 94070-3504';
    copyButton.hidden = false;
    copyButton.addEventListener('click', async () => {
      try {
        if (!navigator.clipboard || !window.isSecureContext) throw new Error('Clipboard unavailable');
        await navigator.clipboard.writeText(text);
        status.textContent = 'Address copied.';
      } catch {
        const range = document.createRange();
        range.selectNodeContents(address);
        const selection = window.getSelection();
        if (selection) {
          selection.removeAllRanges();
          selection.addRange(range);
        }
        status.textContent = 'Select and copy the address above using your device’s copy command.';
      }
    });
  }
})();
