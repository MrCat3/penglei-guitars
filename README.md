# Peng Lei Guitars

Preview site for Peng Lei (彭磊), an independent maker of traditional American-style steel-string guitars. English and Chinese are both on every page. The English text is complete on its own.

Static site, built with Vite. There is no cart, no account, no dealer list, and no backend. The inquiry form only prepares a letter in the browser.

The hero guitar is a drawing. It is marked on the page as a placeholder for a photograph.

## Preview locally

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:43123](http://127.0.0.1:43123).

A production build, served locally:

```bash
npm run build
npm run preview
```

`vite preview` uses the same port, `43123`. Stop the dev server first if it is still running.

## Pages

| Path | Page |
| --- | --- |
| `/` | Home 首页 |
| `/instruments.html` | Instruments 作品 |
| `/available.html` | Available 现货 |
| `/about.html` | About 关于 |
| `/inquire.html` | Inquire 询价 |

## Key copy

Hero

- Traditional American-style guitars, handmade by Peng Lei
- 传统美式风格，彭磊精工手作

Brand

- Peng Lei Guitars
- 制琴师 · 彭磊

Navigation

- Home 首页
- Instruments 作品
- Available 现货
- About 关于
- Inquire 询价

Footer

- Independent luthier. Handmade in small numbers.
- 独立制琴。小批量手工。
- inquire@pengleiguitars.com

Available

- Built to order. / 接单制作。
- No guitar on this site is finished and offered for sale. / 本站没有已完工、可供出售的吉他。
- Current wait time: To be confirmed / 待确认

Buttons on the homepage

- View Instruments / 查看作品
- Inquire / 询价

## Contact address

`inquire@pengleiguitars.com` is the address printed in the supplied homepage comp. Confirm that the inbox is real before anyone relies on it.

The inquire form does not submit to a server. It builds a `mailto:` link and a copyable letter. If the letter is very long, the mailto link omits the body so the address still opens.

## Photographs

Replace the homepage drawing, and the line icons on Instruments, with photographs of real instruments before a public launch. Keep the placeholder label until those files exist, so a drawing is never read as a guitar he has finished.
