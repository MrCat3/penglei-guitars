import './styles.css'

const toggle = document.querySelector('.nav-toggle')
const nav = document.querySelector('.site-nav')

function setNav(open) {
  document.body.classList.toggle('nav-open', open)
  if (!toggle) return
  toggle.setAttribute('aria-expanded', String(open))
  const label = toggle.querySelector('.sr-only')
  if (label) label.textContent = open ? 'Close menu' : 'Open menu'
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
    const body = [
      `Name / 姓名: ${String(data.get('name') || '').trim()}`,
      `Country / 国家或地区: ${String(data.get('country') || '').trim()}`,
      `Guitar type / 感兴趣的琴型: ${String(data.get('type') || '').trim()}`,
      `Playing style / 演奏方式: ${String(data.get('style') || '').trim()}`,
      `Budget range / 预算区间: ${String(data.get('budget') || '').trim()}`,
      '',
      'Message / 留言:',
      String(data.get('message') || '').trim(),
      '',
      '— Prepared in the browser on the Peng Lei Guitars inquiry page. The site did not store this note.',
    ].join('\n')

    const subject = `Inquiry / 询价 — ${String(data.get('name') || '').trim()}`
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
    const previous = copyButton.textContent
    copyButton.textContent = 'Copied 已复制'
    window.setTimeout(() => {
      copyButton.textContent = previous
    }, 2000)
  })
}
