/* SHADOWPROOF — Tier 2: Identity & access attacks */
window.SHADOWPROOF_MODULES = (window.SHADOWPROOF_MODULES || []).concat([
  {
    id: 'vishing',
    tier: 2,
    num: '06',
    icon: 'phone',
    title: 'The Voice on the Line',
    subtitle: 'Vishing & Deepfake Calls',
    desc: 'Someone from “IT” calls you by name. They sound convincing. Learn why voice is the weakest channel.',
    time: '8 min',
    risk: 'High',
    accent: '#ffc36b',
    objectives: [
      'Identify the five tells in a vishing call',
      'Refuse to read MFA codes aloud — ever',
      'Hang up and call back on a number you look up yourself'
    ],
    scenes: [
      {
        type: 'brief',
        eyebrow: 'Tier 02 · Identity & access',
        title: 'The oldest attack. *A newer phone.*',
        lede: 'Vishing is phishing over the phone. It works because voice is the channel your brain trusts most. This module teaches you to distrust it — precisely, and only where it matters.',
        stats: [
          { label: 'Trusted channel', value: 'Voice', note: 'Hardwired to feel real' },
          { label: 'Most abused line', value: '“IT support”', note: 'Authority plus urgency' },
          { label: 'One rule', value: 'Hang up', note: 'Then call back on a known number' }
        ],
        note: 'You are allowed to be rude to a caller who is trying to rob you.'
      },
      {
        type: 'transcript',
        label: 'Scene 01 · The call',
        title: 'The script they use on you.',
        lede: 'A real vishing call, reconstructed from incidents. Read each line, then tap the tell markers to see what the attacker is doing.',
        lines: [
          { speaker: 'Caller', text: 'Hi, is this Alex? Alex Chen from Accounts Receivable?', tell: 'They already know your name and department — from LinkedIn, the company site, or a breach. Familiarity is not authentication.' },
          { speaker: 'You', text: 'Yes, this is Alex.' },
          { speaker: 'Caller', text: 'Great — this is Marcus with the Microsoft security team. We are seeing unusual sign-in activity on your account.', tell: 'Impersonating a trusted vendor. Real Microsoft security does not cold-call you about your account.' },
          { speaker: 'You', text: 'Oh — is something wrong?' },
          { speaker: 'Caller', text: 'Nothing to panic about, but we saw a sign-in attempt from Bulgaria this morning. We want to confirm it was not you before we lock the account.', tell: 'Manufactured urgency plus a geographic threat. It puts you on the defensive and makes you want to cooperate.' },
          { speaker: 'Caller', text: 'I am sending a verification code to your phone right now. When it arrives, read me the six digits so we can reject the Bulgarian sign-in.', tell: 'This is the moment. They triggered a real MFA prompt from a login they are attempting on your account.' },
          { speaker: 'You', text: 'Okay… I just got a text. It says 847293.' },
          { speaker: 'Caller', text: 'Thank you Alex, we have secured your account. Have a great afternoon.', tell: 'They just used your code to finish a real sign-in. They are now in your mailbox, moving fast.' }
        ],
        caption: 'The voice is calm. The story makes sense. The request seems small. That is the entire attack.'
      },
      {
        type: 'rules',
        label: 'Scene 02 · The five tells',
        title: 'Five signals in every vishing call.',
        lede: 'The disguise changes. The skeleton does not.',
        rules: [
          { title: 'They contacted you first', body: 'Real IT, banks, and vendors do not call you out of the blue to “verify” your account. They use documented channels and cases you can look up.' },
          { title: 'They create urgency or fear', body: 'A sign-in from another country, a fraud alert, a suspended account. The emotion is the point.' },
          { title: 'They want a code, password, or remote access', body: 'No legitimate support agent needs your MFA code, your password, or an unattended remote session. Ever.' },
          { title: 'They keep you on the line', body: '“Stay with me,” “don’t hang up,” “I’ll transfer you.” The goal is to stop you from verifying independently.' },
          { title: 'They already know your details', body: 'Name, title, manager, extension. That information is public or breached. It is not proof of identity.' }
        ]
      },
      {
        type: 'sim',
        label: 'Scene 03 · The callback',
        title: 'You hang up. Now what?',
        lede: 'The caller sounded exactly like your IT desk. You are not sure. What is the safest next step?',
        context: { kind: 'phone', name: 'Unknown caller', meta: 'Inbound · 6 min 22 sec · “IT Support”' },
        messages: [
          { from: 'them', text: 'Please don’t hang up — I just need one code and we’re done.', time: '14:52' }
        ],
        choices: [
          { label: 'Call the IT number from the company directory and ask if they called', verdict: 'good', feedback: 'Correct. Hang up and call back on a number you look up yourself. A scammer cannot receive that call, and real IT will not mind verifying.' },
          { label: 'Read the code — they already know everything else', verdict: 'bad', feedback: 'The code is the account. Reading it aloud completes the attacker’s sign-in. Knowing your name proves nothing.' },
          { label: 'Keep them talking while you search for the number', verdict: 'neutral', feedback: 'Better than cooperating, but staying on the line lets them keep pressure on you. Hang up first, then verify.' }
        ],
        hint: 'The callback path is the defense. Use a number you already trust.'
      },
      {
        type: 'debrief',
        title: 'Voice is not identity.',
        lede: 'A familiar voice, a calm tone, and a plausible story can all be manufactured. Verification cannot.',
        checklist: [
          { title: 'Hang up first', body: 'You do not owe a stranger your time. End the call and breathe.' },
          { title: 'Call back on a known number', body: 'Use the directory, the back of your card, or the vendor’s official site — never the number they gave you.' },
          { title: 'Never read a code aloud', body: 'Not to IT, not to your bank, not to your boss. Codes are for you to type, not to share.' },
          { title: 'Report the call', body: 'If one employee gets a vishing call, others will too. Your report is early warning.' }
        ],
        takeaway: 'Trust the identity you verified, not the voice you heard.'
      }
    ],
    questions: [
      {
        question: 'The most reliable defense against a suspicious “support” call is to:',
        options: [
          'Ask the caller to prove their identity over the phone',
          'Hang up and call back on the official number you look up yourself',
          'Stay on the line and cooperate to be polite',
          'Give partial info to test them'
        ],
        correct: 1,
        explanation: 'Hanging up and calling the real number yourself defeats nearly every vishing call. A scammer’s callback path won’t reach the real organization.'
      },
      {
        question: 'A caller claiming to be “Microsoft security” asks you to read back the 6-digit code just texted to you. You should:',
        options: [
          'Read it — they need it to secure your account',
          'Never share it; a code read aloud lets them log in as you',
          'Read only the first three digits',
          'Ask them to text you first'
        ],
        correct: 1,
        explanation: 'MFA codes are never shared aloud with anyone. If someone asks you to read a code, they are attacking your account — every time.'
      },
      {
        question: 'A caller already knows your name, title, and department. This means:',
        options: [
          'They must be legitimate — only real staff would know that',
          'Nothing about legitimacy; that info is easily found on LinkedIn, company sites, or breaches',
          'You can safely share your password',
          'They must work in your building'
        ],
        correct: 1,
        explanation: 'Familiarity is not authentication. Personal details are trivially available and are used to manufacture false trust.'
      },
      {
        question: 'Your “CEO” leaves a voicemail urgently asking you to move money — and the voice sounds exactly right. You should:',
        options: [
          'Act immediately because it sounds like them',
          'Verify on a separate known channel or ask something only the real person would know — voice cloning is real',
          'Reply to the voicemail with a transfer confirmation',
          'Forward the voicemail to accounting to handle'
        ],
        correct: 1,
        explanation: 'AI voice cloning needs only seconds of audio. Trust the verified identity, not the sound — confirm through a channel you already trust.'
      }
    ]
  },

  {
    id: 'mfa-fatigue',
    tier: 2,
    num: '07',
    icon: 'bell',
    title: 'Endless Knocking',
    subtitle: 'MFA Fatigue / Push Bombing',
    desc: 'Your phone will not stop buzzing with approval prompts. Learn why “just tap approve” is a trap.',
    time: '6 min',
    risk: 'High',
    accent: '#ff9a76',
    objectives: [
      'Recognize push bombing and MFA fatigue',
      'Deny unexpected prompts and report them immediately',
      'Choose stronger MFA methods where available'
    ],
    scenes: [
      {
        type: 'brief',
        eyebrow: 'Tier 02 · Identity & access',
        title: 'The prompt you approve *to make it stop.*',
        lede: 'If an attacker has your password, the last wall is your MFA prompt. Push bombing turns that wall into a nuisance you want to dismiss.',
        stats: [
          { label: 'Attack method', value: 'Repetition', note: 'Dozens of prompts until you tap' },
          { label: 'Exploited instinct', value: 'Annoyance', note: 'Approve just to end the noise' },
          { label: 'Correct response', value: 'Deny + report', note: 'Never approve to silence it' }
        ],
        note: 'An MFA prompt is a question. The answer is not “whatever stops the buzzing.”'
      },
      {
        type: 'story',
        label: 'Scene 01 · The setup',
        title: 'Somebody already has your password.',
        paragraphs: [
          'Push bombing starts after a password has been stolen — from a breach, a phish, or reuse. The attacker repeatedly tries to sign in, triggering a stream of approval prompts on your phone.',
          'The goal is exhaustion. After the tenth buzz, approving feels like the quickest way to get back to work. That single tap hands over a valid session.',
          'The attack often arrives at night or during a meeting, when you are least likely to read the location and most likely to silence the phone.'
        ],
        callout: {
          tone: 'warn',
          title: 'A prompt is not a notification',
          body: 'It is a live authentication request. Approving it is the same as typing your password and handing over the session.'
        }
      },
      {
        type: 'sim',
        label: 'Scene 02 · The flood',
        title: 'Nine prompts in six minutes.',
        lede: 'You are in a meeting. Your phone keeps buzzing. The tenth prompt appears. What do you do?',
        context: { kind: 'phone', name: 'Microsoft Authenticator', meta: '9 pending requests · Chicago, IL · 11:42 AM' },
        messages: [
          { from: 'system', text: 'Approve sign-in?', time: '11:36' },
          { from: 'system', text: 'Approve sign-in?', time: '11:37' },
          { from: 'system', text: 'Approve sign-in? (4)', time: '11:39' },
          { from: 'system', text: 'Approve sign-in? (9) — Chicago, IL', time: '11:42' }
        ],
        choices: [
          { label: 'Approve the last one so the prompts stop', verdict: 'bad', feedback: 'That is exactly the intended outcome. Approving gives the attacker a session. The prompts are not a glitch; they are someone trying to get in.' },
          { label: 'Deny every prompt, then report it and change your password', verdict: 'good', feedback: 'Correct. Deny, report, and change the password from a known device. Ask IT to revoke active sessions in case one slipped through.' },
          { label: 'Turn off notifications and deal with it later', verdict: 'neutral', feedback: 'You avoided approving, but the attacker still has your password and may keep trying. Report now so the account can be secured.' }
        ],
        hint: 'The attacker is counting on you choosing convenience over reading the screen.'
      },
      {
        type: 'rules',
        label: 'Scene 03 · The defense',
        title: 'Make the prompt boring and the account hard to guess.',
        lede: 'You cannot stop an attacker from trying. You can make the attempt useless.',
        rules: [
          { title: 'Read the prompt before you tap', body: 'Check the location, the app, and whether you actually initiated a sign-in. If not, deny.' },
          { title: 'Deny first, report second', body: 'Denying blocks that attempt. Reporting lets IT revoke sessions and reset credentials.' },
          { title: 'Change the password from a known device', body: 'If prompts are arriving, assume the password is already compromised.' },
          { title: 'Use number matching', body: 'It forces you to read a number from the screen you are signing in on. Reflexive approval stops working.' },
          { title: 'Prefer phishing-resistant MFA', body: 'Passkeys and FIDO2 keys cannot be approved by accident from a random push.' },
          { title: 'Never approve for someone else', body: '“I’m signing in and the prompt went to you — approve it” is a social-engineering script. Make them use their own account.' }
        ]
      },
      {
        type: 'debrief',
        title: 'Your thumb is the last line of defense.',
        lede: 'The attacker can guess, phish, or buy your password. They cannot tap your phone. Do not tap it for them.',
        checklist: [
          { title: 'Unexpected prompt = attack', body: 'Deny it. There is no legitimate reason for a prompt you did not start.' },
          { title: 'Report, even at 2 a.m.', body: 'A single report can start a password reset and session revocation before damage is done.' },
          { title: 'Check your sessions', body: 'Ask IT to review active sign-ins. A successful approval leaves a session behind.' },
          { title: 'Move to passkeys', body: 'The strongest MFA is the kind that cannot be relayed or tapped by mistake.' }
        ],
        takeaway: 'MFA is only strong if the person holding the phone reads the screen.'
      }
    ],
    questions: [
      {
        question: 'What is MFA fatigue (push bombing)?',
        options: [
          'Sending fake MFA codes by email',
          'Flooding a user with approval prompts until they tap approve out of frustration',
          'Guessing a six-digit code repeatedly',
          'Disabling MFA on an account'
        ],
        correct: 1,
        explanation: 'Attackers who already have a password trigger repeated push notifications, hoping the victim approves one just to stop the noise.'
      },
      {
        question: 'You receive five MFA prompts you did not initiate. The best response is to:',
        options: [
          'Approve one to stop the notifications',
          'Deny them, report to IT, and change your password from a known device',
          'Ignore them and go back to work',
          'Turn off MFA permanently'
        ],
        correct: 1,
        explanation: 'Deny, report, and change the password. The prompts mean someone has your password and is trying to turn it into a session.'
      },
      {
        question: 'Why is number matching stronger than a simple Approve/Deny push?',
        options: [
          'It makes the prompt look nicer',
          'It forces you to read the number from the screen you are signing in on',
          'It replaces the password',
          'It works without a phone'
        ],
        correct: 1,
        explanation: 'Number matching adds context that a blind tap cannot supply. It reduces accidental approvals and relay attacks.'
      },
      {
        question: 'A coworker says: “I’m signing in and the prompt went to your phone — approve it for me.” You should:',
        options: [
          'Approve it to be helpful',
          'Refuse and tell them to use their own account or contact IT',
          'Approve it only if you know them well',
          'Share your password instead'
        ],
        correct: 1,
        explanation: 'Never approve an authentication you did not initiate. It may not be your coworker at all. MFA exists to bind the sign-in to your device.'
      }
    ]
  },

  {
    id: 'oauth',
    tier: 2,
    num: '08',
    icon: 'ticket',
    title: 'The Handed Key',
    subtitle: 'OAuth Consent Phishing',
    desc: 'You grant an app access “just to view a doc” — and it reads your mailbox forever. Learn to spot it.',
    time: '8 min',
    risk: 'Medium',
    accent: '#8ecbff',
    objectives: [
      'Read OAuth consent screens before clicking Accept',
      'Spot “app” permissions that do not match the task',
      'Review and revoke third-party access'
    ],
    scenes: [
      {
        type: 'brief',
        eyebrow: 'Tier 02 · Identity & access',
        title: 'You did not give away your password. *You gave away the keys.*',
        lede: 'OAuth consent phishing skips credentials entirely. It asks you to grant a malicious app permission to read your mail, files, or contacts — and the grant survives a password change.',
        stats: [
          { label: 'What is stolen', value: 'Access token', note: 'No password required' },
          { label: 'What it survives', value: 'Password reset', note: 'The grant remains until revoked' },
          { label: 'The tell', value: 'Permissions', note: 'A doc viewer that wants your mailbox' }
        ],
        note: 'A consent screen is a contract. Read what you are signing.'
      },
      {
        type: 'story',
        label: 'Scene 01 · The invitation',
        title: '“Grant access to view the document.”',
        paragraphs: [
          'A colleague shares a document. The link opens a real Microsoft consent screen: “PerfectDocs would like to access your mailbox, files, and contacts.” There is a blue Accept button and a small Cancel link.',
          'The app is not asking to sign in. It is asking to be trusted. Once you accept, it receives a token that lets it read your data directly, without your password and without another MFA prompt.',
          'The document may even load correctly. The app can be useful and malicious at the same time — or useful as a front while it quietly reads email for “invoice” and “password.”'
        ],
        callout: {
          tone: 'warn',
          title: 'The mismatch test',
          body: 'Does the app need this permission for the task? A PDF viewer does not need your mailbox. A scheduling app does not need your contacts’ passwords.'
        }
      },
      {
        type: 'flow',
        label: 'Scene 02 · The mechanism',
        title: 'How an app becomes a backdoor.',
        lede: 'OAuth is a legitimate feature. The attack abuses the trust prompt, not a software bug.',
        nodes: [
          { icon: 'mail', label: 'The lure', detail: 'A shared document, a meeting invite, or a “free” productivity tool.' },
          { icon: 'ticket', label: 'The consent', detail: 'A real Microsoft or Google screen asks you to grant permissions.' },
          { icon: 'key', label: 'The token', detail: 'The app receives a durable access token tied to your account.' },
          { icon: 'folder', label: 'The access', detail: 'It reads mail, files, and contacts directly — no password, no MFA.' },
          { icon: 'ghost', label: 'The persistence', detail: 'The grant survives a password change until someone revokes it.' }
        ],
        caption: 'Consent phishing is why “change your password” is not a complete incident response.'
      },
      {
        type: 'sim',
        label: 'Scene 03 · The consent screen',
        title: 'The permissions do not match the job.',
        lede: 'A document tool requests access to your mailbox, contacts, and files. What do you do?',
        context: { kind: 'browser', name: 'PerfectDocs', meta: 'consent.microsoftonline.com · Permissions requested' },
        messages: [
          { from: 'system', text: 'PerfectDocs would like to:', time: 'now' },
          { from: 'them', text: '• Read your mail\n• Read your files\n• Read your contacts\n• Maintain access to data you have given it access to', time: 'now' }
        ],
        choices: [
          { label: 'Accept — I need to view the document', verdict: 'bad', feedback: 'A viewer does not need your mailbox or contacts. Accepting grants durable access that survives a password reset. Close it and use the document through your normal account.' },
          { label: 'Cancel, then open the document through the official app or ask the sender', verdict: 'good', feedback: 'Correct. Cancel, verify the sender, and use the platform’s own sharing flow. If the document is real, you can still open it without granting mailbox access.' },
          { label: 'Accept, then change my password afterward', verdict: 'bad', feedback: 'A password change does not revoke an OAuth grant. You would need to remove the app’s access explicitly.' }
        ],
        hint: 'Permissions are the contract. Read the whole list.'
      },
      {
        type: 'rules',
        label: 'Scene 04 · The playbook',
        title: 'Five habits for app permissions.',
        lede: 'OAuth is not the enemy. Unread consent screens are.',
        rules: [
          { title: 'Read the permission list', body: '“Read your mail” or “access your files” is a serious grant. If it does not match the task, stop.' },
          { title: 'Prefer the official app', body: 'If you need to view a document, open it in the official suite, not through a third-party consent screen.' },
          { title: 'Check who published the app', body: 'A verified publisher and a recognizable domain matter more than a polished logo.' },
          { title: 'Review connected apps', body: 'Once a quarter, open your account’s security settings and remove apps you no longer use.' },
          { title: 'Report suspicious consent screens', body: 'IT can block the app tenant-wide and revoke tokens for everyone who accepted.' }
        ]
      },
      {
        type: 'debrief',
        title: 'Consent is access.',
        lede: 'A password is one key. An OAuth grant is a key that keeps working after you change the locks.',
        checklist: [
          { title: 'Pause at the permission screen', body: 'The extra second is the entire defense. Does this app need this data?' },
          { title: 'Cancel mismatched requests', body: 'A viewer that wants mail is not a viewer. Close the tab.' },
          { title: 'Audit connected apps', body: 'Remove anything you do not recognize or no longer use.' },
          { title: 'Report if you accepted', body: 'IT can revoke the token. Do not assume a password change fixes it.' }
        ],
        takeaway: 'The most dangerous click is the one that gives away access you never needed to give.'
      }
    ],
    questions: [
      {
        question: 'What is OAuth consent phishing?',
        options: [
          'Stealing a password by guessing it',
          'Tricking a user into granting a malicious app access to their account',
          'Sending a fake MFA prompt',
          'Cloning a login page'
        ],
        correct: 1,
        explanation: 'The attacker skips credentials and asks you to grant an app permission to read your data. The resulting token can survive a password change.'
      },
      {
        question: 'A PDF viewer requests access to your mailbox and contacts. You should:',
        options: [
          'Accept — it is a Microsoft screen',
          'Cancel; the permissions do not match the task',
          'Accept and change your password later',
          'Accept but only use it once'
        ],
        correct: 1,
        explanation: 'A PDF viewer does not need your mailbox. The mismatch is the tell. Cancel and use the official app or sharing flow.'
      },
      {
        question: 'Does changing your password revoke an OAuth app’s access?',
        options: [
          'Yes, always',
          'No — the grant must be revoked separately',
          'Only if you also change your username',
          'Only on mobile'
        ],
        correct: 1,
        explanation: 'OAuth tokens are independent of your password. You must remove the app’s access in your account settings or have IT revoke it.'
      },
      {
        question: 'Which permission request is the most dangerous?',
        options: [
          'Read your display name',
          'Read your mailbox and files',
          'Know your time zone',
          'See your profile photo'
        ],
        correct: 1,
        explanation: 'Mail and file access exposes sensitive content and can enable further phishing, fraud, and data theft.'
      }
    ]
  },

  {
    id: 'passwords',
    tier: 2,
    num: '09',
    icon: 'key',
    title: 'The Master Key',
    subtitle: 'Password Hygiene',
    desc: 'One reused password can unlock your work, your bank, and your identity. Build habits that scale.',
    time: '8 min',
    risk: 'Medium',
    accent: '#7ee0d1',
    objectives: [
      'Understand credential stuffing and why reuse is dangerous',
      'Use a password manager and passkeys',
      'Respond correctly when a breach exposes a password'
    ],
    scenes: [
      {
        type: 'brief',
        eyebrow: 'Tier 02 · Identity & access',
        title: 'One password. *Every door.*',
        lede: 'Attackers do not need to break your password. They wait for one site to leak it, then try it everywhere you reused it. This is credential stuffing, and it is automated.',
        stats: [
          { label: 'Attack cost', value: 'Near zero', note: 'Leaked lists are public' },
          { label: 'What breaks it', value: 'Unique passwords', note: 'One per account' },
          { label: 'Best storage', value: 'Password manager', note: 'Never memorize or reuse' }
        ],
        note: 'You cannot remember a hundred strong passwords. You do not have to.'
      },
      {
        type: 'story',
        label: 'Scene 01 · The leak',
        title: 'Your password was not hacked. It was *reused.*',
        paragraphs: [
          'A fitness app you signed up for three years ago is breached. The attacker gets your email and password. Within hours, a script tries the same pair on your bank, your email, and your work account.',
          'It works because the password was the same. The breach did not target you; it targeted everyone, and automation did the rest.',
          'The fix is not a more complicated password. It is a different password for every account, stored somewhere that can remember them for you.'
        ],
        callout: {
          tone: 'info',
          title: 'Length beats complexity',
          body: 'A long passphrase of unrelated words is stronger and easier to remember than “P@ssw0rd!”. But the real win is uniqueness.'
        }
      },
      {
        type: 'flow',
        label: 'Scene 02 · The mechanism',
        title: 'From one leak to many accounts.',
        lede: 'Credential stuffing is a numbers game. Your job is to make your accounts a bad bet.',
        nodes: [
          { icon: 'database', label: 'A breach', detail: 'One service leaks email and password pairs.' },
          { icon: 'list', label: 'The list', detail: 'Millions of pairs are sold, shared, and combined.' },
          { icon: 'bot', label: 'The script', detail: 'Automation tries the same pair across popular sites.' },
          { icon: 'key', label: 'The hits', detail: 'Every account with the same password opens at once.' },
          { icon: 'siren', label: 'The fallout', detail: 'Email takeover, bank fraud, and password resets cascade.' }
        ],
        caption: 'A unique password turns a breach into a single inconvenience instead of a chain reaction.'
      },
      {
        type: 'rules',
        label: 'Scene 03 · The playbook',
        title: 'Five habits that scale.',
        lede: 'Good password hygiene is less about willpower and more about tooling.',
        rules: [
          { title: 'Use a password manager', body: 'It generates long, unique passwords and fills them only on the correct domain. You remember one strong master password.' },
          { title: 'Turn on passkeys where available', body: 'Passkeys are bound to the site and resistant to phishing. They are the best replacement for passwords we have.' },
          { title: 'Never reuse work and personal passwords', body: 'A personal breach should never become a work incident. Separate the two worlds.' },
          { title: 'Check breach exposure', body: 'If a service you use is breached, change that password immediately and anywhere it was reused.' },
          { title: 'Use MFA, but not SMS when you can avoid it', body: 'Authenticator apps and hardware keys are stronger than text codes, which can be intercepted or relayed.' }
        ]
      },
      {
        type: 'debrief',
        title: 'Uniqueness is the whole game.',
        lede: 'A strong password you reuse is one breach away from being every password you own.',
        checklist: [
          { title: 'Generate, do not invent', body: 'Let the manager create at least 16 random characters.' },
          { title: 'One account, one password', body: 'If two accounts share a password, fix the more important one first.' },
          { title: 'Protect the manager', body: 'A strong master password plus MFA. It is now the most important account you have.' },
          { title: 'Act on breach alerts', body: 'Change the exposed password and any place it was reused. Do not wait.' }
        ],
        takeaway: 'The goal is not an unbreakable password. It is a breach that stays contained.'
      }
    ],
    questions: [
      {
        question: 'What is credential stuffing?',
        options: [
          'Guessing one password many times',
          'Trying leaked email/password pairs across many sites automatically',
          'Physically stealing a password notebook',
          'Resetting a password without permission'
        ],
        correct: 1,
        explanation: 'Credential stuffing uses breached pairs on other services. Reuse is what makes it profitable.'
      },
      {
        question: 'Which password practice gives the biggest security improvement?',
        options: [
          'Adding an exclamation mark to the end',
          'Using a unique password for every account, managed by a password manager',
          'Changing one password every 30 days',
          'Using your birthday plus a symbol'
        ],
        correct: 1,
        explanation: 'Uniqueness contains the blast radius of a breach. A manager makes uniqueness practical.'
      },
      {
        question: 'Why are passkeys stronger than SMS codes?',
        options: [
          'They are longer',
          'They are bound to the site and resist phishing and relay attacks',
          'They never expire',
          'They work without a device'
        ],
        correct: 1,
        explanation: 'Passkeys use cryptographic keys tied to the real domain, so a lookalike site cannot use them.'
      },
      {
        question: 'A service you use announces a breach. You should:',
        options: [
          'Wait for the company to reset it for you',
          'Change that password immediately and anywhere you reused it',
          'Delete your account and ignore the rest',
          'Add MFA and keep the same password'
        ],
        correct: 1,
        explanation: 'Change the exposed password and every reused copy. Then enable MFA. Waiting gives attackers time to use the list.'
      }
    ]
  },

  {
    id: 'deepfake',
    tier: 2,
    num: '10',
    icon: 'mask',
    title: 'The Perfect Copy',
    subtitle: 'Deepfakes & AI Impersonation',
    desc: 'Video calls, voice notes, and emails that look like your boss — because AI made them. Verify differently.',
    time: '9 min',
    risk: 'High',
    accent: '#e0a6ff',
    objectives: [
      'Understand what AI can and cannot fake convincingly',
      'Build a verification phrase or callback habit',
      'Respond to an urgent AI-generated money request'
    ],
    scenes: [
      {
        type: 'brief',
        eyebrow: 'Tier 02 · Identity & access',
        title: 'Seeing is no longer *believing.*',
        lede: 'A few seconds of public audio is enough to clone a voice. A photo and a video call are enough to build a face. AI has made impersonation cheap, fast, and convincing.',
        stats: [
          { label: 'Audio needed', value: 'Seconds', note: 'From a podcast or voicemail' },
          { label: 'Best defense', value: 'Callback', note: 'A channel the attacker does not control' },
          { label: 'Weakest proof', value: 'Appearance', note: 'Voice and face can be synthesized' }
        ],
        note: 'The goal is not to detect every fake. It is to stop trusting appearance as identity.'
      },
      {
        type: 'story',
        label: 'Scene 01 · The video call',
        title: 'Your CFO, live, asking for a transfer.',
        paragraphs: [
          'The invite says “Urgent — Q4 close.” On the call, your CFO looks and sounds right. The connection is poor, the video is a little frozen, and they explain they are traveling.',
          'They ask you to move funds to a new account and to keep it between the two of you until the deal closes. The call lasts four minutes. It is enough.',
          'Real-time deepfakes are not perfect, but they do not need to be. They only need to survive the length of a conversation where you want to be helpful.'
        ],
        callout: {
          tone: 'warn',
          title: 'The pressure stack',
          body: 'Authority + video “proof” + urgency + poor connection + secrecy. Each layer is designed to stop you from doing the one thing that works: hang up and verify.'
        }
      },
      {
        type: 'sim',
        label: 'Scene 02 · The request',
        title: 'The call is still live.',
        lede: 'Your “CFO” asks for a wire transfer and says not to tell anyone yet. What do you do?',
        context: { kind: 'video', name: 'CFO — Video call', meta: '04:12 · connection unstable · “Q4 close”' },
        messages: [
          { from: 'them', text: 'I need this moved today. Use the new account details I’m sending now. Keep it between us until the announcement.', time: '04:12' }
        ],
        choices: [
          { label: 'Do it — you can see and hear them on video', verdict: 'bad', feedback: 'Video is not identity. Real-time deepfakes exist, and a compromised real account can also be used. The request itself — money plus secrecy — is the tell.' },
          { label: 'End the call and verify through a separate known channel', verdict: 'good', feedback: 'Correct. Call the CFO on a number you already have, or verify with finance through the normal process. A real executive will not object.' },
          { label: 'Ask them to repeat their employee ID on the call', verdict: 'neutral', feedback: 'An ID can be known or faked. Independent verification is stronger than any challenge inside the same channel.' }
        ],
        hint: 'The channel is controlled by the attacker. Step outside it.'
      },
      {
        type: 'rules',
        label: 'Scene 03 · The playbook',
        title: 'Six habits for a synthetic world.',
        lede: 'You cannot train your eyes to catch every fake. You can build processes that do not depend on your eyes.',
        rules: [
          { title: 'Verify on a separate channel', body: 'Hang up and call the person on a number you already have. Do not use the number or link from the conversation.' },
          { title: 'Use a shared verification phrase', body: 'Agree on a question or phrase with your team that is not public and not in your email signatures.' },
          { title: 'Treat urgency and secrecy as hostile', body: 'Real financial processes do not require you to skip controls or hide the request.' },
          { title: 'Look for process breaks', body: 'A wire change outside the normal workflow is the issue — not whether the face looks real.' },
          { title: 'Limit public audio and video', body: 'You cannot remove everything, but know that public interviews and presentations are training data.' },
          { title: 'Report suspected fakes', body: 'Security needs to warn the next target. The same script is usually sent to several people.' }
        ]
      },
      {
        type: 'debrief',
        title: 'Identity is a process, not a face.',
        lede: 'The most convincing deepfake is still defeated by a callback to a number you already trust.',
        checklist: [
          { title: 'Hang up and call back', body: 'Use the directory, not the caller ID. This is the single most effective defense.' },
          { title: 'Never skip financial controls', body: 'Dual approval and callbacks exist to survive exactly this attack.' },
          { title: 'Do not trust “live” alone', body: 'Real-time video and voice can be synthesized or a real account can be compromised.' },
          { title: 'Report immediately', body: 'If money moved, speed matters. If it did not, your report protects others.' }
        ],
        takeaway: 'AI can copy a face. It cannot copy a verification process you control.'
      }
    ],
    questions: [
      {
        question: 'Why are deepfake attacks especially dangerous in finance workflows?',
        options: [
          'They always look obviously fake',
          'They combine familiar faces and voices with urgency to bypass normal verification',
          'They only work on personal accounts',
          'They require physical access'
        ],
        correct: 1,
        explanation: 'Deepfakes exploit trust in appearance and sound. The defense is process — callbacks and dual approval — not visual detection.'
      },
      {
        question: 'A video call from your “CEO” asks for an urgent wire transfer. The best move is to:',
        options: [
          'Comply because you can see them',
          'End the call and verify through a separate known channel',
          'Ask them to hold up their ID',
          'Record the call and send it to a colleague'
        ],
        correct: 1,
        explanation: 'Video is not verification. A callback on a known number, or the normal approval process, defeats the impersonation.'
      },
      {
        question: 'Which detail should increase your suspicion the most?',
        options: [
          'The caller uses your name',
          'The request must be kept secret and skip normal controls',
          'The call has poor video quality',
          'The caller is traveling'
        ],
        correct: 1,
        explanation: 'Secrecy and process bypass are the core of the scam. Poor video can be an excuse, but the request structure is the real tell.'
      },
      {
        question: 'What is a good defense against voice cloning?',
        options: [
          'Listening for robotic artifacts',
          'Verifying on another channel or using a pre-agreed phrase',
          'Asking the caller to speak slower',
          'Recording the call'
        ],
        correct: 1,
        explanation: 'Detection is unreliable. Independent verification and shared phrases work regardless of how good the clone is.'
      }
    ]
  }
]);
