/* ============================================================
   FIREWALL BREACH OPS - Answer key + content
   NOTE: hints are meant to be found on screen. Fragments are
   ord() obfuscated so a curious analyst cannot read them in
   DevTools. Keep this file out of the offline dist.
   ============================================================ */

const O = (arr) => arr.map(c => String.fromCharCode(c)).join("");

const GameData = {
  /* --- physical key --- */
  fragments: [O([70, 82, 77]), O([50, 54]), O([88, 80])],       // FRM / 26 / XP
  overrideCode: O([70, 82, 77, 45, 50, 54, 45, 88, 80]),         // FRM-26-XP

  /* three real hint words -> these are printed on the box lids */
  hintKey: [
    { hint: "FAKE URGENCY",         source: "mail", id: "m1" },
    { hint: "ASKING FOR PASSWORD",  source: "chat", id: "c1" },
    { hint: "FAKE SENDER",          source: "chat", id: "c2" }
  ],

  /* ---------------- MAIL ---------------- */
  mails: [
    {
      id: "m1",
      from: "accounts@maybank-secure-verify.com",
      fromName: "Maybank Security",
      subject: "URGENT: Your account will be suspended in 2 hours",
      time: "08:14",
      flagged: true,
      flagText: "Unverified sender domain",
      body: [
        `Dear Valued Customer,`,
        `We have detected unusual activity on your Maybank account. To protect your funds, your online banking access has been temporarily LIMITED.`,
        { cls: "trap", hint: "FAKE URGENCY", text: `Please respond with your updated banking information before 2PM or your account will be permanently closed.` },
        `Failure to verify within the given time will result in permanent suspension of your account and any remaining balance may be frozen for up to 90 days.`,
        `We apologise for any inconvenience caused and appreciate your prompt cooperation.`,
      ],
      sig: `Maybank Customer Security Team\nsecurity@maybank-secure-verify.com\nThis is an automated message. Please do not reply directly.`
    },
    {
      id: "m2",
      from: "invoice@globalship.com",
      fromName: "GlobalShip Billing",
      subject: "Invoice #4471 — February shipment",
      time: "07:52",
      body: [
        `Hi team,`,
        `Please find the summary of Invoice <b>#4471</b> for the February shipment below. The PDF copy has been attached to this message for your records.`,
        `<div style="background:#0d1626;border:1px solid #1f2c44;border-radius:8px;padding:12px 16px;font-family:Consolas,monospace;font-size:12.5px;line-height:1.9;margin:14px 0;">
        Invoice No. : 4471<br>
        Date        : 12 February 2026<br>
        Waybill     : GS-88214-MY<br>
        Route       : Port Klang &rarr; Penang<br>
        Freight     : RM 1,840.00<br>
        Handling    : RM   120.00<br>
        Insurance   : RM    95.00<br>
        <span style="color:#34d399">Total due   : RM 2,055.00</span><br>
        Payment due : 28 February 2026</div>`,
        `Payment is due by 28 February 2026 as per our standard 14-day terms. Our bank details are unchanged from previous invoices — please contact billing directly if you need them re-issued.`,
        `Let us know if you need the customs declaration attached as well.`,
      ],
      sig: `Best regards,\nNurul Huda\nBilling Executive, GlobalShip Logistics\ninvoice@globalship.com`
    },
    {
      id: "m3",
      from: "hr@company.com",
      fromName: "Human Resources",
      subject: "Updated leave policy 2026 — effective 1 March",
      time: "Yesterday",
      body: [
        `Dear colleagues,`,
        `Following the review by the People Committee last month, we are updating our annual leave policy effective <b>1 March 2026</b>. The main changes are summarised below.`,
        `<b>1. Leave carry-forward</b><br>Unused annual leave may now be carried forward up to a maximum of 8 days into the following calendar year. Previously this was 5 days. Carried-forward days must be used before 30 June.`,
        `<b>2. Compassionate leave</b><br>Compassionate leave has been increased from 3 to 5 working days per calendar year, covering immediate family members. Supporting documentation is required for absences longer than 2 days.`,
        `<b>3. Replacement leave</b><br>Where an employee is required to work on a gazetted public holiday, replacement leave must be applied for within 60 days of the date worked, not 30 days as previously stated.`,
        `All requests still go through the HR portal under <i>My Leave &rarr; New Application</i>. Balances as of 31 December 2025 have been migrated automatically, so there is no action needed on your side.`,
        `If you have questions, drop by the HR counter on level 3 or reply to this email.`,
      ],
      sig: `Regards,\nFarah Idris\nHuman Resources Department\nhr@company.com`
    },
    {
      id: "m4",
      from: "noreply@lms.edu",
      fromName: "Learning Portal",
      subject: "Assignment deadline extended to 20 February",
      time: "Yesterday",
      body: [
        `Dear student,`,
        `Following several requests from the cohort, the submission deadline for <b>Assignment 2 &mdash; Network Fundamentals</b> has been extended.`,
        `<div style="background:#0d1626;border:1px solid #1f2c44;border-radius:8px;padding:12px 16px;font-family:Consolas,monospace;font-size:12.5px;line-height:1.9;margin:14px 0;">
        Module      : Network Fundamentals<br>
        Assignment  : Assignment 2<br>
        Old due     : 15 February 2026, 23:59<br>
        <span style="color:#34d399">New due     : 20 February 2026, 23:59</span><br>
        Submission  : Learning Portal &rarr; Assessments</div>`,
        `Late submissions will still be accepted up to 48 hours after the new deadline with a 10% penalty per day, as stated in the module handbook.`,
        `Please note that the extension applies to Assignment 2 only. The lab report deadline is unchanged.`,
      ],
      sig: `This is an automated message from the Learning Portal.\nDo not reply to this address.`
    },
    {
      id: "m5",
      from: "team@company.com",
      fromName: "Aiman Rahman",
      subject: "Friday lunch — vote for venue",
      time: "Yesterday",
      body: [
        `Oi everyone,`,
        `Friday lunch is on the company card this month (yes, really). I've shortlisted four places within walking distance. Reply with a number by Thursday 5pm so I can book.`,
        `<div style="background:#0d1626;border:1px solid #1f2c44;border-radius:8px;padding:12px 16px;font-size:13px;line-height:2;margin:14px 0;">
        <b>1.</b> Nasi Kandar Pelita &mdash; cheap, fast, always open<br>
        <b>2.</b> The Banana Leaf &mdash; good for a big group, a bit loud<br>
        <b>3.</b> Sakura Sushi &mdash; slightly over budget but worth it<br>
        <b>4.</b> Warung Pak Din &mdash; 10 min walk, best curry in the area</div>`,
        `Current votes: 1 &rarr; 2 people, 2 &rarr; 3 people, 3 &rarr; 1 person, 4 &rarr; 4 people. Looks like Pak Din is winning but it's close.`,
        `Also — someone left a black umbrella in the pantry since Monday. It's leaning against the fridge. Come get it before it becomes office property.`,
      ],
      sig: `Aiman\nQA Team`
    },
    {
      id: "m6",
      from: "it-support@company.com",
      fromName: "IT Support",
      subject: "Scheduled maintenance Saturday 22 Feb, 1am–4am",
      time: "Mon",
      body: [
        `Dear all,`,
        `We will be performing scheduled maintenance on the internal file server and VPN gateway this Saturday from <b>1:00am to 4:00am</b>. During this window, access to shared drives and remote login may be unavailable.`,
        `Email, chat and printing will not be affected.`,
        `<b>A reminder about account safety:</b><br>IT Support will <b>never</b> ask you for your password, your one-time code, or ask you to click a link to "verify" your account. If anyone contacts you claiming to be from IT and asks for those things, it is not us — report it and do not reply.`,
        `If you experience issues after 4:00am on Saturday, please raise a ticket through the helpdesk portal rather than replying to this email.`,
      ],
      sig: `IT Support Team\nit-support@company.com\nExt. 4412`
    }
  ],

  /* ---------------- CHATX ---------------- */
  chats: [
    {
      id: "c1",
      name: "Unknown",
      sub: "+60 12-889-4413 · not in your contacts",
      warn: true,
      tag: "NEW",
      preview: "Hi, this is Maybank. We detected a problem…",
      messages: [
        { who: "them", t: "08:02", text: "Good morning, is this Mr. Danial?" },
        { who: "me",   t: "08:05", text: "Who is this?" },
        { who: "them", t: "08:06", text: "This is Maybank Customer Security. We detected a problem with your account this morning. Someone attempted a transfer of RM 4,300." },
        { who: "me",   t: "08:07", text: "What? I didn't do any transfer" },
        { who: "them", t: "08:07", text: "We know. That is why we are contacting you. We have blocked it for now." },
        { who: "them", t: "08:08", text: "To confirm the block, we need to verify your identity. An OTP has been sent to your phone.", trap: true, hint: "ASKING FOR PASSWORD", text: "Send us the 6-digit code we just SMSed you so we can cancel the transfer." },
        { who: "them", t: "08:08", text: "Please hurry, the transfer will be released in 10 minutes." },
        { who: "them", t: "08:09", text: "Sir? Are you there?" }
      ]
    },
    {
      id: "c2",
      name: "Aina (Boss)",
      sub: "+60 19-772-1104 · number differs from saved contact",
      warn: true,
      tag: "NEW NUMBER",
      preview: "Hi it's me, I changed my number…",
      messages: [
        { who: "sys", t: "", text: "This contact matches a name in your phonebook but the number is not saved" },
        { who: "them", t: "10:41", text: "Hi, it's me. I dropped my phone in the sink so this is my new number. Please save it." },
        { who: "me",   t: "10:48", text: "Oh no, are you okay? Noted!" },
        { who: "them", t: "10:49", text: "Fine fine. Listen, I'm in a meeting until 12 so I can't take calls." },
        { who: "them", t: "10:50", text: "Can you help me settle something small? The courier is holding a package for me at the office lobby and wants RM 2 for the delivery fee." },
        { who: "them", t: "10:50", text: "Just pay at this link, it's faster than waiting for me.", trap: true, hint: "FAKE SENDER", text: "homerr-clone.site/track — pay RM 2 and it will release the parcel." },
        { who: "them", t: "10:52", text: "Please do it now, the courier is waiting outside. I'll pay you back." },
        { who: "them", t: "10:55", text: "Hello?" }
      ]
    },
    {
      id: "c3",
      name: "Sarah (IT)",
      sub: "Ext. 4412 · internal",
      preview: "Hey, are you at your desk? We saw something…",
      messages: [
        { who: "them", t: "08:20", text: "Hey, are you at your desk? We saw something weird on your account this morning." },
        { who: "me",   t: "08:24", text: "Yeah I'm here. Weird how?" },
        { who: "them", t: "08:24", text: "A login from an IP address we don't recognise, about 3am. Then a bunch of files got touched." },
        { who: "me",   t: "08:25", text: "That wasn't me, I was asleep" },
        { who: "them", t: "08:26", text: "I know. Just be careful — there's been a wave of messages going around this morning. People getting texts and emails pretending to be the bank, the boss, the courier. All different." },
        { who: "them", t: "08:27", text: "Whatever you do, don't share codes and don't click any payment links. We'll handle the account on our side." },
        { who: "me",   t: "08:28", text: "Okay. So what do I do?" },
        { who: "them", t: "08:29", text: "Read through everything you've got this morning. Mail and chat. Somewhere in there is the thing that started it. Find what's wrong, then come tell me what you found." },
        { who: "them", t: "08:30", text: "And don't delete anything. I need the evidence." }
      ]
    },
    {
      id: "c4",
      name: "Class Group",
      sub: "12 members",
      preview: "photo_caption: kantin again 😭",
      messages: [
        { who: "sys", t: "", text: "+3 messages from earlier" },
        { who: "them", t: "09:12", text: "who took the photo during lab just now 😭", sender: "Haziq" },
        { who: "them", t: "09:12", text: "kantin again 😭", sender: "Haziq" },
        { who: "them", t: "09:13", text: "that's food not lab work hahaha", sender: "Mei Ling" },
        { who: "them", t: "09:14", text: "guys when is the lab report due again", sender: "Afif" },
        { who: "me",   t: "09:15", text: "20th, they extended it" },
        { who: "them", t: "09:15", text: "BLESS 🙏", sender: "Afif" },
        { who: "them", t: "09:16", text: "anyone going to the printing shop later? need to print the appendix", sender: "Mei Ling" },
        { who: "me",   t: "09:18", text: "maybe after lunch" },
        { who: "them", t: "09:19", text: "ok let me know, I'll follow", sender: "Mei Ling" },
        { who: "them", t: "09:21", text: "btw did anyone else get a weird email this morning saying their account is suspended", sender: "Afif" },
        { who: "them", t: "09:21", text: "I got one too, deleted it already", sender: "Haziq" }
      ]
    },
    {
      id: "c5",
      name: "Delivery Co.",
      sub: "Nationwide Express · verified",
      preview: "Your parcel MY8821457 has been delivered…",
      messages: [
        { who: "sys", t: "", text: "Verified business account" },
        { who: "them", t: "07:40", text: "Good morning. Your parcel from Shopee is out for delivery today." },
        { who: "them", t: "07:40", text: "Tracking: MY8821457\nCourier: Nationwide Express\nETA: between 10:00 and 14:00" },
        { who: "me",   t: "07:55", text: "Thanks, I'll be home" },
        { who: "them", t: "11:32", text: "Your parcel has been delivered. Signed by: DANIAL" },
        { who: "them", t: "11:32", text: "If this was not you, reply to this message and we will open a case. Do not pay any fee requested by third parties claiming to be us." }
      ]
    }
  ],

  /* ---------------- FILES ---------------- */
  files: {
    Desktop: [
      { name: "RANSOM_NOTE.txt", icon: "file", open: "ransom" },
      { name: "TO-DO.txt", icon: "file", open: "todo" },
      { name: "Inbox", icon: "folder", open: "Inbox" },
      { name: "Documents", icon: "folder", open: "Documents" },
      { name: "Downloads", icon: "folder", open: "Downloads" }
    ],
    Documents: [
      { name: "StaffHandbook_2026.pdf", icon: "file" },
      { name: "Budget_Q1.xlsx", icon: "file" },
      { name: "MeetingNotes_Feb.docx", icon: "file" }
    ],
    Downloads: [
      { name: "invoice_4471.pdf.exe", icon: "exe", sus: true },
      { name: "setup_chrome_update.exe", icon: "exe" },
      { name: "photo_2026.zip", icon: "file" }
    ],
    Inbox: [
      { name: "Email Backup (4).txt", icon: "file" },
      { name: "Email Backup (3).txt", icon: "file" }
    ]
  },

  notes: {
    todo: `TO-DO — this week\n\n[x] Submit timesheet\n[x] Renew laptop antivirus\n[ ] Reply to GlobalShip invoice\n[ ] Dentist Friday 3pm\n[ ] Fix the printer in pantry (again)\n[ ] Ask IT why my laptop is so slow\n\n\nnever mind any of that now i guess`,
    ransom: null
  },

  processes: [
    { name: "System Idle Process", cpu: "78%", mem: "8 K", pid: 0 },
    { name: "explorer.exe", cpu: "2%", mem: "84,320 K", pid: 4021 },
    { name: "dwm.exe", cpu: "1%", mem: "45,110 K", pid: 1180 },
    { name: "svchost.exe", cpu: "0%", mem: "12,884 K", pid: 992 },
    { name: "chrome.exe", cpu: "4%", mem: "312,440 K", pid: 7712 },
    { name: "OUTLOOK.EXE", cpu: "1%", mem: "128,900 K", pid: 6634 },
    { name: "ChatX.exe", cpu: "2%", mem: "96,220 K", pid: 6891 },
    { name: "NOTMALWARE.exe", cpu: "41%", mem: "666,666 K", pid: 1337, sus: true },
    { name: "locker.sys", cpu: "6%", mem: "1,024 K", pid: 1777, sus: true }
  ]
};
