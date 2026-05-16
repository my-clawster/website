import Link from '@docusaurus/Link';
import {useSiteData} from '@site/src/components/site';

export default function Footer() {
  const {brand, social} = useSiteData();

  return (
    <footer className="lr-footer">
      <div className="lr-site-shell lr-footer__inner">
        <div className="lr-footer__brand">
          <img src="/img/brand/my-clawster-logo.png" alt="My Clawster" />
          <p>{brand.summary}</p>
        </div>
        <div className="lr-footer__links">
          <div>
            <span className="lr-eyebrow">Browse</span>
            <Link to="/">Field Notes</Link>
            <Link to="/docs">Docs</Link>
            <Link to="/archive">Archive</Link>
            <Link to="/subscribe">Updates</Link>
          </div>
          <div>
            <span className="lr-eyebrow">Follow</span>
            <Link href={social.github}>GitHub</Link>
            <Link href={social.linkedin}>LinkedIn</Link>
            <Link href={social.x}>X</Link>
            <Link href={social.youtube}>YouTube</Link>
            <Link href={social.rss}>RSS</Link>
          </div>
        </div>
        
        <div className="border-t border-white/8 pt-6 flex items-center justify-between">
          <p className="text-[12px] text-white/30">
            © {new Date().getFullYear()} Clawne Me. Part of <span className="text-white/50"><a href="https://rebelion.la" className="hover:underline">La Rebelion Labs</a></span>.
          </p>
          <div className="flex items-center gap-1.5 text-[12px] text-white/30">
            <span className="text-white/50 font-semibold"><a href="https://clawne.me" className="hover:underline">Clawne Me</a></span>
            <span> runs on My Clawster</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
