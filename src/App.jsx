import { useState, useEffect, useCallback } from "react";

// ─── CONSTANTS ───────────────────────────────────────────────────────────────
const NUM_MANAGERS = 8;
const PICKS_EACH = 18; // 14 players + 4 teams
const MAX_GK = 2;
const STARTER_SLOTS = { ATT: 2, MID: 2, DEF: 2, GK: 1 };
const BENCH_SIZE = 7;
const TEAM_SLOTS = 4;
const ACTIVE_TEAMS = 2;

const TIER_INFO = {
1: { label:"Elite", color:"#f59e0b" },
2: { label:"Contender", color:"#60a5fa" },
3: { label:"Dark Horse", color:"#a78bfa" },
4: { label:"Wildcard", color:"#6b7280" },
};

const POS_COLOR = { ATT:"#ef4444", MID:"#3b82f6", DEF:"#22c55e", GK:"#f59e0b" };

const MANAGER_COLORS = [
"#f59e0b","#60a5fa","#34d399","#f472b6",
"#fb923c","#a78bfa","#4ade80","#f87171",
];

// ─── DATA ────────────────────────────────────────────────────────────────────
const TEAMS = [
{id:"t1", name:"Brazil", flag:"🇧🇷", tier:1},
{id:"t2", name:"France", flag:"🇫🇷", tier:1},
{id:"t3", name:"England", flag:"🏴󠁧󠁢󠁥󠁮󠁧󠁿", tier:1},
{id:"t4", name:"Spain", flag:"🇪🇸", tier:1},
{id:"t5", name:"Argentina", flag:"🇦🇷", tier:1},
{id:"t6", name:"Germany", flag:"🇩🇪", tier:1},
{id:"t7", name:"Portugal", flag:"🇵🇹", tier:1},
{id:"t8", name:"Netherlands", flag:"🇳🇱", tier:2},
{id:"t9", name:"Belgium", flag:"🇧🇪", tier:2},
{id:"t10", name:"Uruguay", flag:"🇺🇾", tier:2},
{id:"t11", name:"USA", flag:"🇺🇸", tier:2},
{id:"t12", name:"Mexico", flag:"🇲🇽", tier:2},
{id:"t13", name:"Japan", flag:"🇯🇵", tier:2},
{id:"t14", name:"Croatia", flag:"🇭🇷", tier:2},
{id:"t15", name:"Morocco", flag:"🇲🇦", tier:2},
{id:"t16", name:"Colombia", flag:"🇨🇴", tier:2},
{id:"t17", name:"Denmark", flag:"🇩🇰", tier:2},
{id:"t18", name:"Switzerland", flag:"🇨🇭", tier:2},
{id:"t19", name:"Senegal", flag:"🇸🇳", tier:3},
{id:"t20", name:"South Korea", flag:"🇰🇷", tier:3},
{id:"t21", name:"Ecuador", flag:"🇪🇨", tier:3},
{id:"t22", name:"Canada", flag:"🇨🇦", tier:3},
{id:"t23", name:"Serbia", flag:"🇷🇸", tier:3},
{id:"t24", name:"Poland", flag:"🇵🇱", tier:3},
{id:"t25", name:"Turkey", flag:"🇹🇷", tier:3},
{id:"t26", name:"Austria", flag:"🇦🇹", tier:3},
{id:"t27", name:"Saudi Arabia", flag:"🇸🇦", tier:3},
{id:"t28", name:"Nigeria", flag:"🇳🇬", tier:3},
{id:"t29", name:"Ivory Coast", flag:"🇨🇮", tier:3},
{id:"t30", name:"Tunisia", flag:"🇹🇳", tier:3},
{id:"t31", name:"Czech Rep.", flag:"🇨🇿", tier:4},
{id:"t32", name:"Australia", flag:"🇦🇺", tier:4},
{id:"t33", name:"Iran", flag:"🇮🇷", tier:4},
{id:"t34", name:"Venezuela", flag:"🇻🇪", tier:4},
{id:"t35", name:"Algeria", flag:"🇩🇿", tier:4},
{id:"t36", name:"Panama", flag:"🇵🇦", tier:4},
{id:"t37", name:"Slovakia", flag:"🇸🇰", tier:4},
{id:"t38", name:"Bolivia", flag:"🇧🇴", tier:4},
{id:"t39", name:"Jamaica", flag:"🇯🇲", tier:4},
{id:"t40", name:"Qatar", flag:"🇶🇦", tier:4},
{id:"t41", name:"Paraguay", flag:"🇵🇾", tier:4},
{id:"t42", name:"New Zealand", flag:"🇳🇿", tier:4},
{id:"t43", name:"Honduras", flag:"🇭🇳", tier:4},
{id:"t44", name:"Ghana", flag:"🇬🇭", tier:4},
{id:"t45", name:"Cameroon", flag:"🇨🇲", tier:4},
{id:"t46", name:"Romania", flag:"🇷🇴", tier:4},
{id:"t47", name:"Egypt", flag:"🇪🇬", tier:4},
{id:"t48", name:"Costa Rica", flag:"🇨🇷", tier:4},
];

const PLAYERS = [
// ATT
{id:"p1", name:"Kylian Mbappé", team:"France", pos:"ATT", rating:99, flag:"🇫🇷"},
{id:"p2", name:"Erling Haaland", team:"Norway", pos:"ATT", rating:97, flag:"🇳🇴"},
{id:"p3", name:"Vinicius Jr.", team:"Brazil", pos:"ATT", rating:97, flag:"🇧🇷"},
{id:"p4", name:"Lamine Yamal", team:"Spain", pos:"ATT", rating:94, flag:"🇪🇸"},
{id:"p5", name:"Harry Kane", team:"England", pos:"ATT", rating:92, flag:"🏴󠁧󠁢󠁥󠁮󠁧󠁿"},
{id:"p6", name:"Lautaro Martínez", team:"Argentina", pos:"ATT", rating:91, flag:"🇦🇷"},
{id:"p7", name:"Bukayo Saka", team:"England", pos:"ATT", rating:91, flag:"🏴󠁧󠁢󠁥󠁮󠁧󠁿"},
{id:"p8", name:"Antoine Griezmann", team:"France", pos:"ATT", rating:90, flag:"🇫🇷"},
{id:"p9", name:"Julian Alvarez", team:"Argentina", pos:"ATT", rating:89, flag:"🇦🇷"},
{id:"p10", name:"Rafael Leão", team:"Portugal", pos:"ATT", rating:89, flag:"🇵🇹"},
{id:"p11", name:"Nico Williams", team:"Spain", pos:"ATT", rating:88, flag:"🇪🇸"},
{id:"p12", name:"Rodrygo", team:"Brazil", pos:"ATT", rating:88, flag:"🇧🇷"},
{id:"p13", name:"Kai Havertz", team:"Germany", pos:"ATT", rating:87, flag:"🇩🇪"},
{id:"p14", name:"Darwin Núñez", team:"Uruguay", pos:"ATT", rating:87, flag:"🇺🇾"},
{id:"p15", name:"Leroy Sané", team:"Germany", pos:"ATT", rating:87, flag:"🇩🇪"},
{id:"p16", name:"Cody Gakpo", team:"Netherlands", pos:"ATT", rating:86, flag:"🇳🇱"},
{id:"p17", name:"Marcus Rashford", team:"England", pos:"ATT", rating:85, flag:"🏴󠁧󠁢󠁥󠁮󠁧󠁿"},
{id:"p18", name:"Romelu Lukaku", team:"Belgium", pos:"ATT", rating:85, flag:"🇧🇪"},
{id:"p19", name:"Richarlison", team:"Brazil", pos:"ATT", rating:84, flag:"🇧🇷"},
{id:"p20", name:"Memphis Depay", team:"Netherlands", pos:"ATT", rating:83, flag:"🇳🇱"},
{id:"p21", name:"Dušan Vlahović", team:"Serbia", pos:"ATT", rating:83, flag:"🇷🇸"},
{id:"p22", name:"Ferran Torres", team:"Spain", pos:"ATT", rating:82, flag:"🇪🇸"},
{id:"p23", name:"Ivan Toney", team:"England", pos:"ATT", rating:82, flag:"🏴󠁧󠁢󠁥󠁮󠁧󠁿"},
{id:"p24", name:"Donyell Malen", team:"Netherlands", pos:"ATT", rating:81, flag:"🇳🇱"},
// MID
{id:"p25", name:"Jude Bellingham", team:"England", pos:"MID", rating:96, flag:"🏴󠁧󠁢󠁥󠁮󠁧󠁿"},
{id:"p26", name:"Pedri", team:"Spain", pos:"MID", rating:93, flag:"🇪🇸"},
{id:"p27", name:"Florian Wirtz", team:"Germany", pos:"MID", rating:92, flag:"🇩🇪"},
{id:"p28", name:"Jamal Musiala", team:"Germany", pos:"MID", rating:91, flag:"🇩🇪"},
{id:"p29", name:"Kevin De Bruyne", team:"Belgium", pos:"MID", rating:91, flag:"🇧🇪"},
{id:"p30", name:"Gavi", team:"Spain", pos:"MID", rating:90, flag:"🇪🇸"},
{id:"p31", name:"Bruno Fernandes", team:"Portugal", pos:"MID", rating:90, flag:"🇵🇹"},
{id:"p32", name:"Bernardo Silva", team:"Portugal", pos:"MID", rating:89, flag:"🇵🇹"},
{id:"p33", name:"Declan Rice", team:"England", pos:"MID", rating:88, flag:"🏴󠁧󠁢󠁥󠁮󠁧󠁿"},
{id:"p34", name:"Dani Olmo", team:"Spain", pos:"MID", rating:88, flag:"🇪🇸"},
{id:"p35", name:"Enzo Fernández", team:"Argentina", pos:"MID", rating:87, flag:"🇦🇷"},
{id:"p36", name:"Alexis Mac Allister", team:"Argentina", pos:"MID", rating:87, flag:"🇦🇷"},
{id:"p37", name:"Rodrigo", team:"Spain", pos:"MID", rating:87, flag:"🇪🇸"},
{id:"p38", name:"Ilkay Gündogan", team:"Germany", pos:"MID", rating:86, flag:"🇩🇪"},
{id:"p39", name:"Frenkie de Jong", team:"Netherlands", pos:"MID", rating:86, flag:"🇳🇱"},
{id:"p40", name:"Paquetá", team:"Brazil", pos:"MID", rating:86, flag:"🇧🇷"},
{id:"p41", name:"Nicolo Barella", team:"Italy", pos:"MID", rating:87, flag:"🇮🇹"},
{id:"p42", name:"Aurélien Tchouaméni", team:"France", pos:"MID", rating:86, flag:"🇫🇷"},
{id:"p43", name:"Adrien Rabiot", team:"France", pos:"MID", rating:84, flag:"🇫🇷"},
{id:"p44", name:"Sofyan Amrabat", team:"Morocco", pos:"MID", rating:83, flag:"🇲🇦"},
{id:"p45", name:"Vitinha", team:"Portugal", pos:"MID", rating:85, flag:"🇵🇹"},
{id:"p46", name:"Kieran Trippier", team:"England", pos:"MID", rating:83, flag:"🏴󠁧󠁢󠁥󠁮󠁧󠁿"},
{id:"p47", name:"Sandro Tonali", team:"Italy", pos:"MID", rating:84, flag:"🇮🇹"},
{id:"p48", name:"Pierre-Emile Hojbjerg", team:"Denmark", pos:"MID", rating:83, flag:"🇩🇰"},
// DEF
{id:"p49", name:"Virgil van Dijk", team:"Netherlands", pos:"DEF", rating:92, flag:"🇳🇱"},
{id:"p50", name:"Rúben Dias", team:"Portugal", pos:"DEF", rating:91, flag:"🇵🇹"},
{id:"p51", name:"Antonio Rüdiger", team:"Germany", pos:"DEF", rating:89, flag:"🇩🇪"},
{id:"p52", name:"Trent Alexander-Arnold", team:"England", pos:"DEF", rating:88, flag:"🏴󠁧󠁢󠁥󠁮󠁧󠁿"},
{id:"p53", name:"Achraf Hakimi", team:"Morocco", pos:"DEF", rating:88, flag:"🇲🇦"},
{id:"p54", name:"Marquinhos", team:"Brazil", pos:"DEF", rating:88, flag:"🇧🇷"},
{id:"p55", name:"Josko Gvardiol", team:"Croatia", pos:"DEF", rating:87, flag:"🇭🇷"},
{id:"p56", name:"Theo Hernández", team:"France", pos:"DEF", rating:87, flag:"🇫🇷"},
{id:"p57", name:"William Saliba", team:"France", pos:"DEF", rating:87, flag:"🇫🇷"},
{id:"p58", name:"Aymeric Laporte", team:"Spain", pos:"DEF", rating:87, flag:"🇪🇸"},
{id:"p59", name:"Eder Militão", team:"Brazil", pos:"DEF", rating:87, flag:"🇧🇷"},
{id:"p60", name:"Lisandro Martínez", team:"Argentina", pos:"DEF", rating:86, flag:"🇦🇷"},
{id:"p61", name:"Nuno Mendes", team:"Portugal", pos:"DEF", rating:85, flag:"🇵🇹"},
{id:"p62", name:"Kyle Walker", team:"England", pos:"DEF", rating:85, flag:"🏴󠁧󠁢󠁥󠁮󠁧󠁿"},
{id:"p63", name:"John Stones", team:"England", pos:"DEF", rating:85, flag:"🏴󠁧󠁢󠁥󠁮󠁧󠁿"},
{id:"p64", name:"Dayot Upamecano", team:"France", pos:"DEF", rating:85, flag:"🇫🇷"},
{id:"p65", name:"Jeremie Frimpong", team:"Netherlands", pos:"DEF", rating:84, flag:"🇳🇱"},
{id:"p66", name:"Nicolás Tagliafico", team:"Argentina", pos:"DEF", rating:82, flag:"🇦🇷"},
{id:"p67", name:"Mats Hummels", team:"Germany", pos:"DEF", rating:83, flag:"🇩🇪"},
{id:"p68", name:"Denzel Dumfries", team:"Netherlands", pos:"DEF", rating:83, flag:"🇳🇱"},
// GK
{id:"p69", name:"Alisson Becker", team:"Brazil", pos:"GK", rating:92, flag:"🇧🇷"},
{id:"p70", name:"Emiliano Martínez", team:"Argentina", pos:"GK", rating:91, flag:"🇦🇷"},
{id:"p71", name:"Thibaut Courtois", team:"Belgium", pos:"GK", rating:91, flag:"🇧🇪"},
{id:"p72", name:"Gianluigi Donnarumma", team:"Italy", pos:"GK", rating:90, flag:"🇮🇹"},
{id:"p73", name:"Mike Maignan", team:"France", pos:"GK", rating:88, flag:"🇫🇷"},
{id:"p74", name:"Manuel Neuer", team:"Germany", pos:"GK", rating:87, flag:"🇩🇪"},
{id:"p75", name:"Unai Simón", team:"Spain", pos:"GK", rating:86, flag:"🇪🇸"},
{id:"p76", name:"Diogo Costa", team:"Portugal", pos:"GK", rating:85, flag:"🇵🇹"},
{id:"p77", name:"Jordan Pickford", team:"England", pos:"GK", rating:85, flag:"🏴󠁧󠁢󠁥󠁮󠁧󠁿"},
{id:"p78", name:"Yann Sommer", team:"Switzerland", pos:"GK", rating:84, flag:"🇨🇭"},
{id:"p79", name:"Mark Flekken", team:"Netherlands", pos:"GK", rating:82, flag:"🇳🇱"},
{id:"p80", name:"Andriy Lunin", team:"Ukraine", pos:"GK", rating:82, flag:"🇺🇦"},
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function buildDraftOrder(n, picks) {
const order = [];
for (let r = 0; r < picks; r++) {
const row = Array.from({length: n}, (_, i) => i);
if (r % 2 === 1) row.reverse();
order.push(...row);
}
return order;
}

const DRAFT_ORDER = buildDraftOrder(NUM_MANAGERS, PICKS_EACH);
const TOTAL_PICKS = NUM_MANAGERS * PICKS_EACH;

function getRosterCounts(roster) {
const players = roster.filter(r => r.type === "player");
const teams = roster.filter(r => r.type === "team");
const gks = players.filter(p => p.item.pos === "GK").length;
const byCounts = {};
for (const pos of ["ATT","MID","DEF","GK"]) {
byCounts[pos] = players.filter(p => p.item.pos === pos).length;
}
return { players: players.length, teams: teams.length, gks, byCounts };
}

function canDraft(item, roster, type) {
const { players, teams, gks } = getRosterCounts(roster);
if (type === "team") return teams < TEAM_SLOTS;
if (type === "player") {
if (players >= 14) return false;
if (item.pos === "GK" && gks >= MAX_GK) return false;
return true;
}
return false;
}

function getBlockReason(item, roster, type) {
const { players, teams, gks } = getRosterCounts(roster);
if (type === "team" && teams >= TEAM_SLOTS) return "Squad already has 4 teams";
if (type === "player" && players >= 14) return "Squad is full (14 players)";
if (type === "player" && item.pos === "GK" && gks >= MAX_GK) return "Max 2 GKs per squad";
return null;
}

// ─── MAIN APP ────────────────────────────────────────────────────────────────
export default function App() {
const [screen, setScreen] = useState("setup");
const [managerNames, setManagerNames] = useState(Array.from({length:8}, (_,i) => `Manager ${i+1}`));
const [rosters, setRosters] = useState(Array.from({length:8}, () => []));
const [pickIndex, setPickIndex] = useState(0);
const [drafted, setDrafted] = useState(new Set());
const [filterPos, setFilterPos] = useState("ALL");
const [filterType, setFilterType] = useState("ALL");
const [search, setSearch] = useState("");
const [viewManager, setViewManager] = useState(0);
const [notification, setNotification] = useState(null);
const [draftComplete, setDraftComplete] = useState(false);
const [sortBy, setSortBy] = useState("rating");
const [hoveredItem, setHoveredItem] = useState(null);

const currentManagerIdx = DRAFT_ORDER[pickIndex];
const currentRound = Math.floor(pickIndex / NUM_MANAGERS) + 1;

function notify(msg, color = "#22c55e") {
setNotification({msg, color});
setTimeout(() => setNotification(null), 2800);
}

function draftItem(item, type) {
if (drafted.has(item.id)) return;
const roster = rosters[currentManagerIdx];
const reason = getBlockReason(item, roster, type);
if (reason) { notify(reason, "#ef4444"); return; }

const newRosters = rosters.map((r, i) =>
i === currentManagerIdx ? [...r, {item, type}] : r
);
setRosters(newRosters);
setDrafted(prev => new Set([...prev, item.id]));

const displayName = type === "team"
? `${item.flag} ${item.name}`
: `${item.name} (${item.pos})`;
notify(`${managerNames[currentManagerIdx]} picks ${displayName}!`);

const next = pickIndex + 1;
if (next >= TOTAL_PICKS) {
setDraftComplete(true);
setScreen("roster");
} else {
setPickIndex(next);
}
}

// ─────────────────────────── SETUP ────────────────────────────────────────
if (screen === "setup") {
return (
<div style={S.page}>
<div style={S.setupWrap}>
<div style={S.setupHero}>
<div style={{fontSize:72, lineHeight:1}}>🏆</div>
<h1 style={S.heroTitle}>WORLD CUP 2026</h1>
<div style={S.heroSub}>FANTASY DRAFT POOL</div>
<div style={S.heroDivider} />
<div style={S.heroStats}>
{[["8","Managers"],["18","Picks Each"],["144","Total Picks"],["48","Teams"]].map(([n,l]) => (
<div key={l} style={S.heroStat}>
<div style={S.heroStatNum}>{n}</div>
<div style={S.heroStatLabel}>{l}</div>
</div>
))}
</div>
</div>

<div style={S.setupCard}>
<div style={S.setupCardHeader}>
<h2 style={S.setupCardTitle}>MANAGER NAMES</h2>
<p style={S.setupCardSub}>Customize each manager before draft day</p>
</div>
<div style={S.managerGrid}>
{managerNames.map((name, i) => (
<div key={i} style={S.managerInputRow}>
<div style={{...S.managerDot, background: MANAGER_COLORS[i]}}>{i+1}</div>
<input
style={S.textInput}
value={name}
onChange={e => {
const n = [...managerNames];
n[i] = e.target.value;
setManagerNames(n);
}}
placeholder={`Manager ${i+1}`}
/>
</div>
))}
</div>

<div style={S.rulesRow}>
{[
{icon:"⚽", t:"14 Players", s:"7 starters + 7 flex bench"},
{icon:"🏟️", t:"4 Teams", s:"Activate 2 per round"},
{icon:"🔄", t:"Serpentine", s:"Snake order, 18 rounds"},
{icon:"🔒", t:"Locks Live", s:"Players lock when game starts"},
].map(({icon,t,s}) => (
<div key={t} style={S.ruleChip}>
<span style={{fontSize:20}}>{icon}</span>
<div>
<div style={{fontWeight:700, fontSize:12}}>{t}</div>
<div style={{color:"#475569", fontSize:10}}>{s}</div>
</div>
</div>
))}
</div>

<button style={S.startBtn} onClick={() => setScreen("draft")}>
🚀 START DRAFT
</button>
</div>
</div>
</div>
);
}

// ─────────────────────────── SCORING INFO ─────────────────────────────────
if (screen === "scoring") {
return (
<div style={S.page}>
<TopBar screen={screen} setScreen={setScreen} draftComplete={draftComplete} />
<div style={S.infoPage}>
<h2 style={S.infoTitle}>📊 Scoring System</h2>
<div style={S.scoringGrid}>
<div style={S.scoreBlock}>
<div style={S.scoreBlockTitle}>⚽ PLAYER POINTS</div>
{[
["Goal — ATT / MID", "+10", "#22c55e"],
["Goal — DEF / GK", "+15", "#22c55e"],
["Assist", "+6", "#22c55e"],
["Clean Sheet (GK)", "+8", "#22c55e"],
["Clean Sheet (DEF)","+5", "#22c55e"],
["Yellow Card", "−2", "#ef4444"],
["Red Card", "−6", "#ef4444"],
].map(([k,v,c]) => (
<div key={k} style={S.scoreRow}>
<span style={{color:"#94a3b8"}}>{k}</span>
<span style={{fontWeight:800, color:c, fontSize:15}}>{v} pts</span>
</div>
))}
</div>
<div style={S.scoreBlock}>
<div style={S.scoreBlockTitle}>🏟️ TEAM POINTS — PER WIN</div>
{[
["Group Stage", "+5"],
["Round of 32", "+8"],
["Round of 16", "+10"],
["Quarter-Final", "+12"],
["Semi-Final", "+15"],
["Final", "+18"],
].map(([k,v]) => (
<div key={k} style={S.scoreRow}>
<span style={{color:"#94a3b8"}}>{k}</span>
<span style={{fontWeight:800, color:"#22c55e", fontSize:15}}>{v} pts</span>
</div>
))}
<div style={{height:1, background:"rgba(255,255,255,0.06)", margin:"12px 0"}} />
<div style={S.scoreBlockTitle}>🏆 ADVANCE BONUSES</div>
{[
["Reach Round of 32", "+5"],
["Reach Round of 16", "+8"],
["Reach Quarter-Final","+12"],
["Reach Semi-Final", "+18"],
["Reach Final", "+25"],
["Win Tournament", "+35"],
].map(([k,v]) => (
<div key={k} style={S.scoreRow}>
<span style={{color:"#94a3b8"}}>{k}</span>
<span style={{fontWeight:800, color:"#f59e0b", fontSize:15}}>{v} pts</span>
</div>
))}
</div>
</div>
<div style={S.alertBox}>
<strong>⚡ Key Rules:</strong> Only your 2 <em>activated</em> teams score per round — bench teams earn zero.
Team lineups lock before the first game of each round. Player swaps lock when their individual game kicks off.
Eliminated teams become dead weight for the rest of the tournament.
<br/><br/>
<strong>Draw rule:</strong> Group stage draw = +2 pts. Knockout draws go to extra time/penalties — win still counts as a full win.
</div>
</div>
</div>
);
}

// ─────────────────────────── RULES ────────────────────────────────────────
if (screen === "rules") {
return (
<div style={S.page}>
<TopBar screen={screen} setScreen={setScreen} draftComplete={draftComplete} />
<div style={S.infoPage}>
<h2 style={S.infoTitle}>📋 Draft Rules</h2>
<div style={S.rulesList}>
{[
{icon:"🔄", title:"Serpentine Draft", body:"8 managers pick in snake order. Odd rounds: pick 1→8. Even rounds: pick 8→1. 18 total picks per manager (144 picks total). The draft board shows teams and players in one combined pool — each pick you decide: take a team or take a player."},
{icon:"🧑‍🤝‍🧑", title:"Roster Structure", body:"Each manager builds: 14 players (7 starters + 7 flex bench) + 4 teams. Starters must be set as: 2 ATT, 2 MID, 2 DEF, 1 GK. Bench spots are fully flexible — any position — but max 2 GKs across your entire squad including the starter."},
{icon:"🏟️", title:"Team Activation (Per Round)", body:"Before each round, you choose 2 of your 4 teams to activate. Only activated teams score that round. Bench teams earn zero — even if they win. Activation locks before the first game of the round kicks off. Rounds = Group Stage, R32, R16, QF, SF, Final."},
{icon:"🔀", title:"Player Substitutions", body:"You can freely swap bench players into your starting 7 before each round. Substitutions lock on a per-player basis: once that player's game kicks off, they're locked in for that round. Plan ahead — if your striker plays in the first game of a round, you can't adjust after they've started."},
{icon:"💀", title:"Team Elimination", body:"Once a team is knocked out of the World Cup, they are permanently dead weight. They stay on your roster but earn zero points for the remainder of the tournament. This is by design — drafting 4 teams lets you take insurance picks, but bad teams will cost you a roster spot."},
{icon:"🏆", title:"Winning", body:"The manager with the most cumulative points at the end of the Final wins. Points accumulate from all rounds, combining both player stats and activated team performance. No tiebreaker is currently defined — highly recommend agreeing on one before draft day (e.g. most player goals, or best single-round score)."},
].map(({icon, title, body}) => (
<div key={title} style={S.ruleItem}>
<div style={S.ruleItemHeader}>
<span style={{fontSize:20}}>{icon}</span>
<h3 style={S.ruleItemTitle}>{title}</h3>
</div>
<p style={S.ruleItemBody}>{body}</p>
</div>
))}
</div>
</div>
</div>
);
}

// ─────────────────────────── ROSTER VIEW ──────────────────────────────────
if (screen === "roster") {
const roster = rosters[viewManager];
const players = roster.filter(r => r.type === "player");
const teams = roster.filter(r => r.type === "team");
const byPos = { ATT:[], MID:[], DEF:[], GK:[] };
players.forEach(p => byPos[p.item.pos]?.push(p));

// Simple auto-assign: first 7 players across positions are starters
const starterIds = new Set();
const needs = { ATT:2, MID:2, DEF:2, GK:1 };
const have = { ATT:0, MID:0, DEF:0, GK:0 };
players.forEach(p => {
const pos = p.item.pos;
if (have[pos] < needs[pos]) { starterIds.add(p.item.id); have[pos]++; }
});

return (
<div style={S.page}>
{notification && <Toast msg={notification.msg} color={notification.color} />}
<TopBar screen={screen} setScreen={setScreen} draftComplete={draftComplete} />
<div style={S.rosterPage}>
{/* Manager tabs */}
<div style={S.managerTabs}>
{managerNames.map((name, i) => (
<button key={i}
style={{
...S.managerTab,
...(viewManager === i
? {background: MANAGER_COLORS[i]+"22", borderColor: MANAGER_COLORS[i], color: MANAGER_COLORS[i]}
: {})
}}
onClick={() => setViewManager(i)}>
<span style={{
display:"inline-block", width:8, height:8, borderRadius:"50%",
background: MANAGER_COLORS[i], marginRight:6
}} />
{name}
</button>
))}
</div>

{/* Roster count summary */}
<div style={S.rosterSummary}>
{(() => {
const rc = getRosterCounts(roster);
return [
{label:"Teams", val:`${rc.teams}/4`, c:"#a78bfa"},
{label:"Players", val:`${rc.players}/14`, c:"#60a5fa"},
{label:"Starters",val:`${Object.values(have).reduce((a,b)=>a+b,0)}/7`, c:"#22c55e"},
{label:"Bench", val:`${rc.players - Object.values(have).reduce((a,b)=>a+b,0)}/7`, c:"#94a3b8"},
{label:"GKs", val:`${rc.byCounts.GK}/2`, c:"#f59e0b"},
].map(({label,val,c}) => (
<div key={label} style={S.summaryChip}>
<div style={{fontWeight:800, fontSize:18, color:c}}>{val}</div>
<div style={{fontSize:10, color:"#475569", letterSpacing:1}}>{label.toUpperCase()}</div>
</div>
));
})()}
</div>

{/* Teams */}
<div style={S.rosterSection}>
<div style={S.rosterSectionTitle}>🏟️ TEAMS</div>
<div style={S.teamsGrid}>
{teams.map((t, i) => (
<div key={i} style={{...S.teamCard, borderColor: TIER_INFO[t.item.tier].color}}>
{i < ACTIVE_TEAMS && (
<div style={S.activeBadge}>ACTIVE</div>
)}
<div style={{fontSize:36}}>{t.item.flag}</div>
<div style={{fontWeight:700, fontSize:14, marginTop:4}}>{t.item.name}</div>
<div style={{...S.tierPill, background: TIER_INFO[t.item.tier].color + "22", color: TIER_INFO[t.item.tier].color}}>
{TIER_INFO[t.item.tier].label}
</div>
</div>
))}
{Array.from({length: TEAM_SLOTS - teams.length}).map((_, i) => (
<div key={`et${i}`} style={S.emptySlot}>Empty</div>
))}
</div>
</div>

{/* Players by position */}
{["ATT","MID","DEF","GK"].map(pos => (
byPos[pos].length > 0 && (
<div key={pos} style={S.rosterSection}>
<div style={S.rosterSectionTitle}>
<span style={{color: POS_COLOR[pos]}}>{pos}</span>
<span style={{color:"#334155", marginLeft:8}}>{byPos[pos].length} players</span>
</div>
<div style={S.playersGrid}>
{byPos[pos].map((p, i) => {
const isStarter = starterIds.has(p.item.id);
return (
<div key={i} style={{
...S.playerCard,
borderColor: isStarter ? POS_COLOR[pos]+"44" : "rgba(255,255,255,0.06)",
background: isStarter ? POS_COLOR[pos]+"08" : "rgba(255,255,255,0.02)",
}}>
<div style={{fontSize:22}}>{p.item.flag}</div>
<div style={{flex:1, minWidth:0}}>
<div style={{fontWeight:600, fontSize:13, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis"}}>
{p.item.name}
</div>
<div style={{color:"#475569", fontSize:11}}>{p.item.team}</div>
</div>
<div style={{textAlign:"right"}}>
<div style={{fontSize:13, fontWeight:700, color:"#94a3b8"}}>{p.item.rating}</div>
<div style={{
fontSize:9, fontWeight:700, marginTop:2, padding:"1px 5px", borderRadius:3,
background: isStarter ? "#22c55e22" : "rgba(255,255,255,0.04)",
color: isStarter ? "#22c55e" : "#475569",
border: `1px solid ${isStarter ? "#22c55e44" : "rgba(255,255,255,0.06)"}`,
}}>
{isStarter ? "START" : "BENCH"}
</div>
</div>
</div>
);
})}
</div>
</div>
)
))}

{roster.length === 0 && (
<div style={{textAlign:"center", padding:60, color:"#334155"}}>
No picks yet for {managerNames[viewManager]}
</div>
)}
</div>
</div>
);
}

// ─────────────────────────── DRAFT ────────────────────────────────────────
const allItems = [
...TEAMS.map(t => ({...t, _type:"team"})),
...PLAYERS.map(p => ({...p, _type:"player"})),
];

const filteredItems = allItems.filter(item => {
if (drafted.has(item.id)) return false;
if (filterType === "PLAYER" && item._type === "team") return false;
if (filterType === "TEAM" && item._type === "player") return false;
if (filterPos !== "ALL" && item._type === "player" && item.pos !== filterPos) return false;
if (filterPos !== "ALL" && item._type === "team") return false;
if (search) {
const q = search.toLowerCase();
if (!item.name.toLowerCase().includes(q) && !(item.team||"").toLowerCase().includes(q)) return false;
}
return true;
}).sort((a, b) => {
if (sortBy === "rating") return (b.rating||0) - (a.rating||0);
if (sortBy === "tier") return (a.tier||5) - (b.tier||5);
return a.name.localeCompare(b.name);
});

const curRoster = rosters[currentManagerIdx];
const curCounts = getRosterCounts(curRoster);

// Needs bars
const needs = [
{label:"Teams", have: curCounts.teams, need: TEAM_SLOTS, color:"#a78bfa"},
{label:"ATT", have: curCounts.byCounts.ATT, need: 2, color: POS_COLOR.ATT},
{label:"MID", have: curCounts.byCounts.MID, need: 2, color: POS_COLOR.MID},
{label:"DEF", have: curCounts.byCounts.DEF, need: 2, color: POS_COLOR.DEF},
{label:"GK", have: curCounts.byCounts.GK, need: 1, color: POS_COLOR.GK},
{label:"Bench", have: Math.max(0, curCounts.players - 7), need: 7, color:"#60a5fa"},
];

return (
<div style={S.page}>
{notification && <Toast msg={notification.msg} color={notification.color} />}

<TopBar screen={screen} setScreen={setScreen} draftComplete={draftComplete}
extra={
<div style={S.pickBadge}>
Pick <strong style={{color:"#f59e0b"}}>{pickIndex+1}</strong>/{TOTAL_PICKS}
&nbsp;·&nbsp;Round <strong style={{color:"#f59e0b"}}>{currentRound}</strong>/{PICKS_EACH}
</div>
}
/>

<div style={S.draftLayout}>
{/* ── LEFT PANEL ── */}
<div style={S.leftPanel}>
{/* On the clock */}
<div style={{...S.clockCard, borderColor: MANAGER_COLORS[currentManagerIdx]}}>
<div style={S.panelLabel}>ON THE CLOCK</div>
<div style={{...S.clockName, color: MANAGER_COLORS[currentManagerIdx]}}>
{managerNames[currentManagerIdx]}
</div>
<div style={S.clockSub}>
Round {currentRound} · Pick {(pickIndex % NUM_MANAGERS) + 1}/8
</div>
<div style={{marginTop:12}}>
<div style={S.panelLabel}>NEEDS</div>
{needs.map(({label, have, need, color}) => (
<div key={label} style={S.needRow}>
<span style={{width:38, fontSize:10, color:"#64748b"}}>{label}</span>
<div style={S.needTrack}>
<div style={{
height:"100%", borderRadius:2, transition:"width 0.3s",
width:`${Math.min(1, have/need)*100}%`,
background: have >= need ? "#334155" : color,
}} />
</div>
<span style={{width:24, textAlign:"right", fontSize:10,
color: have >= need ? "#334155" : color, fontWeight:700}}>
{have}/{need}
</span>
</div>
))}
</div>
</div>

{/* Up next */}
<div style={S.panelCard}>
<div style={S.panelLabel}>UPCOMING PICKS</div>
{Array.from({length: Math.min(10, TOTAL_PICKS - pickIndex)}).map((_, offset) => {
const idx = pickIndex + offset;
const mgr = DRAFT_ORDER[idx];
const isNow = offset === 0;
return (
<div key={idx} style={{
display:"flex", alignItems:"center", gap:8, padding:"5px 6px",
borderRadius:6, marginBottom:2,
background: isNow ? "rgba(255,255,255,0.05)" : "transparent",
}}>
<div style={{width:8, height:8, borderRadius:"50%", flexShrink:0, background: MANAGER_COLORS[mgr]}} />
<span style={{fontSize:12, flex:1, color: isNow ? "#f1f5f9" : "#475569", fontWeight: isNow ? 700 : 400}}>
{isNow && "▶ "}{managerNames[mgr]}
</span>
<span style={{fontSize:10, color:"#334155"}}>#{idx+1}</span>
</div>
);
})}
</div>
</div>

{/* ── CENTER BOARD ── */}
<div style={S.boardPanel}>
{/* Filters */}
<div style={S.filterBar}>
<input
style={S.searchBox}
placeholder="Search…"
value={search}
onChange={e => setSearch(e.target.value)}
/>
<div style={S.filterGroup}>
{["ALL","PLAYER","TEAM"].map(f => (
<button key={f}
style={{...S.chip, ...(filterType===f ? S.chipActive : {})}}
onClick={() => { setFilterType(f); if (f !== "PLAYER") setFilterPos("ALL"); }}>
{f}
</button>
))}
</div>
{filterType !== "TEAM" && (
<div style={S.filterGroup}>
{["ALL","ATT","MID","DEF","GK"].map(p => (
<button key={p}
style={{
...S.chip,
...(filterPos === p ? {
...S.chipActive,
background: p !== "ALL" ? POS_COLOR[p]+"22" : "",
borderColor: p !== "ALL" ? POS_COLOR[p]+"88" : "",
color: p !== "ALL" ? POS_COLOR[p] : "#f1f5f9",
} : {})
}}
onClick={() => setFilterPos(p)}>
{p}
</button>
))}
</div>
)}
<div style={S.filterGroup}>
{["rating","name","tier"].map(s => (
<button key={s}
style={{...S.chip, ...(sortBy===s ? S.chipActive : {})}}
onClick={() => setSortBy(s)}>
↕ {s}
</button>
))}
</div>
<span style={{marginLeft:"auto", fontSize:11, color:"#334155", alignSelf:"center"}}>
{filteredItems.length} available · {drafted.size} drafted
</span>
</div>

{/* Draft grid */}
<div style={S.draftGrid}>
{filteredItems.map(item => {
const isTeam = item._type === "team";
const reason = getBlockReason(item, curRoster, item._type);
const disabled = !!reason;
const isHovered = hoveredItem === item.id;

return (
<div
key={item.id}
style={{
...S.draftCard,
...(isTeam ? {borderColor:"rgba(167,139,250,0.2)", background:"rgba(167,139,250,0.04)"} : {}),
...(disabled ? {opacity:0.3, cursor:"not-allowed"} : {}),
...(isHovered && !disabled ? {
borderColor: isTeam ? "#a78bfa88" : POS_COLOR[item.pos]+"88",
background: isTeam ? "rgba(167,139,250,0.1)" : POS_COLOR[item.pos]+"11",
transform:"translateY(-1px)",
} : {}),
}}
onClick={() => !disabled && draftItem(item, item._type)}
onMouseEnter={() => setHoveredItem(item.id)}
onMouseLeave={() => setHoveredItem(null)}
title={disabled ? reason : `Draft ${item.name}`}
>
<span style={{fontSize:20, flexShrink:0}}>{item.flag}</span>
<div style={{flex:1, minWidth:0}}>
<div style={{fontSize:12, fontWeight:600, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis"}}>
{item.name}
</div>
<div style={{fontSize:10, color:"#475569"}}>
{isTeam ? TIER_INFO[item.tier]?.label : item.team}
</div>
</div>
{isTeam ? (
<div style={{
fontSize:9, fontWeight:700, padding:"2px 6px", borderRadius:3,
background: TIER_INFO[item.tier]?.color+"22",
color: TIER_INFO[item.tier]?.color,
border:`1px solid ${TIER_INFO[item.tier]?.color}44`,
flexShrink:0,
}}>T{item.tier}</div>
) : (
<div style={{display:"flex", flexDirection:"column", alignItems:"flex-end", gap:3, flexShrink:0}}>
<div style={{
fontSize:9, fontWeight:700, padding:"2px 6px", borderRadius:3,
background: POS_COLOR[item.pos]+"22",
color: POS_COLOR[item.pos],
border:`1px solid ${POS_COLOR[item.pos]}44`,
}}>{item.pos}</div>
<div style={{fontSize:11, fontWeight:700, color:"#64748b"}}>{item.rating}</div>
</div>
)}
</div>
);
})}
</div>
</div>

{/* ── RIGHT PANEL ── */}
<div style={S.rightPanel}>
<div style={S.panelLabel}>ALL ROSTERS</div>
{managerNames.map((name, i) => {
const r = rosters[i];
const rc = getRosterCounts(r);
const isActive = i === currentManagerIdx;
return (
<div key={i} style={{
...S.miniRoster,
...(isActive ? {borderColor: MANAGER_COLORS[i]+"88", background:"rgba(255,255,255,0.03)"} : {}),
}}>
<div style={{display:"flex", alignItems:"center", gap:6, marginBottom:6}}>
<div style={{width:8, height:8, borderRadius:"50%", background: MANAGER_COLORS[i], flexShrink:0}} />
<span style={{fontSize:11, fontWeight: isActive ? 700 : 500, color: isActive ? "#f1f5f9" : "#64748b", flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}>
{name}
</span>
<span style={{fontSize:10, color:"#334155"}}>{r.length}/18</span>
</div>
<div style={{display:"flex", flexWrap:"wrap", gap:2}}>
{r.map((pick, j) => (
<div key={j} style={{
padding:"1px 5px", borderRadius:3, fontSize:9,
background: pick.type==="team"
? "rgba(167,139,250,0.15)"
: POS_COLOR[pick.item.pos]+"18",
color: pick.type==="team" ? "#a78bfa" : POS_COLOR[pick.item.pos],
maxWidth:60, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap",
}} title={pick.item.name}>
{pick.item.flag} {pick.item.name.split(" ").slice(-1)[0]}
</div>
))}
{Array.from({length: 18 - r.length}).map((_, j) => (
<div key={`e${j}`} style={{
width:20, height:14, borderRadius:3, background:"rgba(255,255,255,0.02)",
border:"1px dashed rgba(255,255,255,0.05)",
}} />
))}
</div>
</div>
);
})}
</div>
</div>
</div>
);
}

// ─── SUB-COMPONENTS ──────────────────────────────────────────────────────────
function TopBar({screen, setScreen, draftComplete, extra}) {
return (
<div style={{
background:"#080f1e", borderBottom:"1px solid rgba(255,255,255,0.06)",
padding:"0 20px", display:"flex", alignItems:"center", gap:16,
height:48, position:"sticky", top:0, zIndex:200, flexShrink:0,
}}>
<div style={{fontWeight:900, fontSize:15, letterSpacing:3, color:"#f59e0b"}}>
WC2026
</div>
{extra && <div style={{fontSize:12, color:"#475569"}}>{extra}</div>}
<div style={{marginLeft:"auto", display:"flex", gap:2}}>
{["draft","roster","scoring","rules"].map(s => {
const labels = {draft:"Draft", roster:"Rosters", scoring:"Scoring", rules:"Rules"};
return (
<button key={s}
style={{
background: screen===s ? "rgba(255,255,255,0.08)" : "transparent",
border:"none", color: screen===s ? "#f1f5f9" : "#475569",
padding:"6px 14px", borderRadius:6, cursor:"pointer",
fontSize:11, fontWeight:600, letterSpacing:1, fontFamily:"inherit",
}}
onClick={() => setScreen(s)}>
{labels[s].toUpperCase()}
</button>
);
})}
</div>
</div>
);
}

function Toast({msg, color}) {
return (
<div style={{
position:"fixed", top:16, left:"50%", transform:"translateX(-50%)",
background:"#0d1829", border:`1px solid ${color}`,
borderRadius:8, padding:"10px 20px",
color, fontWeight:700, fontSize:13, zIndex:9999,
boxShadow:`0 4px 24px ${color}33`, whiteSpace:"nowrap", pointerEvents:"none",
}}>
{msg}
</div>
);
}

// ─── STYLES ──────────────────────────────────────────────────────────────────
const S = {
page: {
minHeight:"100vh", background:"#060d1a", color:"#f1f5f9",
fontFamily:"'DM Sans', system-ui, sans-serif",
display:"flex", flexDirection:"column",
},

// Setup
setupWrap: {
flex:1, display:"flex", flexDirection:"column", alignItems:"center",
justifyContent:"center", padding:"32px 16px", gap:28,
},
setupHero: { textAlign:"center" },
heroTitle: {
fontSize:52, fontWeight:900, letterSpacing:8, margin:"8px 0 4px",
background:"linear-gradient(135deg,#f59e0b 0%,#fde68a 50%,#f59e0b 100%)",
WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
},
heroSub: { color:"#334155", letterSpacing:8, fontSize:12, fontWeight:600, marginBottom:20 },
heroDivider: { height:1, background:"rgba(255,255,255,0.06)", margin:"16px auto", width:200 },
heroStats: { display:"flex", gap:24, justifyContent:"center" },
heroStat: { textAlign:"center" },
heroStatNum: { fontSize:28, fontWeight:900, color:"#f59e0b" },
heroStatLabel: { fontSize:10, color:"#334155", letterSpacing:2, marginTop:2 },

setupCard: {
background:"#0d1829", border:"1px solid rgba(255,255,255,0.07)",
borderRadius:16, padding:28, width:"100%", maxWidth:680,
},
setupCardHeader: { marginBottom:20 },
setupCardTitle: { fontSize:13, fontWeight:800, letterSpacing:3, marginBottom:4 },
setupCardSub: { color:"#334155", fontSize:12 },
managerGrid: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:20 },
managerInputRow: { display:"flex", alignItems:"center", gap:8 },
managerDot: {
width:26, height:26, borderRadius:"50%", display:"flex", alignItems:"center",
justifyContent:"center", fontSize:11, fontWeight:800, color:"#000", flexShrink:0,
},
textInput: {
flex:1, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)",
borderRadius:8, padding:"8px 12px", color:"#f1f5f9", fontSize:13,
outline:"none", fontFamily:"inherit",
},
rulesRow: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:6, marginBottom:20 },
ruleChip: {
background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)",
borderRadius:8, padding:"10px 12px", display:"flex", gap:10, alignItems:"center",
},
startBtn: {
width:"100%", padding:14, background:"linear-gradient(135deg,#f59e0b,#d97706)",
border:"none", borderRadius:10, color:"#000", fontSize:14, fontWeight:900,
letterSpacing:3, cursor:"pointer", fontFamily:"inherit",
},

// Draft layout
draftLayout: {
display:"grid", gridTemplateColumns:"210px 1fr 220px",
flex:1, overflow:"hidden",
},
leftPanel: {
borderRight:"1px solid rgba(255,255,255,0.05)",
overflowY:"auto", padding:10, display:"flex", flexDirection:"column", gap:10,
},
clockCard: {
background:"rgba(255,255,255,0.03)", border:"1px solid",
borderRadius:10, padding:14,
},
panelLabel: { fontSize:9, letterSpacing:3, color:"#334155", fontWeight:700, marginBottom:8 },
clockName: { fontSize:18, fontWeight:900, letterSpacing:0.5, marginBottom:2 },
clockSub: { fontSize:11, color:"#475569" },
needRow: { display:"flex", alignItems:"center", gap:6, marginBottom:4 },
needTrack: { flex:1, height:4, background:"rgba(255,255,255,0.05)", borderRadius:2, overflow:"hidden" },
panelCard: {
background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.05)",
borderRadius:10, padding:12,
},
pickBadge: { fontSize:12, color:"#475569" },

// Board
boardPanel: { overflowY:"auto", padding:10, display:"flex", flexDirection:"column", gap:8 },
filterBar: { display:"flex", gap:6, flexWrap:"wrap", alignItems:"center" },
searchBox: {
background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)",
borderRadius:8, padding:"6px 12px", color:"#f1f5f9", fontSize:12,
outline:"none", fontFamily:"inherit", width:160,
},
filterGroup: { display:"flex", gap:2 },
chip: {
background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.07)",
color:"#475569", borderRadius:6, padding:"5px 9px", cursor:"pointer",
fontSize:10, fontWeight:700, letterSpacing:0.5, fontFamily:"inherit",
},
chipActive: { background:"rgba(255,255,255,0.1)", borderColor:"rgba(255,255,255,0.2)", color:"#f1f5f9" },

draftGrid: {
display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(190px,1fr))",
gap:5,
},
draftCard: {
background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)",
borderRadius:8, padding:"9px 11px", display:"flex", alignItems:"center", gap:9,
cursor:"pointer", transition:"all 0.12s",
},

// Right panel
rightPanel: {
borderLeft:"1px solid rgba(255,255,255,0.05)",
overflowY:"auto", padding:10,
},
miniRoster: {
border:"1px solid rgba(255,255,255,0.05)", borderRadius:8,
padding:"8px 9px", marginBottom:6,
},

// Roster page
rosterPage: { padding:20, maxWidth:1100, margin:"0 auto", width:"100%" },
managerTabs: { display:"flex", gap:4, flexWrap:"wrap", marginBottom:16 },
managerTab: {
background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)",
borderRadius:8, padding:"6px 14px", color:"#475569", cursor:"pointer",
fontSize:12, fontWeight:600, fontFamily:"inherit",
},
rosterSummary: { display:"flex", gap:8, marginBottom:20, flexWrap:"wrap" },
summaryChip: {
background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)",
borderRadius:10, padding:"12px 18px", textAlign:"center",
},
rosterSection: { marginBottom:20 },
rosterSectionTitle: { fontSize:11, fontWeight:800, letterSpacing:2, marginBottom:10, display:"flex", alignItems:"center" },
teamsGrid: { display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))", gap:8 },
teamCard: {
background:"rgba(255,255,255,0.03)", border:"1px solid",
borderRadius:10, padding:14, display:"flex", flexDirection:"column",
alignItems:"center", gap:5, textAlign:"center", position:"relative",
},
activeBadge: {
position:"absolute", top:-6, right:-6, background:"#22c55e",
color:"#000", fontSize:8, fontWeight:900, padding:"2px 6px", borderRadius:3, letterSpacing:1,
},
tierPill: { fontSize:9, fontWeight:700, padding:"2px 7px", borderRadius:3, letterSpacing:1 },
emptySlot: {
border:"1px dashed rgba(255,255,255,0.07)", borderRadius:10, padding:14,
display:"flex", alignItems:"center", justifyContent:"center",
color:"#1e293b", fontSize:12,
},
playersGrid: { display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:5 },
playerCard: {
display:"flex", alignItems:"center", gap:10, padding:"8px 11px",
borderRadius:8, border:"1px solid",
},

// Info pages
infoPage: { padding:28, maxWidth:900, margin:"0 auto" },
infoTitle: { fontSize:22, fontWeight:900, marginBottom:22, letterSpacing:0.5 },
scoringGrid: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:16 },
scoreBlock: {
background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)",
borderRadius:12, padding:20,
},
scoreBlockTitle: { fontSize:9, fontWeight:800, letterSpacing:3, color:"#334155", marginBottom:12 },
scoreRow: {
display:"flex", justifyContent:"space-between", alignItems:"center",
padding:"8px 0", borderBottom:"1px solid rgba(255,255,255,0.04)", fontSize:13,
},
alertBox: {
background:"rgba(245,158,11,0.07)", border:"1px solid rgba(245,158,11,0.2)",
borderRadius:10, padding:"14px 18px", fontSize:13, lineHeight:1.65, color:"#ca8a04",
},
rulesList: { display:"flex", flexDirection:"column", gap:10 },
ruleItem: {
background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)",
borderRadius:10, padding:"16px 20px",
},
ruleItemHeader: { display:"flex", alignItems:"center", gap:10, marginBottom:8 },
ruleItemTitle: { fontSize:14, fontWeight:700 },
ruleItemBody: { fontSize:13, color:"#64748b", lineHeight:1.65 },
};
