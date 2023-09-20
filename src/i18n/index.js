/* eslint-disable */
import { createI18n } from 'vue-i18n';

function loadLocaleMessages() {
  const locales = require.context('.', true, /[A-Za-z0-9-_,\s]+\.js$/i);
  const messages = {};
  locales.keys().forEach(key => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i);
    if (matched && matched.length > 1) {
      const locale = matched[1];
      messages[locale] = locales(key).default;
    }
  });
  return messages;
}

const i18n = new createI18n({
  globalInjection: true,
  locale: localStorage.getItem('locale') || 'en',
  messages: loadLocaleMessages(),
  missing: () => '-',
});

// i18n.vm.$watch('locale', value => localStorage.setItem('locale', value));


export default i18n;
