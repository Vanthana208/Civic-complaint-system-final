/**
 * lang.js — E-Complaint Portal
 * Single source of truth: Flask session (server-side)
 * Client localStorage is only a fallback display cache
 */

/* ═══════════════════════════════════════════
   TRANSLATIONS
═══════════════════════════════════════════ */
var T = {
  en: {
    /* Nav - Home */
    'nav.features':'Features','nav.howworks':'How it Works','nav.contact':'Contact',
    'nav.signin':'Sign In','nav.dept':'Dept Portal','nav.admin':'Admin',
    /* Home page */
    'home.badge':'Smart City Infrastructure',
    'home.h1a':'Report. Track.','home.h1b':'Resolve Together.',
    'home.hero.p':'A citizen-first platform connecting communities with government departments to fix public infrastructure issues — faster, transparently, and with accountability.',
    'home.cta.start':'Get Started Free →','home.cta.how':'See How It Works',
    'home.card.citizen.title':'Citizen Portal','home.card.citizen.desc':'Report issues, track your complaints & earn points',
    'home.card.dept.title':'Department Portal','home.card.dept.desc':'Pick complaints from the common bin & assign workers',
    'home.card.admin.title':'Admin Dashboard','home.card.admin.desc':'Oversee all activity, manage departments & users',
    'home.feat.badge':'Features','home.feat.title':'Everything You Need','home.feat.sub':'A complete platform for modern civic complaint management',
    'home.feat1.title':'Geo-tagged Complaints','home.feat1.desc':'Every complaint is pinned to its exact location so the right team can respond immediately.',
    'home.feat2.title':'Departmental Routing','home.feat2.desc':'Issues are automatically routed to the right government department based on category.',
    'home.feat3.title':'Multi-language Support','home.feat3.desc':'Full support for English, தமிழ் (Tamil), and हिन्दी (Hindi) for wider accessibility.',
    'home.feat4.title':'Photo Proof System','home.feat4.desc':'Workers upload before/after photos. Citizens verify the resolution, ensuring accountability.',
    'home.feat5.title':'Citizen Rewards','home.feat5.desc':'Active citizens earn points for verified complaints, visible on a community leaderboard.',
    'home.feat6.title':'Real-time Dashboard','home.feat6.desc':'Admins and departments get live stats on complaint volumes, resolution rates, and more.',
    'home.how.badge':'Process','home.how.title':'How It Works','home.how.sub':'Simple, transparent workflow — from report to resolution',
    'home.step1.title':'Citizen Reports','home.step1.desc':'Submit a complaint with a photo, location and category. It lands in the common bin immediately.',
    'home.step2.title':'Department Claims','home.step2.desc':'The relevant department picks up the complaint and assigns a field worker to the job.',
    'home.step3.title':'Worker Resolves','home.step3.desc':'The assigned worker fixes the issue and uploads a proof photo to mark it resolved.',
    'home.step4.title':'Citizen Verifies','home.step4.desc':'The reporter confirms the fix. The admin closes the ticket and rewards the citizen.',
    'home.stats.badge':'Our Impact','home.stats.title':'Built for Scale','home.stats.sub':'Designed to handle entire cities, one complaint at a time',
    'home.stat1':'Active Users','home.stat2':'Resolution Rate','home.stat3':'Avg Response Time','home.stat4':'Departments Supported',
    'home.footer.brand':'Bridging citizens and government departments to build better cities together.',
    'home.footer.portals':'Portals','home.footer.citizen':'Citizen Login','home.footer.dept':'Department Login',
    'home.footer.admin':'Admin Login','home.footer.categories':'Categories','home.footer.support':'Support',
    'home.footer.help':'Help Center','home.footer.privacy':'Privacy Policy','home.footer.terms':'Terms',
    'home.footer.copy':'© 2026 ComplaintHub. All rights reserved.',
    /* Auth */
    'auth.login':'Login','auth.register':'Register','auth.email':'Email Address',
    'auth.password':'Password','auth.username':'Username','auth.role':'Select Role',
    'auth.role.user':'User','auth.role.worker':'Worker',
    'auth.no.account':"Don't have an account?",'auth.have.account':'Already have an account?',
    'auth.login.here':'Login here','auth.register.here':'Register here','auth.back.home':'Back to Home',
    /* User nav */
    'nav.dashboard':'Dashboard','nav.raise':'Raise Complaint','nav.track':'Track Complaints',
    'nav.leaderboard':'Leaderboard','nav.signout':'Sign Out',
    /* Complaint */
    'complaint.heading':'Raise a Complaint','complaint.subheading':'Please provide details about the issue.',
    'complaint.label.title':'Complaint Title','complaint.label.desc':'Detailed Description',
    'complaint.label.location':'Location','complaint.label.category':'Category',
    'complaint.label.image':'Upload Supporting Image (Optional)',
    'complaint.placeholder.title':'e.g. Street light not working',
    'complaint.placeholder.desc':'Describe the issue in detail…',
    'complaint.placeholder.location':'Enter the area or address',
    'complaint.submit':'Submit Complaint',
    /* Categories */
    'cat.streetlight':'Street Light','cat.water':'Water / Drainage',
    'cat.road':'Road Damage','cat.sanitation':'Sanitation','cat.other':'Other',
    /* My complaints */
    'mycomp.heading':'My Complaints','mycomp.subheading':'Track the progress of your reported issues in real-time.',
    'mycomp.verify':'Verify Now','mycomp.verified':'Verified','mycomp.no.image':'No Image',
    /* Dashboard */
    'dash.welcome':'Welcome','dash.today':"Here is what's happening with your account today.",
    'dash.total':'Total Raised','dash.resolved':'Resolved','dash.verified':'Verified',
    'dash.points':'Your Points','dash.tip':'Use the "Track Complaints" section to see real-time updates.',
    /* Leaderboard */
    'lb.heading':'Community Leaderboard','lb.subheading':'Recognising our most active citizens.',
    'lb.rank':'Rank','lb.contributor':'Contributor','lb.points':'Total Points',
    /* Dept */
    'dept.dashboard':'Dashboard','dept.logout':'Logout','dept.login.title':'Department Sign In',
    'dept.stats.bin':'Awaiting in Bin','dept.stats.assigned':'Assigned','dept.stats.resolved':'Resolved',
    'dept.bin.title':'Common Bin — Unassigned Complaints','dept.bin.empty':'No pending complaints in your category right now.',
    'dept.assign.worker':'Select Worker','dept.assign.btn':'Assign',
    'dept.active.title':'Active & Completed Assignments',
    'dept.col.complaint':'Complaint','dept.col.reporter':'Reported By',
    'dept.col.worker':'Assigned Worker','dept.col.status':'Status','dept.col.verify':'Verification',
    'dept.assign.title':'Assign a Worker to this Ticket','dept.no.workers':'⚠️ No free workers available.',
    'dept.assigned.to':'Worker assigned:',
    /* Admin */
    'admin.panel':'Admin Panel','admin.dashboard':'Dashboard','admin.complaints':'Complaints',
    'admin.users':'Users','admin.workers':'Add Workers','admin.departments':'Departments',
    'admin.leaderboard':'Leaderboard','admin.logout':'Logout',
    'admin.portal.title':'Admin Portal','admin.portal.desc':'Manage complaints, users, workers from one central dashboard.',
    'admin.stat.total':'Total Complaints','admin.stat.verified':'Verified Genuine',
    'admin.stat.bin':'Awaiting in Bin','admin.stat.users':'Total Users','admin.stat.workers':'Total Workers',
    'admin.col.id':'ID','admin.col.title':'Issue Title','admin.col.user':'User Name',
    'admin.col.status':'Status','admin.col.uverify':'User Verification','admin.col.image':'Resolved Image',
    'admin.col.averify':'Admin Verification','admin.col.action':'Action',
    'admin.action.genuine':'Genuine','admin.action.fake':'Fake',
    'admin.workers.title':'Manage Workers','admin.workers.add':'➕ Add New Worker',
    'admin.workers.name':'Full Name','admin.workers.email':'Email (for login)',
    'admin.workers.location':'Location / Area','admin.workers.btn':'Add Worker','admin.workers.list':'Registered Workers',
    'admin.verify.prompt':'Review this resolved ticket and mark it:',
    'admin.marked.genuine':'Marked as Genuine — User awarded 10 points',
    'admin.marked.fake':'Marked as Fake','admin.waiting.resolve':'Waiting for worker to resolve.',
    'admin.back.complaints':'← Back to All Complaints',
    /* Worker */
    'worker.panel':'Worker Panel','worker.assigned':'Assigned Work','worker.completed':'Completed Work',
    'worker.assigned.tasks':'Assigned Tasks','worker.view.assigned':'View Assigned Work →',
    'worker.view.history':'View History →','worker.update.title':'Update Complaint',
    'worker.update.desc':'Please upload a clear image of the completed work.',
    'worker.mark.resolved':'Mark as Resolved','worker.back.tasks':'← Back to Tasks',
    'worker.resolved.image':'Resolved Image','worker.schedule':"Here is what's on your schedule for today.",
    'worker.update.btn':'Update','worker.completed.label':'● Completed',
    'worker.welcome.desc':'You are successfully logged into the Worker Management Portal.',
    /* Ticket */
    'ticket.back':'← Back to My Complaints','ticket.back.dept':'← Back to Dashboard',
    'ticket.progress':'Ticket Progress','ticket.step1':'Raised','ticket.step2':'Assigned',
    'ticket.step3':'In Progress','ticket.step4':'Resolved','ticket.step5':'Verified',
    'ticket.status':'Status','ticket.department':'Department','ticket.worker':'Assigned Worker',
    'ticket.raised':'Raised On','ticket.location':'Location','ticket.admin.verify':'Admin Verification',
    'ticket.evidence':'Evidence Photo','ticket.resolved.photo':'Resolution Photo',
    'ticket.pending.resolution':'Pending...','ticket.verified.msg':'You have verified this complaint. Thank you!',
    'ticket.reporter':'Reported By',
    /* Verify */
    'verify.title':'Verify Complaint','verify.no.image':'No image uploaded yet.',
    'verify.btn':'Mark as Verified / Resolved',
    /* Dept login */
    'dept.email.placeholder':'e.g. water@gov.in',
  },

  ta: {
    'nav.features':'அம்சங்கள்','nav.howworks':'எவ்வாறு செயல்படுகிறது','nav.contact':'தொடர்பு',
    'nav.signin':'உள்நுழை','nav.dept':'துறை போர்டல்','nav.admin':'நிர்வாகி',
    'home.badge':'ஸ்மார்ட் சிட்டி உள்கட்டமைப்பு',
    'home.h1a':'புகாரிடுங்கள். கண்காணிக்கவும்.','home.h1b':'சேர்ந்து தீர்வு காண்போம்.',
    'home.hero.p':'குடிமக்களையும் அரசு துறைகளையும் இணைக்கும் வெளிப்படையான, பல மொழி தளம் — பொது உள்கட்டமைப்பு சிக்கல்களை விரைவாக தீர்க்கிறது.',
    'home.cta.start':'இலவசமாக தொடங்கவும் →','home.cta.how':'எவ்வாறு செயல்படுகிறது',
    'home.card.citizen.title':'குடிமகன் போர்டல்','home.card.citizen.desc':'சிக்கல்களை புகாரிடுங்கள், கண்காணிக்கவும் & மதிப்பெண்கள் பெறுங்கள்',
    'home.card.dept.title':'துறை போர்டல்','home.card.dept.desc':'பொது கூடையிலிருந்து புகார்களை எடுத்து தொழிலாளர்களை ஒதுக்கவும்',
    'home.card.admin.title':'நிர்வாக டாஷ்போர்டு','home.card.admin.desc':'அனைத்து செயல்பாடுகளை கண்காணிக்கவும்',
    'home.feat.badge':'அம்சங்கள்','home.feat.title':'உங்களுக்கு தேவையான அனைத்தும்','home.feat.sub':'நவீன குடிமை புகார் மேலாண்மைக்கான முழுமையான தளம்',
    'home.feat1.title':'இட-குறிப்பு புகார்கள்','home.feat1.desc':'ஒவ்வொரு புகாரும் சரியான இடத்தில் குறிக்கப்படுகிறது.',
    'home.feat2.title':'துறை வழிதல்','home.feat2.desc':'சிக்கல்கள் தானாகவே சரியான அரசு துறைக்கு அனுப்பப்படுகின்றன.',
    'home.feat3.title':'பல மொழி ஆதரவு','home.feat3.desc':'ஆங்கிலம், தமிழ் மற்றும் ஹிந்தி மொழிகளுக்கு முழு ஆதரவு.',
    'home.feat4.title':'புகைப்பட சான்று முறை','home.feat4.desc':'தொழிலாளர்கள் முன்/பின் புகைப்படங்களை பதிவேற்றுகிறார்கள்.',
    'home.feat5.title':'குடிமகன் வெகுமதிகள்','home.feat5.desc':'சரிபார்க்கப்பட்ட புகார்களுக்கு மதிப்பெண்கள் கிடைக்கும்.',
    'home.feat6.title':'நேரடி டாஷ்போர்டு','home.feat6.desc':'நிர்வாகிகளுக்கும் துறைகளுக்கும் நேரடி புள்ளிவிவரங்கள்.',
    'home.how.badge':'செயல்முறை','home.how.title':'எவ்வாறு செயல்படுகிறது','home.how.sub':'எளிய, வெளிப்படையான பணிப்பாய்வு',
    'home.step1.title':'குடிமகன் புகாரிடுகிறார்','home.step1.desc':'படம், இடம் மற்றும் வகையுடன் புகார் சமர்ப்பிக்கவும்.',
    'home.step2.title':'துறை எடுத்துக்கொள்கிறது','home.step2.desc':'சம்பந்தப்பட்ட துறை புகாரை எடுத்து தொழிலாளரை ஒதுக்குகிறது.',
    'home.step3.title':'தொழிலாளர் தீர்க்கிறார்','home.step3.desc':'தொழிலாளர் சிக்கலை சரிசெய்து ஆதாரப் படம் பதிவேற்றுகிறார்.',
    'home.step4.title':'குடிமகன் சரிபார்க்கிறார்','home.step4.desc':'புகாரிட்டவர் தீர்வை உறுதிப்படுத்துகிறார். நிர்வாகி டிக்கெட் மூடுகிறார்.',
    'home.stats.badge':'எங்கள் தாக்கம்','home.stats.title':'அளவுக்கு கட்டமைக்கப்பட்டது','home.stats.sub':'முழு நகரங்களை கையாளும் வகையில் வடிவமைக்கப்பட்டது',
    'home.stat1':'செயலில் உள்ள பயனர்கள்','home.stat2':'தீர்வு வீதம்','home.stat3':'சராசரி பதில் நேரம்','home.stat4':'துறைகள் ஆதரிக்கப்படுகின்றன',
    'home.footer.brand':'குடிமக்களையும் அரசு துறைகளையும் இணைத்து சிறந்த நகரங்களை உருவாக்குகிறோம்.',
    'home.footer.portals':'போர்டல்கள்','home.footer.citizen':'குடிமகன் உள்நுழைவு',
    'home.footer.dept':'துறை உள்நுழைவு','home.footer.admin':'நிர்வாக உள்நுழைவு',
    'home.footer.categories':'வகைகள்','home.footer.support':'ஆதரவு',
    'home.footer.help':'உதவி மையம்','home.footer.privacy':'தனியுரிமை கொள்கை',
    'home.footer.terms':'விதிமுறைகள்','home.footer.copy':'© 2026 ComplaintHub. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.',
    'auth.login':'உள்நுழை','auth.register':'பதிவு செய்க','auth.email':'மின்னஞ்சல் முகவரி',
    'auth.password':'கடவுச்சொல்','auth.username':'பயனர் பெயர்','auth.role':'பாத்திரம் தேர்வு செய்க',
    'auth.role.user':'பயனர்','auth.role.worker':'தொழிலாளி',
    'auth.no.account':'கணக்கு இல்லையா?','auth.have.account':'ஏற்கனவே கணக்கு உள்ளதா?',
    'auth.login.here':'இங்கே உள்நுழைக','auth.register.here':'இங்கே பதிவு செய்க','auth.back.home':'முகப்பிற்கு திரும்பு',
    'nav.dashboard':'டாஷ்போர்டு','nav.raise':'புகார் தெரிவிக்கவும்','nav.track':'புகார்களை கண்காணிக்கவும்',
    'nav.leaderboard':'தரவரிசை','nav.signout':'வெளியேறு',
    'complaint.heading':'புகார் தெரிவிக்கவும்','complaint.subheading':'சிக்கல் பற்றிய விவரங்களை வழங்கவும்.',
    'complaint.label.title':'புகார் தலைப்பு','complaint.label.desc':'விரிவான விளக்கம்',
    'complaint.label.location':'இடம்','complaint.label.category':'வகை',
    'complaint.label.image':'ஆதாரப் படம் பதிவேற்றவும் (விரும்பினால்)',
    'complaint.placeholder.title':'எ.கா. தெரு விளக்கு வேலை செய்யவில்லை',
    'complaint.placeholder.desc':'சிக்கலை விரிவாக விவரிக்கவும்…',
    'complaint.placeholder.location':'பகுதி அல்லது முகவரி உள்ளிடவும்',
    'complaint.submit':'புகாரை சமர்ப்பிக்கவும்',
    'cat.streetlight':'தெரு விளக்கு','cat.water':'தண்ணீர் / வடிகால்',
    'cat.road':'சாலை சேதம்','cat.sanitation':'சுகாதாரம்','cat.other':'மற்றவை',
    'mycomp.heading':'என் புகார்கள்','mycomp.subheading':'உங்கள் புகார்களின் நிலையை நேரலையில் கண்காணிக்கவும்.',
    'mycomp.verify':'இப்போது சரிபார்க்கவும்','mycomp.verified':'சரிபார்க்கப்பட்டது','mycomp.no.image':'படம் இல்லை',
    'dash.welcome':'வருக','dash.today':'இன்று உங்கள் கணக்கில் என்ன நடக்கிறது.',
    'dash.total':'மொத்தம் தெரிவித்தது','dash.resolved':'தீர்க்கப்பட்டது','dash.verified':'சரிபார்க்கப்பட்டது',
    'dash.points':'உங்கள் மதிப்பெண்கள்','dash.tip':'"புகார்களை கண்காணிக்கவும்" பிரிவைப் பயன்படுத்துங்கள்.',
    'lb.heading':'சமூக தரவரிசை','lb.subheading':'சுறுசுறுப்பான குடிமக்களை அங்கீகரிக்கிறோம்.',
    'lb.rank':'வரிசை','lb.contributor':'பங்களிப்பாளர்','lb.points':'மொத்த மதிப்பெண்கள்',
    'dept.dashboard':'டாஷ்போர்டு','dept.logout':'வெளியேறு','dept.login.title':'துறை உள்நுழைவு',
    'dept.stats.bin':'கூடையில் காத்திருக்கும்','dept.stats.assigned':'ஒதுக்கப்பட்டது','dept.stats.resolved':'தீர்க்கப்பட்டது',
    'dept.bin.title':'பொது கூடை — ஒதுக்கப்படாத புகார்கள்','dept.bin.empty':'இப்போது நிலுவையில் உள்ள புகார்கள் இல்லை.',
    'dept.assign.worker':'தொழிலாளரை தேர்வு செய்க','dept.assign.btn':'ஒதுக்கு',
    'dept.active.title':'செயலில் உள்ள மற்றும் முடிந்த பணிகள்',
    'dept.col.complaint':'புகார்','dept.col.reporter':'தெரிவித்தவர்',
    'dept.col.worker':'ஒதுக்கப்பட்ட தொழிலாளி','dept.col.status':'நிலை','dept.col.verify':'சரிபார்ப்பு',
    'dept.assign.title':'இந்த டிக்கெட்டுக்கு தொழிலாளர் ஒதுக்கவும்',
    'dept.no.workers':'⚠️ இப்போது கட்டாயமான தொழிலாளர்கள் இல்லை.','dept.assigned.to':'தொழிலாளர் ஒதுக்கப்பட்டார்:',
    'admin.panel':'நிர்வாக பலகை','admin.dashboard':'டாஷ்போர்டு','admin.complaints':'புகார்கள்',
    'admin.users':'பயனர்கள்','admin.workers':'தொழிலாளர்களை சேர்க்கவும்',
    'admin.departments':'துறைகள்','admin.leaderboard':'தரவரிசை','admin.logout':'வெளியேறு',
    'admin.portal.title':'நிர்வாக போர்டல்','admin.portal.desc':'ஒரு மத்திய டாஷ்போர்டிலிருந்து நிர்வகிக்கவும்.',
    'admin.stat.total':'மொத்த புகார்கள்','admin.stat.verified':'உண்மையானவை சரிபார்க்கப்பட்டது',
    'admin.stat.bin':'கூடையில் காத்திருக்கும்','admin.stat.users':'மொத்த பயனர்கள்','admin.stat.workers':'மொத்த தொழிலாளர்கள்',
    'admin.col.id':'எண்','admin.col.title':'சிக்கல் தலைப்பு','admin.col.user':'பயனர் பெயர்',
    'admin.col.status':'நிலை','admin.col.uverify':'பயனர் சரிபார்ப்பு','admin.col.image':'தீர்வு படம்',
    'admin.col.averify':'நிர்வாக சரிபார்ப்பு','admin.col.action':'செயல்',
    'admin.action.genuine':'உண்மையானது','admin.action.fake':'போலியானது',
    'admin.workers.title':'தொழிலாளர்களை நிர்வகிக்கவும்','admin.workers.add':'➕ புதிய தொழிலாளர் சேர்க்கவும்',
    'admin.workers.name':'முழு பெயர்','admin.workers.email':'மின்னஞ்சல் (உள்நுழைவுக்கு)',
    'admin.workers.location':'இடம் / பகுதி','admin.workers.btn':'தொழிலாளர் சேர்க்கவும்','admin.workers.list':'பதிவு செய்யப்பட்ட தொழிலாளர்கள்',
    'admin.verify.prompt':'இந்த தீர்க்கப்பட்ட டிக்கெட்டை மதிப்பாய்வு செய்யுங்கள்:',
    'admin.marked.genuine':'உண்மையானது என குறிக்கப்பட்டது — 10 மதிப்பெண்கள்',
    'admin.marked.fake':'போலியானது என குறிக்கப்பட்டது','admin.waiting.resolve':'தொழிலாளர் தீர்க்கும் வரை காத்திருக்கிறது.',
    'admin.back.complaints':'← எல்லா புகார்களுக்கும் திரும்பு',
    'worker.panel':'தொழிலாளர் பலகை','worker.assigned':'ஒதுக்கப்பட்ட பணி','worker.completed':'முடிந்த பணி',
    'worker.assigned.tasks':'ஒதுக்கப்பட்ட பணிகள்','worker.view.assigned':'ஒதுக்கப்பட்ட பணிகளை பார்க்கவும் →',
    'worker.view.history':'வரலாற்றை பார்க்கவும் →','worker.update.title':'புகாரை புதுப்பிக்கவும்',
    'worker.update.desc':'பணி முடிந்தது என்பதை காட்ட தெளிவான படம் பதிவேற்றவும்.',
    'worker.mark.resolved':'தீர்க்கப்பட்டதாக குறிக்கவும்','worker.back.tasks':'← பணிகளுக்கு திரும்பு',
    'worker.resolved.image':'தீர்வு படம்','worker.schedule':'இன்று உங்கள் அட்டவணையில் உள்ளது.',
    'worker.update.btn':'புதுப்பிக்கவும்','worker.completed.label':'● முடிந்தது',
    'worker.welcome.desc':'தொழிலாளர் மேலாண்மை போர்டலில் வெற்றிகரமாக உள்நுழைந்தீர்கள்.',
    'ticket.back':'← என் புகார்களுக்கு திரும்பு','ticket.back.dept':'← டாஷ்போர்டுக்கு திரும்பு',
    'ticket.progress':'டிக்கெட் நிலை','ticket.step1':'தெரிவித்தது','ticket.step2':'ஒதுக்கப்பட்டது',
    'ticket.step3':'செயல்பாட்டில்','ticket.step4':'தீர்க்கப்பட்டது','ticket.step5':'சரிபார்க்கப்பட்டது',
    'ticket.status':'நிலை','ticket.department':'துறை','ticket.worker':'ஒதுக்கப்பட்ட தொழிலாளி',
    'ticket.raised':'தெரிவித்த தேதி','ticket.location':'இடம்','ticket.admin.verify':'நிர்வாக சரிபார்ப்பு',
    'ticket.evidence':'ஆதாரப் படம்','ticket.resolved.photo':'தீர்வு படம்',
    'ticket.pending.resolution':'நிலுவையில்...','ticket.verified.msg':'நீங்கள் இந்த புகாரை சரிபார்த்தீர்கள். நன்றி!',
    'ticket.reporter':'தெரிவித்தவர்',
    'verify.title':'புகாரை சரிபார்க்கவும்','verify.no.image':'இன்னும் படம் பதிவேற்றப்படவில்லை.',
    'verify.btn':'சரிபார்க்கப்பட்டது / தீர்க்கப்பட்டது என குறிக்கவும்',
    'dept.email.placeholder':'எ.கா. water@gov.in',
  },

  hi: {
    'nav.features':'विशेषताएं','nav.howworks':'यह कैसे काम करता है','nav.contact':'संपर्क',
    'nav.signin':'साइन इन','nav.dept':'विभाग पोर्टल','nav.admin':'व्यवस्थापक',
    'home.badge':'स्मार्ट सिटी इंफ्रास्ट्रक्चर',
    'home.h1a':'रिपोर्ट करें। ट्रैक करें।','home.h1b':'मिलकर हल करें।',
    'home.hero.p':'नागरिकों और सरकारी विभागों को जोड़ने वाला एक पारदर्शी, बहुभाषी मंच।',
    'home.cta.start':'मुफ़्त शुरू करें →','home.cta.how':'यह कैसे काम करता है',
    'home.card.citizen.title':'नागरिक पोर्टल','home.card.citizen.desc':'समस्याएं रिपोर्ट करें, शिकायतें ट्रैक करें और अंक अर्जित करें',
    'home.card.dept.title':'विभाग पोर्टल','home.card.dept.desc':'सामान्य बिन से शिकायतें उठाएं और कर्मचारी नियुक्त करें',
    'home.card.admin.title':'व्यवस्थापक डैशबोर्ड','home.card.admin.desc':'सभी गतिविधियों की निगरानी करें',
    'home.feat.badge':'विशेषताएं','home.feat.title':'आपको जो चाहिए वो सब','home.feat.sub':'आधुनिक नागरिक शिकायत प्रबंधन के लिए एक पूर्ण मंच',
    'home.feat1.title':'जियो-टैग की गई शिकायतें','home.feat1.desc':'हर शिकायत उसके सटीक स्थान पर पिन होती है।',
    'home.feat2.title':'विभागीय रूटिंग','home.feat2.desc':'समस्याएं स्वचालित रूप से सही विभाग को भेजी जाती हैं।',
    'home.feat3.title':'बहुभाषी समर्थन','home.feat3.desc':'अंग्रेजी, तमिल और हिंदी के लिए पूर्ण समर्थन।',
    'home.feat4.title':'फोटो प्रमाण प्रणाली','home.feat4.desc':'कर्मचारी पहले/बाद की तस्वीरें अपलोड करते हैं।',
    'home.feat5.title':'नागरिक पुरस्कार','home.feat5.desc':'सत्यापित शिकायतों के लिए अंक मिलते हैं।',
    'home.feat6.title':'रीयल-टाइम डैशबोर्ड','home.feat6.desc':'लाइव आंकड़े।',
    'home.how.badge':'प्रक्रिया','home.how.title':'यह कैसे काम करता है','home.how.sub':'सरल, पारदर्शी कार्यप्रवाह',
    'home.step1.title':'नागरिक रिपोर्ट करता है','home.step1.desc':'फोटो, स्थान और श्रेणी के साथ शिकायत दर्ज करें।',
    'home.step2.title':'विभाग उठाता है','home.step2.desc':'संबंधित विभाग शिकायत लेकर कर्मचारी नियुक्त करता है।',
    'home.step3.title':'कर्मचारी हल करता है','home.step3.desc':'कर्मचारी समस्या ठीक करके प्रमाण फोटो अपलोड करता है।',
    'home.step4.title':'नागरिक सत्यापित करता है','home.step4.desc':'रिपोर्टर समाधान की पुष्टि करता है।',
    'home.stats.badge':'हमारा प्रभाव','home.stats.title':'बड़े पैमाने के लिए बनाया गया','home.stats.sub':'पूरे शहरों को संभालने के लिए डिज़ाइन किया गया',
    'home.stat1':'सक्रिय उपयोगकर्ता','home.stat2':'समाधान दर','home.stat3':'औसत प्रतिक्रिया समय','home.stat4':'विभाग समर्थित',
    'home.footer.brand':'नागरिकों और सरकारी विभागों को जोड़कर बेहतर शहर बनाना।',
    'home.footer.portals':'पोर्टल','home.footer.citizen':'नागरिक लॉगिन',
    'home.footer.dept':'विभाग लॉगिन','home.footer.admin':'व्यवस्थापक लॉगिन',
    'home.footer.categories':'श्रेणियां','home.footer.support':'समर्थन',
    'home.footer.help':'सहायता केंद्र','home.footer.privacy':'गोपनीयता नीति',
    'home.footer.terms':'शर्तें','home.footer.copy':'© 2026 ComplaintHub. सर्वाधिकार सुरक्षित।',
    'auth.login':'लॉग इन करें','auth.register':'पंजीकरण करें','auth.email':'ईमेल पता',
    'auth.password':'पासवर्ड','auth.username':'उपयोगकर्ता नाम','auth.role':'भूमिका चुनें',
    'auth.role.user':'उपयोगकर्ता','auth.role.worker':'कर्मचारी',
    'auth.no.account':'खाता नहीं है?','auth.have.account':'पहले से खाता है?',
    'auth.login.here':'यहाँ लॉग इन करें','auth.register.here':'यहाँ पंजीकरण करें','auth.back.home':'होम पर वापस जाएं',
    'nav.dashboard':'डैशबोर्ड','nav.raise':'शिकायत दर्ज करें','nav.track':'शिकायतें ट्रैक करें',
    'nav.leaderboard':'लीडरबोर्ड','nav.signout':'साइन आउट',
    'complaint.heading':'शिकायत दर्ज करें','complaint.subheading':'कृपया समस्या के बारे में विवरण प्रदान करें।',
    'complaint.label.title':'शिकायत शीर्षक','complaint.label.desc':'विस्तृत विवरण',
    'complaint.label.location':'स्थान','complaint.label.category':'श्रेणी',
    'complaint.label.image':'सहायक छवि अपलोड करें (वैकल्पिक)',
    'complaint.placeholder.title':'उदा. सड़क की बत्ती काम नहीं कर रही',
    'complaint.placeholder.desc':'समस्या को विस्तार से वर्णन करें…',
    'complaint.placeholder.location':'क्षेत्र या पता दर्ज करें',
    'complaint.submit':'शिकायत सबमिट करें',
    'cat.streetlight':'सड़क की बत्ती','cat.water':'पानी / नाली',
    'cat.road':'सड़क क्षति','cat.sanitation':'स्वच्छता','cat.other':'अन्य',
    'mycomp.heading':'मेरी शिकायतें','mycomp.subheading':'अपनी रिपोर्ट की गई समस्याओं की प्रगति ट्रैक करें।',
    'mycomp.verify':'अभी सत्यापित करें','mycomp.verified':'सत्यापित','mycomp.no.image':'कोई छवि नहीं',
    'dash.welcome':'स्वागत है','dash.today':'आज आपके खाते में क्या हो रहा है।',
    'dash.total':'कुल दर्ज','dash.resolved':'हल किया गया','dash.verified':'सत्यापित',
    'dash.points':'आपके अंक','dash.tip':'"शिकायतें ट्रैक करें" अनुभाग का उपयोग करें।',
    'lb.heading':'सामुदायिक लीडरबोर्ड','lb.subheading':'सबसे सक्रिय नागरिकों को पहचानना।',
    'lb.rank':'रैंक','lb.contributor':'योगदानकर्ता','lb.points':'कुल अंक',
    'dept.dashboard':'डैशबोर्ड','dept.logout':'लॉग आउट','dept.login.title':'विभाग साइन इन',
    'dept.stats.bin':'बिन में प्रतीक्षित','dept.stats.assigned':'सौंपा गया','dept.stats.resolved':'हल किया गया',
    'dept.bin.title':'सामान्य बिन — असौंपी शिकायतें','dept.bin.empty':'अभी कोई लंबित शिकायत नहीं है।',
    'dept.assign.worker':'कर्मचारी चुनें','dept.assign.btn':'सौंपें',
    'dept.active.title':'सक्रिय और पूर्ण असाइनमेंट',
    'dept.col.complaint':'शिकायत','dept.col.reporter':'रिपोर्ट किया',
    'dept.col.worker':'सौंपा कर्मचारी','dept.col.status':'स्थिति','dept.col.verify':'सत्यापन',
    'dept.assign.title':'इस टिकट के लिए कर्मचारी नियुक्त करें',
    'dept.no.workers':'⚠️ अभी कोई मुक्त कर्मचारी उपलब्ध नहीं।','dept.assigned.to':'कर्मचारी नियुक्त:',
    'admin.panel':'व्यवस्थापक पैनल','admin.dashboard':'डैशबोर्ड','admin.complaints':'शिकायतें',
    'admin.users':'उपयोगकर्ता','admin.workers':'कर्मचारी जोड़ें',
    'admin.departments':'विभाग','admin.leaderboard':'लीडरबोर्ड','admin.logout':'लॉग आउट',
    'admin.portal.title':'व्यवस्थापक पोर्टल','admin.portal.desc':'एक केंद्रीय डैशबोर्ड से प्रबंधित करें।',
    'admin.stat.total':'कुल शिकायतें','admin.stat.verified':'वास्तविक सत्यापित',
    'admin.stat.bin':'बिन में प्रतीक्षित','admin.stat.users':'कुल उपयोगकर्ता','admin.stat.workers':'कुल कर्मचारी',
    'admin.col.id':'क्रमांक','admin.col.title':'समस्या शीर्षक','admin.col.user':'उपयोगकर्ता नाम',
    'admin.col.status':'स्थिति','admin.col.uverify':'उपयोगकर्ता सत्यापन','admin.col.image':'समाधान छवि',
    'admin.col.averify':'व्यवस्थापक सत्यापन','admin.col.action':'कार्रवाई',
    'admin.action.genuine':'वास्तविक','admin.action.fake':'नकली',
    'admin.workers.title':'कर्मचारी प्रबंधित करें','admin.workers.add':'➕ नया कर्मचारी जोड़ें',
    'admin.workers.name':'पूरा नाम','admin.workers.email':'ईमेल (लॉगिन के लिए)',
    'admin.workers.location':'स्थान / क्षेत्र','admin.workers.btn':'कर्मचारी जोड़ें','admin.workers.list':'पंजीकृत कर्मचारी',
    'admin.verify.prompt':'इस हल किए गए टिकट की समीक्षा करें:',
    'admin.marked.genuine':'वास्तविक चिह्नित — 10 अंक मिले',
    'admin.marked.fake':'नकली चिह्नित','admin.waiting.resolve':'कर्मचारी के हल करने की प्रतीक्षा।',
    'admin.back.complaints':'← सभी शिकायतों पर वापस',
    'worker.panel':'कर्मचारी पैनल','worker.assigned':'सौंपा गया कार्य','worker.completed':'पूर्ण कार्य',
    'worker.assigned.tasks':'सौंपे गए कार्य','worker.view.assigned':'सौंपे गए कार्य देखें →',
    'worker.view.history':'इतिहास देखें →','worker.update.title':'शिकायत अपडेट करें',
    'worker.update.desc':'कार्य पूर्ण होने का स्पष्ट फोटो अपलोड करें।',
    'worker.mark.resolved':'हल किया गया चिह्नित करें','worker.back.tasks':'← कार्यों पर वापस',
    'worker.resolved.image':'समाधान छवि','worker.schedule':'आज आपके शेड्यूल में यह है।',
    'worker.update.btn':'अपडेट करें','worker.completed.label':'● पूर्ण',
    'worker.welcome.desc':'आप कर्मचारी पोर्टल में सफलतापूर्वक लॉग इन हैं।',
    'ticket.back':'← मेरी शिकायतों पर वापस','ticket.back.dept':'← डैशबोर्ड पर वापस',
    'ticket.progress':'टिकट प्रगति','ticket.step1':'दर्ज किया','ticket.step2':'सौंपा गया',
    'ticket.step3':'प्रगति में','ticket.step4':'हल किया','ticket.step5':'सत्यापित',
    'ticket.status':'स्थिति','ticket.department':'विभाग','ticket.worker':'सौंपा कर्मचारी',
    'ticket.raised':'दर्ज तिथि','ticket.location':'स्थान','ticket.admin.verify':'व्यवस्थापक सत्यापन',
    'ticket.evidence':'साक्ष्य फोटो','ticket.resolved.photo':'समाधान फोटो',
    'ticket.pending.resolution':'प्रतीक्षित...','ticket.verified.msg':'आपने इस शिकायत को सत्यापित किया। धन्यवाद!',
    'ticket.reporter':'रिपोर्टर',
    'verify.title':'शिकायत सत्यापित करें','verify.no.image':'अभी तक कोई छवि अपलोड नहीं हुई।',
    'verify.btn':'सत्यापित / हल किया गया चिह्नित करें',
    'dept.email.placeholder':'उदा. water@gov.in',
  }
};

/* ═══════════════════════════════════════
   CORE — get lang from server html tag first
═══════════════════════════════════════ */
var LANG_KEY = 'ecomplaint_lang';

function getLang() {
  /* 1. Server-rendered html lang attr — highest priority */
  var serverLang = document.documentElement.getAttribute('lang');
  if (serverLang && T[serverLang]) {
    localStorage.setItem(LANG_KEY, serverLang);
    return serverLang;
  }
  /* 2. URL param */
  var urlLang = new URLSearchParams(window.location.search).get('lang');
  if (urlLang && T[urlLang]) return urlLang;
  /* 3. localStorage */
  var stored = localStorage.getItem(LANG_KEY);
  if (stored && T[stored]) return stored;
  return 'en';
}

function applyLang(lang) {
  if (!T[lang]) lang = 'en';
  localStorage.setItem(LANG_KEY, lang);

  var dict = T[lang];
  var els = document.querySelectorAll('[data-i18n]');
  for (var i = 0; i < els.length; i++) {
    var el = els[i];
    var key = el.getAttribute('data-i18n');
    if (dict[key] !== undefined) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = dict[key];
      } else {
        el.textContent = dict[key];
      }
    }
  }

  /* Update button label */
  var btn = document.getElementById('lang-toggle-btn');
  if (btn) {
    var labels = { en:'🌐 EN', ta:'🌐 தமிழ்', hi:'🌐 हिंदी' };
    btn.textContent = labels[lang] || '🌐 EN';
  }

  /* Highlight active option */
  var opts = document.querySelectorAll('.lang-opt');
  for (var j = 0; j < opts.length; j++) {
    var isActive = opts[j].getAttribute('data-lang') === lang;
    opts[j].style.background = isActive ? '#eef2ff' : 'transparent';
    opts[j].style.fontWeight  = isActive ? '800' : '600';
  }
}

/* ═══════════════════════════════════════
   BUILD SWITCHER
═══════════════════════════════════════ */
function buildLangSwitcher() {
  var container = document.getElementById('lang-switcher');
  if (!container || container.getAttribute('data-built')) return;
  container.setAttribute('data-built', '1');

  var inNav = !!(
    container.closest('nav') ||
    container.closest('.nav-container') ||
    container.closest('.auth-buttons') ||
    container.closest('.top-bar')
  );

  var btnCSS = inNav
    ? 'background:#f0f4f8;border:1.5px solid #d1d9e0;color:#1A1D29;padding:7px 16px;border-radius:8px;cursor:pointer;font-size:0.84rem;font-weight:700;font-family:inherit;'
    : 'background:rgba(255,255,255,0.15);border:1px solid rgba(255,255,255,0.35);color:#fff;padding:6px 14px;border-radius:20px;cursor:pointer;font-size:0.82rem;font-weight:600;font-family:inherit;';

  var ddPos = inNav
    ? 'top:calc(100% + 8px);right:0;left:auto;'
    : 'bottom:calc(100% + 8px);left:0;right:auto;';

  container.innerHTML =
    '<div style="position:relative;display:inline-block;">' +
      '<button id="lang-toggle-btn" style="' + btnCSS + '">🌐 EN</button>' +
      '<div id="lang-dropdown" style="display:none;position:absolute;' + ddPos +
        'background:#fff;border-radius:10px;box-shadow:0 8px 28px rgba(0,0,0,0.16);' +
        'overflow:hidden;min-width:148px;z-index:99999;border:1px solid #e2e8f0;">' +
        '<button class="lang-opt" data-lang="en" style="display:block;width:100%;padding:11px 16px;border:none;background:transparent;text-align:left;cursor:pointer;font-size:0.88rem;color:#1e293b;font-family:inherit;font-weight:600;">🇬🇧 English</button>' +
        '<button class="lang-opt" data-lang="ta" style="display:block;width:100%;padding:11px 16px;border:none;background:transparent;text-align:left;cursor:pointer;font-size:0.88rem;color:#1e293b;font-family:inherit;font-weight:600;">🇮🇳 தமிழ்</button>' +
        '<button class="lang-opt" data-lang="hi" style="display:block;width:100%;padding:11px 16px;border:none;background:transparent;text-align:left;cursor:pointer;font-size:0.88rem;color:#1e293b;font-family:inherit;font-weight:600;">🇮🇳 हिन्दी</button>' +
      '</div>' +
    '</div>';

  /* Hover effects */
  var opts = container.querySelectorAll('.lang-opt');
  for (var i = 0; i < opts.length; i++) {
    (function(opt) {
      opt.onmouseenter = function() { if (opt.style.background !== '#eef2ff') opt.style.background = '#f8fafc'; };
      opt.onmouseleave = function() { if (opt.style.background !== '#eef2ff') opt.style.background = 'transparent'; };

      opt.addEventListener('click', function(e) {
        e.stopPropagation();
        var lang = opt.getAttribute('data-lang');
        applyLang(lang);
        /* Tell server to save in session — then reload current page with new lang */
        fetch('/set-lang/' + lang)
          .then(function() { location.reload(); })
          .catch(function() { location.reload(); });
        var dd = document.getElementById('lang-dropdown');
        if (dd) dd.style.display = 'none';
      });
    })(opts[i]);
  }

  /* Toggle dropdown */
  document.getElementById('lang-toggle-btn').addEventListener('click', function(e) {
    e.stopPropagation();
    var dd = document.getElementById('lang-dropdown');
    if (dd) dd.style.display = (dd.style.display === 'none' || dd.style.display === '') ? 'block' : 'none';
  });

  /* Close on outside click */
  document.addEventListener('click', function() {
    var dd = document.getElementById('lang-dropdown');
    if (dd) dd.style.display = 'none';
  });
}

/* ═══════════════════════════════════════
   INIT
═══════════════════════════════════════ */
function initLang() {
  buildLangSwitcher();
  applyLang(getLang());
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLang);
} else {
  initLang();
}
