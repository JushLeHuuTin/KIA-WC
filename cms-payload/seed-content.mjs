import { getPayload } from 'payload'
import config from './src/payload.config.ts'
import path from 'path'

const PUBLIC_DIR = path.resolve('../KIA-WC-2026/public')
const ADMIN_EMAIL = 'kia@local.com'
const ADMIN_PASSWORD = 'Kia123@'

const payload = await getPayload({ config })

// Toàn bộ script chạy trong DUY NHẤT 1 transaction (1 session Postgres cố
// định) thay vì để mỗi lệnh Local API tự mượn 1 connection từ pool. Lý do:
// qua Neon pooled endpoint (-pooler), đã tái hiện được nhiều lần lỗi
// read-after-write không nhất quán giữa các connection khác nhau trong cùng 1
// lần chạy (find() không thấy row vừa insert/delete ở lệnh ngay trước đó) --
// gộp vào 1 transaction buộc mọi thao tác đi qua đúng 1 connection nên luôn
// đọc được đúng những gì vừa ghi. Đồng thời cho phép rollback toàn bộ nếu có
// lỗi giữa chừng, tránh để lại trạng thái nửa vời như đã từng xảy ra.
const transactionID = await payload.db.beginTransaction()
const req = { transactionID }

async function run() {
  // Tài khoản admin cố định để ai clone lại source code cũng đăng nhập được
  // ngay, không cần tự tạo tài khoản đầu tiên qua UI -- idempotent (xoá nếu đã
  // tồn tại rồi tạo lại) để chạy seed nhiều lần không lỗi trùng email.
  console.log('=== Seeding admin user ===')
  const existingUsers = await payload.find({ collection: 'users', where: { email: { equals: ADMIN_EMAIL } }, req })
  for (const u of existingUsers.docs) await payload.delete({ collection: 'users', id: u.id, req })
  await payload.create({ collection: 'users', data: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD }, req })
  console.log('  admin user ready:', ADMIN_EMAIL)

  // Idempotent: xoá sạch Media do chính seed này tạo ra (nhận diện qua field
  // seedKey) trước khi tạo lại từ đầu -- đảm bảo mỗi lần chạy luôn ra đúng 1
  // trạng thái dữ liệu, không tạo trùng, và không đụng tới file admin tự upload
  // qua CMS UI (những file đó không có seedKey nên không bị xoá).
  console.log('=== Clearing previously seeded media ===')
  const oldSeeded = await payload.find({ collection: 'media', where: { seedKey: { exists: true } }, limit: 1000, req })
  for (const doc of oldSeeded.docs) await payload.delete({ collection: 'media', id: doc.id, req })
  console.log(`  cleared ${oldSeeded.docs.length} media doc(s)`)

  async function uploadMedia(relPath, alt, seedKey) {
    if (!relPath) return null
    const filePath = path.join(PUBLIC_DIR, relPath)
    const doc = await payload.create({ collection: 'media', data: { alt, seedKey }, filePath, req })
    console.log('  uploaded', relPath, '->', doc.id)
    return doc.id
  }

  console.log('=== Uploading media ===')

  // --- Site Settings ---
  const logoId = await uploadMedia('/icons/kia-logo.svg', 'Kia logo', 'siteSettings.logo')

  // --- Hero ---
  const pcVideoId = await uploadMedia('/media/kv/pc.mp4', 'Hero video (PC)', 'hero.pcVideo')
  const mobileVideoId = await uploadMedia('/media/kv/mw.mp4', 'Hero video (mobile)', 'hero.mobileVideo')
  const pcPosterId = await uploadMedia('/media/kv/pc-poster.png', 'Hero poster (PC)', 'hero.pcPoster')
  const mobilePosterId = await uploadMedia('/media/kv/mw-poster.png', 'Hero poster (mobile)', 'hero.mobilePoster')
  const heroLogoId = await uploadMedia('/icons/49th-team-logo.png', '49th Team logo', 'hero.logo')

  // --- MainFilmCarousel ---
  const filmThumbs = [
    ['/media/cup-main-film/pc-1.jpg', '/media/cup-main-film/mw-1.jpg'],
    ['/media/cup-main-film/pc-2.jpg', '/media/cup-main-film/mw-2.jpg'],
    ['/media/cup-main-film/pc-3.jpg', '/media/cup-main-film/mw-3.jpg'],
  ]
  const filmIds = []
  for (let i = 0; i < filmThumbs.length; i++) {
    const [pc, mw] = filmThumbs[i]
    const n = i + 1
    filmIds.push([
      await uploadMedia(pc, 'Film thumbnail (PC)', `mainFilmCarousel.film${n}.pcThumbnail`),
      await uploadMedia(mw, 'Film thumbnail (mobile)', `mainFilmCarousel.film${n}.mwThumbnail`),
    ])
  }

  // --- PhaseOverview ---
  const phaseOverviewImgs = []
  for (let i = 1; i <= 4; i++) {
    phaseOverviewImgs.push([
      await uploadMedia(`/media/phases/pc-phase${i}.jpg`, `Phase ${i} (PC)`, `phaseOverview.phase${i}.pcImage`),
      await uploadMedia(`/media/phases/mw-phase${i}.jpg`, `Phase ${i} (mobile)`, `phaseOverview.phase${i}.mwImage`),
    ])
  }

  // --- PhaseDetails ---
  const phaseDetailBgs = []
  for (let i = 1; i <= 4; i++) {
    phaseDetailBgs.push([
      await uploadMedia(`/media/phase-detail/pc-${i}-bg.png`, `Phase ${i} background (PC)`, `phaseDetails.phase${i}.bgPc`),
      await uploadMedia(`/media/phase-detail/mw-${i}-bg.png`, `Phase ${i} background (mobile)`, `phaseDetails.phase${i}.bgMw`),
    ])
  }
  const phaseItemCounts = [5, 5, 4, 3]
  const phaseDetailItems = []
  for (let p = 1; p <= 4; p++) {
    const items = []
    for (let it = 1; it <= phaseItemCounts[p - 1]; it++) {
      // Phase 3 item 4 reuses item3's images (matches FALLBACK_PHASES in PhaseDetails.tsx)
      const srcIdx = p === 3 && it === 4 ? 3 : it
      items.push([
        await uploadMedia(`/media/phase-detail/pc-${p}-item${srcIdx}.jpg`, `Phase ${p} item ${it} (PC)`, `phaseDetails.phase${p}.item${it}.pcImage`),
        await uploadMedia(`/media/phase-detail/mw-${p}-item${srcIdx}.jpg`, `Phase ${p} item ${it} (mobile)`, `phaseDetails.phase${p}.item${it}.mwImage`),
      ])
    }
    phaseDetailItems.push(items)
  }

  // --- WatchMore ---
  const watchMorePcId = await uploadMedia('/media/playlist/pc.jpg', 'Watch more (PC)', 'watchMore.pcImage')
  const watchMoreMwId = await uploadMedia('/media/playlist/mw.jpg', 'Watch more (mobile)', 'watchMore.mwImage')

  // --- ExperienceCarousel ---
  const expImgs = []
  for (let i = 1; i <= 4; i++) {
    expImgs.push([
      await uploadMedia(`/media/experience/pc-${i}.jpg`, `Experience ${i} (PC)`, `experienceCarousel.exp${i}.pcImage`),
      await uploadMedia(`/media/experience/pc-${i}-thumb.jpg`, `Experience ${i} thumbnail`, `experienceCarousel.exp${i}.thumbImage`),
      await uploadMedia(`/media/experience/mw-${i}.jpg`, `Experience ${i} (mobile)`, `experienceCarousel.exp${i}.mwImage`),
    ])
  }

  // --- ConnectStore ---
  const connectPcId = await uploadMedia('/media/connect-store/pc.jpg', 'Connect store (PC)', 'connectStore.pcImage')
  const connectMwId = await uploadMedia('/media/connect-store/mw.jpg', 'Connect store (mobile)', 'connectStore.mwImage')

  // --- Outro ---
  const outroPcId = await uploadMedia('/media/outro/pc.jpg', 'Outro (PC)', 'outro.pcImage')
  const outroMwId = await uploadMedia('/media/outro/mw.jpg', 'Outro (mobile)', 'outro.mwImage')

  // --- Footer ---
  const footerCardIds = []
  for (let i = 1; i <= 3; i++) {
    footerCardIds.push(await uploadMedia(`/media/footer/card-${i}.jpg`, `Stay Inspired card ${i}`, `footer.card${i}`))
  }

  console.log('=== Populating globals ===')

  await payload.updateGlobal({
    slug: 'site-settings',
    req,
    data: {
      logo: logoId,
      socialLinks: [],
      seo: {
        title: 'Kia OMBC — FIFA World Cup 2026™',
        description:
          'Kia — Official Partner of the FIFA World Cup 2026™. Discover the 49th Team and the Official Match Ball Carrier (OMBC) program.',
      },
    },
  })
  console.log('site-settings done')

  await payload.updateGlobal({
    slug: 'hero',
    req,
    data: {
      kvTitle: 'FIFA Official Match Ball Carrier',
      kvHeadline: 'Where Young Dreams Move Forward',
      kvSubheadline: 'The 49th Team Creating the Opening Moment of the FIFA World Cup 2026™',
      introShort: 'Kia creates the very first moment of the FIFA World Cup™.',
      introParagraphs: [
        { text: 'As the world watches, the FIFA World Cup™ begins with OMBC.' },
        { text: 'The Official Match Ball Carrier (OMBC) is a program operated exclusively by Kia,' },
        { text: 'inviting children onto the pitch to deliver the official match ball to the referee — formally signaling' },
        { text: 'the start of the match. Each child is personally selected and invited by Kia — future stars of the game.' },
        { text: " In that defining moment, they step into the very heart of the world's biggest stage." },
      ],
      pcVideo: pcVideoId,
      mobileVideo: mobileVideoId,
      pcPoster: pcPosterId,
      mobilePoster: mobilePosterId,
      logo: heroLogoId,
    },
  })
  console.log('hero done')

  await payload.updateGlobal({
    slug: 'header',
    req,
    data: {
      navItems: [
        { label: 'Brand', href: '#brand' },
        { label: 'Design', href: '#design' },
        { label: 'Vehicle', href: '#vehicle' },
        { label: 'Innovation', href: '#innovation' },
        { label: 'Newsroom', href: '#newsroom' },
      ],
    },
  })
  console.log('header done')

  await payload.updateGlobal({
    slug: 'main-film-carousel',
    req,
    data: {
      films: [
        { title: 'The Next Legend', videoId: 'F3oRObMMNx8', pcThumbnail: filmIds[0][0], mwThumbnail: filmIds[0][1] },
        { title: 'Master Plan', videoId: 'F3oRObMMNx8', pcThumbnail: filmIds[1][0], mwThumbnail: filmIds[1][1] },
        { title: 'Deliver to Inspire', videoId: 'dQw4w9WgXcQ', pcThumbnail: filmIds[2][0], mwThumbnail: filmIds[2][1] },
      ],
    },
  })
  console.log('main-film-carousel done')

  await payload.updateGlobal({
    slug: 'phase-overview',
    req,
    data: {
      heading: "Official Match Ball Carrier, The World Cup™'s 49th Team",
      bodyParagraphs: [
        { text: 'The FIFA World Cup 2026™ — the largest in history, bringing together 48 nations. On that stage, one final team takes its place.' },
        { text: 'Rising football talents selected through local auditions around the world come together at the Kia OMBC Cup 2026™. More than just a tournament, it is a space where inspiration flows between players — children learning from legends, sharing the same dream with new friends, connected through the universal language of the game. United as one, they come together as the 49th Team stepping onto the FIFA World Cup™ stage. Discover their stories — united by passion for football and shared dreams.' },
      ],
      phases: [
        { label: 'Phase 1', title: 'The Calling', subtitle: 'A Call Toward a Dream', pcImage: phaseOverviewImgs[0][0], mwImage: phaseOverviewImgs[0][1] },
        { label: 'Phase 2', title: 'Local Audition', subtitle: 'Chosen by Legends', pcImage: phaseOverviewImgs[1][0], mwImage: phaseOverviewImgs[1][1] },
        { label: 'Phase 3', title: 'Kia OMBC Cup 2026™', subtitle: 'Becoming One Team', pcImage: phaseOverviewImgs[2][0], mwImage: phaseOverviewImgs[2][1] },
        { label: 'Phase 4', title: 'FIFA World Cup 2026™', subtitle: 'The 49th Team Stepping onto the FIFA World Cup™ Stage', pcImage: phaseOverviewImgs[3][0], mwImage: phaseOverviewImgs[3][1] },
      ],
    },
  })
  console.log('phase-overview done')

  const phaseDetailsData = {
    phases: [
      {
        eyebrow: 'Phase 1: The Calling',
        headline: 'A Call Toward a Dream',
        body: 'French football legend Thierry Henry sets out to build OMBC — the 49th Team of the FIFA World Cup 2026™. Answering his call, football legends from around the world join one by one, as the journey to becoming the 49th Team begins.',
        bgPc: phaseDetailBgs[0][0],
        bgMw: phaseDetailBgs[0][1],
        items: [
          { title: '49th Team Draw', description: 'Through the draw, Thierry Henry unveils the participating countries of the Kia OMBC Cup, alongside the FIFA World Cup 2026™. The ceremony marks the beginning of the 49th Team journey and introduces the nations that will take part in this once-in-a-lifetime experience.', videoId: '4jjOH2FR6-E', pcImage: phaseDetailItems[0][0][0], mwImage: phaseDetailItems[0][0][1] },
          { title: 'Rio Ferdinand Joins', description: 'Rio Ferdinand answers Thierry Henry’s call, bringing his experience and leadership to inspire the next generation of the 49th Team. He encourages young players to believe in teamwork, confidence, and dedication throughout the journey.', videoId: 'aqz-KE-bpKQ', pcImage: phaseDetailItems[0][1][0], mwImage: phaseDetailItems[0][1][1] },
          { title: 'Jorge Campos Joins', description: 'Legendary goalkeeper Jorge Campos joins the journey, encouraging young players to embrace confidence, creativity, and courage. His unique personality reminds every participant that football is about joy as much as competition.', videoId: '3JZ_D3ELwOQ', pcImage: phaseDetailItems[0][2][0], mwImage: phaseDetailItems[0][2][1] },
          { title: 'David Villa Joins', description: 'David Villa becomes part of the 49th Team, sharing his passion for football and inspiring children to dream beyond limits. His story shows that perseverance and hard work can turn dreams into reality.', videoId: 'ysz5S6PUM-U', pcImage: phaseDetailItems[0][3][0], mwImage: phaseDetailItems[0][3][1] },
          { title: 'Ahn Jung-hwan Joins', description: 'Ahn Jung-hwan completes the lineup of legends, adding his unique story and international experience. Together, the legends prepare the future OMBCs for an unforgettable adventure.', videoId: 'M7lc1UVf-VE', pcImage: phaseDetailItems[0][4][0], mwImage: phaseDetailItems[0][4][1] },
        ],
      },
      {
        eyebrow: 'Phase 2: Local Audition',
        headline: 'Chosen by Legends',
        body: 'Across 10 countries around the world, legends and coaches set out to find the children who would join the OMBC journey. What mattered most went beyond skill. Children who embody five values — Passion, Courage, Resilience, Joy, and Inspiration — are chosen as the new faces of the 49th Team.',
        bgPc: phaseDetailBgs[1][0],
        bgMw: phaseDetailBgs[1][1],
        items: [
          { title: 'Manifesto', description: 'Thierry Henry, leader of the 49th Team, introduces the Official Match Ball Carriers — the 49th to join the FIFA World Cup™ — and shares their stories with the world. Witness their journey to becoming OMBCs.', videoId: '', pcImage: phaseDetailItems[1][0][0], mwImage: phaseDetailItems[1][0][1] },
          { title: 'The Call Up', description: 'Young football fans from around the world answer the call, taking their first step toward becoming members of the 49th Team.', videoId: '', pcImage: phaseDetailItems[1][1][0], mwImage: phaseDetailItems[1][1][1] },
          { title: 'The Selection', description: 'Legends and coaches carefully select children who demonstrate not only football talent but also the five core values of the program.', videoId: '', pcImage: phaseDetailItems[1][2][0], mwImage: phaseDetailItems[1][2][1] },
          { title: 'Ways of the Team', description: 'The selected children learn the mindset, values, and spirit that define the 49th Team before taking the next step together.', videoId: '', pcImage: phaseDetailItems[1][3][0], mwImage: phaseDetailItems[1][3][1] },
          { title: 'Squad Reveal', description: 'The final squad of Official Match Ball Carriers is revealed, introducing the young players who will represent the 49th Team.', videoId: '', pcImage: phaseDetailItems[1][4][0], mwImage: phaseDetailItems[1][4][1] },
        ],
      },
      {
        eyebrow: 'Phase 3: Kia OMBC Cup 2026™',
        headline: 'Becoming One Team',
        body: 'For the first time, the OMBCs selected from each country come together in Los Angeles. The Kia OMBC Cup 2026™ is more than just a tournament. Under the guidance of legends, the children move beyond competition to understand one another and grow together — becoming the true 49th Team, ready to step onto the FIFA World Cup 2026™ stage.',
        bgPc: phaseDetailBgs[2][0],
        bgMw: phaseDetailBgs[2][1],
        items: [
          { title: 'One Team', description: 'The OMBCs selected from each country gather in Los Angeles for the first time to take part in the Kia OMBC Cup 2026™. Now, their second journey begins.', videoId: '', pcImage: phaseDetailItems[2][0][0], mwImage: phaseDetailItems[2][0][1] },
          { title: 'Boot Camp', description: 'Through intensive training sessions and team-building activities, the OMBCs grow together under the mentorship of football legends.', videoId: '', pcImage: phaseDetailItems[2][1][0], mwImage: phaseDetailItems[2][1][1] },
          { title: '49th Team Photo', description: 'The newly united squad captures its official team photo, celebrating the friendships and shared journey that define the 49th Team.', videoId: '', pcImage: phaseDetailItems[2][2][0], mwImage: phaseDetailItems[2][2][1] },
          { title: 'OMBC Cup Highlights', description: 'Relive the unforgettable moments, inspiring goals, and unforgettable teamwork from the Kia OMBC Cup 2026™.', videoId: '', pcImage: phaseDetailItems[2][3][0], mwImage: phaseDetailItems[2][3][1] },
        ],
      },
      {
        eyebrow: 'Phase 4: FIFA World Cup 2026™',
        headline: 'The 49th Team Stepping onto the FIFA World Cup™ Stage',
        body: 'Now, the children step onto the FIFA World Cup 2026™ stage. As they enter the pitch carrying the official match ball, they become part of the opening moment of the match. And even after the final whistle, the journey of challenge and growth that began with the 49th Team continues on.',
        bgPc: phaseDetailBgs[3][0],
        bgMw: phaseDetailBgs[3][1],
        items: [
          { title: "Class of '26", description: 'The children have long dreamed of stepping onto the FIFA World Cup™ stage — and now, as Official Match Ball Carriers, they finally take their place on that stage.', videoId: '', pcImage: phaseDetailItems[3][0][0], mwImage: phaseDetailItems[3][0][1] },
          { title: 'Legend Verdict', description: 'Football legends reflect on the OMBCs’ remarkable journey, celebrating their growth, determination, and unforgettable achievements.', videoId: '', pcImage: phaseDetailItems[3][1][0], mwImage: phaseDetailItems[3][1][1] },
          { title: 'Forever 49th Team', description: 'Although the tournament ends, the friendships, values, and memories of the 49th Team continue to inspire every child for years to come.', videoId: '', pcImage: phaseDetailItems[3][2][0], mwImage: phaseDetailItems[3][2][1] },
        ],
      },
    ],
  }
  await payload.updateGlobal({ slug: 'phase-details', data: phaseDetailsData, req })
  console.log('phase-details done')

  await payload.updateGlobal({
    slug: 'watch-more',
    req,
    data: {
      heading: 'FIFA World Cup 2026™ —\nTogether with OMBC',
      body: 'The journey of the 49th Team does not end with the opening of the match. As an official partner of the FIFA World Cup 2026™, Kia continues to create more unforgettable moments of the tournament — beginning with OMBC.',
      buttonTitle: 'Watch more OMBC videos',
      buttonSubtitle: 'Discover the many stories of the 49th Team — united by passion for football and shared dreams.',
      buttonHref: '/videos',
      pcImage: watchMorePcId,
      mwImage: watchMoreMwId,
    },
  })
  console.log('watch-more done')

  await payload.updateGlobal({
    slug: 'experience-carousel',
    req,
    data: {
      heading: 'Experience Beyond the Match',
      body: 'The excitement that begins inside the stadium extends far beyond it. As an official partner of the FIFA World Cup 2026™, Kia expands the tournament experience — from mobility to shared experiences and connection.',
      experiences: [
        { title: 'Official Tournament Vehicle Support', description: 'Kia has long supported the mobility of players and officials across FIFA international tournaments, ensuring that every moment flows seamlessly.', pcImage: expImgs[0][0], thumbImage: expImgs[0][1], mwImage: expImgs[0][2] },
        { title: 'Youth and Future Generation Programs', description: "From youth and grassroots fan moments to futsal and the FIFA eWorld Cup™, Kia continues to support football's future — staying closer to the next generation of fans and dreams.", pcImage: expImgs[1][0], thumbImage: expImgs[1][1], mwImage: expImgs[1][2] },
        { title: 'FIFA Fan Festival', description: 'A global gathering place beyond the stadium, where fans connect with the passion of football with culture and celebration through mobility experience.', pcImage: expImgs[2][0], thumbImage: expImgs[2][1], mwImage: expImgs[2][2] },
        { title: 'Brand Booth', description: 'A space to experience the present and future of mobility. Through its EV lineup, Kia strives for electrification and sustainability.', pcImage: expImgs[3][0], thumbImage: expImgs[3][1], mwImage: expImgs[3][2] },
      ],
    },
  })
  console.log('experience-carousel done')

  await payload.updateGlobal({
    slug: 'connect-store',
    req,
    data: {
      heading: 'FIFA World Cup 2026™\nDownload the 49th Team Display Theme',
      body: "Every moment of the FIFA World Cup 2026™, Kia stands alongside the passion and determination of the OMBCs. Experience the excitement of passionate support and thrilling victories through Kia's display theme.",
      buttonTitle: 'Learn more',
      buttonHref: '/connect-store',
      pcImage: connectPcId,
      mwImage: connectMwId,
    },
  })
  console.log('connect-store done')

  await payload.updateGlobal({
    slug: 'outro',
    req,
    data: {
      paragraphs: [
        { text: 'OMBC has long invited children to take part in the opening moment of the FIFA World Cup™. The OMBC Cup transforms their own challenge into an experience of growth.', bold: false },
        { text: 'And at the moment they deliver the official match ball, the match officially begins.', bold: false },
        { text: "Kia continues the journey with them at the FIFA World Cup 2026™, ensuring their beginning becomes part of the FIFA World Cup™'s memory.", bold: true },
      ],
      pcImage: outroPcId,
      mwImage: outroMwId,
    },
  })
  console.log('outro done')

  await payload.updateGlobal({
    slug: 'footer',
    req,
    data: {
      stayInspiredHeading: 'Stay Inspired',
      stayInspiredCards: [
        { image: footerCardIds[0], title: 'From Innovation to Impact', subtitle: '지속가능한 내일로 가는 길' },
        { image: footerCardIds[1], title: 'From Innovation to Impact', subtitle: '지속가능한 내일로 가는 길' },
        { image: footerCardIds[2], title: 'From Innovation to Impact', subtitle: '지속가능한 내일로 가는 길' },
      ],
      menuColumns: [
        { title: 'Investor Relations', items: [{ label: 'IR Highlights', href: '#' }, { label: 'Corporate', href: '#' }, { label: 'Financial', href: '#' }, { label: 'Official Notice', href: '#' }, { label: 'Library', href: '#' }] },
        { title: 'Sustainability', items: [{ label: 'ESG', href: '#' }, { label: 'Environmental', href: '#' }, { label: 'Social', href: '#' }, { label: 'Governance', href: '#' }] },
        { title: 'Join the Movement', items: [{ label: 'Career', href: '#' }] },
      ],
      disclaimer1: '본 사이트에는 글로벌 사양의 모델이 사용되었습니다. 실제 차량의 사양, 기능, 소프트웨어 동작은 모델, 시장, 생산 시점, 선택 사양에 따라 달라질 수 있습니다. 일부 이미지 또는 영상은 연출, 시뮬레이션, 혹은 전문 운전자에 의해 촬영된 장면을 포함할 수 있으며, 공식 양산 전 사전 제작 모델 기준으로 제작되어 최종 제품과 다를 수 있습니다. 영상 속 주행 장면을 따라 하지 마십시오. 항상 안전하게 운전하고 관련 교통법규를 준수하십시오. 자세한 내용은 차량의 오너스 매뉴얼을 참고하십시오.',
      disclaimer2: '페이지 내 사용된 일부 시각 요소는 인공지능(AI) 기반 이미지 생성 도구를 통해 제작되었으며, 실제 인물이나 장소 또는 사건을 묘사한 것이 아닙니다. 본 콘텐츠는 당사의 윤리 및 법적 기준을 준수하여 사용되고 있습니다.',
    },
  })
  console.log('footer done')
}

try {
  await run()
  await payload.db.commitTransaction(transactionID)
  console.log('')
  console.log('=== SEED COMPLETE (transaction committed) ===')
  console.log('')
  console.log('Đăng nhập CMS bằng:')
  console.log(`  email: ${ADMIN_EMAIL}`)
  console.log(`  pass:  ${ADMIN_PASSWORD}`)
  console.log('')
  process.exit(0)
} catch (err) {
  console.error('')
  console.error('=== SEED FAILED -- rolling back, database unchanged ===')
  console.error(err)
  await payload.db.rollbackTransaction(transactionID)
  process.exit(1)
}
