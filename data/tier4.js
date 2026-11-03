/* SHADOWPROOF — Tier 4: Human & operational risks */
window.SHADOWPROOF_MODULES = (window.SHADOWPROOF_MODULES || []).concat([
  {
    id: 'insider',
    tier: 4,
    num: '15',
    icon: 'folder',
    title: 'The Careless Hand',
    subtitle: 'Insider Threat & Data Handling',
    desc: 'Most data leaks are accidental, not malicious. Learn where sensitive data belongs — and where it does not.',
    time: '8 min',
    risk: 'Medium',
    accent: '#ffcf7a',
    objectives: [
      'Classify data before you share it',
      'Avoid common accidental leak channels',
      'Use approved tools instead of shadow IT'
    ],
    scenes: [
      {
        type: 'brief',
        eyebrow: 'Tier 04 · Human & operational',
        title: 'The leak is usually *an accident.*',
        lede: 'Insider risk is not only malicious. It is a spreadsheet sent to the wrong person, a document shared “anyone with the link,” or a personal cloud account used because it was faster.',
        stats: [
          { label: 'Most common cause', value: 'Mistake', note: 'Not malice' },
          { label: 'Fastest leak', value: 'One share', note: 'A link can outlive the project' },
          { label: 'Best habit', value: 'Pause + classify', note: 'What is in this, and who needs it?' }
        ],
        note: 'You do not need to memorize policy. You need to ask two questions before you share.'
      },
      {
        type: 'story',
        label: 'Scene 01 · The link',
        title: '“Anyone with the link can view.”',
        paragraphs: [
          'You are late for a meeting and need to share a file. The fastest option is “anyone with the link.” You paste it into a chat and move on.',
          'The link works. It also works for anyone who finds it, forwards it, or scrapes it from a public channel. The file stays accessible until someone remembers to change the setting.',
          'Most data leaks are not dramatic. They are a convenience decision made under time pressure, with no bad intent and no immediate feedback.'
        ],
        callout: {
          tone: 'warn',
          title: 'Two questions before you share',
          body: 'What is the most sensitive thing in this file? Who actually needs it? If you cannot answer both, do not use “anyone with the link.”'
        }
      },
      {
        type: 'classify',
        label: 'Scene 02 · Field exercise',
        title: 'Share or do not share?',
        lede: 'Read each situation and decide whether the sharing behavior is safe. The explanations matter more than the score.',
        items: [
          { from: 'Finance', meta: 'Shared drive', text: 'You upload a payroll file to the team’s private shared drive and grant access to the three approvers.', verdict: 'legit', reason: 'Scoped access to named people on an approved corporate drive is the right pattern. The file stays controlled and auditable.' },
          { from: 'Marketing', meta: 'Public link', text: 'You create a public “anyone with the link” URL for a customer list so a vendor can download it.', verdict: 'scam', reason: 'A public link removes the access control. Customer data should move through an approved, expiring, recipient-scoped method.' },
          { from: 'Personal', meta: 'Personal cloud', text: 'You copy a work document to your personal cloud drive so you can edit it at home.', verdict: 'scam', reason: 'Personal accounts are outside company control, logging, and retention. Use the approved remote-access method.' },
          { from: 'IT', meta: 'Email', text: 'You need to send a spreadsheet with SSNs. You password-protect the file and email the password in a separate message.', verdict: 'neutral', reason: 'Better than nothing, but email is still the wrong channel for regulated data. Use the approved secure-transfer or encrypted portal.' },
          { from: 'Sales', meta: 'Chat', text: 'A prospect asks for a pricing deck. You send the standard public deck with no customer names or internal margins.', verdict: 'legit', reason: 'Public, non-sensitive material can be shared normally. The classification of the content is what makes it safe.' },
          { from: 'HR', meta: 'Meeting', text: 'You screen-share a performance review and accidentally display another employee’s name and salary.', verdict: 'scam', reason: 'Accidental disclosure is still a disclosure. Use a clean window, close unrelated tabs, and report it so the exposure can be assessed.' }
        ]
      },
      {
        type: 'rules',
        label: 'Scene 03 · The playbook',
        title: 'Six habits for handling data.',
        lede: 'Good data handling is mostly about defaults: the safe option should be the easy one.',
        rules: [
          { title: 'Classify before you share', body: 'Public, internal, confidential, restricted. The label tells you which channel and audience are allowed.' },
          { title: 'Use the approved tool', body: 'If the file is sensitive, use the corporate drive and scoped permissions — not personal email, personal cloud, or a consumer chat app.' },
          { title: 'Prefer named access over public links', body: '“Anyone with the link” is a permanent door. Named access can be removed.' },
          { title: 'Set an expiry', body: 'If a link must be shared externally, make it expire and limit downloads where the tool supports it.' },
          { title: 'Clean your screen before sharing', body: 'Close unrelated tabs and windows. Notifications can reveal more than the document.' },
          { title: 'Report mistakes fast', body: 'A wrongly shared file can be revoked. The sooner you report, the smaller the exposure.' }
        ]
      },
      {
        type: 'debrief',
        title: 'Convenience is a security decision.',
        lede: 'The fastest way to share is often the least controlled. Choose the controlled path before you paste the link.',
        checklist: [
          { title: 'Pause at the share dialog', body: 'Check who has access and whether it expires.' },
          { title: 'No personal accounts', body: 'Work data stays in work systems, even when you are in a hurry.' },
          { title: 'Screen-share safely', body: 'Share a single window, not your entire desktop.' },
          { title: 'Report accidental exposure', body: 'Revoke the link, tell security, and document what was exposed.' }
        ],
        takeaway: 'You are trusted with data. The control is the pause before you share it.'
      }
    ],
    questions: [
      {
        question: 'What is the safest way to share a file containing customer data?',
        options: [
          'A public “anyone with the link” URL',
          'Named access on an approved corporate drive, with the minimum audience',
          'Personal email with a password in the same thread',
          'A consumer chat app'
        ],
        correct: 1,
        explanation: 'Scoped, named access on an approved system keeps the data controlled and auditable.'
      },
      {
        question: 'You accidentally pasted a confidential link into a public channel. You should:',
        options: [
          'Delete the message and hope nobody saw it',
          'Revoke or restrict the link and report the exposure',
          'Wait to see if anything happens',
          'Change your password only'
        ],
        correct: 1,
        explanation: 'Revoke access first, then report so the exposure can be assessed. Deleting the message does not remove copies already made.'
      },
      {
        question: 'Why is “anyone with the link” risky?',
        options: [
          'It makes files load slower',
          'The link can be forwarded or found, and access persists until changed',
          'It only works on mobile',
          'It compresses images'
        ],
        correct: 1,
        explanation: 'A public link removes the identity check. Anyone who obtains it can access the file until the setting changes.'
      },
      {
        question: 'Which is a common accidental insider leak?',
        options: [
          'A hacker breaking into the server',
          'Screen-sharing a window that displays unrelated sensitive data',
          'A phishing email',
          'A lost USB drive in a parking lot'
        ],
        correct: 1,
        explanation: 'Accidental disclosure during screen sharing, misaddressed email, or public links is a core insider-risk pattern.'
      }
    ]
  },

  {
    id: 'reporting',
    tier: 4,
    num: '16',
    icon: 'siren',
    title: 'The First Nine Minutes',
    subtitle: 'When & How to Report',
    desc: 'Speed matters more than certainty. Learn when to report, what to include, and why embarrassment costs nothing.',
    time: '5 min',
    risk: 'Critical',
    accent: '#ff8b8b',
    objectives: [
      'Report early, even when unsure',
      'Include the details responders need',
      'Know what not to do after a suspected compromise'
    ],
    scenes: [
      {
        type: 'brief',
        eyebrow: 'Tier 04 · Human & operational',
        title: 'Nine minutes *decide the outcome.*',
        lede: 'Most damage happens after the first click. The difference between a contained incident and a company-wide one is usually how quickly someone reports it.',
        stats: [
          { label: 'Best time to report', value: 'Immediately', note: 'Not after you are sure' },
          { label: 'What responders need', value: 'Facts', note: 'What, when, where, what you did' },
          { label: 'Cost of waiting', value: 'Sessions spread', note: 'Attackers move in minutes' }
        ],
        note: 'You will never be punished for reporting a mistake. You will be thanked.'
      },
      {
        type: 'story',
        label: 'Scene 01 · The click',
        title: 'You approved the prompt. Now what?',
        paragraphs: [
          'It was 9:48. The prompt looked normal. You tapped approve before you read the location. Ten minutes later, a colleague asks why you sent them a strange document.',
          'The instinct is to hide. Maybe it was nothing. Maybe you will look foolish. But every minute you wait, the attacker reads more mail, creates more rules, and sends more phishing from your account.',
          'Security does not need certainty. They need the time, the account, and what you saw. They can revoke sessions and reset credentials in minutes — if they know.'
        ],
        callout: {
          tone: 'good',
          title: 'Reporting is not confessing',
          body: 'It is giving responders a head start. Embarrassment is temporary. A week of mailbox access is not.'
        }
      },
      {
        type: 'flow',
        label: 'Scene 02 · The response',
        title: 'What happens after you report.',
        lede: 'A good report starts a process. You are the first step, not the whole response.',
        nodes: [
          { icon: 'siren', label: 'You report', detail: 'Tell security what happened, even if you are unsure.' },
          { icon: 'search', label: 'Triage', detail: 'Responders check the account, session, and indicators.' },
          { icon: 'shield', label: 'Contain', detail: 'Revoke sessions, reset credentials, isolate devices.' },
          { icon: 'wrench', label: 'Recover', detail: 'Restore access safely and remove attacker persistence.' },
          { icon: 'book', label: 'Learn', detail: 'Update filters and warn the people who may see the same attack.' }
        ],
        caption: 'A two-minute report can save days of incident response.'
      },
      {
        type: 'rules',
        label: 'Scene 03 · The playbook',
        title: 'How to report well.',
        lede: 'You do not need to investigate. You need to hand over the facts.',
        rules: [
          { title: 'Report early, not perfectly', body: '“I think I clicked something” is enough to start. Do not wait until you are certain.' },
          { title: 'Use the official channel', body: 'The security hotline, ticket queue, or report button. Not a direct message to a friend who “knows about computers.”' },
          { title: 'Include the basics', body: 'What happened, when, which account or device, what you clicked, and what you have done since.' },
          { title: 'Preserve the evidence', body: 'Do not delete the email or message. Screenshot it. Responders need the original headers and links.' },
          { title: 'Do not “fix it yourself”', body: 'Do not reset everything, wipe the device, or email the attacker. Follow instructions from responders.' },
          { title: 'Stay reachable', body: 'Responders may need a quick answer. Keep your phone available.' }
        ]
      },
      {
        type: 'debrief',
        title: 'Speed is a security control.',
        lede: 'The first report is not an admission. It is the start of containment.',
        checklist: [
          { title: 'Report, then breathe', body: 'You do not need to explain everything. Start the process.' },
          { title: 'Do not delete the evidence', body: 'Keep the message, the link, and the screenshots.' },
          { title: 'Follow responder instructions', body: 'They may ask you to disconnect, change a password, or bring the device in.' },
          { title: 'Tell others if asked', body: 'Your report may protect coworkers who received the same message.' }
        ],
        takeaway: 'The most valuable security tool you have is the report you make in the first nine minutes.'
      }
    ],
    questions: [
      {
        question: 'You think you clicked a phishing link but are not sure. You should:',
        options: [
          'Wait until you have proof before reporting',
          'Report it now through the official channel',
          'Delete the email and move on',
          'Ask a colleague to check your account'
        ],
        correct: 1,
        explanation: 'Speed matters more than certainty. Report early so responders can check sessions and contain the issue.'
      },
      {
        question: 'Which detail is most useful in a security report?',
        options: [
          'Your opinion of who sent it',
          'What happened, when, which account/device, and what you clicked',
          'A long explanation of why you are sorry',
          'The name of the person who trained you'
        ],
        correct: 1,
        explanation: 'Facts let responders act: timeline, account, device, and the exact link or message involved.'
      },
      {
        question: 'After reporting a suspected compromise, you should:',
        options: [
          'Delete the suspicious email',
          'Preserve the evidence and follow responder instructions',
          'Reset every account you own immediately without telling anyone',
          'Email the sender to ask what happened'
        ],
        correct: 1,
        explanation: 'Preserve evidence and follow the incident response process. Independent fixes can destroy useful information.'
      },
      {
        question: 'Why do organizations want reports even when nothing bad happened?',
        options: [
          'To punish the employee',
          'Because one report can reveal a campaign targeting many coworkers',
          'To collect statistics only',
          'Because policy requires paperwork'
        ],
        correct: 1,
        explanation: 'A single report can expose a campaign, trigger blocks, and warn other potential victims.'
      }
    ]
  }
]);
