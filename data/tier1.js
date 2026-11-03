/* SHADOWPROOF — Tier 1: Human-targeted attacks */
window.SHADOWPROOF_MODULES = (window.SHADOWPROOF_MODULES || []).concat([
  {
    id: 'aitm',
    tier: 1,
    num: '01',
    icon: 'ghost',
    title: 'Ghost Session',
    subtitle: 'Adversary-in-the-Middle',
    desc: 'Attackers sit between you and a real login page, stealing the session after MFA. Learn the tells.',
    time: '10 min',
    risk: 'High',
    accent: '#57e6a1',
    objectives: [
      'Recognize a lookalike login page before you type',
      'Understand why MFA alone does not stop a proxy attack',
      'Respond correctly to an MFA prompt you did not trigger'
    ],
    scenes: [
      {
        type: 'brief',
        eyebrow: 'Tier 01 · Identity attacks',
        title: 'Your password won’t save you. *You can.*',
        lede: 'An adversary-in-the-middle attack does not crack your password or break your MFA. It quietly stands between you and the real login page, copies every keystroke, and steals your session in real time.',
        stats: [
          { label: 'Detection window', value: 'Under 10 min', note: 'Dwell time before first malicious action' },
          { label: 'MFA status', value: 'Bypassed', note: 'The proxy relays the real challenge' },
          { label: 'Your role', value: 'The target', note: 'No code required to fall for it' }
        ],
        note: 'This is a safe simulation. No credential you type is stored or sent anywhere.'
      },
      {
        type: 'story',
        label: 'Scene 01 · The bait',
        title: 'An urgent email lands in your inbox.',
        paragraphs: [
          'It is 9:47 on a Tuesday. An email from “Microsoft 365” says a shared document needs your review, and your manager’s name is on it. The subject line says **action required**.',
          'Four details give it away — but they are easy to miss when you are busy. The sender domain is `rnicrosoft-secure.com`: “rn” is doing the work of “m”. The message invents a 24-hour deadline. The button points at a lookalike domain. And the email certifies its own trust with a banner Microsoft never adds.',
          'The strongest habit is not spotting every clue. It is refusing to authenticate through a link you were sent.'
        ],
        callout: {
          tone: 'warn',
          title: 'The four tells',
          body: 'Lookalike sender · manufactured urgency · mismatched link · self-declared trust. Any two together are enough to stop.'
        },
        quote: 'If you feel rushed by a message, that is the moment to slow down.'
      },
      {
        type: 'flow',
        label: 'Scene 02 · Behind the curtain',
        title: 'How a session gets stolen.',
        lede: 'The attacker never breaks encryption. They simply sit in the middle and relay the conversation — including the MFA challenge — in both directions.',
        nodes: [
          { icon: 'mail', label: 'The bait', detail: 'A lookalike link moves you to an attacker-controlled proxy.' },
          { icon: 'browser', label: 'The mirror', detail: 'A pixel-perfect copy of Microsoft’s sign-in page loads. The URL is the only tell.' },
          { icon: 'arrowLeftRight', label: 'The relay', detail: 'Your username and password are forwarded to the real Microsoft login server.' },
          { icon: 'smartphone', label: 'The prompt', detail: 'Microsoft sends a genuine MFA push to your phone, because the login is real.' },
          { icon: 'cookie', label: 'The handoff', detail: 'You approve. Microsoft issues a session cookie. The proxy copies it before your browser receives it.' },
          { icon: 'ghost', label: 'The takeover', detail: 'The attacker imports the cookie and becomes you — no password, no MFA, for up to 14 days.' }
        ],
        caption: 'The padlock is not proof. HTTPS only means the connection is encrypted — not that the destination is honest.'
      },
      {
        type: 'sim',
        label: 'Scene 03 · The prompt',
        title: 'Your phone buzzes. You did not just try to sign in.',
        lede: 'You are in San Antonio. The prompt says Atlanta, Georgia. What do you do?',
        context: { kind: 'phone', name: 'Microsoft Authenticator', meta: 'Approve sign-in? · Atlanta, GA · 9:48 AM' },
        messages: [
          { from: 'system', text: 'Approve sign-in request?', time: 'now' },
          { from: 'them', text: 'Atlanta, GA, USA · IP 45.227.255.190', time: 'now' },
          { from: 'system', text: 'Enter the number shown on your sign-in screen: **73**', time: 'now' }
        ],
        choices: [
          { label: 'Approve — it must be Microsoft verifying me', verdict: 'bad', feedback: 'That real-looking prompt is the attack. Approving issues a genuine session cookie to the attacker’s proxy. Deny first; if you did not initiate a sign-in, it is never legitimate.' },
          { label: 'Deny, then report it and change my password from a known device', verdict: 'good', feedback: 'Correct. An unexpected prompt means someone else is trying to sign in as you. Deny, report, and change the password from a device you trust.' },
          { label: 'Ignore it and hope it stops', verdict: 'neutral', feedback: 'Ignoring is safer than approving, but it leaves the attack running. Deny the request, then tell IT so they can revoke active sessions.' }
        ],
        hint: 'Number matching exists to force you to read the screen. Read the location too.'
      },
      {
        type: 'rules',
        label: 'Scene 04 · The playbook',
        title: 'Six habits that break the proxy.',
        lede: 'You do not need to out-think the attacker. You need a short set of habits that survive a busy morning.',
        rules: [
          { title: 'Never sign in from an emailed link', body: 'Open a new tab and type the address, or use a saved bookmark. A proxy page cannot capture a credential you never give it.' },
          { title: 'Read the domain, not the design', body: 'Microsoft sign-in lives at `login.microsoftonline.com`. Watch for `rn` for `m`, `0` for `o`, `1` for `l`, and brand names buried in subdomains.' },
          { title: 'Treat an unexpected prompt as hostile', body: 'If you did not just start a sign-in, deny the push. Then report it. Someone has your password.' },
          { title: 'Prefer phishing-resistant MFA', body: 'Passkeys, FIDO2 keys, and Windows Hello are bound to the real domain. They refuse to authenticate to a copy. SMS and OTP codes can be relayed.' },
          { title: 'Use a password manager', body: 'It will not autofill on a lookalike domain. That silence is a free warning.' },
          { title: 'Report fast', body: 'If you think you approved a bad prompt, say so immediately. Revoking sessions kicks the attacker out — minutes matter.' }
        ]
      },
      {
        type: 'debrief',
        title: 'The session is the crown jewel.',
        lede: 'AiTM does not beat your security team. It beats the ten seconds between noticing something is wrong and doing something about it.',
        checklist: [
          { title: 'Hover or long-press before you click', body: 'The label can say anything. The destination is the truth.' },
          { title: 'Navigate to logins yourself', body: 'Type the address or use a bookmark. Never authenticate through a message.' },
          { title: 'Deny prompts you did not start', body: 'Then report. Then change the password from a known-good device.' },
          { title: 'Ask for session revocation', body: 'Changing a password does not always kill an active session. IT can revoke it.' }
        ],
        takeaway: 'A stolen session is a stolen identity. Speed of reporting is the biggest factor in limiting the damage.'
      }
    ],
    questions: [
      {
        question: 'What makes an AiTM (Adversary-in-the-Middle) attack especially dangerous?',
        options: [
          'It guesses your password through brute force',
          'It steals your active session even when MFA is enabled',
          'It only works against people with weak passwords',
          'It physically damages your device'
        ],
        correct: 1,
        explanation: 'AiTM proxies the real login in real time and captures your session cookie after you pass MFA — so multi-factor alone does not stop it.'
      },
      {
        question: 'You get an email with a link to “review a shared document.” What is the safest habit?',
        options: [
          'Click it if the sender name looks familiar',
          'Hover the link, and click if it looks close enough',
          'Never reach a login page from an emailed link — open a new tab and type the address or use a bookmark',
          'Reply and ask the sender if it is legitimate'
        ],
        correct: 2,
        explanation: 'The strongest defense is to never authenticate through a link you were sent. Navigate to the site yourself so a proxy page never gets your credentials.'
      },
      {
        question: 'Which detail exposes the sender “no-reply@rnicrosoft-secure.com”?',
        options: [
          'The word “secure” proves it is safe',
          '“rn” is used to imitate the letter “m” — it is not microsoft.com',
          '“no-reply” means it is automated and trustworthy',
          'Nothing — it is a normal Microsoft domain'
        ],
        correct: 1,
        explanation: '“rn” placed together mimics “m” at a glance. The real domain is microsoft.com. Lookalike domains are a core phishing tell.'
      },
      {
        question: 'The email warns the document “expires in 24 hours or data will be lost.” This is:',
        options: [
          'A helpful courtesy reminder',
          'Manufactured urgency designed to rush your judgment',
          'Standard Microsoft policy',
          'A sign the message is genuine'
        ],
        correct: 1,
        explanation: 'Artificial time pressure is engineered to make you act before you think. Feeling rushed by a message is exactly when to slow down.'
      }
    ]
  },

  {
    id: 'bec',
    tier: 1,
    num: '02',
    icon: 'briefcase',
    title: 'The CEO Text',
    subtitle: 'Business Email Compromise',
    desc: '“Are you at your desk? I need a favor.” How wire fraud and gift-card scams start with a familiar name.',
    time: '8 min',
    risk: 'High',
    accent: '#ffb566',
    objectives: [
      'Spot the off-channel opener used in most BEC attacks',
      'Verify money and banking requests out of band',
      'Recognize secrecy and urgency as manipulation tactics'
    ],
    scenes: [
      {
        type: 'brief',
        eyebrow: 'Tier 01 · Human-targeted attacks',
        title: 'A familiar name. *An unfamiliar number.*',
        lede: 'Business Email Compromise is not a technical attack. It is a social one — designed to make a helpful employee do a harmful thing before their better judgment catches up.',
        stats: [
          { label: 'Typical opener', value: '“New phone”', note: 'Explains why the number is unknown' },
          { label: 'Peak timing', value: 'Fri afternoon', note: 'When attention and IT coverage are low' },
          { label: 'Common ask', value: 'Gift cards / wire', note: 'Money that is hard to reverse' }
        ],
        note: 'The goal is not to make you paranoid. It is to make verification automatic.'
      },
      {
        type: 'story',
        label: 'Scene 01 · The opening',
        title: 'A text from an unknown number.',
        paragraphs: [
          'It is 4:47 on a Friday. Your phone lights up with a number you do not have saved. The sender says they are David Chen, your CEO, and that they got a new phone.',
          'Every part of the story is plausible. That is the point. The “new phone” line explains away the unknown number and gives the attacker a reason to ask for help without using a channel that leaves a record.',
          'Real executives do not need you to move money over personal text. Real business happens in systems that can be audited. The channel is often the tell.'
        ],
        callout: {
          tone: 'warn',
          title: 'The BEC skeleton',
          body: 'Off-channel contact → familiar authority → vague urgency → a request that is hard to reverse → a reason to keep it quiet.'
        },
        quote: 'Politeness is not a security control. Verify anyway.'
      },
      {
        type: 'sim',
        label: 'Scene 02 · The ask',
        title: '“I need a quick favor.”',
        lede: 'You reply. The request arrives: buy four $500 gift cards for a client, scratch the back, and text the codes. What is your move?',
        context: { kind: 'phone', name: '+1 (346) 555-0129', meta: 'Unknown number · Friday 4:52 PM' },
        messages: [
          { from: 'them', text: 'Thanks. I’m in a meeting and can’t talk. I need four $500 Apple gift cards for a client. Can you grab them and text me the codes?', time: '4:52 PM' },
          { from: 'them', text: 'Please keep this between us for now — it’s for a sensitive deal.', time: '4:53 PM' }
        ],
        choices: [
          { label: 'Buy the cards — it is the CEO and the request is urgent', verdict: 'bad', feedback: 'This is the exact pattern BEC is built on. Gift-card codes are cash: once you send them, the money is gone. Secrecy exists to stop you from checking with anyone who might catch it.' },
          { label: 'Call David on the number already in your contacts, or message him in Teams', verdict: 'good', feedback: 'Correct. Verify through a channel you already trust. In the real incident, David never sent the text — the number was a stranger.' },
          { label: 'Reply and ask him to confirm it is really him', verdict: 'bad', feedback: 'Asking the attacker to confirm they are the attacker does not work. The reply also confirms your number is active. Use an independent channel.' }
        ],
        hint: 'The right channel is one you chose before the message arrived.'
      },
      {
        type: 'story',
        label: 'Scene 03 · The higher-stakes version',
        title: 'The vendor who “moved.”',
        paragraphs: [
          'Gift cards are the small version. Invoice redirection is where companies lose six and seven figures at a time. It arrives quietly, looks routine, and asks for one small change.',
          'The email comes from `acme-corp.net` — but your records say `acme-corp.com`. It references a real invoice number, uses the vendor’s real signature, and asks you to update banking details before “closing the books” on a Friday afternoon.',
          'One phone call to a number you already had would catch it. That call is the single most valuable habit in accounts payable.'
        ],
        callout: {
          tone: 'info',
          title: 'Run the three checks',
          body: 'Domain matches the vendor record? The request is a banking change? The timing is pressing you to skip verification? Any yes on the last two means call.'
        }
      },
      {
        type: 'rules',
        label: 'Scene 04 · Your playbook',
        title: 'Five habits that stop BEC.',
        lede: 'No tool solves BEC completely. A small set of habits does.',
        rules: [
          { title: 'Verify the person, not the message', body: 'For money, credentials, banking changes, or gift cards, call the number you already have on file or message them in Teams. Never the number in the email.' },
          { title: 'Treat unusual channels as hostile', body: 'Your CEO does not need to text from a new number. Your CFO does not request wire changes on WhatsApp. A vendor does not switch banks through a stranger’s Gmail.' },
          { title: 'Read the domain like you are paid to', body: '`acme-corp.net` is not `acme-corp.com`. Watch for extra letters, swapped TLDs, and brand names in subdomains.' },
          { title: 'Name the pressure', body: '“Before the client leaves,” “closing the books,” “I’m in a meeting.” Say it out loud. Pressure is the tool; noticing it removes its power.' },
          { title: 'Report every suspicious message', body: 'When one employee gets a BEC message, dozens often do. Your report protects the person who might say yes.' }
        ]
      },
      {
        type: 'debrief',
        title: 'Helpfulness is the target.',
        lede: 'BEC attackers do not need to hack anything. They need a good employee who wants to be responsive.',
        checklist: [
          { title: 'Slow the money down', body: 'Any request involving payment, banking details, or gift cards gets an out-of-band verification. No exceptions.' },
          { title: 'Never trust caller ID or a display name', body: 'Both are trivially spoofed. Identity is confirmed by a channel you control.' },
          { title: 'Escalate secrecy', body: '“Keep this between us” is a manipulation tactic. Tell a manager or security.' },
          { title: 'Report even if you did not fall', body: 'The next target may be less suspicious than you.' }
        ],
        takeaway: 'The most expensive words in business are “I didn’t want to bother anyone.”'
      }
    ],
    questions: [
      {
        question: 'A text from an unknown number says: “It’s David, your CEO — new phone. Need a quick favor.” The best first move is to:',
        options: [
          'Reply and ask what he needs',
          'Verify through a known channel (Teams, Slack, or his known desk line) before doing anything',
          'Buy the gift cards to be safe',
          'Delete it and tell no one'
        ],
        correct: 1,
        explanation: 'Verifying through a channel you already trust is the single most effective defense against BEC. The “new phone” line is the most common opener.'
      },
      {
        question: 'Which request pattern should be treated as hostile until proven otherwise?',
        options: [
          'A request to join a meeting',
          'A request involving gift cards, wire transfers, or changed banking details',
          'A request to review a shared calendar',
          'A request to update your email signature'
        ],
        correct: 1,
        explanation: 'Gift cards, wires, crypto, and banking-detail changes are the money-movement patterns at the heart of BEC. They warrant out-of-band verification every time.'
      },
      {
        question: 'A vendor emails from “acme-corp.net” asking to update their bank details — but your records show acme-corp.com. You should:',
        options: [
          'Update it since the invoice number matches',
          'Call the vendor on a number you already have on file to confirm',
          'Reply to the email asking if they are sure',
          'Update it, but only for small amounts'
        ],
        correct: 1,
        explanation: 'The .net vs .com swap is a lookalike domain. Any banking change must be confirmed by calling a number you already trust — never one from the email.'
      },
      {
        question: '“Keep this between us for now” in a payment message is a red flag because:',
        options: [
          'It signals the request is confidential and important',
          'Isolation is a tactic — real executives don’t ask you to hide business transactions',
          'It means a reward is coming',
          'It is a normal part of finance work'
        ],
        correct: 1,
        explanation: 'Secrecy requests exist to stop you from verifying with someone who might catch the scam. Legitimate business does not need to be hidden.'
      }
    ]
  },

  {
    id: 'smishing',
    tier: 1,
    num: '03',
    icon: 'smartphone',
    title: 'Silent Signal',
    subtitle: 'SMS Phishing',
    desc: 'That “delivery failed” text is not from UPS. Learn the format of messages built to steal credentials.',
    time: '7 min',
    risk: 'Medium',
    accent: '#6fb7ff',
    objectives: [
      'Inspect a text message for domain, urgency, and identity tells',
      'Separate a legitimate alert from a smishing attempt',
      'Report and block without engaging the sender'
    ],
    scenes: [
      {
        type: 'brief',
        eyebrow: 'Tier 01 · Human-targeted attacks',
        title: 'The text you almost *believed.*',
        lede: 'SMS arrives on the device you trust most, in the format you scan fastest, at the moments you are least prepared. Ten messages. A few minutes. The patterns repeat.',
        stats: [
          { label: 'Best channel', value: 'Your phone', note: 'Fewer security filters than email' },
          { label: 'Most common hook', value: 'Delivery / bank', note: 'Everyday errands, everyday trust' },
          { label: 'Defense time', value: '3 seconds', note: 'Read the link preview before tapping' }
        ],
        note: 'The goal is pattern recognition, not memorizing a list of scams.'
      },
      {
        type: 'classify',
        label: 'Scene 01 · Field exercise',
        title: 'Sort your inbox.',
        lede: 'Eight messages from a typical week. Some are legitimate. Most are not. Inspect each one, then decide. There is no penalty for guessing — the explanation is the point.',
        items: [
          { from: 'USPS', meta: 'Mon 8:42 AM', text: 'USPS: Your package is held due to incomplete address. Please update within 24h to avoid return: usps-parcelupdate.co/verify', verdict: 'scam', reason: 'USPS does not text about held packages, and `usps-parcelupdate.co` is a lookalike. Real USPS uses usps.com and your account portal.' },
          { from: 'Wells Fargo', meta: 'Mon 10:15 AM', text: 'FRM-WELLSFARGO: Suspicious transaction $487.20 at BEST BUY. Reply Y to approve, N to decline, or call 1-855-555-2020.', verdict: 'legit', reason: 'Plausibly legitimate — banks do send fraud alerts. Verify by calling the number on the back of your card, never the number in the text.' },
          { from: '+1 (267) 555-0184', meta: 'Tue 3:22 PM', text: 'Hi! I am Emma from your local IRS office. There is a lien on your name for unpaid taxes. Call immediately to avoid arrest: bit.ly/irs-case-8847', verdict: 'scam', reason: 'The IRS does not text, and never threatens arrest by text. Authority + urgency + shortened link is a textbook smish.' },
          { from: 'AMAZON', meta: 'Wed 6:01 AM', text: 'Amazon: Someone is trying to sign in to your account from Moscow, RU. If not you, secure account: amaz0n-verify.help/login', verdict: 'scam', reason: '`amaz0n-verify.help` swaps a zero for the letter “o”. Fear, urgency, and a typo domain. Open the real Amazon app instead.' },
          { from: 'Dr. Chen Office', meta: 'Wed 2:30 PM', text: 'Reminder: Your appointment with Dr. Chen is tomorrow at 3:30 PM. Reply C to confirm, R to reschedule.', verdict: 'legit', reason: 'Specific context, no link, no request for sensitive information. Legitimate texts often feel unremarkable — that is the point.' },
          { from: '32665', meta: 'Thu 11:45 AM', text: 'AT&T: Your bill is 6 days overdue. Service will suspend today. Pay now to avoid disconnection: att-billing-secure.net/pay', verdict: 'scam', reason: 'Real AT&T uses att.com. Same-day suspension is manufactured emergency. Check the bill in the real app.' },
          { from: 'Aunt Karen', meta: 'Fri 8:19 PM', text: 'Honey it’s me, I got a new phone! Can you save this number? Also, quick — can you help me with an Apple gift card real quick? I’m in a bind, will explain later.', verdict: 'scam', reason: 'Unknown number + known name + gift card. Call the old number. This exact wording targets family members.' },
          { from: '(210) 555-0193', meta: 'Sat 9:00 AM', text: 'Hey it’s Jason from work. Quick Q — do you still have the parking pass info? Trying to renew mine. Text me back when you get a sec.', verdict: 'legit', reason: 'No link, no urgency, no sensitive request. Still verify an unknown number through your normal channel before sharing anything work-related.' }
        ]
      },
      {
        type: 'flow',
        label: 'Scene 02 · The mechanism',
        title: 'Why a text feels safer than an email.',
        lede: 'The attack works because the channel is intimate and the ask is ordinary. Follow the path from a fake alert to a stolen account.',
        nodes: [
          { icon: 'smartphone', label: 'A believable hook', detail: 'A package, a bank alert, a toll charge, a family member in trouble.' },
          { icon: 'link', label: 'A short link', detail: 'Shorteners and lookalike domains hide the destination.' },
          { icon: 'browser', label: 'A familiar login', detail: 'The page copies a brand you already trust.' },
          { icon: 'key', label: 'Credentials', detail: 'You type a password, or approve an MFA prompt you did not start.' },
          { icon: 'ghost', label: 'Account takeover', detail: 'The attacker has a working session and moves to contacts, banking, and other accounts.' }
        ],
        caption: 'Never tap a link to “verify” an account. Open the app or type the address yourself.'
      },
      {
        type: 'rules',
        label: 'Scene 03 · The signals',
        title: 'The seven signals in every smish.',
        lede: 'If you spot two, treat the message as hostile. If you spot three, screenshot it, report it, and delete it.',
        rules: [
          { title: 'Shortened or odd domains', body: '`bit.ly` links and domains like `ups-track-9847.co` hide the real destination. Real companies use their own domain.' },
          { title: 'Impersonal openings', body: '“Dear customer,” “Hello user,” or no greeting at all. Real companies you have a relationship with usually know your name.' },
          { title: 'Urgency about money or delivery', body: '“Package held,” “account closing,” “payment failed.” The urgency exists to stop you verifying.' },
          { title: 'Requests for personal data', body: 'No legitimate business asks for your SSN, password, or full card number over SMS. Ever.' },
          { title: 'A link where an app should be', body: 'Banks and delivery companies want you in their app, not on a link from a text.' },
          { title: 'A sender you cannot reply to', body: 'Short codes and spoofed numbers are one-way by design. Legitimate services give you a real support path.' },
          { title: 'A feeling of “just do it”', body: 'That impulse is the attack. Stop, open the official app, and check there.' }
        ]
      },
      {
        type: 'debrief',
        title: 'Three seconds is the whole defense.',
        lede: 'Read the link preview. Do not tap. Open the real app. Report the message.',
        checklist: [
          { title: 'Do not reply, even to “STOP”', body: 'A reply confirms your number is active. Report instead.' },
          { title: 'Forward scams to 7726 (SPAM)', body: 'Your carrier can block the sender network-wide. Then delete and block.' },
          { title: 'Use the app, not the link', body: 'If a message claims to be your bank, open your banking app and check there.' }
        ],
        takeaway: 'Legitimate messages rarely need you to act in the next sixty seconds. Urgency is the tell.'
      }
    ],
    questions: [
      {
        question: 'A text claims to be USPS about a “held package,” linking to usps-parcelupdate.co/verify. The clearest red flag is:',
        options: [
          'USPS never sends any texts',
          'The domain is not usps.com — it is a lookalike using a .co suffix',
          'Packages are never actually held',
          'The message is too short'
        ],
        correct: 1,
        explanation: 'Real USPS uses usps.com. Lookalike domains with odd suffixes (.co, -secure, extra words) are the hallmark of smishing.'
      },
      {
        question: 'Which agency will legitimately text you demanding immediate payment to avoid arrest?',
        options: ['The IRS', 'The SSA', 'The DMV', 'None — agencies do not text arrest threats'],
        correct: 3,
        explanation: 'The IRS, SSA, and DMV do not text threats or arrest warnings. Authority-based urgency about arrest or warrants is always a scam.'
      },
      {
        question: 'The best way to report a smishing text and help block the sender is to:',
        options: [
          'Reply “STOP”',
          'Forward it to 7726 (SPAM), then delete and block',
          'Click the link to see where it leads',
          'Call the number back'
        ],
        correct: 1,
        explanation: 'Forwarding to 7726 lets your carrier block the sender network-wide. Replying “STOP” only confirms your number is active.'
      },
      {
        question: 'A text feels professional, has no link, and references your real appointment. This is:',
        options: [
          'Definitely a scam — every text is',
          'Possibly legitimate — but still verify before sharing anything sensitive',
          'Safe to reply to with your password',
          'A reason to send personal details'
        ],
        correct: 1,
        explanation: 'Not every text is a scam; legit messages feel unremarkable. The rule holds: never share sensitive info by text, and verify anything that asks for it.'
      }
    ]
  },

  {
    id: 'quishing',
    tier: 1,
    num: '04',
    icon: 'qr',
    title: 'The Painted Door',
    subtitle: 'QR Code Phishing',
    desc: 'QR codes bypass email filters and hide their destination. Learn where they hide and how to check them safely.',
    time: '7 min',
    risk: 'Medium',
    accent: '#c9a7ff',
    objectives: [
      'Read the URL preview before opening a QR code',
      'Spot physical QR code tampering',
      'Refuse QR-based logins sent by email or chat'
    ],
    scenes: [
      {
        type: 'brief',
        eyebrow: 'Tier 01 · Human-targeted attacks',
        title: 'A square you scan. *A destination you cannot see.*',
        lede: 'A QR code is a door with no address label. Your phone reads it and takes you wherever it says, instantly. Attackers have learned to hide their doors in the places you trust.',
        stats: [
          { label: 'The tell', value: 'URL preview', note: 'Your camera shows it before you tap' },
          { label: 'Favorite hiding spot', value: 'Public stickers', note: 'Pasted over the real code' },
          { label: 'Worst context', value: 'Email', note: 'Moves you off monitored devices' }
        ],
        note: 'You do not need to stop scanning. You need a two-second habit.'
      },
      {
        type: 'gallery',
        label: 'Scene 01 · Where they hide',
        title: 'Six places you have already scanned.',
        lede: 'Tap each scenario to see the attack pattern and what to look for. These are the six most common places corporate users meet a malicious QR code.',
        items: [
          {
            tag: 'Everyday exposure',
            title: 'The restaurant menu',
            body: 'Attackers walk into a café and stick a fake code over the real one. You get a menu; they get your card number from a “digital tipping” page.',
            signs: ['Fresh, curled, or misaligned sticker', 'Payment requested before the menu', 'Domain does not match the restaurant', '“Download our app” to view the menu']
          },
          {
            tag: 'Public utility',
            title: 'The parking meter',
            body: 'Fake stickers on meters and chargers lead to convincing payment pages. You pay the attacker, and your car still gets a ticket.',
            signs: ['Sticker layered over another sticker', 'Payment page not on the city or vendor domain', 'No real vendor branding or help links', 'Generic “quick-pay” URL']
          },
          {
            tag: 'Corporate account',
            title: 'The MFA email',
            body: '“IT Security” asks you to re-enroll MFA by scanning a code. Email filters cannot read inside a QR code, and scanning moves you to your personal phone.',
            signs: ['Any QR code in an email asking you to sign in', 'Sender domain not your IT team', 'Urgency: “by end of day”', 'A QR code instead of a normal link']
          },
          {
            tag: 'Finance target',
            title: 'The invoice PDF',
            body: 'A real-looking invoice includes “Scan to pay.” The code leads to a fake payment page or a credential harvester dressed as your accounting system.',
            signs: ['A QR “quick pay” option you did not request', 'Sender domain mismatch', 'Invoice outside the normal AP workflow', 'Preview domain unrelated to the vendor']
          },
          {
            tag: 'Physical distribution',
            title: 'The windshield flyer',
            body: 'A fake citation or prize on your car. Fear or greed does the work; the code leads to a credential harvester or card scam.',
            signs: ['A threat, fine, or reward in the flyer', 'Poor print quality or generic branding', 'No matching official notice', 'Unknown destination domain']
          },
          {
            tag: 'Corporate event',
            title: 'The conference badge',
            body: 'Fake badges and “free swag” flyers target the networking context. You are friendly, distracted, and used to scanning things at events.',
            signs: ['A code asking for corporate email or login', '“Free download” of a whitepaper via QR', 'A stranger asking you to scan for a raffle', 'Domain unrelated to the conference']
          }
        ]
      },
      {
        type: 'flow',
        label: 'Scene 02 · The mechanism',
        title: 'One tap, three consequences.',
        lede: 'A QR code is just a URL in a costume. Follow what happens after the camera reads it.',
        nodes: [
          { icon: 'qr', label: 'The square', detail: 'Printed, pasted, or emailed. It can encode any URL.' },
          { icon: 'smartphone', label: 'The scan', detail: 'Your phone decodes it and shows a preview — if you look.' },
          { icon: 'browser', label: 'The landing page', detail: 'A clone of a brand you trust, built to collect a login or a card.' },
          { icon: 'key', label: 'The capture', detail: 'Credentials, card details, or an MFA approval leave your device.' },
          { icon: 'ghost', label: 'The loss', detail: 'Account takeover, fraudulent charges, or a corporate breach.' }
        ],
        caption: 'The preview is the only warning you get. Read the domain before you tap.'
      },
      {
        type: 'rules',
        label: 'Scene 03 · The playbook',
        title: 'Seven habits for safe scanning.',
        lede: 'You do not need to stop scanning. You need a two-second habit that catches the malicious ones.',
        rules: [
          { title: 'Preview before you tap', body: 'Every modern camera shows the URL before opening. If the domain does not match the context, do not proceed.' },
          { title: 'Suspect stickers on public codes', body: 'Fresh, curled, or layered stickers on meters, menus, and gym equipment are a top tampering tactic.' },
          { title: 'Never scan a code from email or chat', body: 'QR codes in messages exist to move you off monitored devices. Go to the real system on your computer instead.' },
          { title: 'If it asks for a login, close it', body: 'A QR code leading to a Microsoft or Google sign-in is almost always a credential harvester.' },
          { title: 'Watch for shortened URLs', body: '`bit.ly` and random domains hide the destination. Real businesses use their real domain.' },
          { title: 'Do not scan codes you did not come to scan', body: 'A code taped to a bathroom wall or placed on your windshield relies on curiosity and boredom.' },
          { title: 'Report the weird ones', body: 'Tell IT and venue staff. You may be the first to notice, and the next person may not be as careful.' }
        ]
      },
      {
        type: 'debrief',
        title: 'The phone will not protect you.',
        lede: 'It will open whatever the square says. The judgment has to come from you.',
        checklist: [
          { title: 'Read the destination, not the logo', body: 'A logo is trivially copied. The domain is the truth.' },
          { title: 'Use the app instead', body: 'For payments, menus, and accounts, open the official app rather than a scanned link.' },
          { title: 'Check the physical code', body: 'If it looks added-on, peel it up or ask staff. Do not scan it.' },
          { title: 'Treat QR logins as hostile', body: 'Real authentication happens in your browser or app, not through a square in a message.' }
        ],
        takeaway: 'A QR code is a link you cannot read. Treat it like one.'
      }
    ],
    questions: [
      {
        question: 'The single most important habit when scanning any QR code is to:',
        options: [
          'Scan it quickly before it expires',
          'Read the URL preview your phone shows before you tap to open it',
          'Trust it if a company logo is next to it',
          'Only scan codes printed in color'
        ],
        correct: 1,
        explanation: 'Every modern phone shows a URL preview after scanning. Reading it before you tap is the whole defense — two seconds that catch most malicious codes.'
      },
      {
        question: 'A QR code on a parking meter looks like a sticker placed over another sticker. You should:',
        options: [
          'Scan it — stickers are normal',
          'Treat it as hostile; attackers paste fake QR stickers over real ones',
          'Peel it and immediately scan what is underneath',
          'Scan it but enter only a small payment'
        ],
        correct: 1,
        explanation: 'Layered or fresh-looking stickers on public codes are a top quishing tactic. If it looks added-on, do not scan it.'
      },
      {
        question: 'An email from “IT” has a QR code to scan to “re-enroll your MFA.” The right move is:',
        options: [
          'Scan it with your phone right away',
          'Do not scan; use the real system on your computer or contact IT directly',
          'Forward it to your team so they can scan it too',
          'Scan it only if your name appears in it'
        ],
        correct: 1,
        explanation: 'QR codes in email exist to move you off your monitored computer onto your phone. Real MFA changes happen through official channels, not an emailed code.'
      },
      {
        question: 'A scanned QR code opens a page that looks like a Microsoft sign-in. You should:',
        options: [
          'Enter your credentials — it looks official',
          'Close it; open the app or type the URL yourself — logins should not come from scanning a square',
          'Enter a fake password to test it',
          'Screenshot it and sign in later'
        ],
        correct: 1,
        explanation: 'A QR leading to a login page is almost always a credential harvester. Real sign-ins happen through your own browser or app.'
      }
    ]
  },

  {
    id: 'ransomware',
    tier: 1,
    num: '05',
    icon: 'lock',
    title: 'The Locked Door',
    subtitle: 'Ransomware & Attachments',
    desc: 'One click on an “invoice” can encrypt everything. Learn which attachments to fear and what to do first.',
    time: '9 min',
    risk: 'High',
    accent: '#ff7a8a',
    objectives: [
      'Recognize dangerous attachment types and double extensions',
      'Understand how a single click becomes company-wide encryption',
      'Know the first three actions during a suspected infection'
    ],
    scenes: [
      {
        type: 'brief',
        eyebrow: 'Tier 01 · Human-targeted attacks',
        title: 'One click. *Every file locked.*',
        lede: 'Ransomware does not need a sophisticated exploit. It needs one person to open the right attachment on the right network. The rest is automation.',
        stats: [
          { label: 'Initial access', value: 'Attachment', note: 'Often a fake invoice or resume' },
          { label: 'Encryption', value: 'Minutes', note: 'Modern variants move fast' },
          { label: 'Best recovery', value: 'Backups', note: 'Offline and tested, not just present' }
        ],
        note: 'The most important decision is the one you make before you click.'
      },
      {
        type: 'story',
        label: 'Scene 01 · The delivery',
        title: 'The invoice that was not an invoice.',
        paragraphs: [
          'A vendor you have worked with sends “Invoice_INV-8841.zip.” The email references a real project, uses the vendor’s logo, and says the PDF is inside because “our portal is down.”',
          'The zip contains a JavaScript file with a PDF icon. Opening it runs code, downloads a payload, and starts encrypting files in the background while you see a harmless-looking document.',
          'The double extension, the archive, and the “portal is down” story are the tells. Legitimate invoices do not need you to run code.'
        ],
        callout: {
          tone: 'warn',
          title: 'Three attachment rules',
          body: 'Never enable macros for a document you did not expect. Never open executables or scripts from email. A zip is a wrapper — look inside before you open anything.'
        }
      },
      {
        type: 'flow',
        label: 'Scene 02 · The mechanism',
        title: 'From attachment to encrypted network.',
        lede: 'Ransomware is a business process: gain access, escalate, spread, encrypt, demand. You only see the last step.',
        nodes: [
          { icon: 'mail', label: 'Delivery', detail: 'A fake invoice, resume, or shipping notice with an archive attached.' },
          { icon: 'cursor', label: 'Execution', detail: 'A script or macro runs. The user sees a decoy document.' },
          { icon: 'network', label: 'Spread', detail: 'The payload finds shared drives, backups, and credentials on the network.' },
          { icon: 'lock', label: 'Encryption', detail: 'Files are locked and renamed. A ransom note appears on the desktop.' },
          { icon: 'siren', label: 'Demand', body: '', detail: 'Payment is demanded in crypto, with a countdown and a threat to leak data.' }
        ],
        caption: 'Paying does not guarantee recovery. It funds the next attack and may be illegal in some jurisdictions.'
      },
      {
        type: 'sim',
        label: 'Scene 03 · The decision',
        title: 'The attachment is already open.',
        lede: 'Files on your desktop start changing names. A text file called “READ_ME” appears. What do you do first?',
        context: { kind: 'desktop', name: 'This PC', meta: '3 files just changed extension · READ_ME.txt appeared' },
        messages: [
          { from: 'system', text: 'README.txt — “Your files are encrypted. Contact us within 72 hours.”', time: 'now' },
          { from: 'system', text: 'Shared drive: 1,284 files changed in the last minute.', time: 'now' }
        ],
        choices: [
          { label: 'Disconnect from the network, then call IT/Security immediately', verdict: 'good', feedback: 'Correct. Cutting the connection limits spread; calling security starts containment, isolation, and recovery. Do not power off unless told to — memory can hold useful evidence.' },
          { label: 'Pay the ransom quickly to get the files back', verdict: 'bad', feedback: 'Payment funds crime, often does not restore everything, and may violate policy or law. Restore from backups and involve incident response.' },
          { label: 'Restart the computer and try to open the files again', verdict: 'bad', feedback: 'A restart can complete encryption or destroy volatile evidence. Disconnect and report instead.' }
        ],
        hint: 'Speed matters, but the first action is containment — not recovery.'
      },
      {
        type: 'rules',
        label: 'Scene 04 · The playbook',
        title: 'Before, during, and after.',
        lede: 'Ransomware defense is mostly boring preparation. The exciting part is what you do in the first ten minutes.',
        rules: [
          { title: 'Treat unexpected attachments as hostile', body: 'Invoices, resumes, and shipping notices are the most common bait. Verify with the sender through another channel.' },
          { title: 'Look at the real extension', body: '`invoice.pdf.js`, `invoice.pdf.exe`, and `.zip` archives are the danger signs. Windows may hide extensions — turn them on.' },
          { title: 'Never enable macros for an unexpected document', body: '“Enable content” is a code-execution prompt wearing a helpful hat.' },
          { title: 'Keep offline backups', body: 'A backup that is reachable from your network can be encrypted too. Test restores, not just backups.' },
          { title: 'Disconnect first, report second', body: 'Pull the network cable or turn off Wi-Fi, then call security. Do not pay, do not restart, do not delete the note.' },
          { title: 'Patch and segment', body: 'Most ransomware spreads through unpatched systems and flat networks. Both are infrastructure decisions — raise them.' }
        ]
      },
      {
        type: 'debrief',
        title: 'The click is the easy part to prevent.',
        lede: 'You cannot out-run encryption. You can avoid the attachment that starts it, and you can contain it fast.',
        checklist: [
          { title: 'Verify unexpected invoices', body: 'Call the vendor on a known number. Do not use the reply button.' },
          { title: 'Turn on file extensions', body: 'A PDF icon means nothing if the real name ends in `.js` or `.exe`.' },
          { title: 'Know your first call', body: 'Security, not a colleague, not a search engine. Save the number offline.' },
          { title: 'Do not pay', body: 'Recovery comes from backups and incident response, not from the attacker’s promise.' }
        ],
        takeaway: 'Ransomware is loud at the end and quiet at the beginning. The quiet part is your chance.'
      }
    ],
    questions: [
      {
        question: 'The most reliable defense against ransomware is:',
        options: [
          'Paying the ransom quickly',
          'Offline, tested backups and fast containment',
          'Antivirus software alone',
          'Renaming important files'
        ],
        correct: 1,
        explanation: 'Backups that are isolated from the network and actually tested are the only reliable recovery path. Antivirus helps but does not stop every variant.'
      },
      {
        question: 'An email includes “Invoice_INV-8841.zip” containing a .js file. You should:',
        options: [
          'Open it — the invoice number looks real',
          'Do not open it; verify the sender through a known channel and report it',
          'Run it in a virtual machine to see what it does',
          'Reply asking for a PDF instead'
        ],
        correct: 1,
        explanation: 'A script inside an archive is a classic ransomware delivery. Verify with the vendor using a number you already trust, then report.'
      },
      {
        question: 'You suspect your machine is being encrypted. The first action is to:',
        options: [
          'Restart the computer',
          'Disconnect from the network and call IT/Security',
          'Pay the ransom',
          'Delete the ransom note'
        ],
        correct: 1,
        explanation: 'Disconnecting limits spread. Security can isolate the device, preserve evidence, and start recovery. A restart may make things worse.'
      },
      {
        question: 'Why is paying a ransom a bad strategy?',
        options: [
          'It always costs more than the files are worth',
          'It funds crime, may be illegal, and does not guarantee recovery',
          'It is always tracked by police',
          'It voids your warranty'
        ],
        correct: 1,
        explanation: 'Payment funds criminal operations, can violate sanctions or policy, and many victims still do not recover all data. Backups and incident response are the real path.'
      }
    ]
  }
]);
