// Voter guide.
//
// Part 1: a reading level and a length. "As written" does not call the model.
// Every rewrite sends only the legal text (measure.fullText).
// This file never reads measure.official. That block is the state's answer key.
//
// Part 2: compare the two sides. That call sends only the arguments and rebuttals.
// The page never says which side is right.

// ---- 1. The five topics and the words we count for each one -----------------
// A whole-word search. "rent" does not also match a longer word.

var TOPICS = [
  {
    id: "taxes",
    label: "My Taxes",
    covers: "taxes and how public money is spent",
    words: ["tax", "taxes", "taxpayer", "revenue", "fee", "fees", "fund", "funds", "spending", "budget", "dollar"]
  },
  {
    id: "home",
    label: "My Home",
    covers: "rent and housing costs, for renters and owners",
    words: ["housing", "home", "homes", "homeowner", "homeowners", "mortgage", "mortgages", "rent", "rents", "rental", "renter", "renters", "tenant", "tenants", "landlord", "landlords", "residential", "apartment", "apartments", "dwelling", "dwellings"]
  },
  {
    id: "health",
    label: "My Health and Schools",
    covers: "health, help for families, and schools",
    words: ["health", "healthcare", "hospital", "medical", "school", "schools", "education", "student", "students", "teacher", "teachers", "college"]
  },
  {
    id: "neighborhood",
    label: "My Neighborhood",
    covers: "local services and the environment, including water and roads",
    words: ["neighborhood", "water", "road", "roads", "environment", "environmental", "park", "parks", "pollution", "transit"]
  },
  {
    id: "vote",
    label: "My Vote and My Say",
    covers: "elections and your vote",
    words: ["election", "elections", "vote", "voting", "voter", "voters", "ballot", "campaign", "candidate", "candidates"]
  }
];

// ---- 2. Small helpers -------------------------------------------------------

var measures = [];

// Printed wherever argument text appears. The data pack has the same sentence.
var argumentDisclaimer = "Arguments printed on this page are the opinions of the authors and have not been checked for accuracy by any official agency.";

function selectedMeasure() {
  var menu = document.getElementById("measure");
  for (var i = 0; i < measures.length; i++) {
    if (measures[i].id === menu.value) {
      return measures[i];
    }
  }
}

function selectedTopic() {
  var menu = document.getElementById("topic");
  for (var i = 0; i < TOPICS.length; i++) {
    if (TOPICS[i].id === menu.value) {
      return TOPICS[i];
    }
  }
}

function levelName(value) {
  if (value === "as-written") return "As written";
  if (value === "plain") return "Plain English (grade 11-13)";
  if (value === "everyday") return "Everyday (grade 7-9)";
  if (value === "simplest") return "Simplest (grade 3-4)";
  return value;
}

// Count one keyword as a whole word. Returns a number.
function countOneWord(text, word) {
  var pattern = new RegExp("\\b" + word + "\\b", "gi");
  var found = text.match(pattern);
  if (found === null) {
    return 0;
  }
  return found.length;
}

// Add up every keyword in one topic.
function countTopicWords(text, wordList) {
  var total = 0;
  for (var i = 0; i < wordList.length; i++) {
    total = total + countOneWord(text, wordList[i]);
  }
  return total;
}

// ---- 3. The two prompts -----------------------------------------------------
// Both prompts include the legal text only.

function readingLevelInstructions(level) {
  if (level === "plain") {
    return "Write like a newspaper editorial for grades 11 to 13. Keep technical terms, and define each technical term the first time you use it.";
  }
  if (level === "everyday") {
    return "Write for grades 7 to 9. Use short sentences and common words. Explain anything that is not an everyday word.";
  }
  if (level === "simplest") {
    return "Write for grades 3 to 4. Use very short sentences. Explain it like a simple story a child could follow.";
  }
  return "";
}

function lengthInstructions(length) {
  if (length === "headline") return "Use 25 words or fewer.";
  if (length === "short") return "Use between 75 and 100 words.";
  if (length === "standard") return "Use between 250 and 300 words.";
  if (length === "complete") return "Do not leave any provision out. Explain every part in plain language. There is no word cap.";
  return "There is no word cap. Pick a length that fits the reading level.";
}

function buildRewritePrompt(measure, level, length) {
  return "Rewrite this California ballot measure for one reader.\n"
    + readingLevelInstructions(level) + "\n"
    + lengthInstructions(length) + "\n"
    + "Use only the legal text below. Do not add facts from anywhere else.\n"
    + "Words marked [DELETED: ...] are being removed from the law. Do not treat those words as part of the new law.\n"
    + "Keep important limits, especially words like one-time.\n\n"
    + measure.label + " full legal text:\n"
    + measure.fullText;
}

function buildTopicPrompt(measure, topic) {
  return "A voter wants to know what this California ballot measure means for one topic: \"" + topic.label + "\".\n"
    + "The topic covers: " + topic.covers + ".\n\n"
    + "Answer in two parts.\n"
    + "Part 1. Start with this heading: What the text says\n"
    + "Give up to 3 points about this topic. Use only the legal text below. After each point, quote the exact words from the text that the point comes from.\n"
    + "Part 2. Start with this heading: AI opinion\n"
    + "The first sentence of part 2 must be: This is an AI opinion, not a fact.\n"
    + "Then, in under 80 words, say whether this measure looks good, bad, or mixed for this topic, and why. Do not tell the voter how to vote.\n"
    + "If the text says little about this topic, say so. Do not invent a connection.\n"
    + "Words marked [DELETED: ...] are being removed from the law.\n\n"
    + measure.label + " full legal text:\n"
    + measure.fullText;
}

// ---- 4. Draw the page pieces that do not need the model ---------------------

function showTopicBars(measure) {
  // operativeText (from js/fk.js) drops the [DELETED: ...] words,
  // because those words are being removed from the law.
  var text = operativeText(measure.fullText);
  var counts = [];
  var biggest = 1;

  for (var i = 0; i < TOPICS.length; i++) {
    var n = countTopicWords(text, TOPICS[i].words);
    counts.push(n);
    if (n > biggest) {
      biggest = n;
    }
  }

  var box = document.getElementById("topics");
  box.innerHTML = "";
  var pickedId = document.getElementById("topic").value;

  for (var j = 0; j < TOPICS.length; j++) {
    var topic = TOPICS[j];
    var width = Math.round((counts[j] / biggest) * 100);

    var unit = "words";
    if (counts[j] === 1) {
      unit = "word";
    }

    var button = document.createElement("button");
    button.type = "button";
    button.className = "topic-button";
    if (topic.id === pickedId) {
      button.className = "topic-button picked";
    }
    button.setAttribute("data-id", topic.id);
    button.innerHTML = topic.label + " (" + counts[j] + " " + unit + ")"
      + "<span class=\"track\"><span class=\"fill\" style=\"width:" + width + "%\"></span></span>";

    button.onclick = function () {
      document.getElementById("topic").value = this.getAttribute("data-id");
      showTopicBars(selectedMeasure());
    };

    box.appendChild(button);
  }
}

function updatePage() {
  var measure = selectedMeasure();
  if (!measure) {
    return;
  }

  showTopicBars(measure);
  showSigners(measure);
  document.getElementById("fullText").textContent = measure.fullText;
  document.getElementById("legalPdf").href = measure.sources.legalTextPdf;
  document.getElementById("topicSource").href = measure.sources.legalTextPdf;
  document.getElementById("argumentsPage").href = measure.sources.argumentsPage;

  var level = document.getElementById("level").value;
  var length = document.getElementById("length").value;
  var warning = document.getElementById("warning");

  if (level === "simplest" && length === "headline") {
    warning.textContent = "Warning: Simplest plus Headline is a hard combination. "
      + "25 words at a grade 3-4 level will drop important limits. "
      + "On Prop 40, the words \"one-time\" are the kind of limit that can disappear, "
      + "which would make a temporary tax sound permanent. "
      + "You can still press the button and see what the model drops.";
  } else if (level === "as-written") {
    warning.textContent = "As written always shows the whole certified text. "
      + "The length you picked is not used in this mode, because a shorter version would no longer be the certified text.";
  } else {
    warning.textContent = "";
  }

  var longNote = document.getElementById("longNote");
  if (measure.id === "prop-45") {
    longNote.textContent = "Prop 45 is the long measure. Sending it to the model costs more and takes longer. As written is free.";
  } else {
    longNote.textContent = "";
  }
}

function fillTopicMenu() {
  var menu = document.getElementById("topic");
  for (var i = 0; i < TOPICS.length; i++) {
    menu.add(new Option(TOPICS[i].label, TOPICS[i].id));
  }
}

// ---- 5. Load the data pack --------------------------------------------------

var measureMenu = document.getElementById("measure");

fetch("data/datapack.json?v=4")
  .then(function (response) {
    return response.json();
  })
  .then(function (pack) {
    if (pack.meta && pack.meta.argumentDisclaimer) {
      argumentDisclaimer = pack.meta.argumentDisclaimer;
    }
    document.getElementById("argumentDisclaimer").textContent = argumentDisclaimer;
    measures = pack.measures;
    for (var i = 0; i < measures.length; i++) {
      var m = measures[i];
      measureMenu.add(new Option(m.label + " (" + m.wordCount + " words)", m.id));
    }
    fillTopicMenu();
    updatePage();
  });

measureMenu.onchange = function () {
  // A new measure should not keep the previous measure's model text on screen.
  resetBox(document.getElementById("output"), "Press Show this version.");
  document.getElementById("outputLabel").textContent = "";
  document.getElementById("check").textContent = "";
  document.getElementById("cost").textContent = "";
  resetBox(document.getElementById("topicOutput"), "Press Explain this topic.");
  document.getElementById("topicLabel").textContent = "";
  document.getElementById("topicCost").textContent = "";
  document.getElementById("prompt").textContent = "Nothing sent yet.";
  resetBox(document.getElementById("compareOutput"), "Press Compare the two sides.");
  document.getElementById("compareCost").textContent = "";
  updatePage();
};

document.getElementById("level").onchange = updatePage;
document.getElementById("length").onchange = updatePage;
document.getElementById("topic").onchange = function () {
  showTopicBars(selectedMeasure());
};

function levelShort(value) {
  if (value === "plain") return "Plain English";
  if (value === "everyday") return "Everyday";
  if (value === "simplest") return "Simplest";
  if (value === "as-written") return "As written";
  return value;
}

function lengthShort(value) {
  if (value === "headline") return "Headline";
  if (value === "short") return "Short";
  if (value === "standard") return "Standard";
  if (value === "complete") return "Complete";
  return "No length cap";
}

function gradeTarget(level) {
  if (level === "plain") return { min: 11, max: 13, label: "11–13" };
  if (level === "everyday") return { min: 7, max: 9, label: "7–9" };
  if (level === "simplest") return { min: 3, max: 4, label: "3–4" };
  return null;
}

function wordTarget(length) {
  if (length === "headline") return { min: 1, max: 25, label: "25 or fewer" };
  if (length === "short") return { min: 75, max: 100, label: "75–100" };
  if (length === "standard") return { min: 250, max: 300, label: "250–300" };
  return null;
}

function addChip(parent, text, kind) {
  var chip = document.createElement("span");
  chip.className = "ai-chip" + (kind ? " " + kind : "");
  chip.textContent = text;
  parent.appendChild(chip);
}

function fillParagraphs(parent, text) {
  var lines = String(text || "").split(/\n+/);
  var wrote = false;
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i].trim();
    if (!line) continue;
    addText(parent, "p", line);
    wrote = true;
  }
  if (!wrote) addText(parent, "p", "The model returned no text.");
}

function machineFoot(parent, costText, seconds) {
  var foot = document.createElement("p");
  foot.className = "ai-foot";
  var modelName = typeof MODEL === "string" ? MODEL : "the model";
  var timing = "";
  if (typeof seconds === "number" && isFinite(seconds)) {
    timing = seconds.toFixed(1) + "s · ";
  }
  foot.textContent = "Machine-written by " + modelName + ". It can be wrong or incomplete, and nothing here is official. " + timing + costText;
  parent.appendChild(foot);
}

function aiHead(parent, kickerText, openLegal) {
  var head = document.createElement("div");
  head.className = "ai-head";
  var left = document.createElement("div");
  var badge = document.createElement("span");
  badge.className = "ai-badge";
  badge.textContent = "AI-GENERATED";
  var kicker = document.createElement("span");
  kicker.className = "ai-kicker";
  kicker.textContent = kickerText;
  left.appendChild(badge);
  left.appendChild(kicker);
  head.appendChild(left);
  if (openLegal) {
    var button = document.createElement("button");
    button.type = "button";
    button.className = "ai-open";
    button.textContent = "Read the full legal text";
    button.onclick = function () {
      var details = document.getElementById("fullTextDetails");
      details.open = true;
      details.scrollIntoView({ block: "nearest" });
    };
    head.appendChild(button);
  }
  parent.appendChild(head);
}

function resetBox(el, message) {
  el.className = "";
  el.textContent = message;
}

function showOfficialText(output, measure, score) {
  output.className = "official-block";
  output.textContent = "";
  var head = document.createElement("div");
  head.className = "ai-head";
  var left = document.createElement("div");
  var badge = document.createElement("span");
  badge.className = "ai-badge";
  badge.textContent = "OFFICIAL TEXT";
  var kicker = document.createElement("span");
  kicker.className = "ai-kicker";
  kicker.textContent = "Certified legal text of " + measure.label + ". No model was used.";
  left.appendChild(badge);
  left.appendChild(kicker);
  head.appendChild(left);
  output.appendChild(head);
  var chips = document.createElement("div");
  chips.className = "ai-chips";
  var grade = score.grade === null ? "not available" : String(score.grade);
  addChip(chips, "Flesch-Kincaid grade " + grade, "");
  addChip(chips, score.words + " words, struck-out words left out", "");
  addChip(chips, "Cost of this view: $0", "ok");
  output.appendChild(chips);
  var body = document.createElement("div");
  body.className = "official-text";
  body.textContent = measure.fullText;
  output.appendChild(body);
}

function showAiRewrite(output, measure, level, length, text, score, cost, seconds) {
  output.className = "ai-block";
  output.textContent = "";
  aiHead(output, levelShort(level) + " · " + lengthShort(length) + " · from the full legal text of " + measure.label, true);
  var chips = document.createElement("div");
  chips.className = "ai-chips";
  var target = gradeTarget(level);
  var grade = score.grade === null ? "not available" : String(score.grade);
  if (target && score.grade !== null) {
    var onGrade = score.grade >= target.min && score.grade <= target.max;
    addChip(chips, "Reads at grade " + grade + " · target " + target.label + " · " + (onGrade ? "on target" : "off target"), onGrade ? "ok" : "off");
  } else {
    addChip(chips, "Reads at grade " + grade, "");
  }
  var words = wordTarget(length);
  if (words) {
    var within = score.words >= words.min && score.words <= words.max;
    addChip(chips, score.words + " words · target " + words.label + " · " + (within ? "within range" : "outside range"), within ? "ok" : "off");
  } else {
    addChip(chips, score.words + " words · no word limit", "");
  }
  output.appendChild(chips);
  var note = document.createElement("p");
  note.className = "ai-note";
  note.textContent = "Written by the model from the full legal text. The official summary was not sent.";
  output.appendChild(note);
  var body = document.createElement("div");
  body.className = "ai-body";
  fillParagraphs(body, text);
  output.appendChild(body);
  machineFoot(output, formatDollars(cost), seconds);
}

function splitTopicReply(text) {
  var raw = String(text || "").replace(/\r/g, "");
  var at = raw.search(/\bAI opinion\b/i);
  if (at === -1) return { facts: raw, opinion: "" };
  return {
    facts: raw.slice(0, at).replace(/^\s*what the text says\s*/i, "").trim(),
    opinion: raw.slice(at).replace(/^\s*AI opinion\s*/i, "").trim()
  };
}

function showAiTopic(output, measure, topic, text, keywordCount, cost, seconds) {
  output.className = "ai-block";
  output.textContent = "";
  aiHead(output, measure.label + " · " + topic.label, true);
  var chips = document.createElement("div");
  chips.className = "ai-chips";
  var unit = keywordCount === 1 ? "word" : "words";
  addChip(chips, "Keyword count: " + keywordCount + " " + unit + " in the legal text", keywordCount > 0 ? "ok" : "off");
  output.appendChild(chips);
  var parts = splitTopicReply(text);
  var facts = document.createElement("div");
  facts.className = "ai-body";
  addText(facts, "p", "What the text says");
  facts.lastChild.style.fontWeight = "700";
  facts.lastChild.style.letterSpacing = "0.04em";
  facts.lastChild.style.fontSize = "0.82rem";
  fillParagraphs(facts, parts.facts);
  output.appendChild(facts);
  var opinion = document.createElement("div");
  opinion.className = "ai-opinion";
  var badge = document.createElement("span");
  badge.className = "ai-badge";
  badge.textContent = "AI OPINION";
  opinion.appendChild(badge);
  var warn = document.createElement("p");
  warn.className = "ai-note";
  warn.textContent = "This is the AI's own opinion. It is not a fact, it is not in the law, and it is not advice on how to vote.";
  opinion.appendChild(warn);
  if (parts.opinion) {
    fillParagraphs(opinion, parts.opinion);
  } else {
    addText(opinion, "p", "The reply did not include a separate opinion section.");
  }
  output.appendChild(opinion);
  var foot = document.createElement("p");
  foot.className = "ai-foot";
  var modelName = typeof MODEL === "string" ? MODEL : "the model";
  var timing = "";
  if (typeof seconds === "number" && isFinite(seconds)) timing = seconds.toFixed(1) + "s · ";
  foot.textContent = "Machine-written by " + modelName + ". The AI opinion is one model's view. Nothing here is official. " + timing + formatDollars(cost);
  output.appendChild(foot);
}

// ---- 6. Show this version ---------------------------------------------------

document.getElementById("show").onclick = async function () {
  var measure = selectedMeasure();
  var level = document.getElementById("level").value;
  var length = document.getElementById("length").value;
  var output = document.getElementById("output");
  var button = document.getElementById("show");

  button.disabled = true;

  // As written: no API call. Show the certified text itself.
  if (level === "as-written") {
    document.getElementById("outputLabel").textContent = "";
    document.getElementById("prompt").textContent = "No prompt. As written does not call the model.";
    document.getElementById("check").textContent = "";
    document.getElementById("cost").textContent = "";

    // The grade formula counts the law people would actually read,
    // so words inside [DELETED: ...] are left out of the count.
    var originalScore = fleschKincaid(operativeText(measure.fullText));
    showOfficialText(output, measure, originalScore);
    button.disabled = false;
    return;
  }

  resetBox(output, "Waiting for the model…");
  document.getElementById("outputLabel").textContent = "";
  document.getElementById("check").textContent = "";
  document.getElementById("cost").textContent = "";
  var prompt = buildRewritePrompt(measure, level, length);
  document.getElementById("prompt").textContent = prompt;
  var started = Date.now();

  try {
    var data = await askModel(prompt);
    var text = data.choices[0].message.content;
    var score = fleschKincaid(text);
    var seconds = (Date.now() - started) / 1000;
    showAiRewrite(output, measure, level, length, text, score, data.usage && data.usage.cost, seconds);
  } catch (err) {
    resetBox(output, "Error: " + err.message);
  }

  button.disabled = false;
};

// ---- 7. Explain one topic ---------------------------------------------------

document.getElementById("explain").onclick = async function () {
  var measure = selectedMeasure();
  var topic = selectedTopic();
  var output = document.getElementById("topicOutput");
  var button = document.getElementById("explain");

  button.disabled = true;
  resetBox(output, "Waiting for the model…");
  document.getElementById("topicLabel").textContent = "";
  document.getElementById("topicCost").textContent = "";

  var prompt = buildTopicPrompt(measure, topic);
  document.getElementById("prompt").textContent = prompt;
  var started = Date.now();

  try {
    var data = await askModel(prompt);
    var keywordCount = countTopicWords(operativeText(measure.fullText), topic.words);
    var seconds = (Date.now() - started) / 1000;
    showAiTopic(output, measure, topic, data.choices[0].message.content, keywordCount, data.usage && data.usage.cost, seconds);
  } catch (err) {
    resetBox(output, "Error: " + err.message);
  }

  button.disabled = false;
};

// ---- 8. Who signed, and the same name on both sides -------------------------
// Signers come straight from the data pack. No model.

// The order is the real exchange. Each side gets one reply, and then it stops.
var ARGUMENT_ORDER = [
  {
    key: "argumentInFavor",
    label: "Yes opening argument. The No side gets one chance to answer this."
  },
  {
    key: "rebuttalToFavor",
    label: "No rebuttal. The No side is answering the Yes opening argument."
  },
  {
    key: "argumentAgainst",
    label: "No opening argument. The Yes side gets one chance to answer this."
  },
  {
    key: "rebuttalToAgainst",
    label: "Yes rebuttal. The Yes side is answering the No opening argument. The No side does not get another turn."
  }
];

function addText(parent, tag, text) {
  var el = document.createElement(tag);
  el.textContent = text;
  parent.appendChild(el);
  return el;
}

function signerLine(signer) {
  var line = signer.name;
  if (signer.title) {
    line = line + ", " + signer.title;
  }
  if (signer.organization) {
    line = line + " — " + signer.organization;
  } else {
    line = line + " — no organization listed";
  }
  return line;
}

// "Planned Parenthood of Pacific Southwest" becomes "Planned Parenthood".
// The shorter name is what we look for in the other side's argument text.
function shortOrgName(org) {
  var name = String(org || "").replace(/\(.*?\)/g, "").trim();
  var cut = name.toLowerCase().indexOf(" of ");
  if (cut > 0) {
    name = name.slice(0, cut).trim();
  }
  return name;
}

function normalizeOrg(org) {
  return String(org || "")
    .toLowerCase()
    .replace(/\(.*?\)/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function quoteAround(text, phrase) {
  var at = text.toLowerCase().indexOf(phrase.toLowerCase());
  if (at === -1) {
    return "";
  }
  // A short window, not a whole sentence. "Prop." would otherwise cut the quote too early.
  var start = at - 80;
  if (start < 0) {
    start = 0;
  }
  var end = at + phrase.length + 80;
  if (end > text.length) {
    end = text.length;
  }
  var slice = text.slice(start, end);
  // Keep the window on word boundaries so a quote does not start mid-word.
  if (start > 0) {
    var firstSpace = slice.indexOf(" ");
    if (firstSpace !== -1 && firstSpace < 40) {
      slice = slice.slice(firstSpace + 1);
    }
  }
  if (end < text.length) {
    var lastSpace = slice.lastIndexOf(" ");
    if (lastSpace > slice.length - 40) {
      slice = slice.slice(0, lastSpace);
    }
  }
  return slice.replace(/\s+/g, " ").trim();
}

function signerRows(measure) {
  var rows = [];
  for (var i = 0; i < ARGUMENT_ORDER.length; i++) {
    var doc = measure.arguments[ARGUMENT_ORDER[i].key];
    for (var s = 0; s < doc.signers.length; s++) {
      rows.push({
        signer: doc.signers[s],
        side: doc.side,
        heading: doc.heading
      });
    }
  }
  return rows;
}

function otherSideText(measure, side) {
  var text = "";
  for (var i = 0; i < ARGUMENT_ORDER.length; i++) {
    var doc = measure.arguments[ARGUMENT_ORDER[i].key];
    if (doc.side === side) {
      text = text + "\n" + doc.text;
    }
  }
  return text;
}

// The same organization string is on a Yes signature and a No signature.
function sharedSignerGroups(measure) {
  var rows = signerRows(measure);
  var groups = {};
  for (var i = 0; i < rows.length; i++) {
    var key = normalizeOrg(rows[i].signer.organization);
    if (key.length < 8) continue;
    if (!groups[key]) groups[key] = [];
    groups[key].push(rows[i]);
  }
  var found = [];
  for (var name in groups) {
    var list = groups[name];
    var yes = false;
    var no = false;
    for (var j = 0; j < list.length; j++) {
      if (list[j].side === "yes") yes = true;
      if (list[j].side === "no") no = true;
    }
    if (yes && no) found.push(list);
  }
  return found;
}

// A signer's organization name shows up in the other side's argument text.
// That is a different finding from the same organization signing both sides.
function mentionedAcrossSides(measure) {
  var rows = signerRows(measure);
  var findings = [];
  var seen = {};
  for (var i = 0; i < rows.length; i++) {
    var row = rows[i];
    var org = String(row.signer.organization || "").trim();
    var phrase = shortOrgName(org);
    if (phrase.length < 8) continue;
    var other = row.side === "yes" ? "no" : "yes";
    var seenKey = phrase.toLowerCase() + "|" + other;
    if (seen[seenKey]) continue;

    var phraseKey = normalizeOrg(phrase);
    var otherHasSigner = false;
    for (var j = 0; j < rows.length; j++) {
      if (rows[j].side !== other) continue;
      var otherKey = normalizeOrg(rows[j].signer.organization);
      if (otherKey.length < 8) continue;
      if (otherKey === normalizeOrg(org) || otherKey.indexOf(phraseKey) !== -1 || phraseKey.indexOf(otherKey) !== -1) {
        otherHasSigner = true;
      }
    }
    if (otherHasSigner) continue;

    var text = otherSideText(measure, other);
    var quote = quoteAround(text, phrase);
    if (!quote) continue;
    seen[seenKey] = true;
    findings.push({
      phrase: phrase,
      signer: row.signer,
      signerSide: row.side,
      quoteSide: other,
      quote: quote
    });
  }
  return findings;
}

function columnHead(text, side) {
  var el = document.createElement("div");
  el.className = "col-head side-" + side;
  el.textContent = text;
  return el;
}

function sideWord(side) {
  if (side === "yes") return "Yes";
  return "No";
}

function countWords(text) {
  var parts = String(text || "").trim().split(/\s+/);
  if (!parts[0]) return 0;
  return parts.length;
}

function signerBlock(card, title, doc) {
  addText(card, "h3", title);
  var list = document.createElement("ul");
  for (var s = 0; s < doc.signers.length; s++) {
    addText(list, "li", signerLine(doc.signers[s]));
  }
  card.appendChild(list);
  var details = document.createElement("details");
  var summary = document.createElement("summary");
  summary.textContent = "Original text";
  details.appendChild(summary);
  var note = addText(details, "p", argumentDisclaimer);
  note.className = "disclaimer";
  var pre = document.createElement("pre");
  pre.textContent = doc.text;
  details.appendChild(pre);
  card.appendChild(details);
}

function sideColumn(measure, side) {
  var opening = measure.arguments[side === "yes" ? "argumentInFavor" : "argumentAgainst"];
  var reply = measure.arguments[side === "yes" ? "rebuttalToAgainst" : "rebuttalToFavor"];
  var card = document.createElement("article");
  card.className = "signer-card side-" + side;
  var meta = addText(card, "p", "Argument, " + countWords(opening.text) + " words. One reply, " + countWords(reply.text) + " words.");
  meta.className = "ai-note";
  signerBlock(card, "Signed the argument", opening);
  signerBlock(card, "Signed the reply", reply);
  return card;
}

function showSigners(measure) {
  var box = document.getElementById("signers");
  box.innerHTML = "";

  var official = document.createElement("p");
  var officialLink = document.createElement("a");
  officialLink.href = measure.sources.argumentsPage;
  officialLink.target = "_blank";
  officialLink.rel = "noopener";
  officialLink.textContent = "Official page: the full unaltered arguments and rebuttals";
  official.appendChild(officialLink);
  box.appendChild(official);

  var heads = document.createElement("div");
  heads.className = "two-col";
  heads.appendChild(columnHead("Yes", "yes"));
  heads.appendChild(columnHead("No", "no"));
  box.appendChild(heads);

  var columns = document.createElement("div");
  columns.className = "two-col";
  columns.appendChild(sideColumn(measure, "yes"));
  columns.appendChild(sideColumn(measure, "no"));
  box.appendChild(columns);

  var groups = sharedSignerGroups(measure);
  var mentions = mentionedAcrossSides(measure);
  if (groups.length === 0 && mentions.length === 0) {
    addText(box, "p", "No organization that signed one side also signed the other side. No signer organization name shows up in the other side's arguments either.");
    return;
  }

  for (var g = 0; g < groups.length; g++) {
    var group = groups[g];
    var signed = document.createElement("div");
    signed.className = "shared-org";
    addText(signed, "p", "Same organization signed both sides: " + group[0].signer.organization);
    for (var r = 0; r < group.length; r++) {
      addText(signed, "p", sideWord(group[r].side) + " — " + group[r].heading + ": " + signerLine(group[r].signer));
    }
    addText(signed, "p", "This is a fact about the signature lines. It is not a fact check, and it does not say which side is right.");
    var signedNote = addText(signed, "p", argumentDisclaimer);
    signedNote.className = "disclaimer";
    box.appendChild(signed);
  }

  for (var f = 0; f < mentions.length; f++) {
    var finding = mentions[f];
    var card = document.createElement("div");
    card.className = "shared-org";
    addText(card, "p",
      "The name \"" + finding.phrase + "\" is on a " + sideWord(finding.signerSide)
      + " signature and also in the " + sideWord(finding.quoteSide) + " arguments.");
    addText(card, "p", "Signer: " + signerLine(finding.signer));
    addText(card, "p",
      "A shared name is not proof it is the same organization. Unaltered words from the "
      + sideWord(finding.quoteSide) + " text:");
    var quote = addText(card, "blockquote", finding.quote);
    quote.className = "official-quote";
    addText(card, "p", "This is not a fact check, and it does not say which side is right.");
    var cardNote = addText(card, "p", argumentDisclaimer);
    cardNote.className = "disclaimer";
    box.appendChild(card);
  }
}

// ---- 9. Compare claims ------------------------------------------------------
// The model must return JSON. This code reads that JSON and prints every cell in words.
// A cell is never left blank. Two blanks would pretend both sides said nothing.

function buildComparePrompt(measure) {
  var args = measure.arguments;
  return "Compare the two sides of one California ballot measure.\n"
    + "You are not a fact checker. Do not say which side is right. Do not call any claim true or false.\n"
    + "Use only the four documents below. Do not add facts from anywhere else.\n"
    + "Return JSON only, with no markdown, in this exact shape:\n"
    + "{\n"
    + "  \"dimensions\": [\n"
    + "    {\n"
    + "      \"name\": \"short name of the point\",\n"
    + "      \"yes\": { \"status\": \"raised\", \"claim\": \"one sentence\", \"response\": \"nobody_answered\", \"source\": \"yes_argument\", \"quote\": \"exact words from that document\" },\n"
    + "      \"no\": { \"status\": \"never_raised\", \"claim\": \"\", \"response\": \"none\", \"source\": \"none\", \"quote\": \"\" }\n"
    + "    }\n"
    + "  ]\n"
    + "}\n"
    + "Give 4 to 6 dimensions. Each dimension must be something at least one side actually wrote about.\n"
    + "status must be one of: raised, disputes, never_raised.\n"
    + "raised = this side made its own claim about the point.\n"
    + "disputes = this side wrote about the point and disagrees with the other side.\n"
    + "never_raised = this side did not write about the point. Then claim, quote must be \"\" and response and source must be \"none\".\n"
    + "response must be one of: rebutted, nobody_answered, no_chance_to_respond, none.\n"
    + "rebutted = the claim is in that side's opening argument, and the other side's rebuttal answers it. The claim is still that side's claim. A reply is not a fact check.\n"
    + "nobody_answered = the claim is in that side's opening argument, and the other side never answers it.\n"
    + "no_chance_to_respond = the claim first appears in that side's rebuttal, so the other side gets no reply.\n"
    + "none = use this only when status is never_raised.\n"
    + "source must be one of: yes_argument, yes_rebuttal, no_argument, no_rebuttal, none.\n"
    + "yes_argument is the Yes opening argument. yes_rebuttal is the Yes rebuttal.\n"
    + "no_argument is the No opening argument. no_rebuttal is the No rebuttal.\n"
    + "quote must be copied exactly from the source document, about 8 to 25 words. Do not paraphrase the quote.\n"
    + "If response is no_chance_to_respond, source must be that side's rebuttal.\n"
    + "If response is rebutted or nobody_answered, source must be that side's opening argument.\n"
    + "Do not leave both sides as never_raised on the same dimension.\n\n"
    + "YES opening argument:\n" + args.argumentInFavor.text + "\n\n"
    + "NO rebuttal to the yes argument (written by the No side):\n" + args.rebuttalToFavor.text + "\n\n"
    + "NO opening argument:\n" + args.argumentAgainst.text + "\n\n"
    + "YES rebuttal to the no argument (written by the Yes side):\n" + args.rebuttalToAgainst.text;
}

function parseModelJson(text) {
  var cleaned = text.trim();
  var start = cleaned.indexOf("{");
  var end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1) {
    throw new Error("The model did not return JSON.");
  }
  return JSON.parse(cleaned.slice(start, end + 1));
}

function cleanStatus(value, claim) {
  var v = String(value || "").toLowerCase().replace(/ /g, "_");
  if (v === "dispute" || v === "disputed" || v === "disputes") return "disputes";
  if (v === "never_raised" || v === "not_raised" || v === "silent") {
    // A sentence means this side did write about the point, so it is not silence.
    if (claim) return "raised";
    return "never_raised";
  }
  if (v === "raised") return "raised";
  if (!claim) return "never_raised";
  return "raised";
}

function cleanResponse(value) {
  var v = String(value || "").toLowerCase().replace(/ /g, "_");
  if (v === "rebutted" || v === "answered") return "rebutted";
  if (v === "nobody_answered" || v === "unanswered") return "nobody_answered";
  if (v === "no_chance_to_respond" || v === "first_raised_in_rebuttal") return "no_chance_to_respond";
  if (v === "none" || v === "") return "none";
  return "unknown";
}

function normalizeSide(raw) {
  var claim = "";
  if (raw && raw.claim) {
    claim = String(raw.claim).trim();
  }
  var quote = "";
  if (raw && raw.quote) {
    quote = String(raw.quote).trim();
  }
  var source = "";
  if (raw && raw.source) {
    source = String(raw.source).trim();
  }
  var status = cleanStatus(raw && raw.status, claim);
  if (status === "never_raised") {
    return { status: "never_raised", claim: "", response: "none", quote: "", source: "none" };
  }
  return {
    status: status,
    claim: claim,
    response: cleanResponse(raw && raw.response),
    quote: quote,
    source: source
  };
}

function normText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function sourceName(source) {
  if (source === "yes_argument") return "the Yes opening argument";
  if (source === "yes_rebuttal") return "the Yes rebuttal";
  if (source === "no_argument") return "the No opening argument";
  if (source === "no_rebuttal") return "the No rebuttal";
  return "";
}

// Where the quote actually appears. The page trusts the documents over the model's source label.
function findQuoteHits(measure, quote) {
  var needle = normText(quote);
  var hits = [];
  if (needle.length < 20) return hits;
  for (var i = 0; i < ARGUMENT_ORDER.length; i++) {
    var doc = measure.arguments[ARGUMENT_ORDER[i].key];
    if (normText(doc.text).indexOf(needle) !== -1) {
      hits.push(doc);
    }
  }
  return hits;
}

function locateQuote(measure, quote) {
  var hits = findQuoteHits(measure, quote);
  if (hits.length) {
    return { hits: hits, displayQuote: quote, loose: false };
  }
  var words = normText(quote).split(" ").filter(function (word) { return word.length > 0; });
  if (words.length < 6) {
    return { hits: [], displayQuote: "", loose: false };
  }
  for (var i = 0; i <= words.length - 6; i++) {
    var window = words.slice(i, i + 6).join(" ");
    if (window.length < 20) continue;
    var found = findQuoteHits(measure, window);
    if (found.length) {
      return {
        hits: found,
        displayQuote: quoteAround(found[0].text, window),
        loose: true
      };
    }
  }
  return { hits: [], displayQuote: "", loose: false };
}

function addArgumentsLink(parent, measure) {
  var p = document.createElement("p");
  var link = document.createElement("a");
  link.href = measure.sources.argumentsPage;
  link.target = "_blank";
  link.rel = "noopener";
  link.textContent = "Full unaltered arguments and rebuttals";
  p.appendChild(link);
  parent.appendChild(p);
}

function markChip(text, kind) {
  var chip = document.createElement("span");
  chip.className = "mark-chip " + kind;
  chip.textContent = text;
  return chip;
}

function exchangeChip(rebuttalOnly, otherSpoke) {
  if (rebuttalOnly) return markChip("First raised in a rebuttal", "is-reply");
  if (!otherSpoke) return markChip("Nobody answered", "is-silent");
  return markChip("Answered, still standing", "is-answered");
}

function fillSideCell(cell, side, other, measure) {
  var kind = "raised";
  if (side.status === "never_raised") kind = "never";
  else if (side.status === "disputes") kind = "disputes";
  cell.className = "side-col " + kind;
  var chips = document.createElement("div");
  chips.className = "chip-row";
  cell.appendChild(chips);

  if (side.status === "never_raised") {
    chips.appendChild(markChip("Never raised", "is-never"));
    var silence = addText(cell, "p", "This side did not write about this point. That is not the same as disagreeing.");
    silence.className = "ai-note";
    return;
  }

  if (side.status === "disputes") chips.appendChild(markChip("Disputes", "is-disputes"));
  else chips.appendChild(markChip("Raised", "is-raised"));

  var tag = addText(cell, "p", "AI-generated rendering, not the official argument.");
  tag.className = "ai-tag";
  if (side.claim) addText(cell, "p", side.claim);
  else addText(cell, "p", "The model marked this side as speaking, but it did not return a sentence.");

  var located = locateQuote(measure, side.quote);
  if (located.hits.length === 0) {
    chips.appendChild(exchangeChip(false, other && other.status !== "never_raised"));
    var miss = addText(cell, "p", "No matching words were found in the arguments, so this rendering is not traced to the text.");
    miss.className = "ungrounded";
    return;
  }

  var headings = [];
  var rebuttalOnly = true;
  var argumentOnly = true;
  for (var i = 0; i < located.hits.length; i++) {
    headings.push(located.hits[i].heading);
    if (located.hits[i].round !== "rebuttal") rebuttalOnly = false;
    if (located.hits[i].round !== "argument") argumentOnly = false;
  }
  if (argumentOnly) chips.appendChild(markChip("Opening", "is-raised"));
  chips.appendChild(exchangeChip(rebuttalOnly, other && other.status !== "never_raised"));

  var details = document.createElement("details");
  var summary = document.createElement("summary");
  summary.textContent = "Unaltered words";
  details.appendChild(summary);
  addText(details, "p", "Traced to: " + headings.join("; ") + ".");
  if (rebuttalOnly) {
    addText(details, "p", "These words are in a rebuttal, so the other side never gets a turn.");
  } else if (!argumentOnly) {
    addText(details, "p", "These words appear in more than one document.");
  }
  if (located.loose) {
    addText(details, "p", "The model's quote was not exact. These are unaltered words from the argument around the part that matched:");
  }
  var quote = addText(details, "blockquote", located.loose ? located.displayQuote : side.quote);
  quote.className = "official-quote";
  var note = addText(details, "p", argumentDisclaimer);
  note.className = "disclaimer";
  addArgumentsLink(details, measure);
  cell.appendChild(details);
}

function showComparison(parsed, measure) {
  var box = document.getElementById("compareOutput");
  box.className = "ai-block";
  box.innerHTML = "";
  aiHead(box, "AI reading of the arguments and rebuttals for " + measure.label + ". Not a fact check, and not a verdict.", false);
  var note = document.createElement("p");
  note.className = "ai-note";
  note.textContent = "The claims below were extracted by the model. A quote is shown only when it was found in the supplied arguments. Nothing here is marked true or false.";
  box.appendChild(note);

  var list = [];
  if (parsed && parsed.dimensions) {
    list = parsed.dimensions;
  }
  if (list.length === 0) {
    addText(box, "p", "The model returned no dimensions to compare.");
    return;
  }

  var shown = 0;
  for (var i = 0; i < list.length; i++) {
    var dim = list[i];
    var yes = normalizeSide(dim.yes);
    var no = normalizeSide(dim.no);

    // Two empty cells would look like both sides said nothing. That would be a lie.
    if (yes.status === "never_raised" && no.status === "never_raised") {
      continue;
    }

    shown = shown + 1;
    if (shown === 1) {
      var heads = document.createElement("div");
      heads.className = "two-col";
      heads.appendChild(columnHead("Yes", "yes"));
      heads.appendChild(columnHead("No", "no"));
      box.appendChild(heads);
    }
    var point = document.createElement("section");
    point.className = "compare-point";
    var name = dim.name ? String(dim.name) : "Point " + shown;
    addText(point, "h3", name);
    var pair = document.createElement("div");
    pair.className = "two-col";
    var yesCell = document.createElement("div");
    var noCell = document.createElement("div");
    fillSideCell(yesCell, yes, no, measure);
    fillSideCell(noCell, no, yes, measure);
    pair.appendChild(yesCell);
    pair.appendChild(noCell);
    point.appendChild(pair);
    box.appendChild(point);
  }

  if (shown === 0) {
    addText(box, "p", "Every dimension the model returned was one neither side wrote about, so nothing is shown. Two empty cells would pretend that was a comparison.");
  }
}

document.getElementById("compare").onclick = async function () {
  var measure = selectedMeasure();
  var box = document.getElementById("compareOutput");
  var button = document.getElementById("compare");
  var prompt = buildComparePrompt(measure);

  button.disabled = true;
  resetBox(box, "Waiting for the model…");
  document.getElementById("prompt").textContent = prompt;

  try {
    var data = await askModel(prompt, { json: true });
    var text = data.choices[0].message.content;
    document.getElementById("compareCost").textContent = "This call: " + formatDollars(data.usage && data.usage.cost) + ".";
    try {
      var parsed = parseModelJson(text);
      showComparison(parsed, measure);
    } catch (parseErr) {
      resetBox(box, "");
      addText(box, "p", "Error: " + parseErr.message + " The reply was not used as a comparison.");
      var pre = document.createElement("pre");
      pre.textContent = text;
      box.appendChild(pre);
    }
  } catch (err) {
    resetBox(box, "Error: " + err.message);
  }

  button.disabled = false;
};

function applyTab() {
  var name = location.hash === "#sides" ? "sides" : "read";
  document.documentElement.setAttribute("data-tab", name);
  var panels = document.querySelectorAll(".panel");
  for (var i = 0; i < panels.length; i++) {
    var on = panels[i].id === "panel-" + name;
    panels[i].hidden = !on;
  }
  var tabs = document.querySelectorAll("[data-tab]");
  for (var j = 0; j < tabs.length; j++) {
    if (tabs[j].getAttribute("data-tab") === name) {
      tabs[j].className = "is-on";
      tabs[j].setAttribute("aria-current", "page");
    } else {
      tabs[j].className = "";
      tabs[j].removeAttribute("aria-current");
    }
  }
}

window.addEventListener("hashchange", applyTab);
applyTab();
paintSessionCost();
