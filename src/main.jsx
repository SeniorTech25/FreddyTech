import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AnimatePresence, LayoutGroup, MotionConfig, motion, useReducedMotion } from 'motion/react';
import * as Dialog from '@radix-ui/react-dialog';
import { ArrowUpRight, ArrowRight, ArrowDown, ArrowLeft, Code, Sparkle, FilmStrip, Wrench, MapPin, X, List, Plus, Check, Copy, EnvelopeSimple, GraduationCap, Globe, CaretRight, Play, Lightbulb, Heart, Monitor } from '@phosphor-icons/react';
import '@fontsource-variable/manrope';
import '@fontsource-variable/dm-sans';
import { matchIntent, emailHref } from './intent';
import './styles.css';

const services = [
  { id: 'build', label: 'BUILD', title: 'Build something.', icon: Code, color: '#c4f56c', description: 'A website. A new idea. Something that doesn\'t exist yet.', tags: ['Websites', 'Prototypes', 'Digital experiences'], heading: 'From "what if" to something real.', detail: 'Websites, landing pages and digital experiences built around what you actually need. We can start small, test an idea, and give it room to grow.', items: ['Websites and landing pages', 'Booking and payment integrations', 'AI-powered prototypes', 'AR / VR and emerging-tech concepts'], prompt: 'I have an idea for a website or digital project.' },
  { id: 'optimize', label: 'OPTIMIZE', title: 'Improve my business.', icon: Sparkle, color: '#a8c9ff', description: 'Less friction. Better tools. AI that earns its place.', tags: ['AI consulting', 'Workflows', 'Team training'], heading: 'Make technology earn its keep.', detail: 'A practical look at the tools, habits and repetitive work in your business. Together, we find what to improve and help your team get comfortable using it.', items: ['Practical AI consulting', 'Technology and tool selection', 'Digital process improvement', 'Custom training and workshops'], prompt: 'I want to improve how my business uses technology.' },
  { id: 'create', label: 'CREATE', title: 'Create content.', icon: FilmStrip, color: '#efb3a5', description: 'Bring a story to life. Give an idea its best edit.', tags: ['Video', 'Podcasts', 'Creative production'], heading: 'Make something worth watching.', detail: 'From the first idea to the final edit: thoughtful filming, video editing, podcasts and digital content with a clear purpose.', items: ['Video editing and post-production', 'Filming and interviews', 'Podcast production', 'Content planning and production workflows'], prompt: 'I have a video or content project in mind.' },
  { id: 'help', label: 'HELP', title: 'Fix a tech problem.', icon: Wrench, color: '#eed985', description: 'The thing that won\'t work? Let\'s figure it out.', tags: ['Troubleshooting', 'Setup', 'Patient guidance'], heading: 'A real person. A practical solution.', detail: 'Tell me what is going wrong, even if you do not know what to call it. I help untangle everyday technology and explain the solution in plain language.', items: ['Computer and device troubleshooting', 'New-device setup and migrations', 'Accounts, cloud storage and backups', 'Buying advice and one-to-one guidance'], prompt: 'I need help with a tech problem.' },
];

const routes = {
  ...Object.fromEntries(services.map((service) => [service.id, { ...service, cta: 'Talk to Freddy' }])),
  preserve: { id: 'preserve', category: 'create', title: 'Give those memories a future.', description: 'Tape digitization, careful cleanup and a digital copy you can revisit.', cta: 'Tell me about your tapes', prompt: 'I have old tapes I would like to digitize.' },
  training: { id: 'training', category: 'optimize', title: 'Help your team feel confident.', description: 'Practical AI and technology workshops, shaped around your day-to-day work.', cta: 'Talk about a workshop', prompt: 'I would like to organize technology or AI training for my team.' },
};

const projects = [
  { id: 'senior', title: 'SeniorTech', label: 'FOUNDED BY FREDDY', type: 'Technology, made human', className: 'senior-art', headline: 'More confidence.\nMore connection.', description: 'Helping older adults feel at home with technology.', detail: 'SeniorTech is my distinct venture focused on helping older adults use technology with confidence. Patient explanations, practical support and education are at the heart of it.', items: ['Technology education', 'Patient, personal support', 'Digital confidence'], note: 'SeniorTech has its own identity and audience. FreddyTech brings my broader technology and creative work together.' },
  { id: 'freddytech', title: 'FreddyTech', label: 'PERSONAL TECHNOLOGY BRAND', type: 'An idea, built for the web', className: 'freddy-art', headline: 'A broad toolkit.\nOne person to call.', description: 'The place where my technical and creative work meet.', detail: 'This website brings together the different ways I help people: building, improving, creating and fixing. The service finder starts with your goal and helps you find a useful next step.', items: ['Website design and development', 'Interactive service discovery', 'Creative direction'], note: 'An evolving home for my work, with more projects to share as they are ready.' },
];

function Reveal({ children, className = '', delay = 0 }) {
  const reduce = useReducedMotion();
  return <motion.div className={className} initial={{ opacity: 0, transform: reduce ? 'none' : 'translateY(20px)' }} whileInView={{ opacity: 1, transform: 'none' }} viewport={{ once: true, amount: 0.08 }} transition={{ duration: 0.5, delay, ease: [0.23, 1, 0.32, 1] }}>{children}</motion.div>;
}

function Brand({ footer = false }) {
  return <a className={`brand ${footer ? 'brand-footer' : ''}`} href="#top" aria-label="FreddyTech home"><span className="brand-mark" aria-hidden="true">f<span>.</span></span><span>freddy<span className="brand-light">tech</span><span className="brand-dot">.</span></span></a>;
}

function App() {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);
  const [contactOpen, setContactOpen] = useState(false);
  const [contactTopic, setContactTopic] = useState('A new idea');
  const [draft, setDraft] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeProject, setActiveProject] = useState(null);
  const [keyboardInput, setKeyboardInput] = useState(false);
  const finderInput = useRef(null);
  const contactTrigger = useRef(null);
  const reduce = useReducedMotion();
  const intent = matchIntent(query);
  const activeId = selected || intent?.category || intent?.id;
  const result = query.trim() ? (intent ? routes[intent.id] : { title: 'Something a little different?', description: 'You do not need to put it in a category. Tell me what you have in mind.', cta: 'Let\'s figure it out' }) : selected ? routes[selected] : null;

  function openContact(message = '', topic = 'A new idea') {
    if (topic === routes.preserve.title) {
      window.location.assign('/memories/');
      return;
    }
    contactTrigger.current = document.activeElement;
    if (message) setDraft(message);
    setContactTopic(topic);
    setContactOpen(true);
    setMenuOpen(false);
  }

  function goFinder() {
    document.getElementById('services').scrollIntoView({ behavior: reduce ? 'instant' : 'smooth' });
    finderInput.current.focus({ preventScroll: true });
  }

  useEffect(() => {
    function handleHash() {
      if (window.location.hash === '#contact') {
        contactTrigger.current = document.activeElement;
        setContactOpen(true);
      }
    }
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  return <MotionConfig reducedMotion="user"><a className="skip-link" href="#main">Skip to content</a>
    <header className="site-header">
      <div className="header-inner"><Brand /><nav aria-label="Primary navigation" className="desktop-nav"><a href="#services">What I do</a><a href="#work">Selected work</a><a href="#about">The person behind it</a></nav><button className="header-contact" onClick={() => openContact()}>Let's talk <ArrowUpRight size={18} /></button><button className="menu-toggle icon-button" aria-label="Open navigation" title="Open navigation" onClick={() => setMenuOpen(true)}><List size={26} /></button></div>
    </header>
    <main id="main">
      <section className="hero" id="top" aria-labelledby="hero-title">
        <div className="hero-image"><img src="/freddy-seated-original.jpeg" alt="Frederic Aubuchon seated with his legs crossed, wearing a black jacket" width="1536" height="2048" fetchPriority="high" /></div>
        <div className="hero-wash" />
        <div className="hero-content shell">
          <div className="hero-location"><MapPin size={16} /><span>Montreal roots. An open mind.</span></div>
          <motion.div initial={{ opacity: 0, transform: reduce ? 'none' : 'translateY(16px)' }} animate={{ opacity: 1, transform: 'none' }} transition={{ duration: 0.65, ease: [0.23, 1, 0.32, 1] }}>
            <h1 id="hero-title"><span>Hey, I'm</span>Freddy<span className="accent">.</span></h1>
            <p className="hero-statement">I build, fix and improve<br />things with technology.</p>
            <p className="hero-sub">Creative ideas. Practical solutions.<br />A real person to figure it out with.</p>
            <button className="button button-lime" onClick={goFinder}>What are you trying to do? <ArrowUpRight size={20} /></button>
          </motion.div>
          <div className="hero-bottom"><span>FREDERIC AUBUCHON / FREDDYTECH</span><a href="#services" className="explore-link">A few ways I can help <ArrowDown size={16} /></a></div>
        </div>
        <span className="portrait-caption">Technology, figured out.</span>
      </section>

      <div className="identity-band"><div className="shell identity-content"><span>One curious mind.<br /><strong>A lot of ways to help.</strong></span><div><span>Founder of SeniorTech</span><span>AI & technology consultant</span><span>Builder & digital creator</span></div><Sparkle size={32} weight="light" aria-hidden="true" /></div></div>

      <section className="services section-space shell" id="services" aria-labelledby="services-heading">
        <Reveal className="section-heading"><span className="eyebrow">01 / START WITH YOUR IDEA</span><div className="heading-row"><h2 id="services-heading">What do you<br />need help with<span className="accent">?</span></h2><p>You bring the goal.<br />I'll help figure out the technology.</p></div></Reveal>
        <div className="finder">
          <form onSubmit={(event) => { event.preventDefault(); openContact(query, intent ? routes[intent.id].title : 'A new idea'); }} role="search" aria-label="Find a FreddyTech service">
            <Sparkle className="finder-icon" size={26} weight="light" aria-hidden="true" /><label className="sr-only" htmlFor="service-search">Tell me what you're trying to do</label><input ref={finderInput} id="service-search" placeholder="Tell me what you're trying to do..." value={query} maxLength={600} onChange={(event) => { setQuery(event.target.value); setSelected(null); setKeyboardInput(true); }} />{query && <button type="button" className="clear-search icon-button" title="Clear request" aria-label="Clear request" onClick={() => { setQuery(''); setSelected(null); finderInput.current.focus(); }}><X size={17} /></button>}<button className="search-submit" type="submit" title="Talk to Freddy about this" aria-label="Talk to Freddy about this"><ArrowUpRight size={24} /></button>
          </form>
          <div className="suggestions"><span>A starting point:</span>{['I need a website', 'I have old VHS tapes', 'Train my team on AI'].map((suggestion) => <button key={suggestion} onClick={() => { setQuery(suggestion); setSelected(null); setKeyboardInput(false); }}>{suggestion}<Plus size={12} /></button>)}</div>
        </div>
        <LayoutGroup id="services"><div className="service-grid">{services.map((service, index) => <ServiceCard key={service.id} service={service} index={index} active={activeId === service.id} reduce={reduce || keyboardInput} onSelect={() => { setQuery(''); setSelected(selected === service.id ? null : service.id); setKeyboardInput(false); }} />)}</div></LayoutGroup>
        <div className="finder-result" aria-live="polite" aria-atomic="true">
          <AnimatePresence initial={false} mode="wait">{result ? <motion.div className="result-inner" key={result.id || 'custom'} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: keyboardInput || reduce ? 0 : 0.15 }}><div><span className="eyebrow">{query ? 'A GOOD PLACE TO START' : result.label}</span><h3>{result.heading || result.title}</h3><p>{result.detail || result.description}</p>{!query && result.items && <ul className="result-services">{result.items.map((item) => <li key={item}><Check size={14} />{item}</li>)}</ul>}</div><button className="text-link" onClick={() => openContact(query || result.prompt, result.title)}>{result.cta || 'Talk to Freddy'}<ArrowUpRight size={20} /></button></motion.div> : <motion.p key="empty" className="finder-default" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><span>Big idea or small headache.</span> You don't need the technical vocabulary.</motion.p>}</AnimatePresence>
        </div>
      </section>

      <section className="preservation" id="preservation" aria-labelledby="preservation-heading">
        <div className="preservation-photo"><img src="/preservation-still.png" alt="VHS tapes and a small cassette, including a sleeve marked Summer 1998" width="1536" height="1024" loading="lazy" /></div>
        <div className="preservation-shade" />
        <div className="shell preservation-inner"><Reveal><span className="eyebrow">02 / SOME THINGS ARE IRREPLACEABLE</span><h2 id="preservation-heading">Your memories<br />weren't meant<br />to stay on tape<span>.</span></h2><p>The family holidays. The school plays. The voices you haven't heard in years. Let's bring them back into your life.</p><a className="button button-white" href="/memories/">Let's talk about your tapes<ArrowUpRight size={20} /></a><div className="tape-formats"><span>TAPE DIGITIZATION</span><span>RESTORATION</span><span>DIGITAL ARCHIVING</span></div></Reveal></div>
        <div className="preservation-foot shell"><span><FilmStrip size={18} /> Old formats. New possibilities.</span><span>Have VHS, MiniDV or Hi8? Tell me what you've got.</span></div>
      </section>

      <section className="business section-space" id="business" aria-labelledby="business-heading"><div className="shell">
        <Reveal className="section-heading"><span className="eyebrow">03 / TECHNOLOGY THAT PULLS ITS WEIGHT</span><div className="heading-row"><h2 id="business-heading">Less busywork.<br />More possibility.</h2><p>Good technology should give you time back.<br />Let's find where it can make a difference.</p></div></Reveal>
        <div className="business-grid"><Reveal className="business-copy"><span className="small-icon"><Sparkle size={26} /></span><h3>AI, with a purpose.</h3><p>A clear look at your work, your tools and where AI can actually help. Practical advice, thoughtful implementation and support that makes sense for your business.</p><ul className="business-list"><li><span>01</span>Find the friction<ArrowRight size={18} /></li><li><span>02</span>Choose the right tools<ArrowRight size={18} /></li><li><span>03</span>Put them to work<Check size={18} /></li></ul><button className="text-link" onClick={() => openContact('I would like to explore where AI and better tools could help my business.', 'AI & business consulting')}>Let's look at your business<ArrowUpRight size={20} /></button></Reveal>
          <Reveal className="training-panel" delay={0.08}><div className="training-top"><GraduationCap size={32} weight="light" /><span>WORKSHOPS / TEAM TRAINING</span></div><h3>Your team has<br />the technology.<br /><span>I help them<br />actually use it.</span></h3><p>Hands-on sessions for the people doing the work. AI, everyday tools, digital confidence and better ways of working together.</p><div className="training-tags"><span>Practical AI</span><span>Digital skills</span><span>Custom workshops</span></div><button className="text-link" onClick={() => openContact(routes.training.prompt, 'Team training')}>Build a workshop with me<ArrowUpRight size={20} /></button></Reveal></div>
      </div></section>

      <section className="work section-space shell" id="work" aria-labelledby="work-heading"><Reveal className="section-heading"><span className="eyebrow">04 / IDEAS WITH MY NAME ON THEM</span><div className="heading-row"><h2 id="work-heading">Different projects.<br />Same curiosity.</h2><p>Building things and helping people.<br />Here's where that takes shape.</p></div></Reveal>
        <LayoutGroup id="project-gallery"><div className="project-grid">{projects.map((project) => <ProjectCard key={project.id} project={project} active={activeProject === project.id} onOpenChange={(open) => setActiveProject(open ? project.id : null)} reduce={reduce} />)}</div></LayoutGroup>
      </section>

      <section className="local" id="local" aria-labelledby="local-heading"><div className="shell local-inner"><Reveal><span className="eyebrow"><MapPin size={16} /> MONTREAL'S WEST ISLAND</span><h2 id="local-heading">Sometimes, you just<br />need a tech guy.</h2><p>The laptop that's slowing you down. A new device to set up.<br className="desktop-break" /> A question you've been putting off. I'm here for that, too.</p><button className="button button-dark" onClick={() => openContact('I am in the West Island and need help with...', 'West Island tech help')}>Tell me what's going on<ArrowUpRight size={20} /></button></Reveal><div className="local-services">{[[Monitor, 'Computers & devices', 'Setup, troubleshooting, migrations'], [Globe, 'Your digital everyday', 'Accounts, cloud storage, backups'], [Lightbulb, 'A little guidance', 'Buying advice and patient explanations']].map(([Icon, title, description]) => <div key={title}><Icon size={28} weight="light" /><div><h3>{title}</h3><p>{description}</p></div></div>)}</div></div></section>

      <section className="about section-space shell" id="about" aria-labelledby="about-heading"><Reveal className="about-photo"><img src="/freddy-business-original.jpeg" alt="Frederic Aubuchon wearing a suit on a balcony overlooking the city" width="1536" height="2048" loading="lazy" /><span>Frederic Aubuchon<br /><strong>Most people call me Freddy.</strong></span></Reveal><Reveal className="about-copy"><span className="eyebrow">05 / THE PERSON BEHIND IT</span><h2 id="about-heading">Curiosity is<br />the common thread.</h2><p className="about-lead">I've always been the person people call when technology needs figuring out.</p><p>Sometimes that means building a website. Sometimes it's editing a video, exploring what AI can do, or sitting down with someone until a confusing piece of technology finally clicks.</p><p>I founded SeniorTech around that same belief: technology becomes useful when people feel comfortable with it. FreddyTech is where I bring my wider technical and creative work together.</p><div className="about-signoff"><span>Freddy.</span><span>Builder. Creator.<br />Your tech person.</span></div></Reveal></section>

      <section className="contact-section" id="start" aria-labelledby="contact-heading"><div className="shell"><Reveal><span className="eyebrow">START WITH A CONVERSATION</span><div className="contact-heading-row"><h2 id="contact-heading">What are you<br />trying to do<span>?</span></h2><button className="contact-circle" aria-label="Start a conversation with Freddy" title="Start a conversation" onClick={() => openContact()}><ArrowUpRight size={64} weight="light" /></button></div><div className="contact-bottom"><p>An idea, a problem, a "wouldn't it be cool if..."<br />That's plenty to start with.</p><a href="mailto:hello@freddytech.ca">hello@freddytech.ca<ArrowUpRight size={18} /></a></div></Reveal></div></section>
    </main>
    <footer className="footer shell"><Brand footer /><span>Montreal, QC / Working wherever ideas take us.</span><a href="#top" className="back-top" aria-label="Back to top">Back to top<ArrowUpRight size={16} /></a><div className="footer-bottom"><span>&copy; {new Date().getFullYear()} FreddyTech. Frederic Aubuchon.</span><span>Technology, figured out.</span></div></footer>

    <ContactDialog open={contactOpen} onOpenChange={setContactOpen} message={draft} setMessage={setDraft} topic={contactTopic} returnFocus={contactTrigger} />
    <Dialog.Root open={menuOpen} onOpenChange={setMenuOpen}><Dialog.Portal><Dialog.Overlay className="dialog-overlay" /><Dialog.Content className="mobile-menu"><Dialog.Title className="sr-only">Navigation</Dialog.Title><Dialog.Description className="sr-only">Explore FreddyTech</Dialog.Description><Dialog.Close className="icon-button close-button" aria-label="Close navigation" title="Close navigation"><X size={24} /></Dialog.Close><Brand />{[['What I do', '#services'], ['Selected work', '#work'], ['The person behind it', '#about']].map(([label, href]) => <a key={href} href={href} onClick={() => setMenuOpen(false)}>{label}<ArrowUpRight size={22} /></a>)}<button className="button button-lime" onClick={() => openContact()}>Let's talk<ArrowUpRight size={20} /></button></Dialog.Content></Dialog.Portal></Dialog.Root>
  </MotionConfig>;
}

function ServiceCard({ service, index, active, onSelect, reduce }) {
  const Icon = service.icon;
  return <button className={`service-card ${active ? 'is-active' : ''}`} style={{ '--service-color': service.color }} aria-pressed={active} onClick={onSelect} onPointerMove={(event) => { if (event.pointerType !== 'mouse' || reduce) return; const bounds = event.currentTarget.getBoundingClientRect(); event.currentTarget.style.setProperty('--pointer-x', `${event.clientX - bounds.left}px`); event.currentTarget.style.setProperty('--pointer-y', `${event.clientY - bounds.top}px`); }}>
    {active && <motion.span className="selected-service" layoutId={reduce ? undefined : 'service-selection'} transition={{ type: 'spring', bounce: 0, duration: 0.4 }} />}
    <span className="service-top"><span className="service-number">0{index + 1} / {service.label}</span><Icon size={27} weight="light" /></span><h3>{service.title}</h3><p>{service.description}</p><span className="service-tags">{service.tags.join(' / ')}</span><span className="service-arrow"><ArrowUpRight size={24} /></span>
  </button>;
}

function ProjectArt({ project, shared = false, reduce = false }) {
  return <motion.div className={`project-art ${project.className}`} layoutId={shared && !reduce ? `project-art-${project.id}` : undefined} transition={{ type: 'spring', bounce: 0, duration: 0.4 }}><div className="project-art-top"><span>{project.id === 'senior' ? 'senior' : 'freddy'}<b>{project.id === 'senior' ? 'tech' : 'tech.'}</b></span>{project.id === 'senior' ? <Heart size={26} weight="light" /> : <Code size={28} weight="light" />}</div><p>{project.headline.split('\n').map((line, i) => <React.Fragment key={line}>{i > 0 && <br />}{line}</React.Fragment>)}</p><span className="project-art-bottom">{project.type}<ArrowUpRight size={20} /></span></motion.div>;
}

function ProjectCard({ project, active, onOpenChange, reduce }) {
  return <Dialog.Root open={active} onOpenChange={onOpenChange}><Dialog.Trigger asChild><button className="project-card"><ProjectArt project={project} shared={!active} reduce={reduce} /><span className="project-caption"><span><span className="eyebrow">{project.label}</span><strong>{project.title}</strong><span>{project.description}</span></span><span className="project-open"><Plus size={24} /></span></span></button></Dialog.Trigger><Dialog.Portal><Dialog.Overlay className="dialog-overlay" /><Dialog.Content className="project-dialog"><Dialog.Close className="icon-button close-button" title="Close project" aria-label="Close project"><X size={24} /></Dialog.Close><ProjectArt project={project} shared reduce={reduce} /><div className="project-dialog-copy"><span className="eyebrow">{project.label}</span><Dialog.Title>{project.title}</Dialog.Title><Dialog.Description>{project.detail}</Dialog.Description><ul>{project.items.map((item) => <li key={item}><Check size={16} />{item}</li>)}</ul><p className="project-note">{project.note}</p></div></Dialog.Content></Dialog.Portal></Dialog.Root>;
}

function ContactDialog({ open, onOpenChange, message, setMessage, topic, returnFocus }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [prepared, setPrepared] = useState(false);
  const messageRef = useRef(null);
  useEffect(() => { if (open) { setStatus(''); setPrepared(false); } }, [open]);

  async function copyMessage() {
    try {
      await navigator.clipboard.writeText(`Hey Freddy,\n\n${message.trim()}\n\n${name}${email ? `\n${email}` : ''}`);
      setStatus('Message copied.');
    } catch {
      setStatus('Copy is unavailable here. Select your message to copy it.');
      setPrepared(false);
      requestAnimationFrame(() => messageRef.current?.select());
    }
  }

  return <Dialog.Root open={open} onOpenChange={onOpenChange}><Dialog.Portal><Dialog.Overlay className="dialog-overlay" /><Dialog.Content className="contact-dialog" onCloseAutoFocus={(event) => { event.preventDefault(); const target = returnFocus.current; if (target instanceof HTMLElement && target.isConnected && !target.closest('[inert]')) target.focus(); else document.querySelector('.header-contact')?.focus(); }}><Dialog.Close className="icon-button close-button" aria-label="Close conversation" title="Close conversation"><X size={24} /></Dialog.Close><span className="eyebrow">HEY FREDDY...</span><Dialog.Title>Let's figure it out.</Dialog.Title><Dialog.Description>Tell me a little about what you have in mind.</Dialog.Description>
    {prepared ? <div className="contact-prepared"><div className="prepared-icon"><EnvelopeSimple size={32} weight="light" /></div><h3>Your draft is ready.</h3><p>Your email app should open with your message. Nothing is sent until you send it there.</p><a className="button button-lime" href={emailHref({ name, email, message, topic })}>Open email draft<ArrowUpRight size={19} /></a><button className="text-link" onClick={() => setPrepared(false)}><ArrowLeft size={17} />Edit my message</button><button className="text-link" onClick={copyMessage}><Copy size={17} />Copy message instead</button><p className="contact-direct">Email directly: <a href="mailto:hello@freddytech.ca">hello@freddytech.ca</a></p></div> : <form onSubmit={(event) => { event.preventDefault(); setPrepared(true); setStatus(''); window.location.href = emailHref({ name, email, message, topic }); }}><label htmlFor="contact-message">What are you trying to do?</label><textarea ref={messageRef} id="contact-message" required minLength={8} maxLength={2000} value={message} onChange={(event) => setMessage(event.target.value)} placeholder="I've got an idea. Or a problem. Here's the story..." rows={5} /><div className="contact-fields"><div><label htmlFor="contact-name">Your name <span>(optional)</span></label><input id="contact-name" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} maxLength={100} /></div><div><label htmlFor="contact-email">Your email <span>(optional)</span></label><input id="contact-email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} maxLength={200} /></div></div><button className="button button-lime contact-submit" type="submit">Prepare my email<ArrowUpRight size={20} /></button><p className="form-note">Opens your email app. Your message stays on this device until you send it.</p></form>}<p className="copy-status" role="status">{status}</p>
    </Dialog.Content></Dialog.Portal></Dialog.Root>;
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);
