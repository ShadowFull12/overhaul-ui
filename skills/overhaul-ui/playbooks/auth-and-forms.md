# Playbook — auth, onboarding and form flows

The highest-stakes surfaces in most products. A user who cannot sign in never sees
anything else you built.

---

## Sign-in / sign-up

**Layout:** single column, 360–420px wide, vertically centred but with the content
starting slightly above centre (optically better than true centre). Logo, heading, form,
alternatives, footer link.

**Order matters:**
1. Social / SSO buttons first if most users use them, otherwise email first
2. A clear divider ("or") between methods
3. Email + password, or a magic-link single field
4. "Forgot password" beside the password label, not below the button
5. The switch to the other mode ("No account? Create one") at the bottom, always visible

**Non-negotiables**
- `autocomplete="email"`, `autocomplete="current-password"` / `"new-password"`
- **Never block paste.** Never block password managers. (WCAG 2.2 SC 3.3.8)
- `autocomplete="one-time-code"` + `inputmode="numeric"` on OTP fields
- Show-password toggle, `aria-pressed`, announced
- Password requirements shown **before** the user types, and validated live as they type
- Errors are generic on sign-in ("Email or password is incorrect") to avoid account enumeration, but specific on sign-up ("That email is already registered. [Sign in]")
- Preserve the email on a failed attempt. Never clear the form
- `Enter` submits — use a real `<button type="submit">`
- Loading state on the submit button, width preserved
- Rate-limit messaging that says how long to wait
- Redirect back to the originally requested page after auth

**Passkeys** are the better default where supported. Offer them first, keep a fallback.

---

## Multi-step flows

- **Show progress**: step N of M, with labels. A bare progress bar tells the user nothing
- **One decision per step.** Steps are for reducing cognitive load, not for splitting one form across four pages
- **Back must work** — browser back included. Never lose entered data going backwards
- **Never ask twice** (WCAG 2.2 SC 3.3.7). Carry forward, or show the earlier answer read-only
- **Review step** before anything irreversible (SC 3.3.4)
- **Save progress** on long flows, and say that you did
- **Focus moves to the new step's heading** on advance, and the step change is announced
- Validate each step on advance, not only at the end

---

## Field craft

`reference/accessibility.md` §4 for the full contract. The high-frequency ones:

| Field | Setup |
|---|---|
| Email | `type="email"` `inputmode="email"` `autocomplete="email"` `spellcheck="false"` |
| Password | `type="password"` `autocomplete="new-password"` + visibility toggle |
| OTP | `inputmode="numeric"` `autocomplete="one-time-code"` `maxlength` per box, paste-aware across boxes |
| Phone | `type="tel"` `inputmode="tel"` — accept any format, normalise server-side |
| Card | `inputmode="numeric"` `autocomplete="cc-number"`, format as they type, never `type="number"` |
| Address | `autocomplete="street-address"`, `"postal-code"`, `"country"` — and a country-appropriate field order |
| Name | One field unless you genuinely need the parts. `autocomplete="name"` |
| Date | Native `type="date"` unless the picker is genuinely inadequate |
| Amount | `inputmode="decimal"`, `tabular-nums`, currency symbol as an adornment |
| Search | `type="search"`, debounced 200ms, clear button, `Esc` clears |

**Validation timing**
- On `blur` first. Per-keystroke validation shouts at people mid-typing
- Once invalid, re-validate on `input` so the error clears the moment it is fixed
- On submit: validate all, move focus to the first invalid field, announce the count
- `aria-invalid` + `aria-describedby` on every invalid field

**Error text:** what happened → why → what to do. "Add one number to your password", not
"Password requirements not met".

---

## Onboarding

- **Ask for the minimum.** Every field is a drop-off. Progressive profiling beats a long form
- **Show value before asking for work.** Let the user see the product, then collect
- **Skippable, always.** With a way back to finish later
- **Real defaults** so a user who skips everything still has a working product
- **First-run empty states** are the actual onboarding — a good empty state beats a tour
- Product tours: at most 3 steps, dismissible, never blocking, never on repeat visits
- Confetti and celebration: once, at genuine completion, respecting reduced motion

---

## Checkout / payment

- Guest checkout available. Forced account creation is the largest single drop-off cause
- Total visible from the start, including shipping and tax. Surprise costs at step 4 lose the sale
- Card form: one column, autofill-friendly, format as they type, card-type detection
- Never lose the cart on an error or a session expiry
- Clear, immediate confirmation with a reference number and an emailed copy
- Errors from the payment processor translated into plain language

---

## Gate

- [ ] Paste and password managers work everywhere
- [ ] `autocomplete` correct on every field
- [ ] Enter submits; loading state on the button with preserved width
- [ ] Input preserved on every failure, including session expiry
- [ ] Back navigation works and loses nothing
- [ ] Nothing asked twice
- [ ] Errors say what to do next; sign-in errors do not enumerate accounts
- [ ] Focus moves to the new step heading and is announced
- [ ] Keyboard-only completion of the whole flow
- [ ] Screen-reader pass on the sign-in form specifically
- [ ] 320px and 200% zoom
- [ ] `commands/review.md` passed
