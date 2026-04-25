// @note: This form is structured as static HTML for HubSpot compliance
// We use inline preventDefault in the form element to avoid navigation while allowing HubSpot to track
// See: https://knowledge.hubspot.com/forms/use-non-hubspot-forms
import React, {startTransition, useState} from 'react';
import {ArrowTipIcon} from '@site/src/components/icons';

type NewsletterFormProps = {
  compact?: boolean;
  onSuccess?: () => void;
};

export default function NewsletterForm({
  compact = false,
  onSuccess,
}: NewsletterFormProps) {
  const [email, setEmail] = useState('');
  const [showThankYou, setShowThankYou] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setShowThankYou(true);
    setTimeout(() => {
      setShowThankYou(false);
      onSuccess?.();
      startTransition(() => setEmail(''));
    }, 3000);
  }

  return (
    <>
      {showThankYou ? (
        <div className="mcpExitThanks">
          <h3>Thank you for subscribing!</h3>
          <p>We'll keep you updated on the latest news and insights.</p>
        </div>
      ) : (
        <form method="POST" action="#" className="lr-newsletter-form" onSubmit={handleSubmit}>
          <label className="lr-newsletter-field">
            <span className="sr-only">Email address</span>
            <input
              type="email"
              name="email"
              value={email}
              required
              placeholder="you@workshop.dev"
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>
          <button type="submit" className="lr-button lr-button--primary">
            <span>{compact ? 'Subscribe' : 'Join the newsletter'}</span>
            <ArrowTipIcon width={16} height={16} />
          </button>
        </form>
      )}
    </>
  );
}
