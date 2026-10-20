// The one function every example uses to talk to a model through OpenRouter.
// It sends a prompt and returns OpenRouter's whole JSON reply, so you can see
// everything that comes back (the text, token counts and cost).

const MODEL = 'google/gemini-2.5-flash-lite';

// options.json asks the model for a JSON object. Callers still parse the text.
async function askModel(prompt, options) {
  if (typeof OPENROUTER_API_KEY === 'undefined' || OPENROUTER_API_KEY.startsWith('YOUR_')) {
    throw new Error('No API key. Copy js/config.local.example.js to js/config.local.js and paste your key in.');
  }

  const body = {
    model: MODEL,
    messages: [{ role: 'user', content: prompt }],
  };
  if (options && options.json) {
    body.response_format = { type: 'json_object' };
  }

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + OPENROUTER_API_KEY,
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || response.statusText);
  // Every text call on this origin adds its reported cost to the session total.
  if (data.usage) addSessionCost(data.usage.cost);
  return data;
}

// Running total for this browser tab, taken from each reply's usage.cost.
var SESSION_COST_KEY = 'prog02-session-cost';
var memoryCost = 0;

function sessionCost() {
  try {
    var n = Number(sessionStorage.getItem(SESSION_COST_KEY));
    if (isFinite(n)) return n;
  } catch (err) {
    // sessionStorage can be blocked. Fall back to this page's memory.
  }
  return memoryCost;
}

function formatDollars(n) {
  var value = Number(n);
  if (!isFinite(value)) return 'not reported';
  return '$' + value.toFixed(6);
}

function addSessionCost(cost) {
  var add = Number(cost);
  if (!isFinite(add)) add = 0;
  memoryCost = sessionCost() + add;
  try {
    sessionStorage.setItem(SESSION_COST_KEY, String(memoryCost));
  } catch (err) {
    // The bar still updates from memoryCost when storage is blocked.
  }
  paintSessionCost();
  return memoryCost;
}

function paintSessionCost() {
  var el = document.getElementById('sessionCost');
  if (el) el.textContent = formatDollars(sessionCost());
}
