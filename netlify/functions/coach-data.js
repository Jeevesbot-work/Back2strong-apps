// Coach dashboard data endpoint.
// Checks COACH_PASSWORD, then reads training-log form submissions from the
// Netlify Forms API and returns them aggregated by student. No secrets in HTML.
exports.handler = async (event) => {
  const COACH_PASSWORD = process.env.COACH_PASSWORD;
  const NETLIFY_TOKEN  = process.env.NETLIFY_ACCESS_TOKEN;
  const SITE_ID        = '546a5f69-1561-4e0b-9137-c58953ea0ef3';

  const pw = (event.queryStringParameters || {}).password || '';
  if (!COACH_PASSWORD || pw !== COACH_PASSWORD) {
    return { statusCode: 401, body: JSON.stringify({ error: 'Unauthorized' }) };
  }

  try {
    // 1. List this site's forms once
    const formsRes = await fetch(
      `https://api.netlify.com/api/v1/sites/${SITE_ID}/forms`,
      { headers: { Authorization: `Bearer ${NETLIFY_TOKEN}` } }
    );
    if (!formsRes.ok) throw new Error(`Forms API ${formsRes.status}`);
    const forms = await formsRes.json();

    const submissionsFor = async (name) => {
      const form = forms.find(f => f.name === name);
      if (!form) return [];
      const res = await fetch(
        `https://api.netlify.com/api/v1/forms/${form.id}/submissions?per_page=1000`,
        { headers: { Authorization: `Bearer ${NETLIFY_TOKEN}` } }
      );
      if (!res.ok) throw new Error(`Submissions API ${res.status}`);
      return res.json();
    };

    // 2. Training logs and sign-ins. Sign-ins mean a player who has opened the
    //    app but not yet saved a set still shows up on the dashboard.
    const [submissions, logins] = await Promise.all([
      submissionsFor('training-log'),
      submissionsFor('player-login'),
    ]);

    // Rows written before the sport field existed: netball squads carried a
    // 'Netball ' prefix, everything else was rugby.
    const normSport = (d) => {
      const raw = String(d.sport || '').trim().toLowerCase();
      if (raw === 'rugby' || raw === 'netball') return raw;
      return String(d.squad || '').trim().startsWith('Netball') ? 'netball' : 'rugby';
    };

    const studentMap = {};
    const ensure = (d) => {
      const name = String(d.student || '').trim();
      if (!name) return null;
      const sport = normSport(d);
      const squad = String(d.squad || '').trim().replace(/^Netball\s+/, '');
      const key = `${name}||${squad}||${sport}`;
      if (!studentMap[key]) {
        studentMap[key] = {
          student:  { name, squad, sport },
          logs:     {},
          lastSeen: null,
          lastLogin: null,
          firstLogin: null,
          loginCount: 0,
        };
      }
      return studentMap[key];
    };

    // 3. Fold in the sign-ins
    for (const sub of logins) {
      const s = ensure(sub.data || {});
      if (!s) continue;
      s.loginCount++;
      if (!s.lastLogin  || sub.created_at > s.lastLogin)  s.lastLogin  = sub.created_at;
      if (!s.firstLogin || sub.created_at < s.firstLogin) s.firstLogin = sub.created_at;
    }

    // 4. Fold in the training logs
    for (const sub of submissions) {
      const d = sub.data || {};
      const s = ensure(d);
      if (!s) continue;
      if (!s.lastSeen || sub.created_at > s.lastSeen) s.lastSeen = sub.created_at;

      const ex = String(d.exercise || '').trim();
      if (ex) {
        if (!s.logs[ex]) s.logs[ex] = [];
        const entry = { date: d.date || sub.created_at.slice(0, 10) };
        if (d.type === 'cardio') {
          entry.cardio = true;
          entry.note   = d.detail || '';
        } else {
          // detail format: "80kg × 8, 85kg × 6"
          const sets = String(d.detail || '').split(',').map(part => {
            const m = part.trim().match(/^([\d.]+)kg\s*[×x]\s*(\d+)/i);
            return m ? { weight: m[1], reps: m[2] } : null;
          }).filter(Boolean);
          if (sets.length) entry.sets = sets;
        }
        s.logs[ex].push(entry);
      }
    }

    // 5. Most recently active first — a sign-in counts as activity
    const recency = (s) => Math.max(
      s.lastSeen  ? new Date(s.lastSeen).getTime()  : 0,
      s.lastLogin ? new Date(s.lastLogin).getTime() : 0
    );
    const students = Object.values(studentMap).sort((a, b) => recency(b) - recency(a));

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ students }),
    };
  } catch (e) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: e.message }),
    };
  }
};
