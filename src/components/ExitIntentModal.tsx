import React, {useEffect, useMemo, useState} from 'react';
import {createPortal} from 'react-dom';
import NewsletterForm from '@site/src/components/NewsletterForm';
import {CloseIcon} from '@site/src/components/icons';
import {useSiteData} from '@site/src/components/site';

const STORAGE_KEY = 'lr-exit-intent-dismissed-at';

export default function ExitIntentModal() {
  const {newsletter} = useSiteData();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const cooldownMs = useMemo(
    () => newsletter.cooldownDays * 24 * 60 * 60 * 1000,
    [newsletter.cooldownDays],
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || window.innerWidth < 960) {
      return undefined;
    }

    const previousDismissedAt = Number.parseInt(
      window.localStorage.getItem(STORAGE_KEY) ?? '0',
      10,
    );

    if (Number.isFinite(previousDismissedAt) && Date.now() - previousDismissedAt < cooldownMs) {
      return undefined;
    }

    let hasTriggered = false;
    const handler = (event: MouseEvent) => {
      if (hasTriggered || event.clientY > 0) {
        return;
      }

      hasTriggered = true;
      setOpen(true);
    };

    document.addEventListener('mouseout', handler);
    return () => document.removeEventListener('mouseout', handler);
  }, [cooldownMs]);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('keydown', onEscape);
    return () => document.removeEventListener('keydown', onEscape);
  }, [open]);

  function dismiss() {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, String(Date.now()));
    }
    setOpen(false);
  }

  if (!mounted || !open) {
    return null;
  }

  return createPortal(
    <div className="lr-modal-backdrop" role="presentation" onClick={dismiss}>
      <div
        className="lr-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="lr-exit-title"
        onClick={(event) => event.stopPropagation()}>
        <button
          type="button"
          className="lr-modal__close"
          aria-label="Close newsletter popup"
          onClick={dismiss}>
          <CloseIcon width={18} height={18} />
        </button>
        <span className="lr-eyebrow">Before you go</span>
        <h2 id="lr-exit-title">{newsletter.title}</h2>
        <p>{newsletter.description}</p>
        <NewsletterForm onSuccess={dismiss} />
      </div>
    </div>,
    document.body,
  );
}
