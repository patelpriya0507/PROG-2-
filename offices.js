// Down-ballot offices.
//
// The explanation may use only the office text in the data pack.
// A quote that is not in that text is shown as untraced, not as a fact.
// The illustration scenes are a fixed set. A model picks one. This file writes the image prompt.

var IMAGE_MODEL = "google/gemini-2.5-flash-image";

// What each scene is for, and the sentence that goes into the image prompt.
// shows is for the picker. draw is the photograph. matters is shown on the page, not sent as words to draw.
var SCENES = {
  "berkeley-rent-board": [
    {
      id: "listing",
      title: "Looking at a rental",
      shows: "People considering a Berkeley rental, inside rent ceilings and registration.",
      matters: "This board sets rent ceilings and registration fees for most rental units in Berkeley. Looking at a place to rent is one moment those rules can affect.",
      draw: "Two simplified figures seen from behind stand on a residential Berkeley street of small houses and apartment buildings, looking at a blank sheet taped inside an apartment window."
    },
    {
      id: "lease",
      title: "Signing a lease",
      shows: "The moment a tenancy starts, which is part of what rent rules cover.",
      matters: "Signing a lease is the start of a tenancy. Rent ceilings, eviction protections, and registration fees for most Berkeley rentals are what this board handles.",
      draw: "Hands over a kitchen table signing a residential lease, with a Berkeley street of houses visible through the window. No faces."
    },
    {
      id: "repair",
      title: "A repair with the landlord",
      shows: "A habitability problem between a tenant and a landlord.",
      matters: "A repair between a tenant and a landlord sits next to the rent and eviction rules this board oversees for most Berkeley rentals.",
      draw: "A tenant and a landlord in an apartment hallway, seen from behind, looking at a water stain on the ceiling and a bucket on the floor."
    },
    {
      id: "move",
      title: "Moving day",
      shows: "Someone moving into or out of a Berkeley rental.",
      matters: "Moving in or out is the edge of a tenancy. Eviction protections are part of what this board covers for most rental units in Berkeley.",
      draw: "Cardboard boxes on the porch of a Berkeley bungalow, and one figure from behind carrying a lamp down the steps."
    },
    {
      id: "notice",
      title: "A notice on the door",
      shows: "An eviction-related moment, with no readable words and no person.",
      matters: "An eviction notice is the kind of moment this board's eviction protections are about. The photograph shows that doorway, not a candidate.",
      draw: "A closed apartment door in a Berkeley building, a blank sheet of paper taped to the door, and a suitcase in the hall. No people."
    }
  ],
  "ac-transit-ward-1": [
    {
      id: "boarding",
      title: "Boarding a city bus",
      shows: "Riders using the bus service this board runs.",
      matters: "This board sets bus routes and service levels across the East Bay, including the lines running past campus. Boarding is the service a rider actually uses.",
      draw: "Simplified figures seen from behind boarding a plain city bus at a stop on a tree-lined East Bay street, with low buildings nearby."
    },
    {
      id: "fare",
      title: "Paying a fare",
      shows: "The fare this board sets, shown as the act of paying.",
      matters: "This board sets AC Transit fares and has nothing to do with BART's. Paying the fare is the part a rider feels.",
      draw: "A hand putting coins into a farebox beside the front door of a city bus, with a driver area, a vertical pole, and seats along the sides. No face. This is a bus, not a train."
    },
    {
      id: "stop",
      title: "Waiting at a stop",
      shows: "Riders depending on where the routes go.",
      matters: "Where the routes go is a service decision this board makes, including the lines that run past campus.",
      draw: "Distant simplified figures waiting at a bus shelter on a Berkeley commercial street in late afternoon."
    },
    {
      id: "gap",
      title: "A long gap between buses",
      shows: "Service level: how often the bus comes.",
      matters: "How often the bus comes is a service level this board sets. A long gap is what that decision feels like at the stop.",
      draw: "A nearly empty bus stop at night on an East Bay street, with one plain city bus far down the road."
    },
    {
      id: "street",
      title: "A bus on a Berkeley street",
      shows: "The bus in ordinary traffic, not a train.",
      matters: "The bus in ordinary Berkeley traffic is the system this board runs. It is not BART.",
      draw: "A view down a Berkeley commercial street with a plain city bus in traffic and low storefronts. No train."
    }
  ],
  "bart-director": [
    {
      id: "platform",
      title: "A train at the platform",
      shows: "Regional rail service, which is what this board runs.",
      matters: "This board handles fares, service hours, capital spending, and policing policy for the regional rail system. A train at the platform is that service.",
      draw: "A regional rail train arriving at an underground station platform, with distant simplified commuters seen from behind."
    },
    {
      id: "faregate",
      title: "Fare gates",
      shows: "Rail fares, shown as people passing the gates.",
      matters: "Fares are one of the things this rail board sets. The gates are where a rider pays.",
      draw: "Fare gates in a rail station, simplified figures from behind walking through, no faces."
    },
    {
      id: "night",
      title: "A late platform",
      shows: "Service hours, shown as a station late at night.",
      matters: "Service hours are a decision this board makes. A late, quiet platform is what those hours feel like.",
      draw: "A nearly empty elevated rail platform at night, one regional train at the platform, station lights on."
    },
    {
      id: "car",
      title: "Inside a rail car",
      shows: "The ride itself, for the people who use the system.",
      matters: "The ride is the service riders get from the system this board oversees.",
      draw: "The interior of a regional rail car, riders seen from behind, no face turned toward the viewer."
    },
    {
      id: "station",
      title: "An elevated station",
      shows: "The rail infrastructure in an East Bay neighborhood.",
      matters: "Capital spending on the rail system is part of this office. The station is that infrastructure in a neighborhood.",
      draw: "The exterior of a modern elevated rail station among low East Bay buildings and trees. No city bus."
    }
  ],
  "ebmud-director": [
    {
      id: "tap",
      title: "Water at the sink",
      shows: "Household water, the service people pay rates for.",
      matters: "This board sets water rates for most of the East Bay. The tap is the service a household pays for.",
      draw: "A kitchen sink in an East Bay home, water running into a glass, and a paper bill face down so nothing on it can be read."
    },
    {
      id: "reservoir",
      title: "A reservoir in the hills",
      shows: "Supply planning: where the water is stored.",
      matters: "Supply planning is part of this office. The reservoir is where that supply is stored.",
      draw: "A reservoir and a low dam in dry East Bay hills, oak trees, no signs and no people."
    },
    {
      id: "drought",
      title: "A dry front yard",
      shows: "Drought restrictions, shown as a yard that is not being watered.",
      matters: "Drought restrictions are a power this board has. A dry yard is what those limits look like at a Berkeley house.",
      draw: "A Berkeley front yard of brown grass, a coiled hose, and a bucket by the steps. No people."
    },
    {
      id: "main",
      title: "Work on a water main",
      shows: "The pipes that carry the supply.",
      matters: "The pipes are how the water this district supplies actually reaches a street.",
      draw: "Distant simplified workers seen from behind beside an open sidewalk and a large water pipe on an East Bay street."
    },
    {
      id: "bottle",
      title: "Filling a bottle",
      shows: "Everyday use of the water during dry weather.",
      matters: "Filling a bottle is everyday use of the water this board supplies, especially when drought rules are in effect.",
      draw: "A person seen from behind filling a reusable bottle at a kitchen sink, with Berkeley houses visible outside."
    }
  ],
  "peralta-ccd-trustee": [
    {
      id: "classroom",
      title: "A community-college classroom",
      shows: "Teaching at the colleges this board governs.",
      matters: "This board sets budget and policy for Berkeley City College and its three sister colleges. A classroom is that work, and it is not UC Berkeley.",
      draw: "A small community-college classroom, adult students seen from behind, low buildings visible through the windows."
    },
    {
      id: "library",
      title: "A college library",
      shows: "Students using a college this board is responsible for.",
      matters: "Students at Berkeley City College are in a college this board governs. The board has no authority over UC Berkeley.",
      draw: "A modest college library, people studying with their faces down toward books, low shelves, no tower outside."
    },
    {
      id: "lab",
      title: "A teaching lab",
      shows: "Job-training classes at a community college.",
      matters: "Job-training classes are part of the colleges whose budget and policy this board sets.",
      draw: "Hands working at a bench in a community-college trades lab, tools on the bench, no faces."
    },
    {
      id: "quad",
      title: "A small campus courtyard",
      shows: "The scale of a community college, not a large university.",
      matters: "The courtyard is the scale of the community colleges this board governs. It is not the UC Berkeley campus.",
      draw: "A small urban college courtyard with low two-story buildings and street trees. No bell tower and no stadium."
    },
    {
      id: "meeting",
      title: "A budget table",
      shows: "The board's budget work, without portraits.",
      matters: "Budget is a core job of this board for Berkeley City College and its sister colleges. The table is that work, with no one's face.",
      draw: "A conference table with blank papers and empty chairs, and a window looking onto low college buildings."
    }
  ]
};

var AVOID = {
  "berkeley-rent-board": "Do not draw a courthouse, a rally, or a campaign sign.",
  "ac-transit-ward-1": "Draw a plain city bus with a front door and no agency logo. Do not draw a train, subway car, or rows of airline-style seats.",
  "bart-director": "Draw regional rail with no agency logo. Do not draw a city bus.",
  "ebmud-director": "Do not draw a readable bill, a logo, or a glass office tower.",
  "peralta-ccd-trustee": "Draw a small community college with low buildings. Do not draw a bell tower, a stadium, or a large university campus."
};

var offices = [];
var readyScene = null;
var choiceSource = null;

function addText(parent, tag, text) {
  var el = document.createElement(tag);
  el.textContent = text;
  parent.appendChild(el);
  return el;
}

function selectedOffice() {
  var menu = document.getElementById("office");
  for (var i = 0; i < offices.length; i++) {
    if (offices[i].id === menu.value) return offices[i];
  }
}

function factsOf(office) {
  if (!office.additionalContext) return [];
  return office.additionalContext;
}

function packText(office) {
  var lines = [];
  lines.push("Name: " + office.name);
  lines.push("Jurisdiction: " + office.jurisdiction);
  lines.push("Description: " + office.description);
  var facts = factsOf(office);
  for (var i = 0; i < facts.length; i++) {
    var kind = facts[i].kind ? " (" + facts[i].kind + ")" : "";
    lines.push("Additional fact" + kind + ": " + facts[i].fact);
  }
  lines.push("Where this pack text came from: " + (office.source || "the assignment pack"));
  return lines.join("\n");
}

function packBlob(office) {
  var parts = [office.name, office.jurisdiction, office.description, office.source || ""];
  var facts = factsOf(office);
  for (var i = 0; i < facts.length; i++) {
    parts.push(facts[i].fact || "");
    parts.push(facts[i].source || "");
  }
  return parts.join("\n");
}

function normText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function quoteInPack(blob, quote) {
  var needle = normText(quote);
  if (needle.length < 20) return false;
  return normText(blob).indexOf(needle) !== -1;
}

function showPack(office) {
  var box = document.getElementById("pack");
  box.innerHTML = "";
  addText(box, "p", office.name + " — " + office.jurisdiction);
  addText(box, "p", office.description);
  var facts = factsOf(office);
  var boundaryCount = 0;
  for (var i = 0; i < facts.length; i++) {
    var fact = facts[i];
    var card = document.createElement("div");
    card.className = fact.kind === "boundary" ? "boundary" : "pack";
    if (fact.kind === "boundary") {
      boundaryCount = boundaryCount + 1;
      addText(card, "p", "Boundary stated in the pack:");
    } else {
      addText(card, "p", "Additional fact from the pack:");
    }
    addText(card, "p", fact.fact);
    addText(card, "p", "Source: " + (fact.source || office.source || "the assignment pack"));
    box.appendChild(card);
  }
  if (boundaryCount === 0) {
    addText(box, "p", "This office's pack entry does not include a separate boundary fact. The description above is the whole source.");
  }
  addText(box, "p", "Pack source: " + (office.source || "the assignment pack") + ". The pack has no separate official web page for this office. The text in this box is the full unaltered description.");
}

function showSceneList(office, chosenId) {
  var list = document.getElementById("scenes");
  list.innerHTML = "";
  var scenes = SCENES[office.id] || [];
  for (var i = 0; i < scenes.length; i++) {
    var scene = scenes[i];
    var li = document.createElement("li");
    var button = document.createElement("button");
    button.type = "button";
    button.className = "scene-card" + (scene.id === chosenId ? " is-on" : "");
    button.setAttribute("data-scene", scene.id);
    var title = document.createElement("strong");
    title.textContent = (scene.id === chosenId ? "Chosen: " : "") + scene.title;
    var blurb = document.createElement("span");
    blurb.className = "blurb";
    blurb.textContent = scene.shows;
    button.appendChild(title);
    button.appendChild(blurb);
    button.onclick = function () {
      if (document.getElementById("draw").disabled) return;
      var picked = sceneById(selectedOffice(), this.getAttribute("data-scene"));
      if (picked) chooseScene(selectedOffice(), picked, "you");
    };
    li.appendChild(button);
    list.appendChild(li);
  }
}

function chooseScene(office, scene, source, reason) {
  readyScene = scene;
  choiceSource = source;
  showSceneList(office, scene.id);
  var choice = document.getElementById("choice");
  choice.textContent = "";
  if (source === "you") {
    document.getElementById("pickCost").textContent = "";
    addText(choice, "p", "You chose \"" + scene.title + "\". Generate illustration draws this scene.");
  } else {
    var tag = addText(choice, "p", "AI-generated choice. The scene list itself was written for this office, not by the model.");
    tag.className = "ai-tag";
    addText(choice, "p", "It chose \"" + scene.title + "\".");
    addText(choice, "p", "Reason, from the model: " + (reason || "The model did not give a reason."));
  }
  var why = document.createElement("p");
  why.className = "why";
  var whyLabel = document.createElement("strong");
  whyLabel.textContent = "Why it matters. ";
  why.appendChild(whyLabel);
  why.appendChild(document.createTextNode(scene.matters || ""));
  choice.appendChild(why);
  document.getElementById("imagePrompt").textContent = buildImagePrompt(office, scene);
  document.getElementById("imageLabel").textContent = "";
  document.getElementById("imageCost").textContent = "";
  document.getElementById("picture").textContent = "No illustration yet. Press Generate illustration to draw \"" + scene.title + "\".";
}

function clearGenerated() {
  readyScene = null;
  choiceSource = null;
  document.getElementById("explainLabel").textContent = "";
  document.getElementById("explainOutput").className = "";
  document.getElementById("explainOutput").textContent = "Press Explain this office.";
  document.getElementById("explainCost").textContent = "";
  document.getElementById("explainPrompt").textContent = "Nothing sent yet.";
  document.getElementById("choice").textContent = "";
  document.getElementById("pickCost").textContent = "";
  document.getElementById("imagePrompt").textContent = "No scene chosen yet.";
  document.getElementById("imageLabel").textContent = "";
  document.getElementById("picture").textContent = "No illustration yet.";
  document.getElementById("imageCost").textContent = "";
  document.getElementById("draw").disabled = false;
}

function sceneById(office, id) {
  var scenes = SCENES[office.id] || [];
  for (var i = 0; i < scenes.length; i++) {
    if (scenes[i].id === id) return scenes[i];
  }
  return null;
}

function usedScenes(officeId) {
  try {
    var raw = sessionStorage.getItem("prog02-scenes-" + officeId);
    if (!raw) return [];
    return raw.split(",").filter(function (id) { return id.length > 0; });
  } catch (err) {
    return [];
  }
}

function rememberScene(officeId, id) {
  var list = usedScenes(officeId);
  if (list.indexOf(id) === -1) list.push(id);
  try {
    sessionStorage.setItem("prog02-scenes-" + officeId, list.join(","));
  } catch (err) {
    // Variety across clicks still works for this page load via readyScene.
  }
}

function buildExplainPrompt(office) {
  return "Explain this elected office for a voter who has never heard of it.\n"
    + "Use ONLY the pack text below. Do not name any agency, campus, city, service, dollar amount, or power that is not written in that text.\n"
    + "Do not say the office is good or bad. Do not mention candidates. Do not tell the voter how to vote.\n"
    + "Return JSON only, with no markdown, in this shape:\n"
    + "{\"controls\": [{\"point\": \"one plain sentence\", \"quote\": \"exact words copied from the pack\"}], \"doesNotControl\": [{\"point\": \"one plain sentence\", \"quote\": \"exact words copied from the pack\"}]}\n"
    + "controls: 2 to 4 points about what the pack says the office does.\n"
    + "doesNotControl: 1 to 3 points about the boundary, meaning what the pack puts outside the office.\n"
    + "If the pack includes a fact marked boundary, quote that fact in doesNotControl. Do not soften it, and do not add another boundary the pack does not state.\n"
    + "You may also state a limit the description itself states, such as the word most, or the jurisdiction it names. The quote must still be copied from the pack.\n"
    + "Every quote must be an exact contiguous span of the pack text, at least 8 words. If you cannot quote a point from the pack, leave that point out.\n\n"
    + "PACK TEXT:\n"
    + packText(office);
}

function buildScenePrompt(office) {
  var scenes = SCENES[office.id] || [];
  var lines = [];
  for (var i = 0; i < scenes.length; i++) {
    lines.push("- " + scenes[i].id + ": " + scenes[i].title + ". " + scenes[i].shows);
  }
  var used = usedScenes(office.id);
  var usedLine = "None yet.";
  if (used.length) usedLine = used.join(", ");
  return "Choose one illustration scene for a voter-guide page about this office.\n"
    + "Pick a scene that shows something this office could affect, inside the pack text.\n"
    + "Do not invent a new scene. sceneId must be one of the ids below.\n"
    + "Scenes already chosen for this office in this browser session: " + usedLine + ".\n"
    + "Choose a different id if one has not been used yet.\n"
    + "Return JSON only: {\"sceneId\": \"the id\", \"reason\": \"one sentence\"}.\n"
    + "The reason must not say how to vote and must not say the office is good or bad.\n\n"
    + "PACK TEXT:\n"
    + packText(office) + "\n\n"
    + "SCENES:\n"
    + lines.join("\n");
}

function buildImagePrompt(office, scene) {
  return "A calm editorial illustration, with flat color and clear shapes, set in Berkeley and the East Bay, California. "
    + scene.draw + " "
    + (AVOID[office.id] || "") + " "
    + "No text, no letters, no numbers, no logos, no seals, no flags, no ballots, and no campaign posters. "
    + "This must not look like official election material. "
    + "Any person is a simplified illustrated figure, distant or seen from behind, with no recognizable face. "
    + "Do not depict a real person, a candidate, or a public figure.";
}

function parseModelJson(text) {
  var cleaned = String(text || "").trim();
  var start = cleaned.indexOf("{");
  var end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1) {
    throw new Error("The model did not return JSON.");
  }
  return JSON.parse(cleaned.slice(start, end + 1));
}

function renderCheckedPoints(parent, title, points, blob) {
  addText(parent, "h3", title);
  var list = points || [];
  var grounded = 0;
  var missed = [];
  for (var i = 0; i < list.length; i++) {
    var point = list[i] || {};
    var sentence = String(point.point || "").trim();
    var quote = String(point.quote || "").trim();
    if (quoteInPack(blob, quote)) {
      grounded = grounded + 1;
      var card = document.createElement("div");
      card.className = "grounded";
      var tag = addText(card, "p", "AI-generated. The quote below was found in the pack.");
      tag.className = "ai-tag";
      addText(card, "p", sentence || "The model did not return a sentence for this quote.");
      addText(card, "p", "Unaltered words from the pack:");
      var q = addText(card, "blockquote", quote);
      q.className = "official-quote";
      parent.appendChild(card);
    } else if (sentence || quote) {
      missed.push({ sentence: sentence, quote: quote });
    }
  }
  if (grounded === 0) {
    addText(parent, "p", "No point here had a quote that appears in the pack.");
  }
  if (missed.length === 0) return;
  var box = document.createElement("div");
  box.className = "ungrounded";
  addText(box, "p", "AI-generated, and not traced. These quotes do not appear in the pack, so they are not facts about the office.");
  for (var m = 0; m < missed.length; m++) {
    if (missed[m].sentence) addText(box, "p", missed[m].sentence);
    if (missed[m].quote) addText(box, "p", "Quote the model offered: " + missed[m].quote);
  }
  parent.appendChild(box);
}

function showExplanation(office, parsed, cost) {
  var box = document.getElementById("explainOutput");
  box.className = "ai-block";
  box.innerHTML = "";
  var head = document.createElement("div");
  head.className = "ai-head";
  var left = document.createElement("div");
  var badge = document.createElement("span");
  badge.className = "ai-badge";
  badge.textContent = "AI-GENERATED";
  var kicker = document.createElement("span");
  kicker.className = "ai-kicker";
  kicker.textContent = "From the pack text for " + office.name + ". Not official voter information.";
  left.appendChild(badge);
  left.appendChild(kicker);
  head.appendChild(left);
  box.appendChild(head);
  var blob = packBlob(office);
  renderCheckedPoints(box, "What it controls", parsed.controls, blob);
  renderCheckedPoints(box, "What it does not control", parsed.doesNotControl, blob);
  addText(box, "p", "The full unaltered pack text is in the green box above. The model was given only that text.");
  var foot = document.createElement("p");
  foot.className = "ai-foot";
  var modelName = typeof MODEL === "string" ? MODEL : "the model";
  foot.textContent = "Machine-written by " + modelName + ". A point counts only when its quote is in the pack. Nothing here is official. " + (typeof formatDollars === "function" ? formatDollars(cost) : "");
  box.appendChild(foot);
}

var OFFICE_KICKER = {
  "berkeley-rent-board": "Rent",
  "ac-transit-ward-1": "Buses",
  "bart-director": "Rail",
  "ebmud-director": "Water",
  "peralta-ccd-trustee": "Colleges"
};

function showOfficeCards(selectedId) {
  var box = document.getElementById("officeCards");
  if (!box) return;
  box.innerHTML = "";
  for (var i = 0; i < offices.length; i++) {
    var office = offices[i];
    var button = document.createElement("button");
    button.type = "button";
    button.className = "office-card" + (office.id === selectedId ? " is-on" : "");
    button.setAttribute("data-id", office.id);
    var kicker = document.createElement("span");
    kicker.className = "kicker";
    kicker.textContent = OFFICE_KICKER[office.id] || "Office";
    var title = document.createElement("strong");
    title.textContent = office.name;
    var blurb = document.createElement("span");
    blurb.className = "blurb";
    blurb.textContent = office.jurisdiction;
    button.appendChild(kicker);
    button.appendChild(title);
    button.appendChild(blurb);
    button.onclick = function () {
      var menu = document.getElementById("office");
      var next = this.getAttribute("data-id");
      if (menu.value === next) return;
      menu.value = next;
      menu.onchange();
    };
    box.appendChild(button);
  }
}

document.getElementById("office").onchange = function () {
  var office = selectedOffice();
  if (!office) return;
  showOfficeCards(office.id);
  showPack(office);
  showSceneList(office, null);
  clearGenerated();
};

document.getElementById("explain").onclick = async function () {
  var office = selectedOffice();
  var button = document.getElementById("explain");
  var box = document.getElementById("explainOutput");
  var prompt = buildExplainPrompt(office);
  button.disabled = true;
  box.textContent = "Waiting for the model…";
  document.getElementById("explainLabel").textContent = "";
  document.getElementById("explainPrompt").textContent = prompt;
  try {
    var data = await askModel(prompt, { json: true });
    var text = data.choices[0].message.content;
    document.getElementById("explainCost").textContent = "This call: " + formatDollars(data.usage && data.usage.cost) + ".";
    document.getElementById("explainLabel").textContent = "AI-generated from the pack text for " + office.name + ". It is not the pack, and it is not official voter information.";
    try {
      showExplanation(office, parseModelJson(text), data.usage && data.usage.cost);
    } catch (parseErr) {
      box.textContent = "";
      addText(box, "p", "Error: " + parseErr.message + " The reply was not used as an explanation.");
      var pre = document.createElement("pre");
      pre.textContent = text;
      box.appendChild(pre);
    }
  } catch (err) {
    box.textContent = "Error: " + err.message;
    document.getElementById("explainLabel").textContent = "";
  }
  button.disabled = false;
};

function dollars(n) {
  if (typeof formatDollars === "function") return formatDollars(n);
  var value = Number(n);
  if (!isFinite(value)) return "not reported";
  return "$" + value.toFixed(6);
}

function imageSrc(data) {
  var image = data && data.data && data.data[0];
  if (image && image.b64_json) {
    return "data:" + (image.media_type || "image/png") + ";base64," + image.b64_json;
  }
  if (image && image.url) return image.url;
  var message = data && data.choices && data.choices[0] && data.choices[0].message;
  var images = message && message.images;
  if (images && images[0]) {
    var first = images[0];
    if (typeof first === "string") return first;
    if (first.image_url && first.image_url.url) return first.image_url.url;
    if (first.url) return first.url;
  }
  return "";
}

document.getElementById("pick").onclick = async function () {
  var office = selectedOffice();
  var button = document.getElementById("pick");
  var choice = document.getElementById("choice");
  button.disabled = true;
  choice.textContent = "Asking the model to choose one of these scenes…";
  try {
    var data = await askModel(buildScenePrompt(office), { json: true });
    var text = data.choices[0].message.content;
    document.getElementById("pickCost").textContent = "Scene choice: " + dollars(data.usage && data.usage.cost) + ".";
    var parsed = parseModelJson(text);
    var scene = sceneById(office, String(parsed.sceneId || "").trim());
    if (!scene) {
      readyScene = null;
      choiceSource = null;
      choice.textContent = "The model returned \"" + String(parsed.sceneId || "") + "\", which is not one of the scenes for this office. Nothing was selected.";
      return;
    }
    rememberScene(office.id, scene.id);
    chooseScene(office, scene, "model", String(parsed.reason || ""));
  } catch (err) {
    choice.textContent = "Error: " + err.message;
  } finally {
    button.disabled = false;
  }
};

document.getElementById("draw").onclick = async function () {
  var office = selectedOffice();
  var button = document.getElementById("draw");
  var picture = document.getElementById("picture");
  if (!readyScene) {
    picture.textContent = "Pick a scene box first, or press Let the AI choose.";
    return;
  }
  var scene = readyScene;
  var prompt = buildImagePrompt(office, scene);
  button.disabled = true;
  document.getElementById("pick").disabled = true;
  picture.textContent = "Drawing \"" + scene.title + "\"… this can take 10–20 seconds.";
  document.getElementById("imageLabel").textContent = "";
  try {
    if (typeof OPENROUTER_API_KEY === "undefined" || OPENROUTER_API_KEY.indexOf("YOUR_") === 0) {
      throw new Error("No API key. Copy js/config.local.example.js to js/config.local.js and paste your key in.");
    }
    var response = await fetch("https://openrouter.ai/api/v1/images", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + OPENROUTER_API_KEY
      },
      body: JSON.stringify({
        model: IMAGE_MODEL,
        prompt: prompt,
        n: 1,
        aspect_ratio: "3:2"
      })
    });
    var imageData = await response.json();
    if (!response.ok) {
      var message = response.statusText;
      if (imageData.error && imageData.error.message) message = imageData.error.message;
      throw new Error(message);
    }
    if (typeof addSessionCost === "function") addSessionCost(imageData.usage && imageData.usage.cost);
    var src = imageSrc(imageData);
    if (!src) throw new Error("The image API did not return a picture.");
    var img = document.createElement("img");
    img.src = src;
    img.alt = "AI-generated illustration: " + scene.title;
    picture.replaceChildren(img);
    var who = choiceSource === "you"
      ? "You chose this scene from the five written for this office."
      : "The model chose this scene from the five written for this office.";
    document.getElementById("imageLabel").textContent =
      "AI-generated illustration of \"" + scene.title + "\" for " + office.name
      + ". It is not a photograph of a real person, not a candidate, and not official election material. "
      + who + " Why it matters: " + (scene.matters || "")
      + " The prompt above is the exact request.";
    document.getElementById("imageCost").textContent = "This picture: " + dollars(imageData.usage && imageData.usage.cost) + ".";
  } catch (err) {
    picture.textContent = "Error: " + err.message;
    document.getElementById("imageCost").textContent = "";
  } finally {
    button.disabled = false;
    document.getElementById("pick").disabled = false;
  }
};

fetch("data/datapack.json?v=5")
  .then(function (response) { return response.json(); })
  .then(function (pack) {
    offices = pack.offices || [];
    var menu = document.getElementById("office");
    for (var i = 0; i < offices.length; i++) {
      menu.add(new Option(offices[i].name, offices[i].id));
    }
    showOfficeCards(selectedOffice().id);
    showPack(selectedOffice());
    showSceneList(selectedOffice(), null);
    paintSessionCost();
  });
