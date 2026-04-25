import type {SVGProps} from 'react';

function BaseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.7"
      aria-hidden="true"
      {...props}
    />
  );
}

export function ArrowTipIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <BaseIcon {...props}>
      <path d="M5 12h12" />
      <path className="lr-arrow-tip" d="m13 6 6 6-6 6" />
    </BaseIcon>
  );
}

export function PlayIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <BaseIcon {...props}>
      <circle cx="12" cy="12" r="9" />
      <path className="lr-arrow-tip" d="m10 8 6 4-6 4Z" fill="currentColor" />
    </BaseIcon>
  );
}

export function CloseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <BaseIcon {...props}>
      <path d="M6 6 18 18" />
      <path d="M18 6 6 18" />
    </BaseIcon>
  );
}
