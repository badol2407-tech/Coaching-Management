---
name: Premium sensory cues
description: Browser-safe guidance for the product's splash sound, haptic feedback, and subtle premium interaction cues
---

The splash experience uses a short, low-volume Web Audio chime and optional haptic pulse as enhancement layers, never as required startup dependencies. Audio should be attempted at the logo reveal and retried after the first pointer, keyboard, or touch gesture when autoplay is blocked.

**Why:** Browsers commonly suspend or reject audio contexts until user interaction. A splash that waits on sound would create a blank or stuck first impression, while a restrained cue can make the product feel intentional without becoming intrusive.

**How to apply:** Keep audio short, quiet, and synthesized or bundled locally; catch all audio errors; close the context on unmount; respect reduced-motion preferences for visual effects; and keep the core reveal fully functional with no audio or vibration support.