/* SHADOWPROOF — Tier 3: Physical & environmental attacks */
window.SHADOWPROOF_MODULES = (window.SHADOWPROOF_MODULES || []).concat([
  {
    id: 'usb',
    tier: 3,
    num: '11',
    icon: 'usb',
    title: 'The Gift Nobody Sent',
    subtitle: 'USB Drops & Rogue Devices',
    desc: 'A branded USB stick in the parking lot. A “free” cable at a conference. Never trust hardware you did not buy.',
    time: '6 min',
    risk: 'Medium',
    accent: '#b7c4ff',
    objectives: [
      'Recognize a baiting drop',
      'Avoid untrusted cables and charging ports',
      'Report found devices without plugging them in'
    ],
    scenes: [
      {
        type: 'brief',
        eyebrow: 'Tier 03 · Physical & environmental',
        title: 'Curiosity is the payload.',
        lede: 'A USB stick is a tiny computer that can pretend to be a keyboard, a network card, or a hard drive. Plugging in an unknown device is like opening an attachment made of plastic.',
        stats: [
          { label: 'Attack type', value: 'Baiting', note: 'Leave it where someone will find it' },
          { label: 'Why it works', value: 'Curiosity', note: '“What’s on this?”' },
          { label: 'Correct action', value: 'Do not plug in', note: 'Give it to security' }
        ],
        note: 'If you did not buy it, it is not yours to trust.'
      },
      {
        type: 'story',
        label: 'Scene 01 · The parking lot',
        title: 'A branded stick with your company logo.',
        paragraphs: [
          'You find a USB drive in the parking lot. It has your company’s logo and a label that says “Q4 Payroll — Confidential.” It is exactly the kind of thing a careless colleague might drop.',
          'That is the design. Attackers seed branded drives near offices, conferences, and cafés because finding one creates a story you want to resolve. Plugging it in to “see who owns it” is the entire attack.',
          'A malicious drive can install software in seconds, log keystrokes, or pose as a network adapter. Some can damage the device. None of that requires you to open a file.'
        ],
        callout: {
          tone: 'warn',
          title: 'Do not satisfy the curiosity',
          body: 'Do not plug it in to identify the owner. Hand it to security or lost-and-found. Your curiosity is the exploit.'
        }
      },
      {
        type: 'flow',
        label: 'Scene 02 · The mechanism',
        title: 'What a drive can do in ten seconds.',
        lede: 'The danger is not always a file you double-click. The device itself can act.',
        nodes: [
          { icon: 'usb', label: 'The drop', detail: 'A branded drive is left where you will find it.' },
          { icon: 'cursor', label: 'The plug-in', detail: 'You connect it to a work machine to see what is on it.' },
          { icon: 'terminal', label: 'The payload', detail: 'It runs keystroke injection, installs malware, or impersonates a keyboard.' },
          { icon: 'network', label: 'The foothold', detail: 'The machine connects to attacker infrastructure or spreads laterally.' },
          { icon: 'siren', label: 'The incident', detail: 'Credentials, files, and network access are now exposed.' }
        ],
        caption: 'Free charging cables can carry the same risk. Use your own cable and charger.'
      },
      {
        type: 'rules',
        label: 'Scene 03 · The playbook',
        title: 'Five rules for hardware you did not buy.',
        lede: 'The safest port is the one you do not use.',
        rules: [
          { title: 'Never plug in found devices', body: 'No exceptions for branded drives, “important” labels, or curiosity about the owner.' },
          { title: 'Hand it to security', body: 'Report where you found it. Security can inspect it safely and warn others.' },
          { title: 'Use your own chargers and cables', body: 'Public USB ports and free cables can carry data. Prefer a wall outlet and your own charger.' },
          { title: 'Disable autorun', body: 'It reduces some risk, but it does not stop a device that pretends to be a keyboard. Do not rely on it.' },
          { title: 'Report unexpected devices', body: 'A strange dongle on a conference-room PC or a new device on the network is worth a report.' }
        ]
      },
      {
        type: 'debrief',
        title: 'The port is a door.',
        lede: 'You would not plug an unknown link into your browser. Do not plug an unknown computer into your laptop.',
        checklist: [
          { title: 'Do not test it', body: 'Identifying the owner is not your job. Security can do it safely.' },
          { title: 'Bag it, do not plug it', body: 'If you must handle it, keep it away from your machine and give it to security.' },
          { title: 'Use trusted charging', body: 'Your own charger in a wall outlet, or a trusted power bank.' },
          { title: 'Report the drop', body: 'If one was planted, others were too. Early warning protects the next person.' }
        ],
        takeaway: 'A found device is not a gift. It is a delivery mechanism.'
      }
    ],
    questions: [
      {
        question: 'You find a branded USB drive in the parking lot. The safest action is to:',
        options: [
          'Plug it into a personal laptop to see who owns it',
          'Hand it to security without plugging it in',
          'Plug it into a work computer but do not open files',
          'Take it home and format it'
        ],
        correct: 1,
        explanation: 'The device itself can be malicious. Do not connect it. Give it to security, who can inspect it safely.'
      },
      {
        question: 'Why is a public USB charging port risky?',
        options: [
          'It charges too slowly',
          'It can carry data or be used for juice-jacking',
          'It only works with Apple devices',
          'It drains the battery'
        ],
        correct: 1,
        explanation: 'A public port can be used to deliver malware or steal data. Use a wall outlet with your own charger or a power bank.'
      },
      {
        question: 'Which is true about disabling autorun?',
        options: [
          'It makes all USB devices safe',
          'It helps with some file-based attacks but not devices that impersonate a keyboard',
          'It blocks charging',
          'It is only available on Macs'
        ],
        correct: 1,
        explanation: 'Autorun reduces some risk, but malicious devices can present themselves as input devices. The real defense is not plugging them in.'
      },
      {
        question: 'A “free” branded charging cable at a conference is:',
        options: [
          'Always safe because it is free',
          'Potentially a data-capable device; use your own cable instead',
          'Safe if it has a logo',
          'Only risky on Android'
        ],
        correct: 1,
        explanation: 'Cables can contain chips that capture keystrokes or inject commands. Use hardware you bought yourself.'
      }
    ]
  },

  {
    id: 'wifi',
    tier: 3,
    num: '12',
    icon: 'wifi',
    title: 'The Open Window',
    subtitle: 'Public Wi-Fi & Travel Security',
    desc: 'Airports, hotels, coffee shops. Learn the simple habits that protect you away from the office.',
    time: '7 min',
    risk: 'Medium',
    accent: '#7fd8ff',
    objectives: [
      'Spot a rogue hotspot and an evil-twin network',
      'Protect traffic with HTTPS, a VPN, and trusted devices',
      'Reduce your exposure while traveling'
    ],
    scenes: [
      {
        type: 'brief',
        eyebrow: 'Tier 03 · Physical & environmental',
        title: 'Free Wi-Fi. *Someone else’s network.*',
        lede: 'Public networks are convenient and untrusted. You do not control who else is on them, what the access point logs, or whether the network is the one you think it is.',
        stats: [
          { label: 'Main risk', value: 'Interception', note: 'Rogue hotspots and evil twins' },
          { label: 'Best habit', value: 'HTTPS + VPN', note: 'Protect the traffic you cannot control' },
          { label: 'Weak moment', value: 'Travel', note: 'Unfamiliar places and urgent tasks' }
        ],
        note: 'You can use public Wi-Fi. You just cannot trust it.'
      },
      {
        type: 'story',
        label: 'Scene 01 · The airport',
        title: 'The network name looks right.',
        lede: '“Airport_Free_WiFi” and “Airport Free WiFi” look identical in a list. One is real. One is a laptop in a backpack.',
        paragraphs: [
          'An evil-twin hotspot copies the name of a legitimate network. You connect, a login page appears, and it asks for your email and password “to accept the terms.” The page looks like the airport’s.',
          'Even without a fake login page, the attacker can see which sites you visit and intercept unencrypted traffic. HTTPS protects most content, but not everything — and a convincing captive portal can still harvest credentials.',
          'The safest approach is to treat every public network as hostile and verify the network name with staff before connecting.'
        ],
        callout: {
          tone: 'info',
          title: 'Captive portals are not identity checks',
          body: 'A page asking for your email, password, or payment to “activate Wi-Fi” is a red flag. Real networks rarely need your work credentials.'
        }
      },
      {
        type: 'flow',
        label: 'Scene 02 · The mechanism',
        title: 'How an evil twin works.',
        lede: 'The attacker does not need to break encryption. They just need you to connect to their access point.',
        nodes: [
          { icon: 'wifi', label: 'The lure', detail: 'A free network with a familiar name and a strong signal.' },
          { icon: 'laptop', label: 'The twin', detail: 'An attacker-controlled hotspot broadcasts the same SSID.' },
          { icon: 'browser', label: 'The portal', detail: 'A fake login page asks for credentials or payment.' },
          { icon: 'eye', label: 'The watch', detail: 'Unencrypted traffic and metadata are visible to the operator.' },
          { icon: 'ghost', label: 'The compromise', detail: 'Stolen credentials or session cookies are used elsewhere.' }
        ],
        caption: 'A VPN protects the tunnel. It does not make a fake captive portal honest.'
      },
      {
        type: 'rules',
        label: 'Scene 03 · The playbook',
        title: 'Six habits for hostile networks.',
        lede: 'Assume the network is watched. Then decide what you are willing to do on it.',
        rules: [
          { title: 'Verify the network name with staff', body: 'Ask for the exact SSID. Do not connect to the one with the strongest signal or the friendliest name.' },
          { title: 'Use a VPN on public networks', body: 'It encrypts traffic between your device and the VPN, so the hotspot sees less. Use a company-approved VPN.' },
          { title: 'Prefer your phone hotspot', body: 'Your own cellular connection is usually safer than a strange Wi-Fi network.' },
          { title: 'Never enter work credentials in a captive portal', body: 'A portal asking for your email password is harvesting, not authenticating. Connect, then open the real service yourself.' },
          { title: 'Keep HTTPS and updates on', body: 'HTTPS protects content in transit. An updated browser and OS close known holes.' },
          { title: 'Avoid sensitive work on shared networks', body: 'If you can wait, do the banking and the admin work on a trusted connection.' }
        ]
      },
      {
        type: 'debrief',
        title: 'Convenience is not trust.',
        lede: 'You do not need to avoid every coffee shop. You need to stop treating “it connected” as “it is safe.”',
        checklist: [
          { title: 'Forget the network afterward', body: 'Do not let your device auto-join open networks it has seen before.' },
          { title: 'Use the VPN before you log in', body: 'Connect the VPN first, then open work services.' },
          { title: 'Watch for portal credential requests', body: 'Your company account is not a Wi-Fi password.' },
          { title: 'Turn off file sharing', body: 'On public networks, disable AirDrop/ nearby sharing and shared folders.' }
        ],
        takeaway: 'A public network is a shared room. Act like someone else can hear you.'
      }
    ],
    questions: [
      {
        question: 'What is an evil-twin Wi-Fi network?',
        options: [
          'A network with two passwords',
          'A rogue hotspot that copies a legitimate network name to intercept traffic',
          'A router with a weak password',
          'A network that only works on two devices'
        ],
        correct: 1,
        explanation: 'The attacker broadcasts a familiar SSID, hoping you connect to their access point instead of the real one.'
      },
      {
        question: 'A captive portal asks for your work email password to “activate” airport Wi-Fi. You should:',
        options: [
          'Enter it — you need internet',
          'Never enter work credentials; connect another way or use your hotspot',
          'Use a fake password',
          'Ask a stranger to log in for you'
        ],
        correct: 1,
        explanation: 'Legitimate Wi-Fi portals do not need your work account password. This is a credential-harvesting page.'
      },
      {
        question: 'What does a VPN protect on public Wi-Fi?',
        options: [
          'It makes the network honest',
          'It encrypts traffic between your device and the VPN, limiting what the hotspot can see',
          'It speeds up the connection',
          'It blocks all malicious websites'
        ],
        correct: 1,
        explanation: 'A VPN creates an encrypted tunnel. It reduces exposure but does not make a fake portal safe or block every threat.'
      },
      {
        question: 'The safest connection for sensitive work while traveling is usually:',
        options: [
          'The hotel’s free Wi-Fi',
          'Your phone’s cellular hotspot',
          'The airport network with the strongest signal',
          'Any network with a password'
        ],
        correct: 1,
        explanation: 'Your own cellular connection is generally more trustworthy than an unfamiliar public network.'
      }
    ]
  },

  {
    id: 'social-eng',
    tier: 3,
    num: '13',
    icon: 'door',
    title: 'Held Door',
    subtitle: 'Social Engineering & Tailgating',
    desc: '“I forgot my badge, could you let me in?” Politeness is the most exploited security control there is.',
    time: '8 min',
    risk: 'Medium',
    accent: '#ffd37a',
    objectives: [
      'Recognize pretexting and tailgating',
      'Redirect access requests to the proper process',
      'Report suspicious visitors without confrontation'
    ],
    scenes: [
      {
        type: 'brief',
        eyebrow: 'Tier 03 · Physical & environmental',
        title: 'The easiest door to open *is held by someone polite.*',
        lede: 'Social engineering targets the rules we follow in polite society: don’t be rude, don’t accuse, don’t make a scene. Attackers borrow those rules to get past physical security.',
        stats: [
          { label: 'Common tactic', value: 'Pretext', note: 'A plausible reason to be there' },
          { label: 'Exploited trait', value: 'Politeness', note: 'Holding a door feels kind' },
          { label: 'Correct move', value: 'Redirect', note: '“I’ll get someone who can help”' }
        ],
        note: 'You are not the security team. You are the early warning.'
      },
      {
        type: 'story',
        label: 'Scene 01 · The lobby',
        title: '“I forgot my badge — can you let me in?”',
        paragraphs: [
          'A man in a delivery uniform holds two boxes and looks stressed. He says he is late for a client meeting on the fourth floor and forgot his badge. He asks you to hold the door.',
          'Everything about the story is designed to make refusal feel unreasonable. He has a reason, he is in a hurry, and helping costs you nothing. That is the trap.',
          'A real employee can call the person they are meeting or wait for reception. A real vendor has a check-in process. The request to bypass the process is the signal.'
        ],
        callout: {
          tone: 'warn',
          title: 'The pretext formula',
          body: 'A role you recognize + a small problem + a reason to skip procedure + time pressure. The story is the attack.'
        }
      },
      {
        type: 'sim',
        label: 'Scene 02 · The door',
        title: 'The boxes are getting heavy.',
        lede: 'He is still waiting. What do you do?',
        context: { kind: 'chat', name: 'Lobby · 8:58 AM', meta: 'Visitor without a badge' },
        messages: [
          { from: 'them', text: 'I’m really sorry — I just need to get these to Legal on four. Could you badge me through? I’ll be two minutes.', time: '8:58' }
        ],
        choices: [
          { label: 'Hold the door — he is clearly late and carrying boxes', verdict: 'bad', feedback: 'This is exactly the intended response. Kindness is not a badge check. You have no idea who he is or what is in the boxes.' },
          { label: 'Walk him to reception and let staff verify him', verdict: 'good', feedback: 'Correct. Redirect to the process without confrontation. Reception can call Legal and confirm the visit.' },
          { label: 'Ask him to show an employee badge', verdict: 'neutral', feedback: 'Better than opening the door, but a fake badge is easy to print. Verification belongs with reception, not your judgment.' }
        ],
        hint: 'Do not argue. Redirect.'
      },
      {
        type: 'rules',
        label: 'Scene 03 · The playbook',
        title: 'Six habits for physical security.',
        lede: 'You can be helpful without being a vulnerability.',
        rules: [
          { title: 'Do not let anyone follow you in', body: 'One badge, one person. If someone slips in behind you, politely direct them to reception.' },
          { title: 'Redirect, do not confront', body: '“I’ll get someone who can help” is safer than accusing. You are not trying to win an argument.' },
          { title: 'Verify visitors through reception', body: 'The visitor process exists for a reason. Let it do its job.' },
          { title: 'Challenge unescorted strangers', body: 'Ask if they need help finding someone. If the answer is vague, call security.' },
          { title: 'Protect your badge and screen', body: 'Do not leave a badge on a desk or wear it in public photos. Lock your screen when you step away.' },
          { title: 'Report, even if nothing happened', body: 'A suspicious visitor may be testing several entrances. Your report connects the dots.' }
        ]
      },
      {
        type: 'debrief',
        title: 'Politeness is not a control.',
        lede: 'The attacker is not trying to break the door. They are trying to make you open it.',
        checklist: [
          { title: 'One badge, one person', body: 'Never piggyback, even with your hands full.' },
          { title: 'Use the visitor process', body: 'Reception, sign-in, escort. No exceptions for urgency.' },
          { title: 'Call, do not confront', body: 'Security handles the situation. You just make the report.' },
          { title: 'Trust the uneasy feeling', body: 'If a story feels slightly off, redirect. You do not need proof to be cautious.' }
        ],
        takeaway: 'The kindest thing you can do for a stranger is follow the process that keeps everyone safe.'
      }
    ],
    questions: [
      {
        question: 'What is tailgating?',
        options: [
          'Following a vehicle too closely',
          'Following an authorized person through a secure door without presenting credentials',
          'Sending a phishing email',
          'Sharing a password with a coworker'
        ],
        correct: 1,
        explanation: 'Tailgating exploits politeness and physical access controls. One badge should admit one person.'
      },
      {
        question: 'A visitor without a badge asks you to let them in because they are late. You should:',
        options: [
          'Hold the door — it is polite',
          'Walk them to reception so staff can verify them',
          'Ask for their business card',
          'Let them in but watch them'
        ],
        correct: 1,
        explanation: 'Redirect to the visitor process. Do not bypass verification, even for a sympathetic story.'
      },
      {
        question: 'A stranger is wandering near your floor. The best action is to:',
        options: [
          'Ignore them — it is not your job',
          'Ask if they need help finding someone, then call security if needed',
          'Confront them aggressively',
          'Give them directions and return to work'
        ],
        correct: 1,
        explanation: 'A calm offer of help is safe and clarifying. If the answer is vague, involve security.'
      },
      {
        question: 'Why should you avoid posting photos that show your badge?',
        options: [
          'It is bad photography',
          'Badge details can be used to clone access or impersonate you',
          'It uses too much data',
          'It is only a problem for executives'
        ],
        correct: 1,
        explanation: 'Badge photos can reveal names, IDs, and access patterns. Attackers use them for pretexting and cloning.'
      }
    ]
  },

  {
    id: 'home-network',
    tier: 3,
    num: '14',
    icon: 'home',
    title: 'The Home Front',
    subtitle: 'Home Network & Personal Devices',
    desc: 'Your router, smart TV, and family laptop now share a network with your work. Learn where the edges are.',
    time: '8 min',
    risk: 'Low',
    accent: '#9fe0a8',
    objectives: [
      'Secure the home router and separate work devices',
      'Update devices and remove default credentials',
      'Recognize how home compromise reaches work'
    ],
    scenes: [
      {
        type: 'brief',
        eyebrow: 'Tier 03 · Physical & environmental',
        title: 'Your office has a *living room.*',
        lede: 'Remote work moved the corporate network into your home. The router, the smart speaker, and the family laptop are now part of your work environment — whether IT manages them or not.',
        stats: [
          { label: 'Weak point', value: 'The router', note: 'Default passwords and old firmware' },
          { label: 'Shared risk', value: 'One network', note: 'Personal devices can reach work devices' },
          { label: 'Best habit', value: 'Segment + update', note: 'Separate and patch' }
        ],
        note: 'You do not need a enterprise setup. You need the basics done consistently.'
      },
      {
        type: 'story',
        label: 'Scene 01 · The router',
        title: 'It has been running for four years.',
        paragraphs: [
          'The router came from the ISP, was plugged in, and has not been touched since. The admin password is still on a sticker. The firmware has never updated. The guest network was never enabled.',
          'A compromised router can redirect traffic, intercept unencrypted data, and expose every device on the network. It is the quietest device in the house and the most important one to secure.',
          'The fix is unglamorous: change the admin password, update the firmware, use WPA3 or WPA2, and put smart devices on a guest network.'
        ],
        callout: {
          tone: 'info',
          title: 'Three basics',
          body: 'Update the router · change its admin password · separate guest and smart devices from work devices.'
        }
      },
      {
        type: 'flow',
        label: 'Scene 02 · The mechanism',
        title: 'How a home device becomes a work incident.',
        lede: 'Attackers do not need to target your office directly. They can enter through the least-maintained device you own.',
        nodes: [
          { icon: 'home', label: 'The edge', detail: 'An old router or smart device with default credentials.' },
          { icon: 'bug', label: 'The compromise', detail: 'Known vulnerabilities or a weak password let the attacker in.' },
          { icon: 'network', label: 'The pivot', detail: 'The attacker moves across the flat home network to other devices.' },
          { icon: 'laptop', label: 'The work device', detail: 'A shared folder, saved session, or unpatched service is reached.' },
          { icon: 'briefcase', label: 'The office', detail: 'Corporate credentials or VPN access open the way into work.' }
        ],
        caption: 'Segmentation does not require a rack of equipment. A guest network is a good start.'
      },
      {
        type: 'rules',
        label: 'Scene 03 · The playbook',
        title: 'Seven habits for a safer home network.',
        lede: 'Do the boring things once. Then let them run.',
        rules: [
          { title: 'Change the router admin password', body: 'The sticker password is often a known default. Set a unique one and store it in your password manager.' },
          { title: 'Update router firmware', body: 'Turn on automatic updates if available. Check quarterly if not.' },
          { title: 'Use WPA3 or WPA2', body: 'Never leave Wi-Fi open. Use a long, unique passphrase.' },
          { title: 'Put smart devices on a guest network', body: 'TVs, cameras, and speakers rarely need to reach your work laptop.' },
          { title: 'Keep work and personal separate', body: 'Use a work-managed device for work. Do not install random software on it.' },
          { title: 'Patch everything', body: 'Phones, laptops, and smart devices. Updates are the cheapest security you will ever get.' },
          { title: 'Lock screens and use MFA', body: 'A shared family computer should not be a shared work session.' }
        ]
      },
      {
        type: 'debrief',
        title: 'Security at home is security at work.',
        lede: 'The office perimeter is now a router in a hallway. Treat it with the same seriousness.',
        checklist: [
          { title: 'Audit the router once', body: 'Admin password, firmware, encryption, guest network. Twenty minutes.' },
          { title: 'Separate the smart stuff', body: 'Guest network for IoT. Work devices on the main network.' },
          { title: 'Patch on a schedule', body: 'Enable automatic updates wherever possible.' },
          { title: 'Report odd behavior', body: 'Unexpected reboots, slow traffic, or unknown devices may be a compromise.' }
        ],
        takeaway: 'Your home network is part of the company’s attack surface now. Secure it like it.'
      }
    ],
    questions: [
      {
        question: 'The most important home network device to secure is usually:',
        options: [
          'The smart TV',
          'The router',
          'The printer',
          'The game console'
        ],
        correct: 1,
        explanation: 'The router controls and sees all traffic. Default credentials and old firmware make it a high-value target.'
      },
      {
        question: 'Why put smart devices on a guest network?',
        options: [
          'They get faster internet',
          'It limits what a compromised smart device can reach on your main network',
          'It saves electricity',
          'It is required by the manufacturer'
        ],
        correct: 1,
        explanation: 'Segmentation contains a compromised IoT device, keeping it away from work laptops and sensitive data.'
      },
      {
        question: 'Which router setting should you change first?',
        options: [
          'The Wi-Fi name',
          'The default administrator password',
          'The LED brightness',
          'The channel number'
        ],
        correct: 1,
        explanation: 'Default admin passwords are widely known. Change it to a unique password and store it safely.'
      },
      {
        question: 'A work laptop on a home network should:',
        options: [
          'Share files with every home device',
          'Stay on a separate network or use a work-managed configuration',
          'Disable updates for speed',
          'Use the same password as the router'
        ],
        correct: 1,
        explanation: 'Separation limits exposure. Work devices should be managed and kept away from untrusted home devices.'
      }
    ]
  }
]);
