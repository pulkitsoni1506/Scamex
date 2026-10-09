const rules = [
    {
        phrase: "urgent action required",
        points: 2,
        explanation: "Urgency can pressure people into acting without checking."
    },
    {
        phrase: "you won a prize",
        points: 2,
        explanation: "Unexpected prize claims can be used to lure victims."
    },
    {
        phrase: "verify your password",
        points: 3,
        explanation: "Be cautious if a message asks you to disclose credentials."
    },
    {
        phrase: "account will be suspended",
        points: 2,
        explanation: "Threats of account suspension can pressure users."
    },
    {
        phrase: "click here",
        points: 1,
        explanation: "Check where a link leads before opening it."
    },
    {
        phrase: "send your otp",
        points: 3,
        explanation: "Never disclose a one-time password to another person."
    },
    {
        phrase: "claim your reward",
        points: 1,
        explanation: "Unexpected rewards deserve careful verification."
    }
];

const messageInput = document.querySelector("#message");
const scanButton = document.querySelector("#scanButton");
const exampleButton = document.querySelector("#exampleButton");
const charCount = document.querySelector("#charCount");
const error = document.querySelector("#error");
const results = document.querySelector("#results");
const verdict = document.querySelector("#verdict");
const summary = document.querySelector("#summary");
const meterFill = document.querySelector("#meterFill");
const scoreText = document.querySelector("#scoreText");
const clues = document.querySelector("#clues");

messageInput.addEventListener("input", () => {
    charCount.textContent = `${messageInput.value.length} / 5000`;
});

exampleButton.addEventListener("click", () => {
    messageInput.value =
        "URGENT ACTION REQUIRED! Your account will be suspended. " +
        "Click here to verify your password and claim your reward.";

    charCount.textContent = `${messageInput.value.length} / 5000`;
    error.hidden = true;
    messageInput.focus();
});

scanButton.addEventListener("click", scanMessage);

function scanMessage() {
    const message = messageInput.value.trim();

    if (!message) {
        error.textContent = "Enter a message before starting your investigation.";
        error.hidden = false;
        results.hidden = true;
        return;
    }
    
    error.hidden = true;

    const normalised = message.toLowerCase();
    const matches = rules.filter(rule =>
        normalised.includes(rule.phrase)
    );
    
    const rawScore = matches.reduce(
        (total, rule) => total + rule.points,
        0
    );

    //This is a simple heuristic, not a probability of fraud.
    const score = Math.min(rawScore * 10, 100);

    let level;
    let explanation;

    if (score >= 60) {
        level = "High concern";
        explanation = "Several warning signs were detected. Verify independently.";
    } else if (score >= 30) {
        level = "Some concerns";
        explanation = "Review the clues and check the sender carefully.";
    } else if (score > 0) {
        level = "A few warning signs";
        explanation = "One or more clues deserve closer inspection.";
    } else {
        level = "no matching clues";
        explanation = "No phrase from the current rule list were found.";
    }
    verdict.textContent = level;
    summary.textContent = explanation;
    scoreText.textContent = `Rule score: ${score}/100 - not a fraud probability.`;
    meterFill.style.width = `${score}%`;
    meterFill.style.background =
    score >= 60 ? "#ff7373" :
    score >= 30 ? "#ffc66d" : "#53f5e8";

    clues.replaceChildren();

    if (matches.length === 0) {
        const card = document.createElement("div");
        card.className = "clue";

        const title = document.createElement("strong");
        title.textContent = "No known phrases matched";

        const detail = document.createElement("p");
        detail.textContent =
        "This does not mean the message is safe. The scanner has limited rules.";

        card.append(title, detail);
        clues.append(card);
    }

    for (const match of matches) {
        const card = document.createElement("div");
        card.className = "clue";

        const title = document.createElement("strong");
        title.textContent = `Detected phrase: "${match.phrase}"`;

        const detail = document.createElement("p");
        detail.textContent = match.explanation;

        card.append(title, detail);
        clues.append(card);
    }
    results.hidden = false;
    results.scrollIntoView({ behaviour: "smooth", block: "start" });
}