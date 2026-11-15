import './styles.css'

const LANG_KEY = 'plg-lang'
const toggle = document.querySelector('.nav-toggle')
const nav = document.querySelector('.site-nav')

function currentLang() {
  return document.documentElement.dataset.lang === 'ch' ? 'ch' : 'en'
}

function syncMenuLabel() {
  const label = toggle?.querySelector('.sr-only')
  if (!label) return
  const open = document.body.classList.contains('nav-open')
  const lang = currentLang()
  const attr = open
    ? lang === 'ch'
      ? 'data-close-ch'
      : 'data-close-en'
    : lang === 'ch'
      ? 'data-open-ch'
      : 'data-open-en'
  const text = label.getAttribute(attr)
  if (text) label.textContent = text
}

function applyLang(lang, { writeUrl = false } = {}) {
  const next = lang === 'ch' ? 'ch' : 'en'
  document.documentElement.dataset.lang = next
  document.documentElement.lang = next === 'ch' ? 'zh-Hans' : 'en'
  try {
    localStorage.setItem(LANG_KEY, next)
  } catch {
    /* private mode */
  }

  if (writeUrl) {
    const url = new URL(location.href)
    url.searchParams.set('lang', next)
    history.replaceState(null, '', url)
  }

  const title = document.querySelector('title')
  const titleText = title?.getAttribute(next === 'ch' ? 'data-title-ch' : 'data-title-en')
  if (title && titleText) title.textContent = titleText

  document.querySelectorAll('[data-set-lang]').forEach((button) => {
    button.setAttribute('aria-pressed', String(button.getAttribute('data-set-lang') === next))
  })

  const group = document.querySelector('.lang-switch')
  if (group) group.setAttribute('aria-label', next === 'ch' ? '语言' : 'Language')
  if (nav) nav.setAttribute('aria-label', next === 'ch' ? '主导航' : 'Primary')

  document.querySelectorAll('option[data-en]').forEach((option) => {
    const text = option.getAttribute(next === 'ch' ? 'data-ch' : 'data-en') || ''
    option.textContent = text
    option.value = text
  })

  document.querySelectorAll('[data-ph-en]').forEach((field) => {
    const text = field.getAttribute(next === 'ch' ? 'data-ph-ch' : 'data-ph-en') || ''
    field.setAttribute('placeholder', text)
  })

  const copyButton = document.querySelector('#copy-message')
  if (copyButton instanceof HTMLButtonElement && copyButton.dataset.copied !== '1') {
    copyButton.replaceChildren()
    const en = document.createElement('span')
    en.dataset.lang = 'en'
    en.textContent = 'Copy'
    const ch = document.createElement('span')
    ch.dataset.lang = 'ch'
    ch.lang = 'zh-Hans'
    ch.textContent = '复制'
    copyButton.append(en, ch)
  }

  syncMenuLabel()
}

document.querySelectorAll('[data-set-lang]').forEach((button) => {
  button.addEventListener('click', () => {
    applyLang(button.getAttribute('data-set-lang') || 'en', { writeUrl: true })
  })
})

applyLang(currentLang())

function setNav(open) {
  document.body.classList.toggle('nav-open', open)
  if (!toggle) return
  toggle.setAttribute('aria-expanded', String(open))
  syncMenuLabel()
}

toggle?.addEventListener('click', () => {
  setNav(!document.body.classList.contains('nav-open'))
})

nav?.addEventListener('click', (event) => {
  if (event.target instanceof Element && event.target.closest('a')) setNav(false)
})

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') setNav(false)
})

const form = document.querySelector('#inquire-form')

if (form instanceof HTMLFormElement) {
  const result = document.querySelector('#form-result')
  const mailto = document.querySelector('#mailto-link')
  const composed = document.querySelector('#composed')
  const copyButton = document.querySelector('#copy-message')
  const warn = document.querySelector('#mailto-warn')
  const submit = form.querySelector('[type="submit"]')

  form.addEventListener('submit', (event) => {
    event.preventDefault()
    if (!form.reportValidity()) return

    const data = new FormData(form)
    const ch = currentLang() === 'ch'
    const body = ch
      ? [
          `姓名: ${String(data.get('name') || '').trim()}`,
          `国家或地区: ${String(data.get('country') || '').trim()}`,
          `感兴趣的琴型: ${String(data.get('type') || '').trim()}`,
          `演奏方式: ${String(data.get('style') || '').trim()}`,
          `预算区间: ${String(data.get('budget') || '').trim()}`,
          '',
          '留言:',
          String(data.get('message') || '').trim(),
          '',
          '— 这封信在彭磊吉他询价页的浏览器里生成。网站没有保存。',
        ].join('\n')
      : [
          `Name: ${String(data.get('name') || '').trim()}`,
          `Country: ${String(data.get('country') || '').trim()}`,
          `Guitar type: ${String(data.get('type') || '').trim()}`,
          `Playing style: ${String(data.get('style') || '').trim()}`,
          `Budget range: ${String(data.get('budget') || '').trim()}`,
          '',
          'Message:',
          String(data.get('message') || '').trim(),
          '',
          '— Prepared in the browser on the Peng Lei Guitars inquiry page. The site did not store this note.',
        ].join('\n')

    const subject = ch
      ? `询价 — ${String(data.get('name') || '').trim()}`
      : `Inquiry — ${String(data.get('name') || '').trim()}`
    const letter = `To: inquire@pengleiguitars.com\nSubject: ${subject}\n\n${body}`

    if (composed instanceof HTMLTextAreaElement) composed.value = letter

    const tooLong = body.length > 1400
    if (mailto instanceof HTMLAnchorElement) {
      const query = [`subject=${encodeURIComponent(subject)}`]
      if (!tooLong) query.push(`body=${encodeURIComponent(body)}`)
      mailto.href = `mailto:inquire@pengleiguitars.com?${query.join('&')}`
    }
    if (warn instanceof HTMLElement) warn.hidden = !tooLong

    if (result instanceof HTMLElement) {
      result.hidden = false
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      result.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'nearest' })
    }

    const en = submit?.querySelector('.btn-en')
    const zh = submit?.querySelector('.btn-zh')
    if (en) en.textContent = 'Update message'
    if (zh) zh.textContent = '更新信件'
  })

  copyButton?.addEventListener('click', async () => {
    if (!(composed instanceof HTMLTextAreaElement)) return
    const text = composed.value
    let copied = false
    try {
      await navigator.clipboard.writeText(text)
      copied = true
    } catch {
      composed.focus()
      composed.select()
      copied = document.execCommand('copy')
    }
    if (!copied) return
    copyButton.dataset.copied = '1'
    copyButton.textContent = currentLang() === 'ch' ? '已复制' : 'Copied'
    window.setTimeout(() => {
      copyButton.dataset.copied = ''
      applyLang(currentLang())
    }, 2000)
  })
}
