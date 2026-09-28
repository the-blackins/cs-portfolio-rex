# Rex Ndukwu portfolio

Website source for Rex Ndukwu's cybersecurity portfolio. The content is based on the approved brief and supplied evidence kept outside this repository.

- Live site: https://rex-ndukwu-portfolio.vercel.app
- Production branch: `main`

## Preview

From this folder, run `node dev-server.js`. It binds to `127.0.0.1:4173`, or the next available port. In PowerShell, set a fixed port with `$env:PORT='4280'; node dev-server.js`.

The production site is deployed by Vercel from the `main` branch. `vercel.json` defines the static-site behavior, while `.vercelignore` keeps local documentation and preview tooling out of the deployment bundle.

## Routes

| Route | Entry file |
| --- | --- |
| `/` | `index.html` |
| `/contact` | `contact/index.html` |
| `/work/wazuh-endpoint-monitoring` | `work/wazuh-endpoint-monitoring/index.html` |
| `/work/identity-lifecycle-management` | `work/identity-lifecycle-management/index.html` |
| `/work/attack-surface-vulnerability-research` | `work/attack-surface-vulnerability-research/index.html` |

Keep this table and `dev-server.js` route map in sync. `404.html` handles unmatched routes.

Shared interactive behavior is in `script.js`; styles are in `styles.css`. All core content and navigation are available as HTML when JavaScript is disabled.

Contact buttons lead to `/contact`; project buttons pass a known project key so the page can display a suggested subject. The address is always visible and selectable. JavaScript adds a copy button and fills browser-based Gmail and Outlook compose links with the address and subject. Visitors may need to sign in to their chosen service. No backend sends mail from this static site.

Every page links to the local `favicon.svg` RN mark. The footer credits Blackins Creative Tech and links to `https://theblackins.vercel.app/work`.

The homepage opens with a centered, full-screen deep-blue command sequence lasting about 3.3 seconds, including its fade. Three simulated commands accumulate before the homepage is revealed; they do not perform authentication. It plays once per browser tab, with Skip and Escape available immediately and Replay intro in the homepage terminal. Reduced-motion settings and direct section links bypass the automatic scene. Native dialog focus handling and scroll locking keep the background inactive until it closes. The homepage terminal remains independent, and its prompt slash blinks continuously when motion is enabled.

## Review evidence and publication boundary

The Wazuh screenshots were included in the public Rex-review preview at the user's direction; Rex will decide whether they remain. They show lab network/device details. Source decks with exposed API credentials are excluded. Do not publish the private extraction directory or the original slide decks.

The JML joiner video at `assets/video/jml-joiner-phase.mp4` was extracted byte-for-byte from slide 7 of `JML_Project_DONE 2026.pptx`; its poster is the slide's embedded video thumbnail. The clip shows one manual Active Directory account-creation step in the simulated ICT unit. It does not establish the broader PowerShell, mover, leaver, or access-review claims. The page loads the video only when a visitor starts playback.

Use the IAM-updated résumé at `assets/Rex_Ndukwu_Resume.pdf` (also saved in the source folder as `Ndukwu_Rex_Resume_IAM_2026.pdf`). The role focus is Junior SOC and systems administration / IAM; the Active Directory lifecycle case study documents the IAM connection. The recommendation remains quoted exactly as written in the letter. No real certificate verification links, GitHub profile, or domain have been supplied.
