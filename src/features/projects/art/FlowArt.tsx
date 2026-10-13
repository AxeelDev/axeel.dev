// From the first message to the final delivery, drawn as one continuous line.
const ROUTE = "M196 115 C 232 115, 226 150, 262 150 L 330 150 C 380 150, 392 104, 440 104";

export function FlowArt() {
  return <svg className="art art-flow" viewBox="0 0 560 250" role="img" aria-label="Two chat messages lead to an offer, which leads to a delivered order">
    <path className="flow-route" d={ROUTE} />
    <path className="flow-pulse" d={ROUTE} pathLength={100} />

    <g className="flow-talk">
      <rect className="a-paper a-line" x="20" y="46" width="160" height="38" rx="19" />
      <text className="a-text" x="38" y="70">hey, got a minute?</text>
      <rect className="a-soft a-line" x="70" y="96" width="120" height="38" rx="19" />
      <text className="a-text" x="88" y="120">sure, tell me</text>
      <circle className="a-ink" cx="196" cy="115" r="3" />
    </g>

    <g className="flow-offer">
      <rect className="a-paper a-line" x="262" y="104" width="68" height="92" rx="3" />
      <path className="a-line a-dash" d="M262 168 H330" />
      <text className="a-text a-small" x="272" y="124">OFFER</text>
      <path className="a-line" d="M272 138 H318 M272 148 H304" />
      <text className="a-text a-small" x="272" y="186">3 days</text>
    </g>

    <g className="flow-deliver">
      <path className="a-paper a-line" d="M440 76 L486 60 L532 76 L532 132 L486 148 L440 132 Z" />
      <path className="a-line" d="M440 76 L486 92 L532 76 M486 92 V148" />
      <path className="a-accent-stroke flow-check" d="M500 108 l7 7 l14 -16" />
    </g>

    <g className="a-text a-small">
      <text x="20" y="226">01 · talk</text>
      <text x="262" y="226">02 · agree</text>
      <text x="440" y="226">03 · deliver</text>
    </g>
  </svg>;
}
