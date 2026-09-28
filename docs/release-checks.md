# Rex portfolio release checks

This file tracks the local source and Rex-review deployment checks.

## Verified locally

- Four pretty routes load directly and unknown routes return a 404.
- Homepage and case-study layouts have no unintended horizontal overflow at 320, 390, 768, 1024, and 1440px in Chromium.
- Terminal commands, theme and motion controls, identity stage selector, evidence viewer, and keyboard closing/focus restoration were exercised in the local browser.
- Mobile navigation and core work links remain visible with JavaScript disabled.
- `script.js` and `dev-server.js` pass `node --check`.
- The staged résumé hash matched the updated résumé in the source folder on 25 September 2026.
- The staged résumé now includes Systems Administration / IAM in its title and summary; the matching IAM PDF is saved in the source folder. The original recommendation quote is unchanged.
- Browser inspection reported no page JavaScript errors.
- The RN SVG favicon loads with the correct MIME type, and the Blackins Creative Tech footer link appears across all pages. The updated footer fits the checked mobile widths.
- Contact buttons now navigate to `/contact` instead of relying on a browser email handler. The homepage and all six project CTAs, contextual subjects, clipboard copy, responsive layouts at 320/390/768/1440px, and a no-JavaScript address fallback passed browser checks.
- The email-app link was removed after it failed in the in-app browser. Gmail and Outlook HTTPS compose links replaced it, with project-specific recipient/subject URLs and the copy-address fallback. Browser navigation to both destinations and the terminal input focus treatment were checked locally; sending through third-party accounts is outside the site.
- The full-screen intro was checked at 1440×900, 320×740, 390×844, 760×844, and 844×390 in Chromium. It fills the viewport, accumulates three commands, and fades into the homepage after about 3.3 seconds.
- Automatic completion, once-per-tab playback, Replay, Skip, Escape, focus restoration, and the independent terminal commands passed browser checks. The slash continues blinking when motion is enabled.
- Reduced-motion and JavaScript-disabled visitors bypass the intro. Changing the OS motion preference during playback closes it immediately. Direct section links also bypass the automatic intro.
- Touch-width checks at 320, 390, 430, and 760px confirmed that the terminal, Skip and Run controls stay inside the viewport; editable text is 16px and primary terminal touch targets are at least 44px high.
- The slide 7 JML recording plays in the case study, uses its original slide poster, and loads only on play. Its MP4 is 40.84 seconds at 1920×1048; local serving returns `video/mp4` and byte-range responses. The new section has no horizontal overflow at 320px and 390px.

## Before final public launch

- Review every staged screenshot at full resolution and prepare public derivatives. Remove unnecessary network/device identifiers from Wazuh images. Confirm the EICAR and reference images contain no private details.
- Ask Rex to review the JML recording's lab domain, visible account names, and final use on the public site. The clip demonstrates the joiner account-creation step, not the complete lifecycle or PowerShell automation.
- Keep the credential-bearing Wazuh integration image and Shodan account/API image excluded. Do not publish the original decks or private source extraction.
- Verify email and LinkedIn destinations with Rex and confirm the preferred display name.
- Confirm the exact GoMyCode diploma title before adding it to the site; it is currently omitted.
- Recheck every claim against the approved brief and user corrections after final visual edits.
- Run a final keyboard, screen-reader, contrast, performance, and font-failure review on the actual deployment build.
- Set canonical and social URLs only once a production domain is selected.
