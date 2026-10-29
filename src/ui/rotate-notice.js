// Rotate notice: on an upright phone, a one-time toast suggests turning it sideways for a bigger kit (it can be closed).
// Once the phone is turned, it closes by itself, so it never sits over the drums. Not shown in the Pad grid, which
// already fills an upright screen.
import { showNoticeOnce } from './toast.js';
import { settings } from './storage.js';

const UPRIGHT_PHONE = '(orientation: portrait) and (max-width: 35em)'; // phone widths only, not upright tablets

export function setupRotateNotice() {
  const upright = matchMedia(UPRIGHT_PHONE);
  let shown = null;
  const notice = () => {
    if (upright.matches && settings.view !== 'grid') shown = showNoticeOnce('rotate', 'Tip: turn your phone sideways for a bigger kit.') ?? shown;
    else shown?.leave();
  };
  notice();
  upright.addEventListener('change', notice);
}
