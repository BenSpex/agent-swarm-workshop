# prompts/

The `prompts/` directory is the swappable IP of this workshop. The orchestration scripts (`orchestrate.sh`, `merge-all.sh`) are reusable plumbing. These prompt files define **what** gets built. Replace them to build anything different.

To build your own project with this swarm architecture:

1. Replace `00-ideation/` with your project concept
2. Replace `02-architecture/` with your contracts, constitution, and team specs
3. Update `03-agent-config/` spawn prompts for your teams
4. Run `./orchestrate.sh`

---

## Directory Structure

```
prompts/
├── README.md                      # This file
├── 00-ideation/                   # What we're building and why
│   ├── game-concept.md            # Paperclip Maximizer + Weyland-Yutani theme
│   ├── features.md                # 3 phases, ~120 state vars, 50+ projects
│   └── tech-decisions.md          # React + Vite + Tailwind, Vercel deploy
├── 02-architecture/               # How it's structured — the law
│   ├── constitution.md            # 9 articles governing all agents
│   ├── contracts.ts               # 5 frozen TypeScript interfaces (reference)
│   ├── spec-core.md               # Self-contained spec for Core team
│   ├── spec-systems.md            # Self-contained spec for Systems team
│   └── spec-ui.md                 # Self-contained spec for UI team
└── 03-agent-config/               # Agent spawn prompts
    ├── team-core.md               # Core team lead spawn prompt
    ├── team-systems.md            # Systems team lead spawn prompt
    └── team-ui.md                 # UI team lead spawn prompt
```

Note: `01-design/` is intentionally omitted. UI mockups (Stitch, Pencil.dev) are created separately and stored in `reference/`.
